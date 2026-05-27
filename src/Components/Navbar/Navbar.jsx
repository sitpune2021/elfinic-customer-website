import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FaAngleDoubleRight } from "react-icons/fa";
import './MegaMenu.css';
import './NavbarStyle.css'
import { useApi } from '../../hooks/useApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCartTotalItems, fetchCart } from '../../store/slices/cartSlice';
import SearchBar from './SearchBar';
import { useLogout } from '../../hooks/useLogout';
function Navbar() {

    const location = useLocation();



    const { categories, categoriesLoading, IsLogin } = useApi();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsScrolled(scrollTop > 100); // Show logo after scrolling 100px
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useAppDispatch();
    const cartItemCount = useAppSelector(selectCartTotalItems);
    const handleLogout = useLogout();

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    // Fetch cart data when component mounts or when user logs in
    useEffect(() => {
        if (IsLogin()) {
            dispatch(fetchCart());
        }
    }, [dispatch, IsLogin]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchChange = (e) => {
        console.log("Search Input:", e.target.value);
    }

    const {
        brands,
        brandsLoading,
        brandsError,
        fetchBrands,
    } = useApi();

    // Fetch brands on component mount
    useEffect(() => {

        if (!brands || brands.length === 0) {
            fetchBrands();
        }
    }, [fetchBrands, brands]);
    // console.log("Brands data:", brands, brandsLoading, brandsError);

    return (
        <header className={`header bg-white border-bottom-0 box-shadow-3xl py-10 z-2 ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="container container-lg">
                <nav className="header-inner d-flex justify-content-between align-items-center gap-8">
                    <div className="flex-align menu-category-wrapper position-relative">
                        {/* Logo - visible when scrolled */}
                        <div className={`navbar-logo ${isScrolled ? 'opacity-100 visible' : ''}`}>
                            <NavLink to="/" className="d-flex align-items-center">
                                <img
                                    src="/images/logo/elfinice logo.png"
                                    alt="Elfinice Logo"
                                    className="logo-img"
                                    style={{
                                        height: '40px',
                                        width: 'auto',
                                        marginRight: '20px'
                                    }}
                                    onError={(e) => {
                                        e.target.src = "/images/logo/busniess_logo.png";
                                    }}
                                />
                            </NavLink>
                        </div>

                        {/* Category Dropdown Start */}
                        {/* <div className="">
                            <button className="" style={{ width: '250px' }}></button>
                        </div> */}
                        {/* <!-- Category Dropdown End --> */}

                        {/* <!-- Menu Start  --> */}
                        <div className="header-menu d-lg-block d-none">
                            {/* /* <!-- Nav Menu Start --> */}
                            <ul className="nav-menu flex-align ">
                                <li className="on-hover-item nav-menu__item">
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) => `nav-menu__link text-heading-two ${isActive ? 'active' : ''}`}
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="on-hover-item nav-menu__item has-submenu mega-menu-item">
                                    <a href='#' className="nav-menu__link text-heading-two">Categories</a>
                                    {/* Mega Menu Start */}
                                    <div className="on-hover-dropdown mega-menu bg-white">
                                        <div className="container">
                                            <div className="row g-4">
                                                {/* Dynamic Categories */}
                                                <div className="col-lg-3">
                                                    <h6 className="mega-menu__title text-lg fw-bold text-heading mb-16">All Categories</h6>
                                                    <ul className="mega-menu__list">
                                                        {categoriesLoading ? (
                                                            <li className="mega-menu__item">
                                                                <span className="mega-menu__link text-gray-500">
                                                                    Loading...
                                                                </span>
                                                            </li>
                                                        ) : categories && categories.length > 0 ? (
                                                            <>
                                                                {categories.slice(0, 8).map((category) => (
                                                                    <li key={category.id} className="mega-menu__item">
                                                                        <NavLink
                                                                            to={`/subcategories/${category.id}/${category.name}`}
                                                                            className="mega-menu__link text-gray-500 hover-text-main-600"
                                                                        >
                                                                            {category.name}
                                                                        </NavLink>
                                                                    </li>
                                                                ))}
                                                                <li className="mega-menu__item view-all ">
                                                                    <NavLink
                                                                        to={`/categories`}
                                                                        className="mega-menu__link text-gray-500 hover-text-main-600"
                                                                    >
                                                                        View All <FaAngleDoubleRight />
                                                                    </NavLink>
                                                                </li>
                                                            </>
                                                        ) : (
                                                            <li className="mega-menu__item">
                                                                <span className="mega-menu__link text-gray-500">
                                                                    No categories available
                                                                </span>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>

                                                {/* Popular Products */}
                                                <div className="col-lg-3">
                                                    <h6 className="mega-menu__title text-lg fw-bold text-heading mb-16 text-nowrap">Popular Products</h6>
                                                    <ul className="mega-menu__list">
                                                        <li className="mega-menu__item">
                                                            <NavLink to="/shop" className="mega-menu__link text-gray-500 hover-text-main-600">
                                                                Trending Now
                                                            </NavLink>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <NavLink to="/shop" className="mega-menu__link text-gray-500 hover-text-main-600">
                                                                Best Sellers
                                                            </NavLink>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <NavLink to="/shop" className="mega-menu__link text-gray-500 hover-text-main-600">
                                                                New Arrivals
                                                            </NavLink>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <NavLink to="/shop" className="mega-menu__link text-gray-500 hover-text-main-600">
                                                                Special Deals
                                                            </NavLink>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <NavLink to="/shop" className="mega-menu__link text-gray-500 hover-text-main-600">
                                                                Clearance
                                                            </NavLink>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <NavLink to="/shop" className="mega-menu__link text-gray-500 hover-text-main-600">
                                                                Featured Products
                                                            </NavLink>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <NavLink to="/shop" className="mega-menu__link text-gray-500 hover-text-main-600">
                                                                Limited Edition
                                                            </NavLink>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <NavLink to="/shop" className="mega-menu__link text-gray-500 hover-text-main-600">
                                                                Customer Favorites
                                                            </NavLink>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Shop by Brand */}
                                                <div className="col-lg-3">
                                                    <h6 className="mega-menu__title text-lg fw-bold text-heading mb-16">Shop by Brand</h6>
                                                    <ul className="mega-menu__list ">
                                                        {brands && brands.slice(0, 8).map((brand) => (
                                                            <li className="mega-menu__item " key={brand.id}>
                                                                <NavLink to={`/shop?brand=${brand.name}`} className="mega-menu__link text-gray-500 hover-text-main-600">
                                                                    {brand.name}
                                                                </NavLink>
                                                            </li>
                                                        ))}
                                                        <li className="mega-menu__item view-all">
                                                            <NavLink to="/all-brands" className="mega-menu__link text-gray-500 hover-text-main-600">
                                                                View All <FaAngleDoubleRight />
                                                            </NavLink>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Featured Product */}
                                                <div className="col-lg-3">
                                                    <div className="mega-menu__banner">
                                                        <div className="mega-menu__banner-inner bg-main-25 rounded-12 p-16">
                                                            <h6 className="mega-menu__banner-title text-lg fw-bold text-heading mb-8">
                                                                Featured Deal
                                                            </h6>
                                                            <p className="mega-menu__banner-desc text-sm text-gray-600 mb-16">
                                                                Save up to 50% on selected items
                                                            </p>
                                                            <div className="mega-menu__banner-img mb-16">
                                                                <img src="/images/thumbs/featured-product-img.png" alt="Featured Product" className="w-100" style={{ maxHeight: '450px', objectFit: 'cover' }} />
                                                            </div>
                                                            <NavLink to="/shop/featured-deal" className="btn-main-600 btn-sm bg-elifnic btn">
                                                                Shop Now
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mega Menu End */}
                                </li>
                                <li className="on-hover-item nav-menu__item has-submenu mega-menu-item">
                                    <Link
                                        to="https://business.elfinic.com/"
                                        target="_blank"
                                        className="nav-menu__link text-heading-two"
                                    >
                                        Business
                                    </Link>

                                    {/* Business Mega Menu Start */}
                                    <div className="on-hover-dropdown mega-menu bg-white">
                                        <div className="container">
                                            <div className="row g-4">

                                                {/* Become a Vendor */}
                                                <div className="col-lg-3">
                                                    <h6 className="mega-menu__title text-lg fw-bold text-heading mb-16">
                                                        Start Your Business
                                                    </h6>
                                                    <ul className="mega-menu__list">
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/BecomeAVendor"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-storefront me-2"></i>
                                                                Become a Vendor
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-user-plus me-2"></i>
                                                                Vendor Registration
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/sellerbenifits"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-gift me-2"></i>
                                                                Seller Benefits
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-currency-dollar me-2"></i>
                                                                Pricing Plans
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/sellerguide"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-book me-2"></i>
                                                                Seller Guide
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Business Growth */}
                                                <div className="col-lg-3">
                                                    <h6 className="mega-menu__title text-lg fw-bold text-heading mb-16">
                                                        Grow Your Business
                                                    </h6>
                                                    <ul className="mega-menu__list">
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/businessanalytics"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-chart-line me-2"></i>
                                                                Business Analytics
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-megaphone me-2"></i>
                                                                Marketing Tools
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-package me-2"></i>
                                                                Inventory Management
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-clipboard-text me-2"></i>
                                                                Order Management
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/BusinessSupport"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-headset me-2"></i>
                                                                Business Support
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Resources & Tools */}
                                                <div className="col-lg-3">
                                                    <h6 className="mega-menu__title text-lg fw-bold text-heading mb-16">
                                                        Resources & Tools
                                                    </h6>
                                                    <ul className="mega-menu__list">
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-video me-2"></i>
                                                                Business Webinars
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-trophy me-2"></i>
                                                                Success Stories
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-article me-2"></i>
                                                                Business Blog
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/HelpCenter"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-question me-2"></i>
                                                                Help Center
                                                            </Link>
                                                        </li>
                                                        <li className="mega-menu__item">
                                                            <Link
                                                                to="https://business.elfinic.com/"
                                                                target="_blank"
                                                                className="mega-menu__link text-gray-500 hover-text-main-600"
                                                            >
                                                                <i className="ph ph-users me-2"></i>
                                                                Business Community
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Featured Business Promotion */}
                                                <div className="col-lg-3">
                                                    <div className="mega-menu__banner">
                                                        <div className="mega-menu__banner-inner bg-gradient-to-r from-blue-50 to-purple-50 rounded-12 p-16">
                                                            <h6 className="mega-menu__banner-title text-lg fw-bold text-heading mb-8">
                                                                Start Your Journey
                                                            </h6>

                                                            <div className="d-flex flex-column gap-2">
                                                                <Link
                                                                    to="https://business.elfinic.com/"
                                                                    target="_blank"
                                                                    className="btn btn-main-600 btn-sm bg-elifnic"
                                                                >
                                                                    <i className="ph ph-rocket-launch me-2"></i>
                                                                    Start Selling
                                                                </Link>
                                                            </div>

                                                            <div className="mt-16 text-center">
                                                                <div className="d-flex justify-content-center align-items-center gap-8 mb-8">
                                                                    <div className="text-center">
                                                                        <div className="fw-bold text-main-600">10K+</div>
                                                                        <div className="text-xs text-gray-500">Active Vendors</div>
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <div className="fw-bold text-main-600">50M+</div>
                                                                        <div className="text-xs text-gray-500">Products Sold</div>
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex justify-content-center gap-4">
                                                                    <span className="text-warning">★★★★★</span>
                                                                    <span className="text-xs text-gray-500">4.8/5 Seller Rating</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    {/* Business Mega Menu End */}
                                </li>

                                <li className="on-hover-item nav-menu__item ">
                                    <NavLink
                                        to="/vendor-list"
                                        className={({ isActive }) => `nav-menu__link text-heading-two ${isActive ? 'active' : ''}`}
                                    >
                                        Vendor
                                    </NavLink>
                                </li>
                                {/* <li className="on-hover-item nav-menu__item ">
                                    <NavLink to="/track_order" className="nav-menu__link text-heading-two">Track Order</NavLink>
                                </li> */}
                                <li className="on-hover-item nav-menu__item ">
                                    <NavLink
                                        to="/about"
                                        className={({ isActive }) => `nav-menu__link text-heading-two ${isActive ? 'active' : ''}`}
                                    >
                                        About
                                    </NavLink>
                                </li>
                                <li className="nav-menu__item">
                                    <NavLink
                                        to="/contact"
                                        className={({ isActive }) => `nav-menu__link text-heading-two ${isActive ? 'active' : ''}`}
                                    >
                                        Contact Us
                                    </NavLink>
                                </li>
                                {/* <li className="nav-menu__item">
                                    <NavLink to="/blog" className="nav-menu__link text-heading-two">Blog</NavLink>
                                </li> */}
                                {/* <li className="on-hover-item nav-menu__item ">
                                    <NavLink to="/faq" className="nav-menu__link text-heading-two">FAQ</NavLink>
                                </li> */}



                            </ul >
                            {/* <!-- Nav Menu End --> */}
                        </div >
                        {/* <!-- Menu End  --> */}
                    </div >
                    {/* <!-- Searching bar --> */}
                    < SearchBar ></SearchBar >


                    <div className="header-right flex-align flex-shrink-0">
                        <div className="flex-align gap-20">
                            <div className="position-relative on-hover-item" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className="flex-align gap-4 item-hover border-0 bg-transparent"
                                    onClick={toggleProfileDropdown}
                                >
                                    <span className="text-xl text-gray-700 d-flex position-relative item-hover__text">
                                        <i className="ph ph-user"></i>
                                    </span>
                                    <span className="text-md text-heading-three item-hover__text d-none d-lg-flex">Profile</span>
                                    <span className="text-sm text-gray-700 d-flex">
                                        <i className={`ph ${isProfileDropdownOpen ? 'ph-caret-up' : 'ph-caret-down'}`}></i>
                                    </span>
                                </button>

                                {/* Profile Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <ul className="common-dropdown nav-submenu profile-dropdown position-absolute top-100 end-0 mt-2 bg-white border border-gray-200 p-0" style={{ zIndex: 1000 }}>
                                        <li className="common-dropdown__item nav-submenu__item">
                                            <Link
                                                to="/profile?section=profile"
                                                className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100 d-flex align-items-center gap-2 px-16 py-8"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <i className="ph ph-squares-four text-lg"></i>
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li className="common-dropdown__item nav-submenu__item">
                                            <Link
                                                to="/profile?section=account"
                                                className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100 d-flex align-items-center gap-2 px-16 py-8"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <i className="ph ph-user text-lg"></i>
                                                Account
                                            </Link>
                                        </li>
                                        <li className="common-dropdown__item nav-submenu__item">
                                            <Link
                                                to="/profile?section=orders"
                                                className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100 d-flex align-items-center gap-2 px-16 py-8"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <i className="ph ph-package text-lg"></i>
                                                Orders
                                            </Link>
                                        </li>
                                        <li className="common-dropdown__item nav-submenu__item">
                                            <Link
                                                to="/profile?section=addresses"
                                                className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100 d-flex align-items-center gap-2 px-16 py-8"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <i className="ph ph-map-pin text-lg"></i>
                                                Address
                                            </Link>
                                        </li>
                                        <li className="common-dropdown__item nav-submenu__item">
                                            <Link
                                                to="/profile?section=wishlist"
                                                className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100 d-flex align-items-center gap-2 px-16 py-8"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <i className="ph ph-heart text-lg"></i>
                                                Wishlist
                                            </Link>
                                        </li>
                                        <li className="common-dropdown__item nav-submenu__item">
                                            <Link
                                                to="/profile?section=settings"
                                                className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100 d-flex align-items-center gap-2 px-16 py-8"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <i className="ph ph-gear text-lg"></i>
                                                Settings
                                            </Link>
                                        </li>
                                        <li className="common-dropdown__item nav-submenu__item border-top">
                                            <button
                                                className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100 d-flex align-items-center gap-2 px-16 py-8 w-100 border-0 bg-transparent text-start"
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                    handleLogout();
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className="ph ph-sign-out text-lg"></i>
                                                Log Out
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>

                            <Link to="/cart" className="d-flex fw-bold align-items-center gap-4 me-30 item-hover">
                                <span className="text-xl text-gray-700  d-flex position-relative item-hover__text">
                                    <i className="ph ph-shopping-cart-simple d-none d-lg-flex"></i>
                                    {cartItemCount > 0 && (
                                        <span className="w-16 h-16 flex-center rounded-circle bg-main-600 text-white text-xs position-absolute top-n6 end-n4">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </span>
                                <span className="text-md text-heading-three item-hover__text d-none d-lg-flex">Cart</span>
                            </Link>
                        </div>
                    </div>
                    {/* <!-- Header Right End  --> */}
                    {/* <!-- Header Right start --> */}

                    <button
                        type="button"
                        className="toggle-mobileMenu d-lg-none ms-3n text-gray-800 text-4xl d-flex"
                        onClick={() => {
                            const sidebar = document.querySelector('.mn-sidebar');
                            const overlay = document.querySelector('.mn-overlay');

                            if (sidebar && overlay) {
                                sidebar.classList.add('active');
                                overlay.classList.add('show');
                                document.body.classList.add('mn-locked');
                            }
                        }}
                    >
                        <i className="ph ph-list"></i>
                    </button>
                </nav >
            </div >
        </header >

    )
}

export default Navbar