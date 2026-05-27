import React from 'react'
import { Link } from 'react-router-dom'
import './Heading.css'

function Heading({
    title,
    subtitle,
    showViewAll = true,
    viewAllText = "View All",
    viewAllLink = "#",
    alignment = "between",
    size = "medium",
    animated = false,
    className = ""
}) {
    const getAlignmentClass = () => {
        switch (alignment) {
            case 'center': return 'text-center justify-content-center';
            case 'left': return 'text-start justify-content-start';
            case 'right': return 'text-end justify-content-end';
            case 'between': return 'justify-content-between align-items-center';
            default: return 'justify-content-between align-items-center';
        }
    };

    const getSizeClass = () => {
        switch (size) {
            case 'small': return 'heading-small';
            case 'medium': return 'heading-medium';
            case 'large': return 'heading-large';
            default: return 'heading-medium';
        }
    };

    return (
        <div className={`custom-heading d-flex gap-3 ${getAlignmentClass()} ${getSizeClass()} ${animated ? 'wow fadeInUp' : ''} ${className}`}>
            <div className="heading-content">
                {subtitle && (
                    <span className="heading-subtitle text-main fw-medium text-uppercase">
                        {subtitle}
                    </span>
                )}
                <h5 className={`heading-title mb-0 text-uppercase ${animated ? 'wow fadeInLeft' : ''}`}>
                    {title || 'Default Title'}
                </h5>
            </div>

            {showViewAll && (
                <div className="heading-action">
                    <Link
                        to={viewAllLink}
                        className={`btn-view-all border-bottom rounded-0 ${animated ? 'wow fadeInRight' : ''}`}
                    >
                        {viewAllText}

                        <i className="ph ph-arrow-right ms-1 text-decoration-none"></i>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Heading