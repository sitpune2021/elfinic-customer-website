import React from 'react';
import PropTypes from 'prop-types';
import './SvgIcon.css';

/**
 * SvgIcon Component
 * Displays SVG icons from public/Elfinic_Icons folder
 * 
 * Available icons:
 * add-image, apps, bank, book-alt, brand-badge, cube, customer-service,
 * display-chart-up, envelope, home, list-tree, master-plan-integrate,
 * order-history, pending, search, seller, shield-check, shopping-cart,
 * square-plus, store-alt, subscription-plan, subscription, tax-alt,
 * user-bag, vote-nay, wallet, wishlist-heart
 */
const SvgIcon = ({ name, className = '', size = 24, color, style = {}, onClick }) => {
    const iconPath = `/Elfinic_Icons/${name}.svg`;

    const iconStyle = {
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style
    };

    if (color) {
        iconStyle.filter = `brightness(0) saturate(100%)`;
    }

    return (
        <span
            className={`svg-icon ${className}`}
            style={iconStyle}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <img
                src={iconPath}
                alt={`${name} icon`}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
                onError={(e) => {
                    console.warn(`Icon not found: ${name}`);
                    e.target.style.display = 'none';
                }}
            />
        </span>
    );
};

SvgIcon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    color: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func
};

export default SvgIcon;
