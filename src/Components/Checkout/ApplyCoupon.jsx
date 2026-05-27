import React, { useEffect } from 'react'
import useApi from '../../hooks/useApi';

function ApplyCoupon({ cartItems = [], cartSubtotal = 0, onCouponApplied }) {
    const { 
        API_BASE_URL, 
        user,
        // Coupon state from Redux
        coupons,
        couponsLoading,
        appliedCoupon,
        discountInfo,
        couponApplyLoading,
        couponApplyError,
        couponApplySuccess,
        // Coupon actions
        fetchCoupons,
        applyCouponCode,
        removeCoupon,
        clearCouponError,
    } = useApi();
    
    const [showModal, setShowModal] = React.useState(false);
    const [selectedOffer, setSelectedOffer] = React.useState(null);
    const [isOffersOpen, setIsOffersOpen] = React.useState(false);
    const [couponCode, setCouponCode] = React.useState('');
    const [localError, setLocalError] = React.useState('');

    // Fetch coupons on component mount
    useEffect(() => {
        fetchCoupons();
    }, []);

    // Notify parent when coupon is applied
    useEffect(() => {
        if (appliedCoupon && discountInfo) {
            if (onCouponApplied) {
                onCouponApplied({
                    coupon: appliedCoupon,
                    pricing: {
                        total_discount: discountInfo.totalDiscount,
                        cart_subtotal: discountInfo.cartSubtotal,
                        total_payable_amount: discountInfo.totalPayableAmount
                    },
                    item_discounts: discountInfo.itemDiscounts
                });
            }
        }
    }, [appliedCoupon, discountInfo, onCouponApplied]);

    // Notify parent when coupon is removed
    useEffect(() => {
        if (!appliedCoupon && onCouponApplied) {
            // Only call if we previously had a coupon (to avoid initial call)
        }
    }, [appliedCoupon]);

    const handleOfferClick = (offer) => {
        setSelectedOffer(offer);
        setShowModal(true);
    };

    const toggleOffers = (e) => {
        e.preventDefault();
        setIsOffersOpen(!isOffersOpen);
    };

    // Apply coupon from offers list
    const handleApplyFromOffer = (code) => {
        setCouponCode(code);
        handleApplyCoupon(code);
    };

    // Remove applied coupon
    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponCode('');
        // Notify parent component
        if (onCouponApplied) {
            onCouponApplied(null);
        }
    };

    const handleApplyCoupon = async (codeToApply = null) => {
        const code = codeToApply || couponCode;
        
        // Clear previous errors
        setLocalError('');
        clearCouponError();

        // Validation
        if (!code.trim()) {
            setLocalError('Please enter a coupon code');
            return;
        }

        if (!user || !user.id) {
            setLocalError('Please login to apply coupon');
            return;
        }

        // Check cart items - handle both array and object with data property
        let itemsToProcess = cartItems;
        if (cartItems && cartItems.data && Array.isArray(cartItems.data)) {
            itemsToProcess = cartItems.data;
        }

        if (!itemsToProcess || !Array.isArray(itemsToProcess) || itemsToProcess.length === 0) {
            setLocalError('Your cart is empty');
            return;
        }

        // Apply coupon via Redux
        applyCouponCode(user.id, code.trim(), itemsToProcess, cartSubtotal);
    };

    const handleOnsubmit = async (e) => {
        e.preventDefault();
        handleApplyCoupon();
    };

    // Filter valid coupons
    const validCoupons = coupons.filter(coupon => coupon.coupon_status === 'valid');

    // Get error message (local or from Redux)
    const errorMessage = localError || couponApplyError;

    return (
        <>
            <form onSubmit={handleOnsubmit}>
                {/* Show applied coupon or input field */}
                {appliedCoupon ? (
                    <div className="applied-coupon-box p-3 border rounded bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <span className="badge bg-success me-2">
                                    <i className="ph ph-check-circle"></i> Applied
                                </span>
                                <span className="fw-bold text-uppercase">{appliedCoupon.code}</span>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={handleRemoveCoupon}
                                disabled={couponApplyLoading}
                            >
                                <i className="ph ph-x"></i> Remove
                            </button>
                        </div>
                        {appliedCoupon.message && (
                            <p className="text-muted small mb-0 mt-2">
                                <i className="ph ph-info"></i> {appliedCoupon.message}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="d-flex justify-content-between gap-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => {
                                setCouponCode(e.target.value);
                                setLocalError('');
                                clearCouponError();
                            }}
                            disabled={couponApplyLoading}
                        />
                        <button
                            type="submit"
                            className="btn bg-elifnic text-nowrap"
                            disabled={couponApplyLoading || !couponCode.trim()}
                        >
                            {couponApplyLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Applying...
                                </>
                            ) : 'Apply'}
                        </button>
                    </div>
                )}
                
                {errorMessage && (
                    <div className="alert alert-danger py-2 mt-2 mb-0" style={{ fontSize: "12px" }}>
                        <i className="ph ph-warning-circle me-1"></i>{errorMessage}
                    </div>
                )}
                {couponApplySuccess && !appliedCoupon && (
                    <span className="text-success d-block mt-2" style={{ fontSize: "12px" }}>
                        <i className="ph ph-check-circle me-1"></i>{couponApplySuccess}
                    </span>
                )}

                {/* Discount Summary */}
                {discountInfo && discountInfo.totalDiscount > 0 && (
                    <div className="discount-summary mt-3 p-3 border rounded" style={{ backgroundColor: '#f0fff4' }}>
                        <h6 className="text-success mb-2">
                            <i className="ph ph-confetti me-1"></i> Discount Applied!
                        </h6>
                        <div className="d-flex justify-content-between mb-1" style={{ fontSize: "13px" }}>
                            <span>Cart Subtotal:</span>
                            <span>₹{discountInfo.cartSubtotal?.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1 text-success" style={{ fontSize: "13px" }}>
                            <span>Discount:</span>
                            <span>- ₹{discountInfo.totalDiscount?.toLocaleString()}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "14px" }}>
                            <span>You Pay:</span>
                            <span className="text-success">₹{discountInfo.totalPayableAmount?.toLocaleString()}</span>
                        </div>
                        
                        {/* Item-wise discount details */}
                        {discountInfo.itemDiscounts && discountInfo.itemDiscounts.some(item => item.discount_amount > 0) && (
                            <div className="mt-2 pt-2 border-top">
                                <small className="text-muted d-block mb-1">Item-wise discounts:</small>
                                {discountInfo.itemDiscounts
                                    .filter(item => item.discount_amount > 0)
                                    .map((item, index) => (
                                        <div key={index} className="d-flex justify-content-between" style={{ fontSize: "11px" }}>
                                            <span className="text-muted">Product #{item.product_id}</span>
                                            <span className="text-success">- ₹{item.discount_amount}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-3">
                    <a
                        href="#!"
                        className="text-decoration-none text-organge"
                        onClick={toggleOffers}
                    >
                        <i className="ph ph-tag"></i> Available offers 
                        {couponsLoading && <span className="spinner-border spinner-border-sm ms-2" role="status"></span>}
                     
                    </a>
                </div>
                {/* dropdown for available offers */}
                {isOffersOpen && (
                    <div className="mt-2">
                        <div className="card card-body p-2">
                            {couponsLoading ? (
                                <div className="text-center py-3">
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Loading offers...
                                </div>
                            ) : validCoupons.length === 0 ? (
                                <p className="text-muted small mb-0 text-center py-2">
                                    No offers available at the moment
                                </p>
                            ) : (
                                validCoupons.map((offer) => (
                                    <div 
                                        key={offer.id} 
                                        className="offer-item border-bottom py-2 px-1" 
                                        style={{ fontSize: "12px" }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                {/* <div className="d-flex align-items-center gap-2 mb-1">
                                                    <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: "10px" }}>
                                                        {offer.code}
                                                    </span>
                                                    <span className="text-success fw-semibold">
                                                        {offer.discount_type === 'percent' 
                                                            ? `${offer.discount_value}% OFF` 
                                                            : `₹${offer.discount_value} OFF`}
                                                    </span>
                                                </div> */}
                                                {offer.title && (
                                                    <p className="mb-1 fw-medium">{offer.title}</p>
                                                )}
                                                {offer.minimum_amount && parseFloat(offer.minimum_amount) > 0 && (
                                                    <p className="text-muted mb-1" style={{ fontSize: "11px" }}>
                                                        Min. order: ₹{parseFloat(offer.minimum_amount).toLocaleString()}
                                                    </p>
                                                )}
                                                <div className="d-flex gap-2 align-items-center">
                                                    {offer.end_date && (
                                                        <span className="text-muted" style={{ fontSize: "10px" }}>
                                                            <i className="ph ph-calendar me-1"></i>
                                                            Valid till {new Date(offer.end_date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {offer.term_condition && (
                                                        <a
                                                            href="#!"
                                                            className="text-decoration-none text-primary"
                                                            style={{ fontSize: "10px" }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleOfferClick({
                                                                    id: offer.id,
                                                                    title: offer.code,
                                                                    terms: offer.term_condition
                                                                });
                                                            }}
                                                        >
                                                            T&C
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-success ms-2"
                                                style={{ fontSize: "11px" }}
                                                onClick={() => handleApplyFromOffer(offer.code)}
                                                disabled={couponApplyLoading || appliedCoupon?.code === offer.code}
                                            >
                                                {couponApplyLoading && couponCode === offer.code ? (
                                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                                ) : appliedCoupon?.code === offer.code ? (
                                                    'Applied'
                                                ) : (
                                                    'Apply'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </form>

            {/* Modal for T&C */}
            <div
                className={`modal fade ${showModal ? 'show' : ''}`}
                style={{ display: showModal ? 'block' : 'none' }}
                tabIndex="-1"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Terms & Conditions</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {selectedOffer && (
                                <>
                                    <h6>{selectedOffer.title}</h6>
                                    <p>{selectedOffer.terms}</p>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}
        </>
    )
}

export default ApplyCoupon