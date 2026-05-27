import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Toolkit.css';

/**
 * Toolkit Component - Shows character count and displays full text on hover
 * @param {string} text - The text to display
 * @param {boolean} showOnHover - If true, shows tooltip on hover. If false, no tooltip appears
 * @param {number} maxLength - Maximum length of text to display before truncating (default: 50)
 * @param {string} className - Additional CSS classes
 * @param {number} maxWidth - Maximum width of tooltip in pixels (default: 300)
 */
const Toolkit = ({ text = '', showOnHover = true, maxLength = 50, className = '', font_size = '', maxWidth = 300 }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const contentRef = useRef(null);
    const tooltipRef = useRef(null);

    const isTruncated = text.length > maxLength;
    const displayText = isTruncated ? text.substring(0, maxLength) + '...' : text;

    const handleMouseMove = (e) => {
        if (showOnHover) {
            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Calculate position with offset from cursor
            let x = e.clientX;
            let y = e.clientY - 10; // 10px above cursor

            setMousePosition({ x, y });
        }
    };

    const handleMouseEnter = (e) => {
        if (showOnHover) {
            setMousePosition({ x: e.clientX, y: e.clientY - 10 });
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        if (showOnHover) {
            setIsHovering(false);
        }
    };

    // Tooltip component rendered via portal
    const TooltipPortal = () => {
        if (!showOnHover || !isHovering) return null;

        const tooltipStyle = {
            position: 'fixed',
            top: `${mousePosition.y}px`,
            left: `${mousePosition.x}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 999999,
            backgroundColor: '#1a1a2e',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: font_size || '14px',
            maxWidth: `${maxWidth}px`,
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            textAlign: 'left',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none',
            animation: 'tooltipFadeIn 0.2s ease-out',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        };

        return ReactDOM.createPortal(
            <div ref={tooltipRef} style={tooltipStyle} className="toolkit-tooltip-portal">
                {text}
            </div>,
            document.body
        );
    };

    return (
        <div className={`toolkit-container ${className}`}>
            <div
                ref={contentRef}
                className="toolkit-content"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                style={{ cursor: showOnHover && isTruncated ? 'pointer' : 'default' }}
            >
                <span
                    className={`toolkit-text ${className}`}
                    style={{ color: "#2d3436", fontSize: font_size }}
                >
                    {displayText}
                </span>
            </div>
            <TooltipPortal />
        </div>
    );
};

export default Toolkit;
