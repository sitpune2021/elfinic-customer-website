import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './FilterModal.css';

function FilterModal({
    isOpen,
    onClose,
    title,
    items,
    onItemClick,
    selectedId,
    showSubcategories = false,
    subcategoriesData = {},
    onSubcategoryClick,
    selectedSubcategoryId,
    expandedCategoryId,
    onCategoryExpand
}) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = prevOverflow;
            };
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="filter-modal-overlay" onClick={onClose}>
            <div className="filter-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="filter-modal-header">
                    <h5 className="filter-modal-title">{title}</h5>
                    <button className="filter-modal-close" onClick={onClose}>
                        <i className="ph ph-x"></i>
                    </button>
                </div>
                <div className="filter-modal-body ">
                    <ul className="filter-modal-list pb-40">
                        {items && items.length > 0 ? (
                            items.map((item) => (
                                <li key={item.id} className="filter-modal-item">
                                    <div>
                                        <a
                                            href="#"
                                            className={`filter-modal-link ${selectedId === item.id ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (showSubcategories) {
                                                    onCategoryExpand(item.id);
                                                }
                                                onItemClick(item, e);
                                            }}
                                        >
                                            {item.name}
                                            {item.subcategory_count && (
                                                <span className="item-count">({item.subcategory_count})</span>
                                            )}
                                            {showSubcategories && item.subcategory_count > 0 && (
                                                <i className={`ph ${expandedCategoryId === item.id ? 'ph-caret-up' : 'ph-caret-down'} ms-auto`}></i>
                                            )}
                                            {!showSubcategories && selectedId === item.id && (
                                                <i className="ph ph-check"></i>
                                            )}
                                        </a>
                                        {/* Show subcategories if this category is expanded */}
                                        {showSubcategories && expandedCategoryId === item.id && subcategoriesData[item.id] && (
                                            <ul className="filter-modal-subcategory-list">
                                                {subcategoriesData[item.id].map((subcategory) => (
                                                    <li key={subcategory.id} className="filter-modal-subcategory-item">
                                                        <a
                                                            href="#"
                                                            className={`filter-modal-subcategory-link ${selectedSubcategoryId === subcategory.id ? 'active' : ''}`}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                onSubcategoryClick(subcategory, e);
                                                            }}
                                                        >
                                                            {subcategory.name}
                                                            {selectedSubcategoryId === subcategory.id && (
                                                                <i className="ph ph-check"></i>
                                                            )}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="no-items">No items found</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default FilterModal;
