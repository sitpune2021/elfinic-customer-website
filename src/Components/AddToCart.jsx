import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useApi } from '../contexts/ApiContext'
import { toast } from 'react-toastify'
import { FaAngleDoubleRight } from "react-icons/fa";
import SvgIcon from './SvgIcon/SvgIcon';
import {
    fetchCart,
    removeFromCart,
    updateCartItem,
    increaseCartQuantity,
    decreaseCartQuantity,
    selectCartItems,
    selectCartLoading,
    selectCartError,
    selectCartTotalPrice,
    selectCartTotalItems
} from '../store/slices/cartSlice'
import { Link } from 'react-router-dom'
import Product from './Product'
import { selectProducts, fetchProducts } from '../store/slices/productsSlice'
import Heading from './Home/Heading'
import Confetti from 'react-confetti-boom';
import './AddToCart.css';
import Toolkit from './External-lab/Toolkit';

function AddToCart() {
    const dispatch = useDispatch()
    const { image_path, IsLogin } = useApi()
    const cartItems = useSelector(selectCartItems)
    const loading = useSelector(selectCartLoading)
    const error = useSelector(selectCartError)
    const totalPrices = useSelector(selectCartTotalPrice)
    const totalItems = useSelector(selectCartTotalItems)

    const Products = useSelector(selectProducts);

    const [removingItems, setRemovingItems] = useState(new Set())
    const [initialLoadComplete, setInitialLoadComplete] = useState(false)

    // Load cart and products only once on mount
    useEffect(() => {
        let isMounted = true;

        const loadCartData = async () => {
            if (IsLogin()) {
                try {
                    // ❌ REMOVED: fetchProducts() - getAllProducts API causing integration issues
                    await Promise.all([
                        dispatch(fetchCart()),
                        // dispatch(fetchProducts())
                    ]);
                } catch (error) {
                    console.error('Error loading cart data:', error);
                } finally {
                    if (isMounted) {
                        setInitialLoadComplete(true);
                    }
                }
            }
        };

        if (!initialLoadComplete) {
            loadCartData();
        }

        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array - run only once




    const handleRemoveItem = useCallback(async (itemId) => {
        try {
            // Add to removing set
            setRemovingItems(prev => new Set(prev).add(itemId))

            // Show loading toast
            const loadingToast = toast.loading('Removing item from cart...')

            // Dispatch remove action
            const result = await dispatch(removeFromCart(itemId))

            // Check if removal was successful
            if (result.type === 'removeFromCart/fulfilled') {
                toast.update(loadingToast, {
                    render: 'Item removed from cart successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000
                })
            } else {
                throw new Error(result.error?.message || 'Failed to remove item')
            }
        } catch (error) {
            console.error('Error removing item from cart:', error)
            toast.error(error.message || 'Failed to remove item. Please try again.')
        } finally {
            // Remove from removing set
            setRemovingItems(prev => {
                const newSet = new Set(prev)
                newSet.delete(itemId)
                return newSet
            })
        }
    }, [dispatch])

    const handleIncreaseQuantity = useCallback(async (item) => {
        try {
            // Dispatch increase action (optimistic update happens automatically)
            const result = await dispatch(increaseCartQuantity({
                product_id: item.product_id,
                quantity: 1
            }))

            if (result.type === 'cart/increase/rejected') {
                toast.error(result.error?.message || 'Failed to increase quantity')
            }
        } catch (error) {
            console.error('Error increasing quantity:', error)
            toast.error('Failed to increase quantity. Please try again.')
        }
    }, [dispatch])

    const handleDecreaseQuantity = useCallback(async (item) => {
        if (item.quantity <= 1) {
            toast.warning('Quantity cannot be less than 1. Please remove the item instead.')
            return
        }

        try {
            // Dispatch decrease action (optimistic update happens automatically)
            const result = await dispatch(decreaseCartQuantity({
                product_id: item.product_id,
                quantity: 1
            }))

            if (result.type === 'cart/decrease/rejected') {
                toast.error(result.error?.message || 'Failed to decrease quantity')
            }
        } catch (error) {
            console.error('Error decreasing quantity:', error)
            toast.error('Failed to decrease quantity. Please try again.')
        }
    }, [dispatch])

    const getProductImage = (product) => {
        if (product?.product_thumb) {
            return `${image_path}products-thumbs/${product.product_thumb}`
        }
        return '/images/thumbs/product-two-img1.png'
    }

    // Get selected variant from cart item
    const getSelectedVariant = (item) => {
        if (!item?.product?.variants || item.product.variants.length === 0) {
            return null;
        }
        // If variant_id is in cart item, find the matching variant
        if (item.variant_id) {
            return item.product.variants.find(v => v.id === item.variant_id) || null;
        }
        // If selected_variant is directly in cart item
        if (item.selected_variant) {
            return item.selected_variant;
        }
        // If variant name/string is stored
        if (item.variant) {
            return item.product.variants.find(v => v.variant === item.variant) || { variant: item.variant };
        }
        // Check if product has only one variant (auto-select)
        if (item.product.variants.length === 1) {
            return item.product.variants[0];
        }
        return null;
    }

    const getProductPrice = (product, selectedVariant = null) => {
        if (!product) return 0;

        // If variant is selected, use variant price
        if (selectedVariant && selectedVariant.variant_price) {
            const variantPrice = parseFloat(selectedVariant.variant_price);
            if (!isNaN(variantPrice) && variantPrice > 0) {
                return variantPrice;
            }
        }

        // Use total_price if available (already calculated: price - discount_price)
        if (product.total_price) {
            const cleanTotalPrice = typeof product.total_price === 'string'
                ? product.total_price.replace(/,/g, '')
                : product.total_price;
            const totalPrice = parseFloat(cleanTotalPrice);
            if (!isNaN(totalPrice) && totalPrice > 0) {
                return totalPrice;
            }
        }

        // Fallback: Calculate price - discount_price manually
        const regularPrice = parseFloat(product.price) || 0;
        const discountAmount = parseFloat(product.discount_price) || 0;

        // discount_price is the DISCOUNT AMOUNT, not the final price
        // Final price = regular price - discount amount
        if (regularPrice > 0) {
            return regularPrice - discountAmount;
        }

        return 0;
    }

    const calculateSubtotal = useCallback((item) => {
        const selectedVariant = getSelectedVariant(item);
        const price = getProductPrice(item.product, selectedVariant);
        const quantity = parseInt(item.quantity) || 0;
        return (price * quantity).toFixed(2);
    }, [image_path])

    // totalPrices is the actual cart subtotal from Redux
    // Shipping is calculated separately in calculateGrandTotal
    const subtotal = useMemo(() => {
        return parseFloat(totalPrices) || 0;
    }, [totalPrices])

    const calculateTax = useCallback(() => {
        const validSubtotal = parseFloat(subtotal) || 0;
        return (validSubtotal * 0.04).toFixed(2); // 4% tax
    }, [subtotal])

    const handleEst = useCallback(() => {
        return subtotal < 999;
    }, [subtotal])

    const [showConfetti, setShowConfetti] = useState(false);
    const [hasShownFreeShippingToast, setHasShownFreeShippingToast] = useState(false);
    const [previousTotalPrice, setPreviousTotalPrice] = useState(null);

    useEffect(() => {
        // Only run after initial load is complete and cart has items
        if (!initialLoadComplete || cartItems.length === 0) return;

        const isEligibleForFreeShipping = totalPrices > 999;

        // First time checking after page load
        if (previousTotalPrice === null) {
            setPreviousTotalPrice(totalPrices);

            // If already eligible on initial load, show confetti
            if (isEligibleForFreeShipping && !hasShownFreeShippingToast) {
                setShowConfetti(true);
                setHasShownFreeShippingToast(true);
                toast.success('🎉 Congratulations! You have qualified for free shipping!');

                // Hide confetti after 3 seconds
                setTimeout(() => {
                    setShowConfetti(false);
                }, 3000);
            }
            return;
        }

        const wasEligibleBefore = previousTotalPrice > 999;

        // Show confetti when crossing threshold from below
        if (isEligibleForFreeShipping && !wasEligibleBefore && !hasShownFreeShippingToast) {
            setShowConfetti(true);
            setHasShownFreeShippingToast(true);
            toast.success('🎉 Congratulations! You have qualified for free shipping!');

            // Hide confetti after 3 seconds
            setTimeout(() => {
                setShowConfetti(false);
            }, 3000);
        } else if (!isEligibleForFreeShipping && hasShownFreeShippingToast) {
            // Reset the toast flag if user goes below threshold
            setHasShownFreeShippingToast(false);
            setShowConfetti(false);
        }

        // Update previous total price
        setPreviousTotalPrice(totalPrices);
    }, [totalPrices, initialLoadComplete, cartItems.length]);

    const calculateGrandTotal = useCallback(() => {
        const validSubtotal = parseFloat(subtotal) || 0;
        const estimatedShipping = subtotal >= 999 ? 0 : 99;
        return (validSubtotal + estimatedShipping).toFixed(2);
    }, [subtotal])

    if (!IsLogin()) {
        return (
            <>
                <section className="atc-section">
                    <div className="container container-lg">
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                                <div className="atc-empty">
                                    <i className="ph ph-user-circle" style={{ fontSize: '4rem', color: 'var(--primary-skyblue)' }}></i>
                                    <h3>Please Login to View Cart</h3>
                                    <p>You need to be logged in to view your cart items.</p>
                                    <Link to="/login" className="atc-checkout-btn" style={{ display: 'inline-block', width: 'auto', padding: '12px 32px' }}>Login Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    }

    if (!initialLoadComplete && loading) {
        return (
            <>
                {/* Breadcrumb */}
                <div className="atc-breadcrumb">
                    <div className="container container-lg">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <h6 className="mb-0">Your Cart</h6>
                            <ul className="d-flex align-items-center gap-2 flex-wrap list-unstyled mb-0">
                                <li>
                                    <Link to="/" className="atc-breadcrumb-link">
                                        <i className="ph ph-house"></i>
                                        Home
                                    </Link>
                                </li>
                                <li className="d-flex align-items-center">
                                    <i className="ph ph-caret-right" style={{ fontSize: '0.75rem', color: '#adb5bd' }}></i>
                                </li>
                                <li className="atc-breadcrumb-active">Cart</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Skeleton Loading */}
                <section className="atc-section">
                    <div className="container container-lg">
                        <div className="row gy-4">
                            <div className="col-xl-9 col-lg-8">
                                <div className="atc-items-wrapper">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="atc-card">
                                            <div className="atc-card-inner">
                                                <div className="atc-skeleton" style={{ width: '72px', height: '72px', borderRadius: '8px', flexShrink: 0 }}></div>
                                                <div style={{ flex: 1 }}>
                                                    <div className="atc-skeleton mb-2" style={{ width: '75%', height: '14px' }}></div>
                                                    <div className="atc-skeleton mb-2" style={{ width: '50%', height: '12px' }}></div>
                                                    <div className="d-flex gap-2">
                                                        <div className="atc-skeleton" style={{ width: '50px', height: '18px', borderRadius: '4px' }}></div>
                                                        <div className="atc-skeleton" style={{ width: '50px', height: '18px', borderRadius: '4px' }}></div>
                                                    </div>
                                                </div>
                                                <div className="atc-skeleton d-none d-md-block" style={{ width: '80px', height: '32px' }}></div>
                                                <div className="atc-skeleton d-none d-md-block" style={{ width: '100px', height: '32px', borderRadius: '8px' }}></div>
                                                <div className="atc-skeleton d-none d-md-block" style={{ width: '80px', height: '32px' }}></div>
                                                <div className="atc-skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4">
                                <div className="atc-sidebar">
                                    <div className="atc-skeleton mb-3" style={{ width: '120px', height: '22px' }}></div>
                                    <div className="atc-sidebar-body">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="d-flex justify-content-between mb-3">
                                                <div className="atc-skeleton" style={{ width: '90px', height: '14px' }}></div>
                                                <div className="atc-skeleton" style={{ width: '60px', height: '14px' }}></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="atc-skeleton mt-3" style={{ width: '100%', height: '50px', borderRadius: '12px' }}></div>
                                    <div className="atc-skeleton mt-3" style={{ width: '100%', height: '48px', borderRadius: '12px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    }
    // Only show empty cart message after initial load is complete
    if (initialLoadComplete && cartItems.length === 0 && !loading) {
        return (
            <>
                <section className="atc-section">
                    <div className="container container-lg">
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                                <div className="atc-empty">
                                    <SvgIcon name="shopping-cart" size={80} className="mb-3" style={{ color: 'var(--primary-skyblue)' }} />
                                    <h3>Your Cart is Empty</h3>
                                    <p>Looks like you haven't added any items to your cart yet.</p>
                                    <Link to="/shop?show_section=featured" className="atc-checkout-btn" style={{ display: 'inline-block', width: 'auto', padding: '12px 32px' }}>Continue Shopping</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    }

    return (
        <>
            {showConfetti && (
                <div className="atc-confetti">
                    <Confetti
                        mode="boom"
                        particleCount={300}
                        shapeSize={6}
                        deg={266}
                        colors={['#d8963c', '#a9d4e7', '#050040']}
                    />
                </div>
            )}
            {/* ========================= Breadcrumb =============================== */}
            <div className="atc-breadcrumb">
                <div className="container container-lg">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h6 className="mb-0">Your Cart</h6>
                        <ul className="d-flex align-items-center gap-2 flex-wrap list-unstyled mb-0">
                            <li>
                                <Link to="/" className="atc-breadcrumb-link">
                                    <i className="ph ph-house"></i>
                                    Home
                                </Link>
                            </li>
                            <li className="d-flex align-items-center">
                                <i className="ph ph-caret-right" style={{ fontSize: '0.75rem', color: '#adb5bd' }}></i>
                            </li>
                            <li className="atc-breadcrumb-active">Cart</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ========================= Cart Section =============================== */}
            <section className={`atc-section ${initialLoadComplete ? 'atc-loaded' : ''}`}>
                <div className="container container-lg">
                    <div className="row gy-4">
                        {/* ---- Cart Items Column ---- */}
                        <div className="col-xl-9 col-lg-8">
                            <div className="atc-items-wrapper">

                                {cartItems.map((item) => {
                                    const isRemoving = removingItems.has(item.cart_id)
                                    const selectedVariant = getSelectedVariant(item)
                                    const itemPrice = getProductPrice(item.product, selectedVariant)
                                    return (
                                        <div
                                            key={item.cart_id}
                                            className={`atc-card ${isRemoving ? 'atc-card--removing' : ''}`}
                                        >
                                            <div className="atc-card-inner">
                                                {/* Product Image */}
                                                <Link to={`/product-details/${item.product?.slug}`} className="atc-img-wrap">
                                                    <img
                                                        src={getProductImage(item.product)}
                                                        alt={item.product?.name || 'Product'}
                                                    />
                                                </Link>

                                                {/* Product Details */}
                                                <div className="atc-col-details">
                                                    <Link to={`/product-details/${item.product?.slug}`} className="atc-product-name">
                                                        <Toolkit text={item.product?.name || 'Product Name'} maxLength={60} />
                                                    </Link>
                                                    {selectedVariant && selectedVariant.variant && (
                                                        <span className="atc-variant-badge">
                                                            <i className="ph ph-tag"></i>
                                                            {selectedVariant.variant}
                                                        </span>
                                                    )}
                                                    <div className="atc-meta-badges">
                                                        {item.product?.category && (
                                                            <span className="atc-meta-badge">{item.product.category}</span>
                                                        )}
                                                        {item.product?.brand && (
                                                            <span className="atc-meta-badge">{item.product.brand}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Price — desktop */}
                                                <div className="atc-col-price atc-desktop-only">
                                                    <span className="atc-price-label">Price</span>
                                                    <span className="atc-price-value">&#8377;{itemPrice.toFixed(2)}</span>
                                                </div>

                                                {/* Quantity — desktop */}
                                                <div className="atc-col-qty atc-desktop-only">
                                                    <span className="atc-price-label">Qty</span>
                                                    <div className="atc-qty-group">
                                                        <button
                                                            type="button"
                                                            className="atc-qty-btn"
                                                            onClick={() => handleDecreaseQuantity(item)}
                                                            disabled={item.quantity <= 1 || isRemoving}
                                                        >
                                                            <i className="ph ph-minus"></i>
                                                        </button>
                                                        <input
                                                            type="text"
                                                            className="atc-qty-input"
                                                            value={item.quantity}
                                                            readOnly
                                                        />
                                                        <button
                                                            type="button"
                                                            className="atc-qty-btn"
                                                            onClick={() => handleIncreaseQuantity(item)}
                                                            disabled={isRemoving}
                                                        >
                                                            <i className="ph ph-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Subtotal — desktop */}
                                                <div className="atc-col-total atc-desktop-only">
                                                    <span className="atc-price-label">Total</span>
                                                    <span className="atc-total-value">&#8377;{calculateSubtotal(item)}</span>
                                                </div>

                                                {/* Remove */}
                                                <div className="atc-col-remove">
                                                    <button
                                                        type="button"
                                                        title={isRemoving ? 'Removing...' : 'Remove Item'}
                                                        className="atc-remove-btn"
                                                        onClick={() => handleRemoveItem(item.cart_id)}
                                                        disabled={isRemoving}
                                                    >
                                                        {isRemoving ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : (
                                                            <i className="ph ph-x-circle" style={{ fontSize: '1.1rem' }}></i>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Mobile bottom row: price + qty + total */}
                                                <div className="atc-mobile-bottom d-none">
                                                    <div className="atc-price-cell">
                                                        <span className="atc-price-label">Price</span>
                                                        <span className="atc-price-value">&#8377;{itemPrice.toFixed(2)}</span>
                                                    </div>
                                                    <div className="atc-qty-wrap">
                                                        <div className="atc-qty-group">
                                                            <button
                                                                type="button"
                                                                className="atc-qty-btn"
                                                                onClick={() => handleDecreaseQuantity(item)}
                                                                disabled={item.quantity <= 1 || isRemoving}
                                                            >
                                                                <i className="ph ph-minus"></i>
                                                            </button>
                                                            <input
                                                                type="text"
                                                                className="atc-qty-input"
                                                                value={item.quantity}
                                                                readOnly
                                                            />
                                                            <button
                                                                type="button"
                                                                className="atc-qty-btn"
                                                                onClick={() => handleIncreaseQuantity(item)}
                                                                disabled={isRemoving}
                                                            >
                                                                <i className="ph ph-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="atc-price-cell">
                                                        <span className="atc-price-label">Total</span>
                                                        <span className="atc-total-value">&#8377;{calculateSubtotal(item)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                                <div className="atc-spacer"></div>

                                <div className="atc-continue-wrap">
                                    <div className="atc-continue-line"></div>
                                    <Link to="/shop" className="atc-continue-btn">
                                        Continue Shopping <FaAngleDoubleRight />
                                    </Link>
                                    <div className="atc-continue-line"></div>
                                </div>

                                <Heading className=''
                                    title="Similar Products"
                                    size="small"
                                    subtitle="You may also like"
                                />
                                <div className="container-sm">
                                    <div className="row">
                                        {Products.slice(0, 8).map((product) => (
                                            <div key={product.id} className="col-xxl-3 col-xl-3 col-sm-6 col-6 mb-24">
                                                <Product product={product} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ---- Sidebar Column ---- */}
                        <div className="col-xl-3 col-lg-4">
                            <div className="atc-sidebar">
                                <h6 className="atc-sidebar-title">Cart Totals</h6>
                                <div className="atc-sidebar-body">
                                    <div className="atc-sidebar-row">
                                        <span className="atc-sidebar-label">Subtotal</span>
                                        <span className="atc-sidebar-val">&#8377; {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="atc-sidebar-row">
                                        <span className="atc-sidebar-label">Items</span>
                                        <span className="atc-sidebar-val">{totalItems || 0} items</span>
                                    </div>
                                    <div className="atc-sidebar-row">
                                        <span className="atc-sidebar-label">
                                            Delivery
                                            <span className="atc-delivery-sub">Above ₹999 Free</span>
                                        </span>
                                        <span className={`atc-sidebar-val ${!handleEst() ? 'atc-delivery-free' : ''}`}>
                                            {handleEst() ? "+₹99" : "Free"}
                                        </span>
                                    </div>
                                </div>
                                <div className="atc-sidebar-total">
                                    <span>Total</span>
                                    <span>&#8377; {calculateGrandTotal()}</span>
                                </div>
                                <Link to="/checkout" className="atc-checkout-btn">
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AddToCart