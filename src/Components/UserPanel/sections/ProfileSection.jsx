import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../../store/slices/userProfileSlice";
import { useApi } from "../../../hooks/useApi";
import { toast } from "react-toastify";
import { getDashboardCounts } from "../../../services/userProfileService";
import {
  FaBox,
  FaClock,
  FaWallet,
  FaHeart,
  FaGift,
  FaCheckCircle,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaTruck,
  FaMoneyBillWave,
  FaShoppingBag,
  FaChartLine,
  FaStar,
  FaArrowRight,
  FaBell,
  FaTimesCircle,
} from "react-icons/fa";
import "./ProfileSection.css";

function ProfileSection({ userInfo, setUserInfo }) {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.userProfile);
  const { API_BASE_URL } = useApi();
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    walletBalance: 0,
    wishlistItems: 0,
    rewardPoints: 0,
  });

  // Recent activities
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) {
        toast.error("User not found");
        setLoading(false);
        return;
      }

      const response = await getDashboardCounts(user.id);

      if (response.status === "success" && response.data) {
        setDashboardStats({
          totalOrders: response.data.total_orders || 0,
          pendingOrders: response.data.pending_orders || 0,
          completedOrders: response.data.completed_orders || 0,
          wishlistItems: response.data.wishlist_items || 0,
          walletBalance: 0,
          rewardPoints: 0,
        });
      }

      setRecentActivities([
        {
          id: 1,
          type: "order",
          title: "Order #12345 Delivered",
          description: "Your order has been successfully delivered",
          time: "2 hours ago",
          icon: FaCheckCircle,
          color: "#4caf50",
        },
        {
          id: 2,
          type: "wallet",
          title: "Wallet Credited",
          description: "₹500 added to your wallet",
          time: "1 day ago",
          icon: FaMoneyBillWave,
          color: "#d8963c",
        },
        {
          id: 3,
          type: "reward",
          title: "Reward Points Earned",
          description: "50 points earned on recent purchase",
          time: "2 days ago",
          icon: FaGift,
          color: "#a9d4e7",
        },
        {
          id: 4,
          type: "order",
          title: "Order #12344 Shipped",
          description: "Your order is on the way",
          time: "3 days ago",
          icon: FaTruck,
          color: "#050040",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Shop Now",
      icon: FaShoppingCart,
      description: "Browse our latest products",
      action: () => navigate("/shop"),
      gradient: "linear-gradient(135deg, #050040 0%, #0a0080 100%)",
    },
    {
      title: "Track Order",
      icon: FaMapMarkerAlt,
      description: "Check your order status",
      action: () => navigate("/profile?section=orders"),
      gradient: "linear-gradient(135deg, #d8963c 0%, #c07d2a 100%)",
    },
    {
      title: "My Wishlist",
      icon: FaHeart,
      description: "View saved items",
      action: () => navigate("/profile?section=wishlist"),
      gradient: "linear-gradient(135deg, #a9d4e7 0%, #7bb5d1 100%)",
    },
    {
      title: "Help Center",
      icon: FaQuestionCircle,
      description: "Get support & assistance",
      action: () => navigate("/contact"),
      gradient: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
    },
  ];

  const statsCards = [
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders,
      icon: FaShoppingBag,
      color: "#050040",
      bgGradient: "linear-gradient(135deg, #050040 0%, #0a0080 100%)",
      isPositive: true,
    },
    {
      title: "Pending Orders",
      value: dashboardStats.pendingOrders,
      icon: FaClock,
      color: "#d8963c",
      bgGradient: "linear-gradient(135deg, #d8963c 0%, #c07d2a 100%)",

      isPositive: false,
    },
    // {
    //   title: "Wallet Balance",
    //   value: `₹${dashboardStats.walletBalance}`,
    //   icon: FaWallet,
    //   color: "#a9d4e7",
    //   bgGradient: "linear-gradient(135deg, #a9d4e7 0%, #7bb5d1 100%)",
    //   change: "+₹500",
    //   isPositive: true,
    // },
    // {
    //   title: "Reward Points",
    //   value: dashboardStats.rewardPoints,
    //   icon: FaStar,
    //   color: "#4caf50",
    //   bgGradient: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
    //   change: "+50",
    //   isPositive: true,
    // },
  ];

  return (
    <section className="content-section active dashboard-profile-section">
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="dashboard-header-main">
            <div className="dashboard-header-content">
              <div className="welcome-section">
                <h1 className="header-name-main">
                  Welcome back{profile?.name ? `, ${profile.name}` : ""}! 👋
                </h1>
                <p className="dashboard-subtitle-main">
                  Here's what's happening with your account today.
                </p>
              </div>
              <div className="header-actions">
                <button className="notification-btn">
                  <FaBell />
                  {/* <span className="notification-badge">3</span> */}
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            {statsCards.map((stat, index) => (
              <Link to={'/profile?section=orders'}>
                <div key={index} className="stat-card">
                  <div className="stat-icon-wrapper" style={{ background: stat.bgGradient }}>
                    <stat.icon className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <h6 className="action-title">{stat.title}</h6>
                    <h3 className="stat-value">{stat.value}</h3>
                  </div>
                </div>
              </Link>
            ))}

          </div>
          {/* Additional Info Cards */}
          <div className="info-cards mb-20">
            <Link to={'/profile?section=wishlist'}>
              <div className="info-card">
                <div className="info-icon wishlist">
                  <FaHeart />
                </div>
                <div className="info-content">
                  <h6 className="action-title">Wishlist Items</h6>
                  <p>{dashboardStats.wishlistItems}</p>
                </div>
              </div>
            </Link>
            <Link to={'/profile?section=orders'}>
              <div className="info-card">
                <div className="info-icon completed">
                  <FaCheckCircle />
                </div>
                <div className="info-content">
                  <h6 className="action-title">Completed Orders</h6>
                  <p>{dashboardStats.completedOrders}</p>
                </div>
              </div>
            </Link>
          </div>


          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className=" btn-elifnic">Quick Actions</h2>
              <p className="section-subtitle">Take action on your account</p>
            </div>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="quick-action-card"
                  onClick={action.action}
                >
                  <div className="action-icon-wrapper" style={{ background: action.gradient }}>
                    <action.icon className="action-icon" />
                  </div>
                  <div className="action-content">
                    <h4 className="action-title">{action.title}</h4>
                    <p className="action-description">{action.description}</p>
                  </div>
                  <FaArrowRight className="action-arrow" />
                </div>
              ))}
            </div>
          </div>


          {/* Promotional Banner */}
          {/* <div className="dashboard-section promo-section">
            <div className="promo-banner">
              <div className="promo-icon">
                <FaGift />
              </div>
              <h3 className="promo-title">Special Offer!</h3>
              <p className="promo-description">
                Get 20% off on your next purchase. Use code: <strong className="promo-code">WELCOME20</strong>
              </p>
              <button className="promo-btn" onClick={() => navigate("/shop")}>
                Shop Now
                <FaArrowRight className="btn-icon" />
              </button>
              <div className="promo-bg-icon">
                <FaShoppingBag />
              </div>
            </div>


          </div> */}
        </>
      )}
    </section>
  );
}

export default ProfileSection;
