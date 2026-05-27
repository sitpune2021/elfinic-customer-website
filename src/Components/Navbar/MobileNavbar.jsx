import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaAngleDoubleRight } from "react-icons/fa"
import { useApi } from '../../hooks/useApi'
import { useAppSelector } from '../../store/hooks'
import { selectCartTotalItems } from '../../store/slices/cartSlice'
import './MobileNavbar.css'

function MobileNavbar() {
    const { categories, categoriesLoading, IsLogin, handleLogout } = useApi()
    const cartItemCount = useAppSelector(selectCartTotalItems)
    const isLoggedIn = IsLogin()

    // Track which submenu is open by key (null = all closed)
    const [openSubmenu, setOpenSubmenu] = useState(null)
    const sidebarRef = useRef(null)

    /** Close the sidebar */
    const closeSidebar = useCallback(() => {
        const sidebar = sidebarRef.current
        const overlay = document.querySelector('.mn-overlay')
        if (sidebar) sidebar.classList.remove('active')
        if (overlay) overlay.classList.remove('show')
        document.body.classList.remove('mn-locked')
        setOpenSubmenu(null)
    }, [])

    /** Nav item clicked — close sidebar */
    const handleNavClick = useCallback(() => {
        closeSidebar()
    }, [closeSidebar])

    /** Logout then close */
    const handleLogoutClick = useCallback(() => {
        handleLogout()
        closeSidebar()
    }, [handleLogout, closeSidebar])

    /** Toggle a submenu open/closed */
    const toggleSubmenu = useCallback((key) => {
        setOpenSubmenu(prev => (prev === key ? null : key))
    }, [])

    // Close on Escape key
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') closeSidebar() }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [closeSidebar])

    return (
        <>
            {/* Overlay */}
            <div className="mn-overlay" onClick={closeSidebar} />

            {/* Sidebar */}
            <div className="mn-sidebar d-lg-none d-block" ref={sidebarRef}>
                {/* ---- Header ---- */}
                <div className="mn-header">
                    <Link to="/" className="mn-logo" onClick={handleNavClick}>
                        <img
                            src="/images/logo/elfinice logo.png"
                            alt="Logo"
                            onError={(e) => { e.target.src = "/images/logo/busniess_logo.png" }}
                        />
                    </Link>
                    <button type="button" className="mn-close" onClick={closeSidebar} aria-label="Close menu">
                        <i className="ph ph-x" />
                    </button>
                </div>

                {/* ---- Scrollable Nav ---- */}
                <div className="mn-body">
                    <ul className="mn-nav">
                        {/* Home */}
                        <li className="mn-nav__item">
                            <NavLink to="/" className="mn-nav__link" onClick={handleNavClick} end>
                                <span className="mn-nav__icon"><i className="ph ph-house" /></span>
                                Home
                            </NavLink>
                        </li>

                        {/* Categories (dropdown) */}
                        <li className={`mn-nav__item ${openSubmenu === 'categories' ? 'mn-open' : ''}`}>
                            <button
                                type="button"
                                className="mn-nav__link"
                                onClick={() => toggleSubmenu('categories')}
                                aria-expanded={openSubmenu === 'categories'}
                            >
                                <span className="mn-nav__icon"><i className="ph ph-squares-four" /></span>
                                Categories
                                <i className="ph ph-caret-down mn-chevron" />
                            </button>

                            <ul className="mn-submenu">
                                {categoriesLoading ? (
                                    <li className="mn-submenu__item">
                                        <span className="mn-submenu__loading">Loading…</span>
                                    </li>
                                ) : categories && categories.length > 0 ? (
                                    <>
                                        {categories.slice(0, 8).map((cat) => (
                                            <li key={cat.id} className="mn-submenu__item">
                                                <NavLink
                                                    to={`/subcategories/${cat.id}`}
                                                    className="mn-submenu__link"
                                                    onClick={handleNavClick}
                                                >
                                                    {cat.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                        <li className="mn-submenu__item">
                                            <NavLink
                                                to="/shop"
                                                className="mn-submenu__link mn-submenu__view-all"
                                                onClick={handleNavClick}
                                            >
                                                View All <FaAngleDoubleRight style={{ marginLeft: 4, fontSize: 11 }} />
                                            </NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <li className="mn-submenu__item">
                                        <span className="mn-submenu__link">No categories</span>
                                    </li>
                                )}
                            </ul>
                        </li>

                        {/* Business */}
                        <li className="mn-nav__item">
                            <NavLink to="/business" className="mn-nav__link" onClick={handleNavClick}>
                                <span className="mn-nav__icon"><i className="ph ph-briefcase" /></span>
                                Business
                            </NavLink>
                        </li>

                        {/* Vendor */}
                        <li className="mn-nav__item">
                            <NavLink to="/vendor-list" className="mn-nav__link" onClick={handleNavClick}>
                                <span className="mn-nav__icon"><i className="ph ph-storefront" /></span>
                                Vendor
                            </NavLink>
                        </li>

                        {/* Track Order */}
                        <li className="mn-nav__item">
                            <NavLink to="/track_order" className="mn-nav__link" onClick={handleNavClick}>
                                <span className="mn-nav__icon"><i className="ph ph-map-pin" /></span>
                                Track Order
                            </NavLink>
                        </li>

                        {/* About */}
                        <li className="mn-nav__item">
                            <NavLink to="/about" className="mn-nav__link" onClick={handleNavClick}>
                                <span className="mn-nav__icon"><i className="ph ph-info" /></span>
                                About
                            </NavLink>
                        </li>

                        {/* Contact */}
                        <li className="mn-nav__item">
                            <NavLink to="/contact" className="mn-nav__link" onClick={handleNavClick}>
                                <span className="mn-nav__icon"><i className="ph ph-phone" /></span>
                                Contact Us
                            </NavLink>
                        </li>

                        {/* Blog */}
                        <li className="mn-nav__item">
                            <NavLink to="/blog" className="mn-nav__link" onClick={handleNavClick}>
                                <span className="mn-nav__icon"><i className="ph ph-article" /></span>
                                Blog
                            </NavLink>
                        </li>

                        {/* Cart */}
                        <li className="mn-nav__item">
                            <NavLink to="/cart" className="mn-nav__link" onClick={handleNavClick}>
                                <span className="mn-nav__icon"><i className="ph ph-shopping-cart-simple" /></span>
                                Cart
                                {cartItemCount > 0 && (
                                    <span className="mn-cart-badge">{cartItemCount}</span>
                                )}
                            </NavLink>
                        </li>

                        {/* My Account (dropdown — only when logged in) */}
                        {isLoggedIn && (
                            <li className={`mn-nav__item ${openSubmenu === 'account' ? 'mn-open' : ''}`}>
                                <button
                                    type="button"
                                    className="mn-nav__link"
                                    onClick={() => toggleSubmenu('account')}
                                    aria-expanded={openSubmenu === 'account'}
                                >
                                    <span className="mn-nav__icon"><i className="ph ph-user-circle" /></span>
                                    My Account
                                    <i className="ph ph-caret-down mn-chevron" />
                                </button>

                                <ul className="mn-submenu">
                                    <li className="mn-submenu__item">
                                        <NavLink to="/profile?section=profile" className="mn-submenu__link" onClick={handleNavClick}>
                                            <i className="ph ph-user" /> Profile
                                        </NavLink>
                                    </li>
                                    <li className="mn-submenu__item">
                                        <NavLink to="/profile?section=orders" className="mn-submenu__link" onClick={handleNavClick}>
                                            <i className="ph ph-package" /> Your Orders
                                        </NavLink>
                                    </li>
                                    <li className="mn-submenu__item">
                                        <NavLink to="/profile?section=wishlist" className="mn-submenu__link" onClick={handleNavClick}>
                                            <i className="ph ph-heart" /> Wishlist
                                        </NavLink>
                                    </li>
                                    <li className="mn-submenu__item">
                                        <NavLink to="/profile?section=addresses" className="mn-submenu__link" onClick={handleNavClick}>
                                            <i className="ph ph-map-pin" /> Addresses
                                        </NavLink>
                                    </li>
                                    <li className="mn-submenu__item">
                                        <NavLink to="/profile?section=wallet" className="mn-submenu__link" onClick={handleNavClick}>
                                            <i className="ph ph-wallet" /> Wallet
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>

                {/* ---- Footer (auth buttons) ---- */}
                <div className="mn-footer">
                    {isLoggedIn ? (
                        <button onClick={handleLogoutClick} className="mn-btn mn-btn--primary">
                            <i className="ph ph-sign-out" />
                            Logout
                        </button>
                    ) : (
                        <div className="mn-footer__row">
                            <NavLink to="/login" className="mn-btn mn-btn--outline" onClick={handleNavClick}>
                                <i className="ph ph-sign-in" />
                                Login
                            </NavLink>
                            <NavLink to="/register" className="mn-btn mn-btn--filled" onClick={handleNavClick}>
                                <i className="ph ph-user-plus" />
                                Sign Up
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MobileNavbar