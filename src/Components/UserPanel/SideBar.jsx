import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../store/slices/userProfileSlice";
import { useLogout } from "../../hooks/useLogout";
import "./UserPanel.css";

// Import React Icons
import {
  FaHome,
  FaWallet,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaHeart,
  FaGift,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

function SideBar({ activeSection, setActiveSection, userInfo }) {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.userProfile);
  const handleLogout = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch]);

  const handleNavClick = (section) => {
    setActiveSection(section);
    // Update URL with section parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('section', section);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileLogout = () => {
    closeMobileMenu();
    handleLogout();
  };

  const menuItems = [
    { id: "profile", label: "Dashboard", icon: MdDashboard },
    { id: "account", label: "Account", icon: FaHome },
    // { id: "wallet", label: "Wallet", icon: FaWallet },
    { id: "orders", label: "Orders", icon: FaShoppingBag },
    { id: "addresses", label: "Address", icon: FaMapMarkerAlt },
    { id: "wishlist", label: "Wishlist", icon: FaHeart },
    { id: "settings", label: "Settings", icon: FaCog },

  ];

  // Use profile data from Redux, fallback to userInfo prop
  const profileImage = profile?.photo || null;
  const userName = profile?.name || null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-modern d-none d-lg-block">
        {/* Profile Section */}
        <div className="sidebar-profile-section">
          <div className="profile-avatar">
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                <FaUser size={40} />
              </div>
            )}
            {/* <div className="online-badge"></div> */}
          </div>
          {userName && <h3 className="profile-name">{userName}</h3>}

          <div className="online-status">
            <span className="status-dot"></span>
            Online
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-menu">
          <ul className="">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <a
                    onClick={() => handleNavClick(item.id)}
                    className={`menu-item ${activeSection === item.id ? "active" : ""
                      }`}
                  >
                    <Icon className="menu-icon" size={18} />
                    <span className="menu-label">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>LOG OUT</button>
        </div>
      </aside>

      {/* Mobile Menu Toggle Button */}
      {/* <button
        className="mobile-sidebar-toggle d-lg-none"
        onClick={toggleMobileMenu}
        aria-label="Toggle Menu"
      >
        <FaBars />
      </button> */}

      {/* Mobile Sidebar Overlay */}
      <div
        className={`mobile-sidebar-overlay d-lg-none ${mobileMenuOpen ? "active" : ""
          }`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Sidebar */}
      <aside
        className={`mobile-sidebar d-lg-none ${mobileMenuOpen ? "active" : ""}`}
      >
        {/* Mobile Header */}
        <div className="mobile-sidebar-header">
          <h3>My Account</h3>
          <button
            className="mobile-sidebar-close"
            onClick={closeMobileMenu}
            aria-label="Close Menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Mobile Profile Section */}
        <div className="mobile-sidebar-profile">
          <div className="mobile-profile-avatar">
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                <FaUser size={40} />
              </div>
            )}
          </div>
          {userName && <h3 className="mobile-profile-name">{userName}</h3>}
          <div className="mobile-profile-status">
            <span className="status-dot"></span>
            Online
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <nav className="mobile-sidebar-menu">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <a
                    onClick={() => handleNavClick(item.id)}
                    className={`mobile-menu-item ${activeSection === item.id ? "active" : ""
                      }`}
                  >
                    <Icon className="menu-icon" size={18} />
                    <span className="menu-label">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Logout Button */}
        <div className="mobile-sidebar-footer">
          <button className="mobile-logout-btn" onClick={handleMobileLogout}>
            <FaSignOutAlt />
            LOG OUT
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
