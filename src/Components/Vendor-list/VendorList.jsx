import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VendorCard from './VendorCard'
import SwapBanner from '../External-lab/SwapBanner'
import axios from 'axios'
import './VendorList.css'
import { Link } from 'react-router-dom'
import {
    fetchVendors,
    searchVendors,
    setSearchTerm,
    setFilters,
    clearFilters,
    setCurrentPage,
    selectVendors,
    selectVendorsLoading,
    selectVendorsError,
    selectCurrentPage,
    selectPerPage,
    selectTotalPages,
    selectTotal,
    selectSearchTerm,
    selectIsSearching,
    selectFilters,
} from '../../store/slices/vendorSlice'

const DEFAULT_VENDOR_PER_PAGE = 12;

function VendorList() {
    const dispatch = useDispatch();

    // Redux state selectors
    const vendors = useSelector(selectVendors);
    const loading = useSelector(selectVendorsLoading);
    const error = useSelector(selectVendorsError);
    const currentPage = useSelector(selectCurrentPage);
    const perPage = useSelector(selectPerPage);
    const totalPages = useSelector(selectTotalPages);
    const total = useSelector(selectTotal);
    const searchTerm = useSelector(selectSearchTerm);
    const isSearching = useSelector(selectIsSearching);
    const filters = useSelector(selectFilters);

    // Local search input state
    const [localSearchTerm, setLocalSearchTerm] = useState('');

    // State variables for location filter
    const [countries, setCountries] = useState([]);
    const [getCountry, setGetCountry] = useState("");
    const [states, setStates] = useState([]);
    const [getState, setGetState] = useState("");
    const [cities, setCities] = useState([]);
    const [getCity, setGetCity] = useState("");

    // Loading states
    const [loadingCountry, setLoadingCountry] = useState(false);
    const [loadingState, setLoadingState] = useState(false);
    const [loadingCity, setLoadingCity] = useState(false);

    // Debounce timer ref
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Fetch vendors on mount and when filters/pagination change
    useEffect(() => {
        const params = {
            page: currentPage,
            per_page: perPage || DEFAULT_VENDOR_PER_PAGE,
            ...filters,
        };

        // Clean up empty filter values
        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key];
            }
        });

        dispatch(fetchVendors(params));
    }, [dispatch, currentPage, perPage, filters]);

    // Handle search with debounce
    const handleSearchChange = useCallback((value) => {
        setLocalSearchTerm(value);

        // Clear previous timer
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Set new timer for debounced search
        const timer = setTimeout(() => {
            dispatch(setSearchTerm(value));
            dispatch(setFilters({ company_name: value }));
            dispatch(setCurrentPage(1));
        }, 500);

        setDebounceTimer(timer);
    }, [dispatch, debounceTimer]);

    // Handle search form submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        dispatch(setSearchTerm(localSearchTerm));
        dispatch(setFilters({ company_name: localSearchTerm }));
        dispatch(setCurrentPage(1));
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            dispatch(setCurrentPage(page));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 7;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Fetch all countries
    const fetchCountry = async () => {
        try {
            setLoadingCountry(true);
            const response = await axios.get("https://countriesnow.space/api/v0.1/countries");
            const countryNames = response.data.data.map((item) => item.country);
            setCountries(countryNames);
        } catch (error) {
            console.error("Error fetching countries:", error);
        } finally {
            setLoadingCountry(false);
        }
    };

    // Fetch states for the selected country
    const fetchState = async (country) => {
        try {
            setLoadingState(true);
            const response = await axios.post(
                "https://countriesnow.space/api/v0.1/countries/states",
                { country }
            );
            const stateNames = response.data.data.states.map((item) => item.name);
            setStates(stateNames);
            setGetState("");
            setCities([]);
            setGetCity("");
        } catch (error) {
            console.error("Error fetching states:", error);
        } finally {
            setLoadingState(false);
        }
    };

    // Fetch cities for the selected state
    const fetchCity = async (state, country) => {
        try {
            setLoadingCity(true);
            const response = await axios.post(
                "https://countriesnow.space/api/v0.1/countries/state/cities",
                { state, country }
            );
            const cityNames = response.data.data || [];
            setCities(cityNames);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoadingCity(false);
        }
    };

    // Handle state change and reset city
    const handleStateChange = (selectedState) => {
        setGetState(selectedState);
        setGetCity(""); // Reset city when state changes
    };

    // Handle location filter apply
    const handleApplyLocationFilter = () => {
        // Convert country name to country code if needed
        // For now, we'll pass as-is since the API might accept full names
        dispatch(setFilters({
            country: getCountry,
            state: getState,
            city: getCity,
        }));
        dispatch(setCurrentPage(1));
    };

    // Handle clear all filters
    const handleClearAllFilters = () => {
        setGetCountry("");
        setGetState("");
        setGetCity("");
        setStates([]);
        setCities([]);
        setLocalSearchTerm("");
        dispatch(clearFilters());
        dispatch(setCurrentPage(1));
    };

    // Fetch countries on mount
    useEffect(() => {
        fetchCountry();
    }, []);

    // Fetch states when country changes
    useEffect(() => {
        if (getCountry) {
            fetchState(getCountry);
        }
    }, [getCountry]);

    // Fetch cities when state changes
    useEffect(() => {
        if (getState && getCountry) {
            fetchCity(getState, getCountry);
        }
    }, [getState]);

    return (
        <>

            {/* <!-- ========================= Breadcrumb Start =============================== --> */}
            <div className="breadcrumb mb-0 py-26 bg-main-two-50">
                <div className="container container-lg">
                    <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
                        <h6 className="mb-0">All Vendors</h6>
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
                            <li className="text-sm text-main-600"> All Vendors </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!-- ========================= Breadcrumb End =============================== --> */}

            {/* <!-- =============================== Vendor Two Section Start =============================== --> */}
            <section className="vendor-two py-20">
                <div className="container container-lg">

                    {/* <!-- Top Search --> */}
                    <div className="d-flex align-items-center justify-content-between flex-wrap mb-48 gap-16">
                        <form action="#" className="input-group w-100 max-w-418" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                className="form-control common-input rounded-start-3"
                                placeholder="Search a Vendor Here..."
                                value={localSearchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            <button type="submit"
                                className="input-group-text border-0 bg-main-two-600 rounded-end-3 text-white text-3xl hover-bg-main-two-700 px-24 py-8"
                                disabled={loading}>
                                {isSearching ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <i className="ph ph-magnifying-glass"></i>
                                )}
                            </button>
                        </form>

                        <div
                            className="d-flex align-items-center justify-content-between justify-content-sm-end gap-16 flex-grow-1">
                            <div className="text-gray-600 text-md flex-shrink-0">
                                <span className="text-neutral-900 fw-semibold">{total}</span> Results Found
                            </div>
                            {/* <div className="d-flex align-items-center gap-8 d-sm-flex d-none">
                                <button type="button"
                                    className="grid-btn text-2xl d-flex w-48 h-48 border border-neutral-100 rounded-8 justify-content-center align-items-center border-main-600 text-white bg-main-600"><i
                                        className="ph ph-squares-four"></i></button>
                                <button type="button"
                                    className="list-btn text-2xl d-flex w-48 h-48 border border-neutral-100 rounded-8 justify-content-center align-items-center"><i
                                        className="ph ph-list-bullets"></i></button>
                            </div> */}
                            <button type="button"
                                className="w-48 h-48 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn">
                                <i className="ph-bold ph-funnel"></i>
                            </button>
                        </div>
                    </div>
                    {/* <!-- Top Search End --> */}



                    <div className="row">
                        <div className="col-xl-3 col-lg-4">
                            <div className="shop-sidebar">
                                <button type="button"
                                    className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600">
                                    <i className="ph ph-x"></i>
                                </button>
                                <div className="d-flex flex-column gap-12 px-lg-0 px-3 py-lg-0 py-4">
                                    {/* <div className="border border-gray-50 rounded-8 p-24">
                                        <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Product Category</h6>
                                        <ul className="max-h-540 overflow-y-auto scroll-sm">
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Mobile & Accessories (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Laptop (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Electronics (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Smart Watch (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Storage (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Portable Devices (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Action Camera (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Smart Gadget (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Monitor (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Smart TV (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Camera (12)</a>
                                            </li>
                                            <li className="mb-24">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Monitor Stand (12)</a>
                                            </li>
                                            <li className="mb-0">
                                                <a href="product-details-two.html"
                                                    className="text-gray-900 hover-text-main-600">Headphone (12)</a>
                                            </li>
                                        </ul>
                                    </div> */}
                                    <div className="location-filter">
                                        <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                                            <i className="ph ph-map-pin me-5 text-main-600"></i>
                                            Search by Location
                                        </h6>

                                        <div className="d-flex flex-column ">
                                            {/* Country Dropdown */}
                                            <div className={`form-group ${getCountry ? 'has-value' : ''}`}>
                                                <label className="form-label text-sm fw-medium text-gray-700 mb-2">
                                                    Country
                                                </label>
                                                {loadingCountry ? (
                                                    <div className="loading-container">
                                                        <div className="loading-spinner" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        <span className="loading-text">Loading countries...</span>
                                                    </div>
                                                ) : (
                                                    <select
                                                        className="common-input form-select"
                                                        onChange={(e) => setGetCountry(e.target.value)}
                                                        value={getCountry}
                                                        disabled={loadingCountry}
                                                    >
                                                        <option value="" disabled>
                                                            {countries.length > 0 ? "Select a country" : "No countries available"}
                                                        </option>
                                                        {countries.map((country, index) => (
                                                            <option key={index} value={country}>
                                                                {country}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>

                                            {/* State Dropdown */}
                                            <div className={`form-group ${getState ? 'has-value' : ''}`}>
                                                <label className="form-label text-sm fw-medium text-gray-700 mb-2">
                                                    State / Province
                                                </label>
                                                {loadingState ? (
                                                    <div className="loading-container">
                                                        <div className="loading-spinner" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        <span className="loading-text">Loading states...</span>
                                                    </div>
                                                ) : (
                                                    <select
                                                        className={`common-input form-select ${!getCountry ? 'bg-gray-50 text-gray-400' : ''}`}
                                                        onChange={(e) => handleStateChange(e.target.value)}
                                                        value={getState}
                                                        disabled={!getCountry || loadingState}
                                                        title={!getCountry ? "Please select a country first" : ""}
                                                    >
                                                        <option value="" disabled>
                                                            {!getCountry
                                                                ? "First select a country"
                                                                : states.length > 0
                                                                    ? "Select a state"
                                                                    : "No states available"
                                                            }
                                                        </option>
                                                        {states.map((state, index) => (
                                                            <option key={index} value={state}>
                                                                {state}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>

                                            {/* City Dropdown */}
                                            <div className={`form-group ${getCity ? 'has-value' : ''}`}>
                                                <label className="form-label text-sm fw-medium text-gray-700 mb-2">
                                                    City
                                                </label>
                                                {loadingCity ? (
                                                    <div className="loading-container">
                                                        <div className="loading-spinner" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        <span className="loading-text">Loading cities...</span>
                                                    </div>
                                                ) : (
                                                    <select
                                                        className={`common-input form-select ${!getState ? 'bg-gray-50 text-gray-400' : ''}`}
                                                        onChange={(e) => setGetCity(e.target.value)}
                                                        value={getCity}
                                                        disabled={!getState || loadingCity}
                                                        title={!getState ? "Please select a state first" : ""}
                                                    >
                                                        <option value="" disabled>
                                                            {!getState
                                                                ? "First select a state"
                                                                : cities.length > 0
                                                                    ? "Select a city"
                                                                    : "No cities available"
                                                            }
                                                        </option>
                                                        {cities.map((city, index) => (
                                                            <option key={index} value={city}>
                                                                {city}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>

                                            {/* Clear Filter Button */}
                                            {(getCountry || getState || getCity) && (
                                                <div className="mt-2 d-flex gap-8">
                                                    <button
                                                        type="button"
                                                        className="btn btn-main-two-600 text-white py-8 px-16 rounded-8 flex-grow-1"
                                                        onClick={handleApplyLocationFilter}
                                                    >
                                                        <i className="ph ph-funnel me-1"></i>
                                                        Apply Filter
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn-clear-filters"
                                                        onClick={handleClearAllFilters}
                                                    >
                                                        <i className="ph ph-x me-1"></i>
                                                        Clear
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                    {/* SwapBanner Section */}
                                    <div className="shop-sidebar__box border border-gray-100 rounded-8 p-20 mb-32">
                                        <SwapBanner></SwapBanner>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-xl-9 col-lg-8">
                            {/* <!-- Vendors Start --> */}
                            <div className="list-grid-wrapper vendors-two-item-wrapper grid-cols-3">
                                {/* Loading State */}
                                {loading && (
                                    <div className="col-span-3 d-flex justify-content-center align-items-center py-80">
                                        <div className="text-center">
                                            <div className="spinner-border text-main-two-600" role="status" style={{ width: '3rem', height: '3rem' }}>
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-16 text-gray-600">Loading vendors...</p>
                                        </div>
                                    </div>
                                )}

                                {/* Error State */}
                                {!loading && error && (
                                    <div className="col-span-3 d-flex justify-content-center align-items-center py-80">
                                        <div className="text-center">
                                            <i className="ph ph-warning-circle text-danger" style={{ fontSize: '48px' }}></i>
                                            <p className="mt-16 text-danger">{error}</p>
                                            <button
                                                className="btn bg-main-two-600 text-white py-8 px-24 rounded-8 mt-16"
                                                onClick={() => dispatch(fetchVendors({ page: currentPage, per_page: perPage }))}
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Empty State */}
                                {!loading && !error && vendors.length === 0 && (
                                    <div className="col-span-3 d-flex justify-content-center align-items-center py-80">
                                        <div className="text-center">
                                            <i className="ph ph-storefront text-gray-400" style={{ fontSize: '64px' }}></i>
                                            <p className="mt-16 text-gray-600 text-lg">No vendors found</p>
                                            <p className="text-gray-400">Try adjusting your search or filters</p>
                                            {(searchTerm || filters.country || filters.state || filters.city) && (
                                                <button
                                                    className="btn bg-main-two-600 text-white py-8 px-24 rounded-8 mt-16"
                                                    onClick={handleClearAllFilters}
                                                >
                                                    Clear All Filters
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Vendors Grid */}
                                {!loading && !error && vendors.length > 0 && vendors.map((vendor) => (
                                    <VendorCard key={vendor.vendor_id} vendor={vendor} />
                                ))}
                            </div>
                            {/* <!-- Vendors End --> */}

                            {/* <!-- Pagination Start --> */}
                            {!loading && !error && vendors.length > 0 && totalPages > 1 && (
                                <ul className="pagination flex-center flex-wrap gap-16 mt-48">
                                    {/* Previous Button */}
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <i className="ph-bold ph-arrow-left"></i>
                                        </button>
                                    </li>

                                    {/* Page Numbers */}
                                    {generatePageNumbers().map((page, index) => (
                                        <li key={index} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                            {page === '...' ? (
                                                <span className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100">
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {String(page).padStart(2, '0')}
                                                </button>
                                            )}
                                        </li>
                                    ))}

                                    {/* Next Button */}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <i className="ph-bold ph-arrow-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            )}
                            {/* <!-- Pagination End --> */}
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- =============================== Vendor Two Section End =============================== --> */}



        </>
    )
}

export default VendorList