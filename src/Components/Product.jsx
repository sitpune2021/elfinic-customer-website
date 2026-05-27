import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart, selectIsInCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import './ProductCard.css';
import WishlistRedux from './WishlistRedux';
import Toolkit from './External-lab/Toolkit';

function Product({ product }) {
    const productId = product?.product_id || product?.id;



    const {
        image_path,
        categoryName,
        IsLogin,
    } = useApi();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const isInCartCheck = useAppSelector((state) => selectIsInCart(product?.id)(state));
    const apiImageBasePath = product?.image_path || `${image_path}products-images/`;
    const productImageSrc = product?.images?.[0]
        ? `${image_path}products-images/${product.images[0]}`
        : product?.product_thumb
            ? `${apiImageBasePath}${product.product_thumb}`
            : "/images/default/imageno.png";
    // Calculate discount percentage if both prices exist
    const discountPercentage = product?.price && product.total_price
        ? Math.round(((product.price - product.total_price) / product.price) * 100)
        : 0;

    const handleAddtocart = async () => {
        if (!IsLogin()) {
            toast.error('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }

        // Check if item is already in cart
        if (isInCartCheck) {
            toast.info('Product is already in cart!');
            return;
        }

        // Set loading state for this specific product
        setIsLoading(true);

        try {
            // Dispatch addToCart action
            await dispatch(addToCart({ product_id: product.id, quantity: 1 })).unwrap();
            toast.success('Product added to cart!');
        } catch (error) {
            toast.error(error || 'Failed to add product to cart');
            console.error('Add to cart error:', error);
        } finally {
            setIsLoading(false);
        }
    }
    // console.log("Product details:", product);

    const handleBuyNow = async () => {
        if (!IsLogin()) {
            toast.error('Please log in to buy products.');
            navigate('/login');
            return;
        }

        // Set loading state
        setIsLoading(true);

        try {
            // If not in cart, add it first
            if (!isInCartCheck) {
                await dispatch(addToCart({ product_id: product.id, quantity: 1 })).unwrap();
            }

            // Navigate to checkout page
            navigate('/checkout');
        } catch (error) {
            toast.error(error || 'Failed to proceed to checkout');
            console.error('Buy now error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="modern-product-card">
            {/* Image Container */}
            <div className="product-image-wrapper">
                <Link to={`/product-details/${product?.slug || product?.id}`} className="product-image-link overflow-hidden">
                    <img
                        src={productImageSrc}
                        alt={product?.name || "Product"}
                        className="product-image-card"
                        loading="lazy"
                    />
                </Link>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <span className="discount-badge">{discountPercentage}% OFF</span>
                )}

                {/* Hot Label Badge */}
                {product?.label && (
                    <span className="hot-badge">HOT</span>
                )}

                {/* Wishlist Quick Action */}
                <div className="quick-actions z-3">
                    <WishlistRedux product_id={productId} />
                </div>
            </div>

            {/* Content */}
            <div className="product-content">
                {/* Product Title */}
                <h6 className="product-title">
                    <Link to={`/product-details/${product?.slug || product?.id}`}>
                        <Toolkit text={product?.name || "Product Name"} maxLength={42} font_size="12px" className={'hoverCursorAnimation'} showOnHover={false} />
                    </Link>
                </h6>

                {/* Rating */}
                <div className="product-rating d-flex align-items-center">
                    <div className="stars">
                        {[...Array(5)].map((_, index) => (
                            <i
                                key={index}
                                className={index < Math.floor(product?.averageRating || 0) ? "ph-fill ph-star" : "ph ph-star"}
                            ></i>
                        ))}
                    </div>
                    <p className="rating-text ms-1 mb-0">
                        {product?.averageRating || 0} ({product?.ratingCount || 0})
                    </p>
                </div>

                {/* Price */}
                <div className="product-price pb-0">
                    <span className="current-price">
                        ₹{product?.total_price || product?.price || "0.00"}
                    </span>
                    {product?.total_price && product.total_price < product?.price && (
                        <span className="original-price">₹{product.price}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Product

