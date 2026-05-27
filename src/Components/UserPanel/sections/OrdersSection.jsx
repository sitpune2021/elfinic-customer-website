import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBox,
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaRedo,
  FaTimesCircle,
  FaShoppingBag,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  fetchOrderHistory,
  selectOrderHistory,
  selectHistoryLoading,
  selectHistoryError,
} from "../../../store/slices/orderSlice";
import OrderDetailsSection from "./OrderDetailsSection";
import { Link, useNavigate } from "react-router-dom";

// Image base URL from environment
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://admin.elfinic.com/';

function OrdersSection() {
  const navigator = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();
  const orderHistory = useSelector(selectOrderHistory);
  const isLoading = useSelector(selectHistoryLoading);
  const error = useSelector(selectHistoryError);

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  // Process orders - display each product separately
  const processedOrders = useMemo(() => {
    if (!orderHistory || !Array.isArray(orderHistory) || orderHistory.length === 0) {
      return [];
    }

    // Sort by order_id (newest first) - create a copy first since Redux state is immutable
    return [...orderHistory].sort((a, b) => b.order_id - a.order_id);
  }, [orderHistory]);

  // Get status icon and color based on status
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    switch (statusLower) {
      case "delivered":
        return {
          icon: FaCheckCircle,
          color: "#4caf50",
          label: "Delivered",
        };
      case "shipped":
        return {
          icon: FaTruck,
          color: "#2196f3",
          label: "Shipped",
        };
      case "confirmed":
        return {
          icon: FaCheckCircle,
          color: "#4caf50",
          label: "Confirmed",
        };
      case "processing":
        return {
          icon: FaBox,
          color: "#9c27b0",
          label: "Processing",
        };
      case "cancelled":
        return {
          icon: FaTimesCircle,
          color: "#f44336",
          label: "Cancelled",
        };
      case "pending":
      default:
        return {
          icon: FaClock,
          color: "#ff9800",
          label: "Pending",
        };
    }
  };

  // Format date to relative time
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins <= 1 ? "Just now" : `${diffMins} mins ago`;
      }
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  // Get product thumbnail image
  const getProductImage = (productThumb) => {
    if (!productThumb) return null;
    return `${IMAGE_BASE_URL}${productThumb}`;
  };

  // Handle view order details
  const handleViewOrderDetails = (order) => {
    // Pass order_id and product_id to the details component
    setSelectedOrder({
      order_id: order.order_id,
      product_id: order.product_id,
    });
  };

  // Handle back from order details
  const handleBackFromDetails = () => {
    setSelectedOrder(null);
  };

  // Loading skeleton
  const OrderSkeleton = () => (
    <div className="user-order-card-wrapper user-orders-skeleton-card">
      <div className="user-order-header-section">
        <div className="user-order-info-group">
          <Skeleton circle width={45} height={45} />
          <div>
            <Skeleton width={100} height={18} />
            <Skeleton width={80} height={14} style={{ marginTop: 5 }} />
          </div>
        </div>
        <Skeleton width={80} height={28} borderRadius={20} />
      </div>
      <div className="user-order-product-preview-box">
        <Skeleton width={60} height={60} borderRadius={8} />
        <div style={{ flex: 1, marginLeft: 12 }}>
          <Skeleton width="80%" height={16} />
          <Skeleton width="40%" height={14} style={{ marginTop: 5 }} />
        </div>
      </div>
      <div className="user-order-details-body-section">
        <div className="user-order-detail-row-item">
          <Skeleton width={50} height={14} />
          <Skeleton width={60} height={16} />
        </div>
        <div className="user-order-detail-row-item">
          <Skeleton width={80} height={14} />
          <Skeleton width={80} height={18} />
        </div>
      </div>
      <div className="user-order-actions-footer">
        <Skeleton width={110} height={36} borderRadius={8} />
        <Skeleton width={90} height={36} borderRadius={8} />
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="user-orders-empty-state-container">
      <div className="user-orders-empty-icon-wrapper">
        <FaShoppingBag size={60} />
      </div>
      <h3>No Orders Yet</h3>
      <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
      <button
        className="user-order-action-button primary"
        onClick={() => (window.location.href = "/shop")}
      >
        <FaShoppingBag size={14} />
        Start Shopping
      </button>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="user-orders-error-state-container">
      <div className="user-orders-error-icon-wrapper">
        <FaTimesCircle size={50} />
      </div>
      <h3>Failed to Load Orders</h3>
      <p>{error || "Something went wrong. Please try again."}</p>
      <button
        className="user-order-action-button primary"
        onClick={() => dispatch(fetchOrderHistory())}
      >
        <FaRedo size={14} />
        Try Again
      </button>
    </div>
  );

  // If an order is selected, show the details page
  if (selectedOrder) {
    return (
      <OrderDetailsSection
        orderId={selectedOrder}
        onBack={handleBackFromDetails}
      />
    );
  }

  return (
    <section className="content-section active">
      <div className="user-orders-section-header">
        <h1 className="header-name">My Orders</h1>
        <p className="dashboard-subtitle">Track and manage your orders</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="user-orders-grid-container">
          {[1, 2, 3, 4].map((i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && <ErrorState />}

      {/* Empty State */}
      {!isLoading && !error && processedOrders.length === 0 && <EmptyState />}

      {/* Orders List */}
      {!isLoading && !error && processedOrders.length > 0 && (
        <div className="user-orders-grid-container">
          {processedOrders.map((order, index) => {
            const statusConfig = getStatusConfig(order.item_status);
            const StatusIcon = statusConfig.icon;
            const productImage = getProductImage(order.product_thumb);

            return (
              <div key={`${order.order_number}-${order.product_id}-${index}`} className="user-order-card-wrapper">
                <div className="user-order-header-section">
                  <div className="user-order-info-group">
                    <div
                      className="user-order-status-icon-box"
                      style={{
                        backgroundColor: `${statusConfig.color}15`,
                        color: statusConfig.color,
                      }}
                    >
                      <StatusIcon size={20} />
                    </div>
                    <div className="user-order-details-text">
                      <h4 className="user-order-number-text">{order.order_number}</h4>
                      <span className="user-order-date-text">
                        {order.place_at || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div
                    className="user-order-status-badge-pill"
                    style={{
                      backgroundColor: `${statusConfig.color}15`,
                      color: statusConfig.color,
                    }}
                  >
                    {statusConfig.label}
                  </div>
                </div>

                {/* Product Preview */}
                <Link to={`/product-details/${order.slug}`} className="user-order-product-preview-link">
                  <div className="user-order-product-preview-box">

                    <div className="user-order-product-thumbnail-wrapper">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={order.product_name || "Product"}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default/product-placeholder.png";
                          }}
                        />
                      ) : (
                        <div className="user-order-product-placeholder-icon">
                          <FaBox size={24} />
                        </div>
                      )}
                    </div>
                    <div className="user-order-product-info-text">
                      <h5 className="user-order-product-name-title">
                        {order.product_name || "Product"}
                      </h5>
                      {order.variant_name && (
                        <span className="user-order-variant-name-label">{order.variant_name}</span>
                      )}
                      <span className="user-order-item-quantity-label">Qty: {order.quantity}</span>
                    </div>
                  </div>
                </Link>

                <div className="user-order-details-body-section">
                  <div className="user-order-detail-row-item">
                    <span className="user-order-detail-label-text">Quantity</span>
                    <span className="user-order-detail-value-text">
                      {order.quantity} item{order.quantity > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="user-order-detail-row-item">
                    <span className="user-order-detail-label-text">Price</span>
                    <span className="user-order-detail-value-text user-order-total-amount-price">
                      ₹{parseFloat(order.paid_amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="user-order-actions-footer">
                  <button
                    className="user-order-action-button secondary"
                    onClick={() => handleViewOrderDetails(order)}
                  >
                    <FaEye size={14} />
                    View Details
                  </button>
                  {order.item_status === "delivered" && (
                    <button
                      className="user-order-action-button primary"
                      onClick={() => navigator(`/product-details/${order.slug}`)}
                    >
                      <FaRedo size={14} />
                      Reorder
                    </button>
                  )}

                  {/* {(order.item_status === "shipped" ||
                    order.item_status === "processing" ||
                    order.item_status === "confirmed") && (
                      <button className="order-action-btn primary">
                        <FaTruck size={14} />
                        Track
                      </button>
                    )} */}
                </div>
              </div>
            );
          })}
        </div>
      )
      }
    </section >
  );
}

export default OrdersSection;
