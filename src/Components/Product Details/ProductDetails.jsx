import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi';
import SocialShare from '../SocialShare';
import WishlistRedux from '../WishlistRedux';
import ProductImages from './ProductImages';
import ProductReview from './ProductReview/ProductReview';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, selectAddress, selectAddresses, selectSelectedAddressId } from '../../store/slices/addressSlice';
import { useAppSelector } from '../../store/hooks';
import { addToCart, selectIsInCart, selectCartLoading, fetchCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import Description from './Description';
import SizeChart from './SizeChart';
import Toolkit from '../External-lab/Toolkit';
import './ProductDetailsTable.css';
import Offers from './Offers';
import ShopFeature from './ShopFeature';
import {
    fetchProductBySlug,
    selectProductDetails,
    selectProductLoading,
    selectProductError,
    selectGroupedOptions,
    selectSelectedOptions,
    selectSelectedImage,
    selectDiscountPercentage,
    setSelectedOption,
    clearProductDetails,
    selectSelectedVariant,
    selectCurrentPrice,
    selectCurrentStock,
    selectAllOptionsSelected,
} from '../../store/slices/productDetailsSlice';
import {
    fetchSimilarProducts,
    selectSimilarProducts,
    selectSimilarProductsLoading,
    clearSimilarProducts,
} from '../../store/slices/similarProductsSlice';
import ProductSection from '../ProductSection';
import Product from '../Product';
import Heading from '../Home/Heading';
import ExpectedDate from './ExpectedDate';

function ProductDetails() {
    const { slug } = useParams(); // Changed from id to slug
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { IsLogin, image_path } = useApi();

    // Redux selectors for product details
    const product = useSelector(selectProductDetails);
    const loading = useSelector(selectProductLoading);
    const error = useSelector(selectProductError);
    const groupedOptions = useSelector(selectGroupedOptions);
    const selectedOptions = useSelector(selectSelectedOptions);
    const selectedImage = useSelector(selectSelectedImage);
    const discountPercentage = useSelector(selectDiscountPercentage);

    // New selectors for variant handling
    const selectedVariant = useSelector(selectSelectedVariant);
    const currentPrice = useSelector(selectCurrentPrice);
    const currentStock = useSelector(selectCurrentStock);
    const allOptionsSelected = useSelector(selectAllOptionsSelected);

    // Similar products selectors
    const similarProducts = useSelector(selectSimilarProducts);
    const similarProductsLoading = useSelector(selectSimilarProductsLoading);

    const [quantity, setQuantity] = useState(1);
    const [showAllTables, setShowAllTables] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [localInCart, setLocalInCart] = useState(false);
    const [variantError, setVariantError] = useState('');

    const cartLoading = useSelector(selectCartLoading);
    const isInCartCheck = useAppSelector((state) => selectIsInCart(product?.id)(state));

    const showSizeChart = String(product?.show_sizechart) === "true";


    // Combined check for cart status - use local state for immediate feedback
    const isProductInCart = localInCart || isInCartCheck;

    const handleChange = (e) => {
        const val = Math.max(1, Math.min(product?.stock, Number(e.target.value)));
        setQuantity(val);
    };

    // Fetch product details by slug
    useEffect(() => {
        if (slug) {
            dispatch(fetchProductBySlug(slug));
            // Reset local cart state when product changes
            setLocalInCart(false);
        }

        // Cleanup on unmount
        return () => {
            dispatch(clearProductDetails());
            dispatch(clearSimilarProducts());
        };
    }, [dispatch, slug]);

    // Fetch cart when component mounts if user is logged in
    useEffect(() => {
        if (IsLogin()) {
            dispatch(fetchCart());
        }
    }, [dispatch, IsLogin]);

    // Fetch similar products when product is loaded
    useEffect(() => {
        if (product?.id) {
            dispatch(fetchSimilarProducts(product.id));
        }
    }, [dispatch, product?.id]);

    useEffect(() => {
        if (IsLogin()) {
            dispatch(fetchAddresses());
        }
    }, [dispatch, IsLogin]);

    const addresses = useSelector(selectAddresses);
    const selectedAddressId = useSelector(selectSelectedAddressId);

    const selectedDeliveryAddress =
        addresses?.find((address) => String(address.id) === String(selectedAddressId)) ||
        addresses?.find((address) => Number(address.is_default) === 1) ||
        addresses?.[0] ||
        null;

    const selectedDeliveryPostalCode = selectedDeliveryAddress?.postal_code || '';
    console.log('Selected Delivery Postal Code:', selectedDeliveryPostalCode);

    const deliveryWeight = Number(selectedVariant?.weight || product?.weight || 0.5);
    const deliveryCod = Number(product?.cod || 0);
    const pickup_postcode = product?.warehouse[0]?.pickup_postcode || '';

    useEffect(() => {
        if (!addresses?.length || selectedAddressId != null) return;

        const defaultAddress =
            addresses.find((address) => Number(address.is_default) === 1) || addresses[0];

        if (defaultAddress?.id) {
            dispatch(selectAddress(defaultAddress.id));
        }
    }, [addresses, selectedAddressId, dispatch]);

    const handleDeliveryAddressChange = (event) => {
        const nextAddressId = event.target.value ? Number(event.target.value) : null;
        dispatch(selectAddress(nextAddressId));
    };

    // Handle option selection
    const handleOptionSelect = (optionType, option) => {
        setVariantError(''); // Clear error when user selects an option
        dispatch(setSelectedOption({
            optionType: optionType,
            value: option.size || option.name,
            connectingImage: option.connecting_image,
        }));
    };



    const handleAddtocart = async () => {
        // Debug: Log all relevant state before adding to cart
        console.log('=== ADD TO CART DEBUG ===');
        console.log('Product:', product);
        console.log('Product Variants:', product?.variants);
        console.log('Selected Options:', selectedOptions);
        console.log('Selected Variant:', selectedVariant);
        console.log('All Options Selected:', allOptionsSelected);
        console.log('=========================');

        if (!IsLogin()) {
            toast.error('Please log in to add items to your cart.', { autoClose: 2000 });
            navigate('/login');
            return;
        }

        // Check if out of stock
        if (currentStock.isOutOfStock) {
            toast.error('This product is currently out of stock.', { autoClose: 2000 });
            return;
        }

        // Check if all options are selected (for products with variants)
        if (!allOptionsSelected && product?.options?.length > 0) {
            setVariantError('Please select product options before proceeding.');
            return;
        }

        if (isProductInCart) {
            toast.info('Product is already in cart!', { autoClose: 1500 });
            return;
        }


        // Set loading state immediately
        setAddingToCart(true);

        try {
            // Get variant ID from selectedVariant
            const variantId = selectedVariant?.id || null;



            const cartData = {
                product_id: product.id,
                quantity: 1,
                variants_id: variantId // nullable for simple products
            };

            // Optimistic update - show "In Cart" immediately
            setLocalInCart(true);
            setVariantError(''); // Clear any errors on success
            toast.success('Product added to cart!', { autoClose: 1500 });

            await dispatch(addToCart(cartData)).unwrap();
        } catch (error) {
            // Revert optimistic update on error
            setLocalInCart(false);
            toast.error(error || 'Failed to add product to cart', { autoClose: 2000 });
            console.error('Add to cart error:', error);
        } finally {
            setAddingToCart(false);
        }
    }

    const handleBuyNow = async () => {
        if (!IsLogin()) {
            toast.error('Please log in to buy products.', { autoClose: 2000 });
            navigate('/login');
            return;
        }

        // Check if out of stock
        if (currentStock.isOutOfStock) {
            toast.error('This product is currently out of stock.', { autoClose: 2000 });
            return;
        }

        // Check if all options are selected (for products with variants)
        if (!allOptionsSelected && product?.options?.length > 0) {
            setVariantError('Please select product options before proceeding.');
            return;
        }

        setAddingToCart(true);
        setVariantError(''); // Clear error if validation passes

        try {
            if (!isProductInCart) {
                // Get variant ID from selectedVariant
                const variantId = selectedVariant?.id || null;

                const cartData = {
                    product_id: product.id,
                    quantity: 1,
                    variants_id: variantId // nullable for simple products
                };
                setLocalInCart(true);
                await dispatch(addToCart(cartData)).unwrap();
            }
            navigate('/checkout');
        } catch (error) {
            setLocalInCart(false);
            toast.error(error || 'Failed to proceed to checkout', { autoClose: 2000 });
            console.error('Buy now error:', error);
        } finally {
            setAddingToCart(false);
        }
    }



    // Loading state
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container py-40">
                <div className="alert alert-danger text-center">
                    <h5>Error loading product</h5>
                    <p>{error}</p>
                    <Link to="/shop" className="btn btn-primary">Go to Shop</Link>
                </div>
            </div>
        );
    }

    // Format subcategory display
    const getSubcategoryDisplay = () => {
        if (!product?.subcategory) return null;
        if (Array.isArray(product.subcategory)) {
            return product.subcategory.join(', ');
        }
        return product.subcategory;
    };

    // Function to render product details with table limit
    const renderProductDetails = () => {
        if (!product?.product_details) return null;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = product.product_details;
        const tables = tempDiv.querySelectorAll('table');

        if (tables.length <= 3) {
            // If 3 or fewer tables, show all
            return (
                <div
                    className="product-details-table table-responsive"
                    dangerouslySetInnerHTML={{ __html: product.product_details }}
                    style={{
                        '--table-border-color': '#e5e7eb',
                        '--table-bg': '#fff'
                    }}
                ></div>
            );
        }

        // If more than 3 tables, show limited or all based on state
        if (!showAllTables) {
            // Show only first 3 tables
            const limitedDiv = document.createElement('div');
            for (let i = 0; i < 3; i++) {
                limitedDiv.appendChild(tables[i].cloneNode(true));
            }
            return (
                <>
                    <div
                        className="product-details-table table-responsive"
                        dangerouslySetInnerHTML={{ __html: limitedDiv.innerHTML }}
                        style={{
                            '--table-border-color': '#e5e7eb',
                            '--table-bg': '#fff'
                        }}
                    ></div>
                    <div className="text-center mt-24">
                        <button
                            onClick={() => setShowAllTables(true)}
                            className="btn btn-outline-main rounded-8 px-24 py-12"
                        >
                            <i className="ph ph-caret-down me-8"></i>
                            Read More Details
                        </button>
                    </div>
                </>
            );
        } else {
            // Show all tables
            return (
                <>
                    <div
                        className="product-details-table table-responsive"
                        dangerouslySetInnerHTML={{ __html: product.product_details }}
                        style={{
                            '--table-border-color': '#e5e7eb',
                            '--table-bg': '#fff'
                        }}
                    ></div>
                    <div className="text-center mt-24">
                        <button
                            onClick={() => setShowAllTables(false)}
                            className="btn btn-outline-main rounded-8 px-24 py-12"
                        >
                            <i className="ph ph-caret-up me-8"></i>
                            Show Less
                        </button>
                    </div>
                </>
            );
        }
    };

    return (
        <>
            {/* <!-- ========================= Breadcrumb Start =============================== --> */}
            <div className="breadcrumb mb-0 py-8 py-md-18 bg-main-two-50">
                <div className="container container-lg">
                    <div className="breadcrumb-wrapper flex-between flex-wrap gap-8 gap-md-16">
                        <h6 className="mb-0 d-none d-md-block">Product Details</h6>
                        <ul className="flex-align gap-4 gap-md-8 flex-wrap">
                            <Link to="/" className="">
                                <li className="text-xs text-sm-sm text-main-600">
                                    Home
                                </li>
                            </Link>
                            <li className="flex-align">
                                <i className="ph ph-caret-right text-xs text-sm-base"></i>
                            </li>
                            <Link to={'/shop'}>
                                <li className="text-xs text-sm-sm text-main-600 text-truncate" style={{ maxWidth: '100px' }}>
                                    {product?.category}
                                </li>
                            </Link>

                            {product?.subcategory && (
                                <>
                                    <li className="flex-align ">
                                        <i className="ph ph-caret-right text-xs text-sm-base"></i>
                                    </li>
                                    <Link to={'/shop'}>
                                        <li className="text-xs text-sm-sm text-main-600 text-truncate " style={{ maxWidth: '100px' }}>
                                            {getSubcategoryDisplay()}
                                        </li>
                                    </Link>
                                </>
                            )}

                            {product?.name && (
                                <>
                                    <li className="flex-align ">
                                        <i className="ph ph-caret-right"></i>
                                    </li>
                                    <Link>
                                        <li className="text-xs text-sm-sm ">
                                            <Toolkit
                                                text={product?.name}
                                                showOnHover={false}
                                                maxLength={15}
                                                className=""
                                                font_size="10px"
                                            />
                                        </li>
                                    </Link>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!-- ========================= Breadcrumb End =============================== --> */}
            {/* <!-- ========================== Product Details Two Start =========================== --> */}
            <section className="product-details py-20">
                <div className="container container-lg">
                    <div className="row gy-4">
                        <div className="col-xl-9">
                            <div className="row gy-4">
                                <div className="col-xl-6 col-12">
                                    <ProductImages
                                        product={product}
                                        selectedImage={selectedImage}
                                    />
                                    {/* <div className=' d-block d-sm-none'><ShopFeature /></div> */}

                                </div>
                                <div className="col-xl-6 col-12">
                                    <div className="product-details__content">
                                        <small>{product?.brand}</small>
                                        <h5 className="mb-12">{product?.name}
                                        </h5>
                                        <div className="flex-align flex-wrap gap-12">
                                            <div className="flex-align gap-12 ">
                                                <div className="flex-align gap-8">
                                                    <div className="d-flex align-items-center">
                                                        {Array.from({ length: 5 }, (_, index) => (
                                                            <i
                                                                key={index}
                                                                className={`ph-fill ph-star me-1 fs-6 ${index < Math.round(product?.averageRating || 0)
                                                                    ? "text-warning"
                                                                    : "text-muted"
                                                                    }`}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-sm fw-medium text-neutral-600 bg-elifnic px-5 rounded">{product?.averageRating}</span>
                                                <span className="text-sm fw-medium text-gray-500">({product?.ratingCount})</span>
                                                <span className="text-sm fw-medium text-gray-500 d-none d-sm-block"> Review & Ratings</span>
                                            </div>

                                            {/* <span className="text-gray-900"> <span className="text-gray-400">SKU:</span>{product?.sku} </span> */}
                                        </div>
                                        <span className="mt-10 pt-10 text-gray-700 border-top border-gray-100 d-block"></span>



                                        <div className=" flex-align gap-16 mt-10 flex-wrap">
                                            <div className="flex-align gap-8">
                                                {currentPrice.discountPercentage > 0 && currentPrice.originalPrice > currentPrice.price && (
                                                    <div className="flex-align gap-2 fs-4 text-danger">
                                                        <i className="ph-fill ph-seal-percent text-xl "></i>
                                                        {currentPrice.discountPercentage}%
                                                    </div>
                                                )}

                                                <h6 className="mb-0 ">₹{currentPrice.price.toLocaleString('en-IN')}</h6>
                                                {currentPrice.originalPrice > currentPrice.price && (
                                                    <span className="text-md text-gray-400 fw-medium text-decoration-line-through">₹{currentPrice.originalPrice.toLocaleString('en-IN')}</span>
                                                )}
                                                {/* {currentPrice.priceDifference && (
                                                    <span className={`text-sm fw-medium ${parseFloat(currentPrice.priceDifference) < 0 ? 'text-success' : 'text-danger'}`}>
                                                        ({parseFloat(currentPrice.priceDifference) > 0 ? '+' : ''}₹{currentPrice.priceDifference})
                                                    </span>
                                                )} */}
                                            </div>

                                            {/* Stock Status Badge */}
                                            {/* <div className="ms-auto">
                                                {currentStock.isOutOfStock ? (
                                                    <span className="badge bg-danger px-12 py-8 text-white fw-medium">
                                                        <i className="ph ph-x-circle me-4"></i>
                                                        Out of Stock
                                                    </span>
                                                ) : currentStock.stock <= 5 ? (
                                                    <span className="badge bg-warning px-12 py-8 text-dark fw-medium">
                                                        <i className="ph ph-warning me-4"></i>
                                                        Only {currentStock.stock} left
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-success px-12 py-8 text-white fw-medium">
                                                        <i className="ph ph-check-circle me-4"></i>
                                                        In Stock
                                                    </span>
                                                )}
                                            </div> */}
                                        </div>

                                        {/* <div className="my-32 flex-align flex-wrap gap-12">
                                            <a href="#"
                                                className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600">
                                                Monthyly EMI &#8377; 150.00
                                                <i className="ph ph-caret-right"></i>
                                            </a>
                                            <a href="#"
                                                className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600">
                                                Shipping Charge
                                                <i className="ph ph-caret-right"></i>
                                            </a>
                                            <a href="#"
                                                className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600">
                                                Security & Privacy
                                                <i className="ph ph-caret-right"></i>
                                            </a>
                                        </div> */}

                                        {/* <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block"></span> */}
                                        <hr />

                                        <div className="">
                                            <div className="flex-between align-items-start flex-wrap gap-16">
                                                <div className="w-100">
                                                    {/* Color Options */}
                                                    {groupedOptions.color && groupedOptions.color.length > 0 && (
                                                        <div className="mb-16">
                                                            <span className="text-gray-900 fw-bold d-block mb-12 text-capitalize">
                                                                Color
                                                            </span>
                                                            <div className="color-list flex-align gap-8">
                                                                {groupedOptions.color.map((option, index) => (
                                                                    <button
                                                                        key={index}
                                                                        type="button"
                                                                        onClick={() => handleOptionSelect('Color', option)}
                                                                        className={`color-list__button w-32 h-32 border border-2 rounded-circle ${selectedOptions.Color === option.name
                                                                            ? 'border-main-600 shadow-sm'
                                                                            : 'border-gray-200'
                                                                            }`}
                                                                        style={{ backgroundColor: option.name }}
                                                                        title={option.name}
                                                                    ></button>
                                                                ))}
                                                            </div>
                                                            {selectedOptions.Color && (
                                                                <small className="text-gray-500 mt-8 d-block">
                                                                    Selected: <span className="fw-medium text-capitalize">{selectedOptions.Color}</span>
                                                                </small>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* List Options (Size, Weight, etc.) */}
                                                    {groupedOptions.list && Object.keys(groupedOptions.list).map((optionType, typeIndex) => (
                                                        <div key={typeIndex} className="mb-16">
                                                            <span className="text-gray-900 fw-bold d-block mb-12 text-capitalize">
                                                                {optionType}
                                                            </span>
                                                            <div className="flex-align gap-8 flex-wrap">
                                                                {groupedOptions.list[optionType].map((option, index) => (
                                                                    <button
                                                                        key={index}
                                                                        type="button"
                                                                        onClick={() => handleOptionSelect(optionType, option)}
                                                                        className={`px-16 py-8 text-sm rounded-8 text-capitalize transition-all ${selectedOptions[optionType] === (option.size || option.name)
                                                                            ? 'bg-main-600 text-white border-main-600'
                                                                            : 'text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600'
                                                                            }`}
                                                                    >
                                                                        {option.size || option.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            {selectedOptions[optionType] && (
                                                                <small className="text-gray-500 mt-8 d-block">
                                                                    Selected: <span className="fw-medium">{selectedOptions[optionType]}</span>
                                                                </small>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Validation Error Message */}
                                                    {variantError && (
                                                        <div className="mt-12">
                                                            <small className="text-danger d-flex align-items-center gap-2">
                                                                <i className="ph ph-warning-circle"></i>
                                                                {variantError}
                                                            </small>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-0">
                                            <h6 className="mb-10">Product details</h6>
                                            <span className="text-gray-500 text-wrap">
                                                <Description description={product?.description} wordLimit={20} />
                                            </span>

                                        </div>

                                        <span className="mt-10 pt-12 text-gray-700 border-top border-gray-100 d-block"></span>

                                        {/* available offers */}
                                        {/* <span className="text-gray-900 d-block fw-bolder mb-12 text-capitalize">
                                            Available Offers
                                        </span> */}

                                        {/* <Offers></Offers> */}




                                        {/* <span className="mt-10 pt-12 text-gray-700 border-top border-gray-100 d-block"></span> */}
                                        <div className='d-none d-sm-block'><ShopFeature productFeature={product?.features} /></div>

                                        {/* <a href="https://www.whatsapp.com/"
                                            className="btn btn-black flex-center gap-8 rounded-8 py-16">
                                            <i className="ph ph-whatsapp-logo text-lg"></i>
                                            Request More Information
                                        </a> */}



                                    </div>
                                    <div className=' d-block d-sm-none'><ShopFeature productFeature={product?.features} /></div>

                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3">
                            <div className="product-details__sidebar py-40 px-32 border border-gray-100 rounded-16">
                                {IsLogin() ?
                                    <div className="mb-">
                                        <label htmlFor="delivery"
                                            className="h6 activePage mb-8 text-heading fw-semibold d-block">Delivery</label>
                                        <div className="flex-align border border-gray-100 rounded-4 px-16">
                                            <span className="text-xl d-flex text-main-600">
                                                <i className="ph ph-map-pin"></i>
                                            </span>
                                            <select
                                                className="common-input border-0 px-8 rounded-4"
                                                id="delivery"
                                                value={selectedDeliveryAddress?.id ?? ''}
                                                onChange={handleDeliveryAddressChange}
                                            >
                                                {addresses && addresses.length > 0 ? (
                                                    addresses.map((address) => (
                                                        <option key={address.id} value={address.id}>
                                                            {address.address_line1}, {address.city} - {address.postal_code}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="">No addresses available</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className='mt-10'>
                                            <label htmlFor="delivery"
                                                className=" activePage mb-8 text-heading fw-semibold d-block">Estimated Delivery</label>
                                            <span className="text-gray-500">

                                                <ExpectedDate
                                                    delivery_postcode={selectedDeliveryPostalCode}
                                                    weight={deliveryWeight}
                                                    cod={deliveryCod}
                                                    pickup_postcode={pickup_postcode}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    : <div className="mb-32">
                                        <small htmlFor="delivery"
                                            className="fs-6 activePage mb-8">Please login to see your delivery Address <Link to="/login" className="text-link-100 fw-semibold hover-text-decoration-underline">Login</Link></small>
                                    </div>}

                                <div className="mb-32">
                                    <label htmlFor="stock" className="text-lg mb-8 text-heading fw-semibold d-block">
                                        {currentStock.isOutOfStock ?? (
                                            <span className="text-danger">Out of Stock</span>
                                        )}
                                    </label>

                                    {!allOptionsSelected && product?.options?.length > 0 && (
                                        <small className="text-warning d-block mt-8">
                                            <i className="ph ph-info me-4"></i>
                                            Please select all options to Buy Available exact product
                                        </small>
                                    )}
                                    <span className="text-xl d-flex">
                                        <i className="ph ph-location"></i>
                                    </span>
                                    {/* <div className="d-flex rounded-4 overflow-hidden">
                                        <button type="button"
                                            className="quantity__minus flex-shrink-0 h-48 w-48 text-neutral-600 bg-gray-50 flex-center hover-bg-main-600 hover-text-white">
                                            <i className="ph ph-minus"></i>
                                        </button>
                                        <input
                                            type="number"
                                            id="stock"
                                            value={quantity}
                                            onChange={handleChange}
                                            min={1}
                                            max={product?.stock}
                                            className="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-16"
                                        />
                                        <button type="button"
                                            className="quantity__plus flex-shrink-0 h-48 w-48 text-neutral-600 bg-gray-50 flex-center hover-bg-main-600 hover-text-white">
                                            <i className="ph ph-plus"></i>
                                        </button>
                                    </div> */}
                                </div>
                                {/* <div className="mb-32">
                                    <div className="flex-between flex-wrap gap-8 border-bottom border-gray-100 pb-16 mb-16">
                                        <span className="text-gray-500">Price</span>
                                        <h6 className="text-lg mb-0">₹{product?.total_price}</h6>
                                    </div>
                                    <div className="flex-between flex-wrap gap-8">
                                        <span className="text-gray-500">Shipping</span>
                                        <h6 className="text-lg mb-0">From ₹10.00</h6>
                                    </div>
                                </div> */}

                                {/* <a href="#" className="btn btn-main flex-center gap-8 rounded-8 py-16 fw-normal mt-48">
                                    <i className="ph ph-shopping-cart-simple text-lg"></i>
                                    Add To Cart
                                </a>
                                <a href="#" className="btn btn-outline-main rounded-8 py-16 fw-normal mt-16 w-100">
                                    Buy Now
                                </a>
                                {/* Action Buttons */}
                                <div className="product-actions">
                                    {currentStock.isOutOfStock ? (
                                        <button
                                            disabled
                                            className="btn-cart fs-6 p-18 disabled opacity-50"
                                            style={{ cursor: 'not-allowed' }}
                                        >
                                            <i className="ph ph-x-circle"></i>
                                            <span>Out of Stock</span>
                                        </button>
                                    ) : addingToCart ? (
                                        <button
                                            disabled
                                            className="btn-cart fs-6 p-18"
                                            style={{ cursor: 'wait' }}
                                        >
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            <span>Adding...</span>
                                        </button>
                                    ) : isProductInCart ? (
                                        <Link
                                            to="/cart"
                                            className="btn-cart in-cart fs-6 p-18"
                                            title="View Cart"
                                        >
                                            <i className="fa-solid fa-cart-shopping"></i>
                                            <span>In Cart</span>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleAddtocart}
                                            className="btn-cart fs-6 p-18"
                                            title="Add to Cart"
                                        >
                                            {/* <i className="fa-solid fa-cart-plus"></i> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" id="Filled" fill="white" viewBox="0 0 24 24" width="20" height="20"><path d="M22.713,4.077A2.993,2.993,0,0,0,20.41,3H4.242L4.2,2.649A3,3,0,0,0,1.222,0H1A1,1,0,0,0,1,2h.222a1,1,0,0,1,.993.883l1.376,11.7A5,5,0,0,0,8.557,19H19a1,1,0,0,0,0-2H8.557a3,3,0,0,1-2.82-2h11.92a5,5,0,0,0,4.921-4.113l.785-4.354A2.994,2.994,0,0,0,22.713,4.077Z" /><circle cx="7" cy="22" r="2" /><circle cx="17" cy="22" r="2" /></svg>
                                            <span>Add to Cart</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={handleBuyNow}
                                        disabled={currentStock.isOutOfStock}
                                        className={`btn-buy p-18 fs-6 w-100 ${currentStock.isOutOfStock ? 'disabled opacity-50' : ''}`}
                                        style={currentStock.isOutOfStock ? { cursor: 'not-allowed' } : {}}
                                        title={currentStock.isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                                    >
                                        {/* <i className="fa-solid fa-bolt"></i> */}
                                        <svg fill='#fff' xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="18" height="18"><path d="M19,0H5C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm-3,13h-3v3c0,.553-.448,1-1,1s-1-.447-1-1v-3h-3c-.552,0-1-.447-1-1s.448-1,1-1h3v-3c0-.553,.448-1,1-1s1,.447,1,1v3h3c.552,0,1,.447,1,1s-.448,1-1,1Z" /></svg>
                                        <span>Buy</span>
                                    </button>
                                </div>
                                <div className="mt-32">
                                    <span className="fw-medium text-gray-900">100% Guarantee Safe Checkout</span>
                                    <div className="mt-10">
                                        <img src="/images/thumbs/gateway-img.png" alt="" />
                                    </div>
                                </div>

                                <div className="mt-32">
                                    <div className="px-16 py-8 bg-main-50 rounded-8 text-nowrap  d-flex align-items-center gap-24 mb-14">
                                        <span
                                            className="w-32 h-32 bg-white text-main-600 rounded-circle flex-center text-xl flex-shrink-0">
                                            <i className="ph-fill ph-truck"></i>
                                        </span>
                                        <span className="text-sm text-neutral-600">Fullfilled by: <img src="/images/logo/lfinic favicon.png" className='' width={15} alt="" /><span
                                            className="fw-semibold">Elfinic</span> </span>
                                    </div>
                                    {product?.vendor && (
                                        <div className="px-16 py-8 bg-main-50 rounded-8 d-flex align-items-center gap-24 mb-0">
                                            <span
                                                className="w-32 h-32 bg-white text-main-600 rounded-circle flex-center text-xl flex-shrink-0">
                                                <i className="ph-fill ph-storefront"></i>
                                            </span>

                                            <span className="text-sm text-neutral-600">Sold by: <Link to={`/vendor-details/${product?.vendorId}`} className="fw-semibold text-black">{product?.vendor}</Link> </span>

                                        </div>
                                    )}
                                </div>

                                <div className="mt-32">
                                    <div className="px-32 py-16 rounded-8 border border-gray-100 flex-between gap-8">
                                        <WishlistRedux product_id={product?.id} />
                                        <span className="h-26 border border-gray-100"></span>
                                        <div className="dropdown on-hover-item">
                                            <button className="d-flex text-main-600 text-28" type="button">
                                                <i className="ph-fill ph-share-network"></i>
                                            </button>
                                            <SocialShare />
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div className="col-12">
                            <div className="product-dContent border rounded-24">
                                <div className="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16">
                                    <ul className="nav common-tab nav-pills mb-3" id="pills-tab" role="tablist">
                                        {/* description */}
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="pills-description-tab" data-bs-toggle="pill"
                                                data-bs-target="#pills-description" type="button" role="tab"
                                                aria-controls="pills-description" aria-selected="true">Description</button>
                                        </li>
                                        {/* reviews */}
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-reviews-tab" data-bs-toggle="pill"
                                                data-bs-target="#pills-reviews" type="button" role="tab"
                                                aria-controls="pills-reviews" aria-selected="false">Reviews</button>
                                        </li>
                                        {/* size chart */}

                                        {showSizeChart && (<li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-sizechart-tab" data-bs-toggle="pill"
                                                data-bs-target="#pills-sizechart" type="button" role="tab"
                                                aria-controls="pills-sizechart" aria-selected="false">Size Chart</button>
                                        </li>)}


                                    </ul>
                                    <a href="#"
                                        className="btn bg-color-one rounded-16 flex-align img-fluid gap-8 text-main-600 hover-bg-main-600 hover-text-white">
                                        <img width={24} src="/images/logo/lfinic favicon.png" alt="" />
                                        100% Satisfaction Guaranteed
                                    </a>
                                </div>
                                <div className="product-dContent__box">
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className="tab-pane fade show active" id="pills-description" role="tabpanel"
                                            aria-labelledby="pills-description-tab" tabIndex="0">
                                            <div className="mb-40">
                                                <h6 className="mb-24">Product Description</h6>
                                                <span className="text-gray-500 text-wrap">
                                                    <Description description={product?.description} wordLimit={500} />
                                                </span>

                                            </div>
                                            {/* Render product details HTML from API */}
                                            {product?.product_details && (
                                                <div className="mb-40">
                                                    <h6 className="mb-24">Product Details</h6>
                                                    {renderProductDetails()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="tab-pane fade" id="pills-reviews" role="tabpanel"
                                            aria-labelledby="pills-reviews-tab" tabIndex="0">
                                            <ProductReview productId={product?.id}></ProductReview>
                                        </div>
                                        <div className="tab-pane fade" id="pills-sizechart" role="tabpanel"
                                            aria-labelledby="pills-sizechart-tab" tabIndex="0">
                                            <SizeChart />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>


                </div>
            </section >
            {/* <!-- ========================== Product Details Two End =========================== --> */}

            {/* <!-- ========================== Similar Product Start ============================= --> */}

            <div className="row px-10">
                <div className='px-30'>  <Heading
                    title="Similar Products"
                    size="small"
                    subtitle=" You may like these products too"
                    showViewAll={false}

                /></div>
                {Array.isArray(similarProducts) &&
                    similarProducts.map((product) => (<>
                        <div className="col-2 col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 mb-24" key={product.id}>
                            <Product key={product.id} product={product} />
                        </div>
                    </>
                    ))}
            </div>



        </>
    )
}

export default ProductDetails