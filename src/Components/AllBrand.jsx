import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Link } from 'react-router-dom';
import './AllBrand.css';
import HeadingExamples from './Home/HeadingExamples';
import Heading from './Home/Heading';

function AllBrand() {
    const {
        brands,
        brandsLoading,
        brandsError,
        fetchBrands,
        image_path
    } = useApi();

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBrands, setFilteredBrands] = useState([]);

    // Fetch brands on component mount
    useEffect(() => {
        if (!brands || brands.length === 0) {
            fetchBrands();
        }
    }, [fetchBrands, brands]);

    // Filter brands based on search term
    useEffect(() => {
        if (brands && brands.length > 0) {
            const filtered = brands.filter(brand =>
                brand.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredBrands(filtered);
        }
    }, [brands, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="all-brands-page pt-30">
            {/* Hero Section */}
            {/* <div className="brands-hero bg-elifnic">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">Explore All Brands</h1>
                        <p className="hero-subtitle text-skyblue">
                            Discover our extensive collection of trusted brands
                        </p>
                    </div>
                </div>
            </div> */}
            <Heading
                title="Explore All Brands"
                subtitle="Discover our extensive collection of trusted brands"
                showViewAll={false}
                alignment="center"
            />

            {/* Main Content */}
            <div className="container brands-container">
                {/* Search and Filter Section */}
                <div className="brands-controls">
                    {/* <div className="search-wrapper">
                        <div className="search-box">
                            <i className="ph ph-magnifying-glass search-icon"></i>
                            <input
                                type="text"
                                placeholder="Search brands..."
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
                    </div> */}
                    {/* 
                    <div className="view-controls">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active bg-organge' : ''}`}
                            onClick={() => setViewMode('grid')}
                            aria-label="Grid view"
                        >
                            <i className="ph ph-grid-four"></i>
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active bg-organge' : ''}`}
                            onClick={() => setViewMode('list')}
                            aria-label="List view"
                        >
                            <i className="ph ph-list"></i>
                        </button>
                    </div> */}
                </div>

                {/* Stats Section */}
                {/* <div className="brands-stats">
                    <div className="stat-item">
                        <span className="stat-number text-elifnic">{filteredBrands.length}</span>
                        <span className="stat-label">
                            {filteredBrands.length === 1 ? 'Brand' : 'Brands'} Found
                        </span>
                    </div>
                </div> */}

                {/* Loading State */}
                {brandsLoading && (
                    <div className="brands-grid">
                        {Array.from({ length: 18 }, (_, index) => (
                            <div key={`skeleton-${index}`} className="brand-card skeleton-card">
                                <div className="brand-card-inner">
                                    <div className="brand-image-wrapper">
                                        <div className="skeleton-image"></div>
                                    </div>
                                    <div className="brand-info">
                                        <div className="skeleton-text skeleton-title"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {brandsError && (
                    <div className="error-state">
                        <i className="ph ph-warning-circle error-icon"></i>
                        <h3>Oops! Something went wrong</h3>
                        <p>{brandsError}</p>
                        <button onClick={fetchBrands} className="retry-btn bg-organge">
                            <i className="ph ph-arrow-clockwise"></i> Try Again
                        </button>
                    </div>
                )}

                {/* Brands Grid/List */}
                {!brandsLoading && !brandsError && (
                    <>
                        {filteredBrands.length > 0 ? (
                            <div className="brands-grid">
                                {filteredBrands.map((brand) => (
                                    <div key={brand.id} className="brand-card">
                                        <div className="brand-card-inner">
                                            <div className="brand-image-wrapper">
                                                {brand.image ? (
                                                    <img
                                                        src={`${image_path}brand-images/${brand.image}`}
                                                        alt={brand.name}
                                                        className="brand-image"
                                                    />
                                                ) : (
                                                    <div className="brand-placeholder">
                                                        <i className="ph ph-image"></i>
                                                        <span>No Image</span>
                                                    </div>
                                                )}
                                                <div className="brand-overlay">
                                                    <Link to={`/shop?brand=${brand.name}`}>
                                                        <button className="view-brand-btn bg-organge">
                                                            <i className="ph ph-arrow-right"></i>
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="brand-info">
                                                <h3 className="brand-name">{brand.name}</h3>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <i className="ph ph-storefront empty-icon"></i>
                                <h3>{searchTerm ? 'No brands found' : 'No brands available'}</h3>
                                <p>{searchTerm ? 'Try adjusting your search criteria' : 'No brands are currently available to display'}</p>
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
                {filteredBrands.length > 12 && (
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

export default AllBrand;