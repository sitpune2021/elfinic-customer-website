import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectCartTotalItems } from '../../store/slices/cartSlice';

function Mobileviewbottomtab() {
    const location = useLocation();
    const cartItemCount = useAppSelector(selectCartTotalItems);

    const tabs = [
        {
            to: '/',
            label: 'Home',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            ),
        },
        {
            to: '/categories',
            label: 'Categories',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            ),
        },
        {
            to: '/shop',
            label: 'Shop',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
            ),
            isCenter: true,
        },
        {
            to: '/cart',
            label: 'Cart',
            badge: cartItemCount,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
            ),
        },
        {
            to: '/profile',
            label: 'Account',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
    ];

    return (
        <nav className="mbtab" aria-label="Mobile navigation">
            <div className="mbtab__inner">
                {tabs.map((tab) => {
                    const isActive =
                        tab.to === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(tab.to);

                    return (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            className={`mbtab__item ${isActive ? 'mbtab__item--active' : ''} ${tab.isCenter ? 'mbtab__item--center' : ''}`}
                            aria-label={tab.label}
                        >
                            {tab.isCenter ? (
                                <span className="mbtab__center-btn">
                                    <span className="mbtab__center-icon">{tab.icon}</span>
                                </span>
                            ) : (
                                <span className="mbtab__icon">
                                    {tab.icon}
                                    {tab.badge > 0 && (
                                        <span className="mbtab__badge">{tab.badge > 99 ? '99+' : tab.badge}</span>
                                    )}
                                </span>
                            )}
                            <span className="mbtab__label">{tab.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}

export default Mobileviewbottomtab;