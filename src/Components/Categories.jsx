import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Link } from 'react-router-dom';
import './Categories.css';
import Heading from './Home/Heading';
import Dompurify from './External-lab/Dompurify';

function Categories() {
    const {
        categories,
        categoriesLoading,
        categoriesError,
        fetchCategories,
        image_path
    } = useApi();

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    // Fetch categories on component mount
    useEffect(() => {
        if (!categories || categories.length === 0) {
            fetchCategories();
        }
    }, [fetchCategories, categories]);

    // Filter categories based on search term
    useEffect(() => {
        if (categories && categories.length > 0) {
            const filtered = categories.filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [categories, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="all-categories-page pt-30">
            {/* Hero Section with Heading */}
            <Heading
                title="Explore All Categories"
                subtitle="Browse through our wide range of product categories"
                showViewAll={false}
                alignment="center"
            />

            {/* Main Content */}
            <div className="container categories-container">
                {/* Search Section */}
                <div className="categories-controls">
                    <div className="search-wrapper">
                        <div className="search-box">
                            <i className="ph ph-magnifying-glass search-icon"></i>
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="clear-search"
                                    aria-label="Clear search"
                                >
                                    <i className="ph ph-x"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="categories-stats">
                        <span className="stat-badge bg-elifnic">
                            <i className="ph ph-folders me-2"></i>
                            {filteredCategories.length} {filteredCategories.length === 1 ? 'Category' : 'Categories'}
                        </span>
                    </div>
                </div>

                {/* Loading State */}
                {categoriesLoading && (
                    <div className="categories-grid">
                        {Array.from({ length: 8 }, (_, index) => (
                            <div key={`skeleton-${index}`} className="category-card skeleton-card">
                                <div className="category-card-inner">
                                    <div className="category-image-wrapper">
                                        <div className="skeleton-image"></div>
                                    </div>
                                    <div className="category-info">
                                        <div className="skeleton-text skeleton-title"></div>
                                        <div className="skeleton-text skeleton-subtitle"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {categoriesError && (
                    <div className="error-state">
                        <i className="ph ph-warning-circle error-icon"></i>
                        <h3>Oops! Something went wrong</h3>
                        <p>{categoriesError}</p>
                        <button onClick={fetchCategories} className="retry-btn bg-organge">
                            <i className="ph ph-arrow-clockwise"></i> Try Again
                        </button>
                    </div>
                )}

                {/* Categories Grid */}
                {!categoriesLoading && !categoriesError && (
                    <>
                        {filteredCategories.length > 0 ? (
                            <div className="categories-grid">
                                {filteredCategories.map((category, index) => (
                                    <Link
                                        key={category.id}
                                        to={`/subcategories/${category.id}/${category.name}`}
                                        className="category-card"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="category-card-inner">
                                            <div className="category-image-wrapper">
                                                {category.image ? (
                                                    <img
                                                        src={`${image_path}category-images/${category.image}`}
                                                        alt={category.name}
                                                        className="category-image"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div
                                                    className="category-placeholder"
                                                    style={{ display: category.image ? 'none' : 'flex' }}
                                                >
                                                    <i className="ph ph-package"></i>
                                                </div>
                                                <div className="category-overlay">
                                                    <span className="explore-btn">
                                                        <i className="ph ph-arrow-right"></i>
                                                        Explore
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="category-info">
                                                <h3 className="category-name">{category.name}</h3>
                                                <p className="category-description">
                                                    <Dompurify addhtml={category.description || 'Explore products in this category'}></Dompurify>

                                                </p>
                                                <span className="view-subcategories">
                                                    View Subcategories
                                                    <i className="ph ph-caret-right ms-1"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <i className="ph ph-folder-notch-open empty-icon"></i>
                                <h3>{searchTerm ? 'No categories found' : 'No categories available'}</h3>
                                <p>{searchTerm ? 'Try adjusting your search criteria' : 'No categories are currently available to display'}</p>
                                {searchTerm && (
                                    <button onClick={clearSearch} className="clear-filters-btn bg-organge">
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Back to Top Button */}
                {filteredCategories.length > 12 && (
                    <button
                        className="back-to-top bg-elifnic"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Back to top"
                    >
                        <i className="ph ph-arrow-up"></i>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Categories;