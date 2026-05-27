import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsList, setSearchQuery } from "../../store/slices/productSearchSlice";
import "./NavbarStyle.css";
import { useApi } from "../../contexts/ApiContext";

function SearchBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { image_path } = useApi();

    const { products, loading } = useSelector((state) => state.productSearch);

    const [searchTerm, setSearchTerm] = useState("");
    const [mobileSearchTerm, setMobileSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const searchRef = useRef(null);
    const mobileSearchRef = useRef(null);
    const timeoutRef = useRef(null);
    const preventScrollRef = useRef(null);




    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        if (showMobileSearch) {
            // Store the current scroll position
            const scrollY = window.scrollY;

            // Add CSS class and inline styles for maximum compatibility
            document.body.classList.add('mobile-search-open');
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
            document.documentElement.style.overflow = "hidden";

            // Prevent touch scrolling on mobile - but allow clicks on suggestions
            const preventScroll = (e) => {
                // Allow touch events on suggestion items and dropdown
                if (e.target.closest('.mobile-suggestions-dropdown') ||
                    e.target.closest('.suggestion-item') ||
                    e.target.closest('.suggestion-footer')) {
                    return; // Don't prevent default for suggestions
                }
                e.preventDefault();
            };

            document.addEventListener('touchmove', preventScroll, { passive: false });

            // Store the function so we can remove it later
            preventScrollRef.current = preventScroll;
        } else {
            // Remove CSS class and restore body scroll
            document.body.classList.remove('mobile-search-open');
            const scrollY = document.body.style.top;
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.documentElement.style.overflow = "";

            // Remove touch scroll prevention
            if (preventScrollRef.current) {
                document.removeEventListener('touchmove', preventScrollRef.current);
            }

            // Restore scroll position
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('mobile-search-open');
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.documentElement.style.overflow = "";
            if (preventScrollRef.current) {
                document.removeEventListener('touchmove', preventScrollRef.current);
            }
        };
    }, [showMobileSearch]);


    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
    };

    const handleMobileSearchChange = (e) => {
        const value = e.target.value;
        setMobileSearchTerm(value);

        if (value.trim() === "") {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
    };

    // Debounce effect for API calls
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const currentSearchTerm = showMobileSearch ? mobileSearchTerm : searchTerm;

        if (currentSearchTerm.length > 1) {
            timeoutRef.current = setTimeout(() => {
                fetchSuggestions(currentSearchTerm);
            }, 300);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchTerm, mobileSearchTerm, showMobileSearch]);

    const fetchSuggestions = async (query) => {
        try {
            const result = await dispatch(
                fetchProductsList({
                    name: query,
                    per_page: 6, // Limit suggestions to 6 items
                    page: 1,
                })
            ).unwrap();

            setSuggestions(result.data || []);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error fetching search results", error);
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (product) => {
        const productName = product.name || product.title;
        setSearchTerm(productName);
        setMobileSearchTerm(productName);
        setShowSuggestions(false);
        setShowMobileSearch(false);

        // Navigate to shop - Shop component handles filter initialization from URL
        navigate(`/shop?search=${encodeURIComponent(productName)}`);
    };

    const handleSeeAllResults = () => {
        setShowSuggestions(false);
        setShowMobileSearch(false);
        const currentSearchTerm = showMobileSearch ? mobileSearchTerm : searchTerm;

        // Navigate to shop page - Shop component handles filter initialization from URL
        navigate(`/shop?search=${encodeURIComponent(currentSearchTerm)}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        const currentSearchTerm = showMobileSearch ? mobileSearchTerm : searchTerm;

        if (currentSearchTerm.trim()) {
            // Navigate to shop page - Shop component handles filter initialization from URL
            navigate(`/shop?search=${encodeURIComponent(currentSearchTerm)}`);
            setShowMobileSearch(false);
        }
    };

    const handleMobileSearchSubmit = (e) => {
        e.preventDefault();
        setShowSuggestions(false);

        if (mobileSearchTerm.trim()) {
            // Navigate to shop page - Shop component handles filter initialization from URL
            navigate(`/shop?search=${encodeURIComponent(mobileSearchTerm)}`);
            setShowMobileSearch(false);
        }
    };

    const toggleMobileSearch = () => {
        setShowMobileSearch(!showMobileSearch);
        setShowSuggestions(false);
    };

    const closeMobileSearch = () => {
        setShowMobileSearch(false);
        setShowSuggestions(false);
        setMobileSearchTerm("");
    };

    // Get current search term based on active view
    const getCurrentSearchTerm = () => {
        return showMobileSearch ? mobileSearchTerm : searchTerm;
    };

    return (
        <>
            {/* Desktop Search Bar */}
            <div className="search-bar-container d-none d-md-block" ref={searchRef}>
                <form onSubmit={handleSubmit} className="search-form">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            className="searchbar-input border-1 border p-5 rounded-end-0"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                            placeholder="Search for products..."
                            aria-label="Search products"
                        />
                        <button
                            type="submit"
                            className="search-button p-8"
                            aria-label="Search"
                            onClick={handleSubmit}
                        >
                            <SearchIcon />
                        </button>

                        {loading && (
                            <div className="search-loading">
                                <div className="spinner"></div>
                            </div>
                        )}
                    </div>
                </form>

                {/* Desktop Suggestions Dropdown */}
                {showSuggestions && !showMobileSearch && (
                    <div className="suggestions-dropdown">
                        {suggestions.length > 0 ? (
                            <>
                                <div className="suggestions-list">
                                    {suggestions.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleSuggestionClick(item)}
                                            className="suggestion-item"
                                        >
                                            <div className="suggestion-image">
                                                <img
                                                    src={`${image_path}products-images/${item.images[0]}`}
                                                    alt={item.name || item.title}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="suggestion-content">
                                                <div className="suggestion-title">
                                                    {item.name || item.title}
                                                </div>
                                                <div className="suggestion-price d-flex align-items-center">
                                                    &#8377;{item.sale_price || item.price}
                                                    {item.regular_price && item.regular_price > item.sale_price && (
                                                        <span className="original-price"> &#8377;{item.regular_price}</span>
                                                    )}

                                                    {item.category && (
                                                        <div className="suggestion-category">
                                                            /- {item.category}
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className="suggestion-footer"
                                    onClick={handleSeeAllResults}
                                >
                                    See all results for "{getCurrentSearchTerm()}"
                                </div>
                            </>
                        ) : getCurrentSearchTerm().length > 1 && !loading ? (
                            <div className="suggestion-empty">
                                No products found for "{getCurrentSearchTerm()}"
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            {/* Mobile Search Icon/Button (Add this to trigger mobile search) */}
            <button
                className="d-md-none search-mobile-toggle bg-transparent border-0"
                onClick={toggleMobileSearch}
                aria-label="Open search"
            >
                <SearchIcon />
            </button>

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
                <div className="mobile-search-overlay">
                    <form
                        onSubmit={handleMobileSearchSubmit}
                        className={`search-box mobile-search-box ${showMobileSearch ? 'active' : ''}`}
                        ref={mobileSearchRef}
                    >
                        <button
                            type="button"
                            onClick={closeMobileSearch}
                            className="search-box__close position-absolute rounded-circle flex-center text-white hover-text-gray-800 hover-bg-white text-2xl transition-1"
                            aria-label="Close search"
                        >
                            <i className="ph ph-x"></i>
                        </button>
                        <div className="container">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control py-16 px-24 text-xl bg-white text-black rounded-pill pe-64"
                                    placeholder="Search for a product..."
                                    value={mobileSearchTerm}
                                    onChange={handleMobileSearchChange}
                                    onFocus={() => mobileSearchTerm.length > 1 && setShowSuggestions(true)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="w-48 h-48 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8"
                                >
                                    <i className="ph ph-magnifying-glass"></i>
                                </button>

                                {loading && (
                                    <div className="search-loading mobile-loading">
                                        <div className="spinner"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Suggestions Dropdown */}
                        {showSuggestions && showMobileSearch && (
                            <div className="mobile-suggestions-dropdown">
                                {suggestions.length > 0 ? (
                                    <>
                                        <div className="suggestions-list">
                                            {suggestions.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleSuggestionClick(item)}
                                                    className="suggestion-item"
                                                >
                                                    <div className="suggestion-image">
                                                        <img
                                                            src={`${image_path}products-images/${item.images[0]}`}
                                                            alt={item.name || item.title}
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder.png';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="suggestion-content ">
                                                        <div className="suggestion-title">
                                                            {item.name || item.title}
                                                        </div>
                                                        <div className="suggestion-price d-flex align-items-center">
                                                            &#8377;{item.sale_price || item.price}
                                                            {item.regular_price && item.regular_price > item.sale_price && (
                                                                <span className="original-price"> ${item.regular_price}</span>
                                                            )}

                                                            {item.category && (
                                                                <div className="suggestion-category">
                                                                    &nbsp; / {item.category}
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div
                                            className="suggestion-footer"
                                            onClick={handleSeeAllResults}
                                        >
                                            See all results for "{getCurrentSearchTerm()}"
                                        </div>
                                    </>
                                ) : getCurrentSearchTerm().length > 1 && !loading ? (
                                    <div className="suggestion-empty">
                                        No products found for "{getCurrentSearchTerm()}"
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </form >
                </div >
            )
            }
        </>
    );
}

// Search icon component
const SearchIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: 'none' }}
    >
        <path
            d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default SearchBar;