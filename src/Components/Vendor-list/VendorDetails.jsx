import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ShopProducts from '../Product filter shop/ShopProducts'
import './VendorDetails.css'
import SwapBanner from '../External-lab/SwapBanner'
import { CONTACT_INFO } from '../../data/socialMedia'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';
const DEFAULT_PRODUCTS_PER_PAGE = 16;

const defaultPagination = {
    current_page: 1,
    last_page: 1,
    per_page: DEFAULT_PRODUCTS_PER_PAGE,
    total: 0,
};

function VendorDetails() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    // Get vendor_id from URL params (either from path or query string)
    const vendorId = id || searchParams.get('vendor_id');

    // State management
    const [vendorData, setVendorData] = useState(null);
    const [vendorCategories, setVendorCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [vendorProducts, setVendorProducts] = useState([]);
    const [vendorPagination, setVendorPagination] = useState(defaultPagination);
    const [loadingVendorProducts, setLoadingVendorProducts] = useState(false);
    const [vendorProductsError, setVendorProductsError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('about'); // 'about', 'products', or 'categories'

    // Fetch vendor details
    useEffect(() => {
        const fetchVendorDetails = async () => {
            if (!vendorId) {
                setError('Vendor ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${API_BASE_URL}/getVendorDetails?vendor_id=${vendorId}`);

                if (response.data.status === 'success') {
                    setVendorData(response.data.data.vendorInfo);
                } else {
                    setError(response.data.message || 'Failed to fetch vendor details');
                }

            } catch (err) {
                console.error('Error fetching vendor details:', err);
                setError(err.response?.data?.message || 'Failed to load vendor details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchVendorDetails();
    }, [vendorId]);

    // Fetch vendor categories
    useEffect(() => {
        const fetchVendorCategories = async () => {
            if (!vendorId) {
                setVendorCategories([]);
                return;
            }

            try {
                setLoadingCategories(true);
                const response = await axios.get(`${API_BASE_URL}/categories-by-vendor?vendor_id=${vendorId}`);

                if (response.data?.status) {
                    setVendorCategories(Array.isArray(response.data.data) ? response.data.data : []);
                } else {
                    setVendorCategories([]);
                }
            } catch (err) {
                console.error('Error fetching vendor categories:', err);
                setVendorCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchVendorCategories();
    }, [vendorId]);

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        setSelectedCategoryId(null);
        setSelectedCategoryName('');
        setVendorProducts([]);
        setVendorPagination(defaultPagination);
        setCurrentPage(1);
        setSearchInput('');
        setAppliedSearch('');
        setSortBy('latest');
        setVendorProductsError(null);
        setActiveTab('about');
    }, [vendorId]);

    useEffect(() => {
        const fetchVendorProducts = async () => {
            if (activeTab !== 'products' || !vendorId) {
                return;
            }

            try {
                setLoadingVendorProducts(true);
                setVendorProductsError(null);

                const params = {
                    vendor_id: vendorId,
                    per_page: DEFAULT_PRODUCTS_PER_PAGE,
                    page: currentPage,
                    sort_by: sortBy,
                };

                if (selectedCategoryId) {
                    params.category_id = selectedCategoryId;
                }

                const trimmedSearch = appliedSearch.trim();
                if (trimmedSearch) {
                    params.prod_name = trimmedSearch;
                }

                const response = await axios.get(`${API_BASE_URL}/products-by-vendor-category`, { params });

                if (response.data?.status) {
                    const products = Array.isArray(response.data.data) ? response.data.data : [];
                    const apiPagination = response.data?.pagination || {};

                    setVendorProducts(products);
                    setVendorPagination({
                        current_page: Number(apiPagination.current_page) || currentPage,
                        last_page: Number(apiPagination.last_page) || 1,
                        per_page: Number(apiPagination.per_page) || DEFAULT_PRODUCTS_PER_PAGE,
                        total: Number(apiPagination.total) || products.length,
                    });
                } else {
                    setVendorProducts([]);
                    setVendorPagination(defaultPagination);
                    setVendorProductsError(response.data?.message || 'Failed to load vendor products');
                }
            } catch (err) {
                console.error('Error fetching vendor products:', err);
                setVendorProducts([]);
                setVendorPagination(defaultPagination);
                setVendorProductsError(err.response?.data?.message || 'Failed to load vendor products');
            } finally {
                setLoadingVendorProducts(false);
            }
        };

        fetchVendorProducts();
    }, [activeTab, vendorId, selectedCategoryId, appliedSearch, sortBy, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > vendorPagination.last_page || pageNumber === currentPage) {
            return;
        }

        setCurrentPage(pageNumber);
    };

    const getVisiblePageNumbers = () => {
        const lastPage = vendorPagination.last_page;
        if (lastPage <= 0) {
            return [];
        }

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(lastPage, currentPage + 2);

        if (currentPage <= 3) {
            endPage = Math.min(lastPage, 5);
        }

        if (currentPage >= lastPage - 2) {
            startPage = Math.max(1, lastPage - 4);
        }

        const pages = [];
        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }

        return pages;
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setCurrentPage(1);
        setAppliedSearch(searchInput.trim());
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setCurrentPage(1);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategoryId(category.category_id);
        setSelectedCategoryName(category.category_name || 'Category');
        setCurrentPage(1);
        setActiveTab('products');
    };

    const handleAllProductsClick = () => {
        setSelectedCategoryId(null);
        setSelectedCategoryName('');
        setCurrentPage(1);
        setActiveTab('products');
    };

    const showingFrom = vendorPagination.total === 0
        ? 0
        : ((vendorPagination.current_page - 1) * vendorPagination.per_page) + 1;
    const showingTo = Math.min(vendorPagination.current_page * vendorPagination.per_page, vendorPagination.total);

    const visiblePageNumbers = getVisiblePageNumbers();
    const averageRating = Number(vendorData?.average_rating) || 0;

    // Get country flag code
    const getCountryCode = (countryCode) => {
        return countryCode?.toLowerCase() || 'in';
    };

    // Render rating stars
    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<i key={i} className="ph-fill ph-star text-warning-600"></i>);
            } else {
                stars.push(<i key={i} className="ph ph-star text-gray-300"></i>);
            }
        }

        return stars;
    };

    return (
        <>

            {/* <!-- ========================= Breadcrumb Start =============================== --> */}
            <div className="breadcrumb mb-0 py-18 bg-main-two-50">
                <div className="container container-lg">
                    <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
                        <h6 className="mb-0">{vendorData?.company_name || 'Vendor Details'}</h6>
                        <ul className="flex-align gap-8 flex-wrap">
                            <li className="text-sm">
                                <Link to="/" className="text-gray-900 flex-align gap-8 hover-text-main-600">
                                    <i className="ph ph-house"></i>
                                    Home
                                </Link>
                            </li>
                            <li className="flex-align">
                                <i className="ph ph-caret-right"></i>
                            </li>
                            <li className="text-sm">
                                <Link to="/vendor-list" className="text-gray-900 hover-text-main-600">
                                    Vendors
                                </Link>
                            </li>
                            <li className="flex-align">
                                <i className="ph ph-caret-right"></i>
                            </li>
                            <li className="text-sm text-main-600"> Vendor Details </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!-- ========================= Breadcrumb End =============================== --> */}

            {/* <!-- ============================== Vendor Two Details Start =============================== --> */}
            <section className="vendor-two-details py-30">
                <div className="container container-lg">
                    {/* Loading State */}
                    {loading && (
                        <div className="loading-vendor-details">
                            <div className="loading-spinner"></div>
                            <p className="text-gray-600">Loading vendor details...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="error-vendor-details">
                            <i className="ph ph-warning-circle error-icon"></i>
                            <p className="error-message">{error}</p>
                            <Link to="/vendor-list" className="btn bg-main-two-600 text-white py-12 px-24 rounded-8">
                                Back to Vendors
                            </Link>
                        </div>
                    )}

                    {/* Vendor Details Content */}
                    {!loading && !error && vendorData && (
                        <div className="vendor-two-details-wrapper d-flex flex-wrap align-items-start gap-24">

                            {/* Mobile Tab Bar - visible only on mobile */}
                            <div className="vendor-mobile-tab-bar d-lg-none">
                                <div className="vendor-mobile-tab-bar__inner">
                                    <button
                                        onClick={() => handleTabChange('about')}
                                        className={`vendor-mobile-tab ${activeTab === 'about' ? 'active' : ''}`}
                                    >
                                        <i className="ph ph-storefront"></i>
                                        About
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('products')}
                                        className={`vendor-mobile-tab ${activeTab === 'products' ? 'active' : ''}`}
                                    >
                                        <i className="ph ph-package"></i>
                                        Products
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('categories')}
                                        className={`vendor-mobile-tab ${activeTab === 'categories' ? 'active' : ''}`}
                                    >
                                        <i className="ph ph-list"></i>
                                        Categories
                                    </button>
                                </div>
                            </div>

                            <div className="shop-sidebar">
                                <button type="button"
                                    className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 text-white border-main-600">
                                    <i className="ph ph-x"></i>
                                </button>
                                <div className="d-flex flex-column gap-12 px-lg-0 px-3 py-lg-0 py-4">
                                    <div className="bg-neutral-600 rounded-8 p-24">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="w-80 h-80 flex-center bg-white rounded-8 flex-shrink-0">
                                                {vendorData?.company_logo ? (
                                                    <img
                                                        src={vendorData.company_logo}
                                                        alt={vendorData?.company_name || 'Vendor'}
                                                        className="company-logo-display"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/images/thumbs/vendors-two-icon1.png';
                                                        }}
                                                    />
                                                ) : (
                                                    <img src="/images/thumbs/vendors-two-icon1.png" alt="" />
                                                )}
                                            </span>
                                        </div>
                                        <div className="mt-32">
                                            <h6 className="text-white fw-semibold mb-12">
                                                <span className="">{vendorData?.company_name || 'Vendor Name'}</span>
                                            </h6>
                                            <div className="flex-align gap-6">
                                                <div className="flex-align gap-8">
                                                    {renderRatingStars(averageRating)}
                                                </div>
                                                {/* <span className="text-xs fw-medium text-white">{averageRating}</span> */}
                                            </div>
                                        </div>
                                        <div className="mt-32 d-flex flex-column gap-8 sidebar-tabs">
                                            <button
                                                onClick={() => handleTabChange('about')}
                                                className={`sidebar-tab ${activeTab === 'about' ? 'active' : ''}`}
                                            >
                                                About Store
                                            </button>
                                            <button
                                                onClick={() => handleTabChange('products')}
                                                className={`sidebar-tab ${activeTab === 'products' ? 'active' : ''}`}
                                            >
                                                Products
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border border-gray-50 rounded-8 p-24">
                                        <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Vendors Category</h6>
                                        <ul className="max-h-540 overflow-y-auto scroll-sm">
                                            <li className="mb-24">
                                                <button
                                                    type="button"
                                                    onClick={handleAllProductsClick}
                                                    className={`text-start bg-transparent border-0 p-0 ${selectedCategoryId === null ? 'text-main-600' : 'text-gray-900'} hover-text-main-600`}
                                                >
                                                    All Products
                                                </button>
                                            </li>

                                            {loadingCategories && (
                                                <li className="mb-0 text-gray-600">Loading categories...</li>
                                            )}

                                            {!loadingCategories && vendorCategories.length === 0 && (
                                                <li className="mb-0 text-gray-600">No categories found</li>
                                            )}

                                            {!loadingCategories && vendorCategories.map((category, index) => (
                                                <li key={category.category_id || index} className={index === vendorCategories.length - 1 ? 'mb-0' : 'mb-24'}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCategoryClick(category)}
                                                        className={`text-start bg-transparent border-0 p-0 ${selectedCategoryId === category.category_id ? 'text-main-600' : 'text-gray-900'} hover-text-main-600`}
                                                    >
                                                        {category.category_name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>


                                </div>
                            </div>


                            <div className="vendor-two-details__contents">
                                {/* About Store Tab Content */}
                                {activeTab === 'about' && (
                                    <div className="about-store-section">
                                        <h4 className="mb-24">
                                            <i className="ph ph-storefront me-2 text-main-two-600"></i>
                                            About Store
                                        </h4>

                                        <div className="vendor-info-grid">
                                            <div className="vendor-info-item">
                                                <span className="vendor-info-label">
                                                    <i className="ph ph-user"></i> Company Name
                                                </span>
                                                <span className="vendor-info-value">{vendorData?.company_name || 'N/A'}</span>
                                            </div>

                                            <div className="vendor-info-item">
                                                <span className="vendor-info-label">
                                                    <i className="ph ph-envelope"></i> Email
                                                </span>
                                                <span className="vendor-info-value">
                                                    <a href={`mailto:${CONTACT_INFO?.email}`}>
                                                        {CONTACT_INFO?.email || 'N/A'}
                                                    </a>
                                                </span>
                                            </div>

                                            <div className="vendor-info-item">
                                                <span className="vendor-info-label">
                                                    <i className="ph ph-phone"></i> Phone
                                                </span>
                                                <span className="vendor-info-value">
                                                    {CONTACT_INFO?.countryCode && CONTACT_INFO?.phone
                                                        ? `+${CONTACT_INFO.countryCode} ${CONTACT_INFO.phone}`
                                                        : CONTACT_INFO?.phone || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="vendor-info-item">
                                                <span className="vendor-info-label">
                                                    <i className="ph ph-globe"></i> Website
                                                </span>
                                                <span className="vendor-info-value">
                                                    {vendorData?.website ? (
                                                        <a href={vendorData.website} target="_blank" rel="noopener noreferrer">
                                                            {vendorData.website}
                                                        </a>
                                                    ) : 'N/A'}
                                                </span>
                                            </div>

                                            <div className="vendor-info-item">
                                                <span className="vendor-info-label">
                                                    <i className="ph ph-currency-circle-dollar"></i> Turnover
                                                </span>
                                                <span className="vendor-info-value">
                                                    <span className="info-badge primary">
                                                        {vendorData?.turnover || 'N/A'}
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="vendor-info-item">
                                                <span className="vendor-info-label">
                                                    <i className="ph ph-star"></i> Rating
                                                </span>
                                                <span className="vendor-info-value">
                                                    <div className="vendor-rating-display">
                                                        <div className="rating-stars">
                                                            {renderRatingStars(averageRating)}
                                                        </div>
                                                        {/* <span className="rating-text">{averageRating}</span> */}
                                                    </div>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="vendor-address-section">
                                            <h5 className="mb-16">
                                                <i className="ph ph-map-pin me-2 text-main-two-600"></i>
                                                Location
                                            </h5>
                                            <div className="vendor-info-grid">
                                                {/* <div className="vendor-info-item">
                                                    <span className="vendor-info-label">Address</span>
                                                    <span className="vendor-info-value">{vendorData?.address || 'N/A'}</span>
                                                </div> */}

                                                <div className="vendor-info-item">
                                                    <span className="vendor-info-label">City</span>
                                                    <span className="vendor-info-value">{vendorData?.city || 'N/A'}</span>
                                                </div>

                                                <div className="vendor-info-item">
                                                    <span className="vendor-info-label">Country</span>
                                                    <span className="vendor-info-value">
                                                        {vendorData?.country && (
                                                            <>
                                                                <img
                                                                    src={`https://flagcdn.com/16x12/${getCountryCode(vendorData.country)}.png`}
                                                                    srcSet={`https://flagcdn.com/32x24/${getCountryCode(vendorData.country)}.png 2x`}
                                                                    width="20"
                                                                    height="15"
                                                                    alt={vendorData.country}
                                                                    style={{ marginRight: '8px' }}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                                {vendorData.country}
                                                            </>
                                                        )}
                                                        {!vendorData?.country && 'N/A'}
                                                    </span>
                                                </div>
                                                {/* 
                                                <div className="vendor-info-item">
                                                    <span className="vendor-info-label">Zip Code</span>
                                                    <span className="vendor-info-value">{vendorData?.zipCode || 'N/A'}</span>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Products Tab Content */}
                                {activeTab === 'products' && (
                                    <>
                                        <div className="mb-20">
                                            <h5 className="mb-8">{selectedCategoryName ? `${selectedCategoryName} Products` : 'All Products'}</h5>
                                            <p className="text-gray-600 mb-0">
                                                {vendorPagination.total > 0
                                                    ? `Showing ${showingFrom}-${showingTo} of ${vendorPagination.total} products`
                                                    : 'Use search or category filters to find products.'}
                                            </p>
                                        </div>

                                        <div className="row mb-32 vendor-search-filter-row">
                                            <div className="col-lg-4 col-md-5 col-12 mb-md-0 mb-12">
                                                <form onSubmit={handleSearchSubmit} className="input-group w-100">
                                                    <input type="text" className="form-control p-10 rounded-start-3"
                                                        value={searchInput}
                                                        onChange={(event) => setSearchInput(event.target.value)}
                                                        placeholder="Search products..." />
                                                    <button type="submit"
                                                        className="input-group-text border-0 bg-elifnic p-10 rounded-end-3 text-white text-2xl hover-bg-main-two-700 px-10">
                                                        <i className="ph ph-magnifying-glass"></i>
                                                    </button>
                                                </form>
                                            </div>
                                            <div className="col-lg-8 col-md-7 col-12">
                                                <div
                                                    className="d-flex align-items-center justify-content-between justify-content-sm-end gap-16 flex-grow-1">

                                                    <div className="flex-align gap-8">
                                                        <span className="text-gray-900 flex-shrink-0 d-sm-block d-none">Sort by:</span>
                                                        <select
                                                            value={sortBy}
                                                            onChange={handleSortChange}
                                                            className="common-input form-select rounded-pill border border-gray-100 d-inline-block ps-20 pe-36 h-48 py-0 fw-medium">
                                                            <option value="latest">Latest</option>
                                                            <option value="old">Old</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- Search Filter End --> */}

                                        {/* <!-- Products Start --> */}
                                        <div className="list-grid-wrapper grid-cols-12">
                                            <ShopProducts
                                                productsData={vendorProducts}
                                                loadingOverride={loadingVendorProducts}
                                                errorOverride={vendorProductsError}
                                                showRecommendations={false}
                                            />
                                        </div>
                                        {/* <!-- Products End --> */}
                                        {/* <!-- Pagination Start --> */}
                                        {vendorPagination.last_page > 1 && (
                                            <ul className="pagination flex-center flex-wrap gap-16">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button
                                                        type="button"
                                                        className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        <i className="ph-bold ph-arrow-left"></i>
                                                    </button>
                                                </li>

                                                {visiblePageNumbers.map((pageNumber) => (
                                                    <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                                        <button
                                                            type="button"
                                                            className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                                                            onClick={() => handlePageChange(pageNumber)}
                                                        >
                                                            {String(pageNumber).padStart(2, '0')}
                                                        </button>
                                                    </li>
                                                ))}

                                                <li className={`page-item ${currentPage === vendorPagination.last_page ? 'disabled' : ''}`}>
                                                    <button
                                                        type="button"
                                                        className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === vendorPagination.last_page}
                                                    >
                                                        <i className="ph-bold ph-arrow-right"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        )}

                                    </>
                                )}

                                {/* Categories Tab Content - visible on mobile */}
                                {activeTab === 'categories' && (
                                    <div className="mobile-categories-section">
                                        <h4 className="mb-20">
                                            <i className="ph ph-list me-2 text-main-two-600"></i>
                                            Vendor Categories
                                        </h4>

                                        <div className="mobile-category-list">
                                            {/* All Products */}
                                            <button
                                                type="button"
                                                onClick={handleAllProductsClick}
                                                className={`mobile-category-item ${selectedCategoryId === null ? 'active' : ''}`}
                                            >
                                                <span className="mobile-category-icon">
                                                    <i className="ph ph-squares-four"></i>
                                                </span>
                                                <span className="mobile-category-name">All Products</span>
                                                <i className="ph ph-caret-right mobile-category-arrow"></i>
                                            </button>

                                            {loadingCategories && (
                                                <div className="mobile-category-loading">
                                                    <div className="loading-spinner" style={{ width: '24px', height: '24px', borderWidth: '3px' }}></div>
                                                    <span>Loading categories...</span>
                                                </div>
                                            )}

                                            {!loadingCategories && vendorCategories.length === 0 && (
                                                <div className="mobile-category-empty">
                                                    <i className="ph ph-folder-open"></i>
                                                    <span>No categories found</span>
                                                </div>
                                            )}

                                            {!loadingCategories && vendorCategories.map((category, index) => (
                                                <button
                                                    key={category.category_id || index}
                                                    type="button"
                                                    onClick={() => handleCategoryClick(category)}
                                                    className={`mobile-category-item ${selectedCategoryId === category.category_id ? 'active' : ''}`}
                                                >
                                                    <span className="mobile-category-icon">
                                                        <i className="ph ph-tag"></i>
                                                    </span>
                                                    <span className="mobile-category-name">{category.category_name}</span>
                                                    <i className="ph ph-caret-right mobile-category-arrow"></i>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>


                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default VendorDetails