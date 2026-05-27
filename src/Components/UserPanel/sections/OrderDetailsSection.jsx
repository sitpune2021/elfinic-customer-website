import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaClock,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaBuilding,
  FaComments,
  FaStar,
  FaRegStar,
  FaDownload,
  FaArrowLeft,
  FaChevronRight,
  FaTag,
  FaPercent,
  FaRupeeSign,
  FaCreditCard,
  FaShieldAlt,
  FaCopy,
  FaInfoCircle,
  FaRegThumbsUp,
  FaRedo,
} from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import {
  fetchOrderHistoryDetails,
  selectOrderHistoryDetails,
  selectOrderHistoryDetailsLoading,
  selectOrderHistoryDetailsError,
  clearOrderHistoryDetails,
} from "../../../store/slices/orderSlice";
import { submitReview } from "../../../store/slices/reviewSlice";
import { selectUser } from "../../../store/slices/authSlice";
import "./OrderDetailsSection.css";
import Toolkit from "../../External-lab/Toolkit";
import DownloadInvoice from "./DownloadInvoice";
import { Link } from "react-router-dom";

// Image base URL from environment
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://admin.elfinic.com/';

function OrderDetailsSection({ orderId, onBack }) {
  const dispatch = useDispatch();
  const orderHistoryDetails = useSelector(selectOrderHistoryDetails);
  const isLoading = useSelector(selectOrderHistoryDetailsLoading);
  const error = useSelector(selectOrderHistoryDetailsError);
  const user = useSelector(selectUser);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  const [submittedRatings, setSubmittedRatings] = useState(new Set());

  // Fetch order details on mount
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderHistoryDetails(orderId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearOrderHistoryDetails());
    };
  }, [dispatch, orderId]);

  // Transform API response to orderData format
  const orderData = useMemo(() => {
    if (!orderHistoryDetails || orderHistoryDetails.length === 0) {
      return null;
    }

    const firstItem = orderHistoryDetails[0];
    const address = firstItem.address || {};

    // Calculate totals from all items
    const totalAmount = orderHistoryDetails.reduce(
      (sum, item) => sum + parseFloat(item.total_amount || 0), 0
    );
    const totalDiscount = orderHistoryDetails.reduce(
      (sum, item) => sum + parseFloat(item.discount_amount || 0), 0
    );

    // Get listing price (sum of discounts represents original prices)
    const listingPrice = orderHistoryDetails.reduce(
      (sum, item) => sum + parseFloat(item.discount || item.total_amount || 0), 0
    );

    return {
      order_id: firstItem.order_number?.replace("ORD-", "") || orderId,
      orderID: firstItem.order_id,
      order_number: firstItem.order_number,
      place_at: formatDateDisplay(firstItem.paid_at),
      delivered_at: firstItem.delivered_status === "delivered"
        ? formatDateDisplay(firstItem.delivered_at)
        : null,
      paid_at: formatDateDisplay(firstItem.paid_at),
      item_status: firstItem.delivered_status || "pending",
      payment_status: firstItem.payment_status,
      payment_method: "UPI",
      coupon_code: firstItem.coupon_code,
      coins_used: firstItem.coins_used,
      items: orderHistoryDetails.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        variant_name: item.variant_name || "",
        product_thumb: item.product_thumb,
        quantity: item.quantity || 1,
        price: parseFloat(item.discount || item.total_amount || 0),
        special_price: parseFloat(item.total_amount || 0),
        final_price: parseFloat(item.final_price || item.total_amount || 0),
        seller: item.vendor_name || "Elfinic Store",
        slug: item.slug,
        offers: 0,
      })),
      delivery_address: {
        type: address.type || "Home",
        name: address.name || "Customer",
        phone: address.phone || "",
        address_line1: address.address_line1 || "",
        address_line2: address.address_line2 || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "India",
        pincode: address.postal_code || "",
      },
      price_details: {
        listing_price: Math.abs(listingPrice),
        special_price: totalAmount,
        fees: 0,
        discount: totalDiscount,
        total_amount: totalAmount,
      },
      history: firstItem.history || [],
      return_policy_end: null,
    };
  }, [orderHistoryDetails, orderId]);

  // Format date for display
  function formatDateDisplay(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // Format date with time for history
  function formatDateTimeDisplay(dateString) {
    if (!dateString) return "";
    return dateString;
  }

  // Get product image
  const getProductImage = (productThumb) => {
    if (!productThumb) return null;
    return `${IMAGE_BASE_URL}${productThumb}`;
  };

  // Get status timeline config
  const getStatusTimeline = () => {
    if (!orderData) return [];

    const status = orderData.item_status?.toLowerCase() || "pending";

    const timeline = [
      {
        id: "confirmed",
        label: "Order Confirmed",
        date: orderData.place_at,
        completed: true,
        icon: FaCheckCircle,
      },
      // {
      //   id: "shipped",
      //   label: "Shipped",
      //   date: null,
      //   completed: status === "shipped" || status === "out_for_delivery" || status === "delivered",
      //   icon: FaTruck,
      // },
      // {
      //   id: "delivered",
      //   label: "Delivered",
      //   date: orderData.delivered_at,
      //   completed: status === "delivered",
      //   icon: FaBox,
      // },
    ];

    if (status === "cancelled") {
      return [
        {
          id: "confirmed",
          label: "Order Confirmed",
          date: orderData.place_at,
          completed: true,
          icon: FaCheckCircle,
        },
        {
          id: "cancelled",
          label: "Cancelled",
          date: null,
          completed: true,
          icon: FaTimesCircle,
          isCancelled: true,
        },
      ];
    }

    return timeline;
  };

  // Get detailed timeline with sub-updates for modal (using API history data)
  const getDetailedTimeline = () => {
    if (!orderData) return [];

    const status = orderData.item_status?.toLowerCase() || "pending";
    const history = orderData.history || [];

    // Map API history statuses to timeline steps
    const statusMap = {
      'order_placed': { id: 'confirmed', label: 'Order Confirmed', icon: FaCheckCircle },
      'payment_confirmed': { id: 'payment', label: 'Payment Confirmed', icon: FaCheckCircle },
      'processing': { id: 'processing', label: 'Processing', icon: FaClock },
      'shipped': { id: 'shipped', label: 'Shipped', icon: FaTruck },
      'out_for_delivery': { id: 'out_for_delivery', label: 'Out For Delivery', icon: FaTruck },
      'delivered': { id: 'delivered', label: 'Delivered', icon: FaBox },
      'cancelled': { id: 'cancelled', label: 'Cancelled', icon: FaTimesCircle, isCancelled: true },
    };

    // Build timeline from history
    if (history.length > 0) {
      const timelineFromHistory = [];
      let processedStatuses = new Set();

      history.forEach((historyItem, index) => {
        const statusInfo = statusMap[historyItem.history_status] || {
          id: historyItem.history_status,
          label: historyItem.history_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          icon: FaClock
        };

        if (!processedStatuses.has(statusInfo.id)) {
          processedStatuses.add(statusInfo.id);

          // Find all sub-updates for this status
          const subUpdates = history
            .filter(h => h.history_status === historyItem.history_status)
            .map(h => ({
              text: h.history_message,
              timestamp: h.created_at
            }));

          timelineFromHistory.push({
            ...statusInfo,
            date: historyItem.created_at?.split(' ')[0] || null,
            completed: true,
            subUpdates
          });
        }
      });

      return timelineFromHistory;
    }

    // Fallback to default timeline if no history
    const detailedTimeline = [
      {
        id: "confirmed",
        label: "Order Confirmed",
        date: orderData.place_at,
        completed: true,
        icon: FaCheckCircle,
        subUpdates: [
          {
            text: "Your Order has been placed.",
            timestamp: orderData.paid_at || orderData.place_at
          }
        ]
      },
      {
        id: "shipped",
        label: "Shipped",
        date: null,
        completed: status === "shipped" || status === "out_for_delivery" || status === "delivered",
        icon: FaTruck,
        subUpdates: []
      },
      {
        id: "delivered",
        label: "Delivered",
        date: orderData.delivered_at,
        completed: status === "delivered",
        icon: FaBox,
        subUpdates: status === "delivered" ? [
          {
            text: "Your item has been delivered",
            timestamp: orderData.delivered_at
          }
        ] : []
      },
    ];

    if (status === "cancelled") {
      return [
        {
          id: "confirmed",
          label: "Order Confirmed",
          date: orderData.place_at,
          completed: true,
          icon: FaCheckCircle,
          subUpdates: [
            {
              text: "Your Order has been placed.",
              timestamp: orderData.place_at
            }
          ]
        },
        {
          id: "cancelled",
          label: "Cancelled",
          date: null,
          completed: true,
          icon: FaTimesCircle,
          isCancelled: true,
          subUpdates: [
            {
              text: "Order has been cancelled."
            }
          ]
        },
      ];
    }

    return detailedTimeline;
  };

  // Copy order ID to clipboard
  const copyOrderId = () => {
    if (!orderData) return;
    navigator.clipboard.writeText(orderData.order_number || orderData.order_id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  // Submit quick rating
  const submitQuickRating = async (productId, ratingValue) => {
    const userId = user?.id || localStorage.getItem('userId');

    if (!userId) {
      toast.error('Please log in to rate products');
      return;
    }

    // Check if already rated
    const ratingKey = `${productId}-${ratingValue}`;
    if (submittedRatings.has(ratingKey)) {
      toast.info('You have already submitted this rating');
      return;
    }

    try {
      // Submit quick rating
      const quickReviewData = {
        user_id: userId,
        productId: productId,
        rating: ratingValue,
        title: '',
        content: ``,
        image: [],
        video: []
      };

      await dispatch(submitReview(quickReviewData)).unwrap();

      // Mark as submitted
      setSubmittedRatings(prev => new Set([...prev, ratingKey]));
      toast.success(`Thank you for rating ${ratingValue} stars!`);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  // Render star rating
  const renderStars = (currentRating, setRatingFn, hoverState, setHoverState, productId = null) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hoverState || currentRating) ? "filled" : ""}`}
            onClick={() => {
              setRatingFn(star);
              if (productId) {
                submitQuickRating(productId, star);
              }
            }}
            onMouseEnter={() => setHoverState && setHoverState(star)}
            onMouseLeave={() => setHoverState && setHoverState(0)}
          >
            {star <= (hoverState || currentRating) ? (
              <FaStar />
            ) : (
              <FaRegStar />
            )}
          </span>
        ))}
      </div>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <section className="content-section active order-details-section">
      <div className="order-details-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft />
          <span>Back to Orders</span>
        </button>
        <h1 className="header-name">Order Details</h1>
        <p className="dashboard-subtitle">View your order information and track delivery</p>
      </div>

      <div className="order-details-container">
        <div className="order-details-left">
          <div className="product-detail-card">
            <div className="product-detail-header">
              <Skeleton width={120} height={120} borderRadius={12} />
              <div className="product-detail-info" style={{ flex: 1, marginLeft: 16 }}>
                <Skeleton width="80%" height={24} />
                <Skeleton width="40%" height={18} style={{ marginTop: 8 }} />
                <Skeleton width="30%" height={28} style={{ marginTop: 12 }} />
              </div>
            </div>
            <div className="order-timeline" style={{ marginTop: 20 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="timeline-step" style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Skeleton circle width={40} height={40} />
                  <div style={{ marginLeft: 12 }}>
                    <Skeleton width={100} height={16} />
                    <Skeleton width={70} height={14} style={{ marginTop: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-details-right">
          <div className="info-card-order">
            <Skeleton width={150} height={20} style={{ marginBottom: 16 }} />
            <Skeleton width="100%" height={16} count={3} style={{ marginBottom: 8 }} />
          </div>
          <div className="info-card-order" style={{ marginTop: 16 }}>
            <Skeleton width={120} height={20} style={{ marginBottom: 16 }} />
            <Skeleton width="100%" height={16} count={5} style={{ marginBottom: 8 }} />
          </div>
        </div>
      </div>
    </section>
  );

  // Error state component
  const ErrorState = () => (
    <section className="content-section active order-details-section">
      <div className="order-details-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft />
          <span>Back to Orders</span>
        </button>
        <h1 className="header-name">Order Details</h1>
      </div>
      <div className="orders-error-state">
        <div className="error-icon">
          <FaTimesCircle size={50} />
        </div>
        <h3>Failed to Load Order Details</h3>
        <p>{error || "Something went wrong. Please try again."}</p>
        <button
          className="order-action-btn primary"
          onClick={() => dispatch(fetchOrderHistoryDetails(orderId))}
        >
          <FaRedo size={14} />
          Try Again
        </button>
      </div>
    </section>
  );

  // Show loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show error state
  if (error) {
    return <ErrorState />;
  }

  // Show loading if no data yet
  if (!orderData) {
    return <LoadingSkeleton />;
  }

  const timeline = getStatusTimeline();
  const firstItem = orderData.items[0];

  const productImage = getProductImage(firstItem?.product_thumb);

  return (
    <section className="content-section active order-details-section">
      {/* Header with back button */}
      <div className="order-details-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft />
          <span>Back to Orders</span>
        </button>
        <h1 className="header-name">Order Details</h1>
        <p className="dashboard-subtitle">View your order information and track delivery</p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="order-details-container">
        {/* Left Column */}
        <div className="order-details-left">
          {/* Delivery Badge */}
          {orderData.item_status === "delivered" && (
            <div className="delivery-badge-card">
              <div className="delivery-badge-icon">
                <FaBox />
              </div>
              <div className="delivery-badge-content">
                <h4>Delivered in transparent packaging</h4>
                <p>You checked and confirmed the order at your doorstep</p>
              </div>
            </div>
          )}

          {/* Product Card */}
          <div className="product-detail-card">
            <div className="product-detail-header">
              <div className="product-image-large">
                {productImage ? (
                  <Link to={`/product-details/${firstItem.slug}`} rel="noopener noreferrer">
                    <img
                      src={productImage}
                      alt={firstItem?.product_name || "Product"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/default/product-placeholder.png";
                      }}
                    /></Link>
                ) : (
                  <div className="product-placeholder-large">
                    <FaBox size={40} />
                  </div>
                )}
              </div>
              <div className="product-detail-info">
                <h3 className="product-title"><Toolkit text={firstItem?.product_name} maxLength={30} /></h3>
                {firstItem?.variant_name && (
                  <span className="product-variant">{firstItem.variant_name}</span>
                )}
                {/* <div className="seller-info">
                  <span className="seller-label">Seller:</span>
                  <span className="seller-name">{firstItem?.seller || "Elfinic Store"}</span>
                </div> */}
                <div className="product-price-row">
                  <span className="current-price-order mt-12">
                    ₹{orderData.price_details?.special_price?.toLocaleString("en-IN")}
                  </span>
                  {firstItem?.offers > 0 && (
                    <span className="offers-badge">{firstItem.offers} offers</span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="order-timeline">
              {timeline.map((step, index) => (
                <div
                  key={step.id}
                  className={`timeline-step ${step.completed ? "completed" : ""} ${step.isCancelled ? "cancelled" : ""}`}
                >
                  <div className="timeline-icon-wrapper">
                    <div className="timeline-icon">
                      <step.icon />
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={` ms-14 timeline-line ${timeline[index + 1]?.completed ? "completed" : ""}`}></div>
                    )}
                  </div>
                  <div className=" ms-18 timeline-content">
                    <span className="timeline-label">{step.label}</span>
                    {step.date && <span className="timeline-date">{step.date}</span>}
                    {/* Show last history message in first status for quick view */}
                    {step.id === "confirmed" && orderData.history && orderData.history.length > 0 && (
                      <span className="timeline-status-message">
                        {orderData.history[0].history_message}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* See All Updates Link */}
            <button className="see-updates-btn" onClick={() => setShowUpdatesModal(true)}>
              See All Updates
              <FaChevronRight />
            </button>

            {/* Return Policy */}
            {orderData.return_policy_end && (
              <div className="return-policy-info">
                <FaInfoCircle />
                <span>Return policy ended on {orderData.return_policy_end}</span>
              </div>
            )}
          </div>

          {/* Chat with us */}
          {/* <div className="chat-support-card">
            <FaComments className="chat-icon" />
            <span>Chat with us</span>
          </div> */}

          {/* Rating Section */}
          <div className="rating-section-card">
            <h3 className="rating-section-title">Rate your experience</h3>

            {/* Product Rating */}
            {orderData.items.map((item, index) => (
              <div key={item.product_id || index} className="rating-item">
                <div className="rating-item-icon">
                  <FaBox />
                </div>
                <div className="rating-item-content">
                  <span className="rating-label">
                    Rate {item.product_name?.length > 30
                      ? item.product_name.substring(0, 30) + '...'
                      : item.product_name}
                  </span>
                  {renderStars(
                    rating,
                    setRating,
                    hoverRating,
                    setHoverRating,
                    item.product_id
                  )}
                </div>
              </div>
            ))}

            {/* Delivery Rating */}

          </div>
        </div>

        {/* Right Column */}
        <div className="order-details-right">
          {/* Delivery Details Card */}
          <div className="info-card-order delivery-details-card">
            <h3 className="info-card-order-title">Delivery details</h3>

            <div className="address-info">
              <div className="address-type-badge">
                <FaBuilding />
                <span>{orderData.delivery_address?.type || "Home"}</span>
              </div>
              <p className="address-line">
                {orderData.delivery_address?.address_line1}, {orderData.delivery_address?.address_line2}
              </p>
            </div>

            <div className="contact-info">
              <FaUser className="contact-icon" />
              <div className="contact-details">
                <span className="contact-name">{orderData.delivery_address?.name}</span>
                <span className="contact-phone">{orderData.delivery_address?.phone}</span>
              </div>
            </div>
          </div>

          {/* Price Details Card */}
          <div className="info-card-order price-details-card">
            <h3 className="info-card-order-title">Price details</h3>

            <div className="price-breakdown">
              <div className="price-row">
                <span className="price-label">Listing price</span>
                <span className="price-value strikethrough">
                  ₹{orderData.price_details?.listing_price?.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="price-row">
                <span className="price-label">
                  Special price
                  <FaInfoCircle className="info-icon-order" />
                </span>
                <span className="price-value">
                  ₹{orderData.price_details?.special_price?.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="price-row expandable">
                <span className="price-label">
                  Total fees
                  <FaChevronRight className="expand-icon" />
                </span>
                <span className="price-value">
                  ₹{orderData.price_details?.fees?.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="price-row expandable discount">
                <span className="price-label">
                  Other discount
                  <FaChevronRight className="expand-icon" />
                </span>
                <span className="price-value discount-value">
                  -₹{orderData.price_details?.discount?.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="price-row total">
                <span className="price-label">Total amount</span>
                <span className="price-value total-value">
                  ₹{orderData.price_details?.total_amount?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="payment-method-row">
              <span className="payment-label">Payment method</span>
              <div className="payment-badge">
                <IoWallet />
                <span>{orderData.payment_method || "UPI"}</span>
              </div>
            </div>

            {/* Download Invoice Button */}
            {console.log("Rendering DownloadInvoice with:", { orderData })}

            {orderData.item_status === "confirmed" && (
              <DownloadInvoice orderID={orderData.orderID} order_number={orderData.order_number}></DownloadInvoice>
            )}
          </div>

          {/* Offers Earned Card */}
          {/* <div className="info-card-order offers-card">
            <div className="offers-header">
              <FaTag className="offers-icon" />
              <span>Offers earned</span>
              <FaChevronRight className="expand-arrow" />
            </div>
          </div> */}
        </div>
      </div>

      {/* Order ID Footer */}
      <div className="order-id-footer">
        <span className="order-id-label">Order {orderData.order_number || `#${orderData.order_id}`}</span>
        <button className="copy-btn" onClick={copyOrderId}>
          <FaCopy />
          {copiedOrderId ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* All Updates Modal */}
      {showUpdatesModal && (
        <div className="updates-modal-overlay" onClick={() => setShowUpdatesModal(false)}>
          <div className="updates-modal" onClick={(e) => e.stopPropagation()}>
            <div className="updates-modal-header">
              <h3>Order Updates</h3>
              <button className="close-modal-btn" onClick={() => setShowUpdatesModal(false)}>
                <FaTimesCircle />
              </button>
            </div>
            <div className="updates-modal-content">
              <div className="detailed-timeline">
                {getDetailedTimeline().map((step, index) => (
                  <div
                    key={step.id}
                    className={`detailed-timeline-step ${step.completed ? "completed" : ""} ${step.isCancelled ? "cancelled" : ""}`}
                  >
                    <div className="detailed-timeline-dot-wrapper">
                      <div className="detailed-timeline-dot"></div>
                      {index < getDetailedTimeline().length - 1 && (
                        <div className={`detailed-timeline-line ${getDetailedTimeline()[index + 1]?.completed ? "completed" : ""}`}></div>
                      )}
                    </div>
                    <div className="detailed-timeline-content">
                      <div className="detailed-step-header">
                        <span className="detailed-step-label">{step.label}</span>
                        <span className="detailed-step-date">{step.date}</span>
                      </div>
                      <div className="detailed-sub-updates">
                        {step.subUpdates?.map((update, idx) => (
                          <div key={idx} className={`sub-update-item ${update.isHighlight ? "highlight" : ""}`}>
                            <p className="sub-update-text">{update.text}</p>
                            {update.timestamp && (
                              <span className="sub-update-timestamp">{update.timestamp}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default OrderDetailsSection;
