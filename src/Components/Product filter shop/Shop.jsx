import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import SwapBanner from '../External-lab/SwapBanner'
import ShopProducts from './ShopProducts'
import useApi from '../../hooks/useApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectSubCategories, selectSubCategoriesLoading, subCategories } from '../../store/slices/apiSlice';
import {
    fetchProductsList,
    setFilter,
    setPriceRange,
    setSearchQuery,
    setSortBy,
    setPage,
    selectFilters,
    selectPagination,
    selectTotalProducts,
    clearFilters
} from '../../store/slices/productSearchSlice';
import './Shop.css';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Slider } from "primereact/slider";
import BrandFilter from './BrandFilter';
import FilterModal from './FilterModal';

function Shop() {
    const { categories, categoriesLoading } = useApi();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [subCategoriesId, setSubCategoriesId] = useState();
    const [openDropdown, setOpenDropdown] = useState(null); // Track which category dropdown is open
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); // Track selected subcategory
    const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category
    const [selectedCategoryName, setSelectedCategoryName] = useState(''); // Track category name
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState(''); // Track subcategory name
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [modalExpandedCategory, setModalExpandedCategory] = useState(null); // Track expanded category in modal
    const [modalSubcategories, setModalSubcategories] = useState({}); // Store subcategories for modal
    const [searchInput, setSearchInput] = useState(''); // Local state for search input
    const [selectedBrand, setSelectedBrand] = useState(null); // Track selected brand
    const [selectedRating, setSelectedRating] = useState(null); // Track selected rating
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
    const [isInitialized, setIsInitialized] = useState(false);
    const isUrlUpdate = useRef(false); // Track if update is from URL
    const isProgrammaticNavigation = useRef(false); // Track if URL change was from sync effect
    const location = useLocation();

    const subcategories = useSelector(selectSubCategories);
    const SubCategoriesLoading = useSelector(selectSubCategoriesLoading);
    const filters = useSelector(selectFilters);
    const pagination = useSelector(selectPagination);
    const totalProducts = useSelector(selectTotalProducts);

    const dispatch = useDispatch();

    const CATEGORY_LIMIT = 8;
    const SUBCATEGORY_LIMIT = 5;

    const handleCategoryClick = (category, e) => {
        e.preventDefault();
        e.stopPropagation();

        // Handle both object and ID for backwards compatibility
        const categoryId = typeof category === 'object' ? category.id : category;
        const categoryName = typeof category === 'object' ? category.name : category;

        console.log('Category clicked:', { category, categoryId, categoryName });

        // Set selected category for visual feedback
        setSelectedCategory(categoryId);
        setSelectedCategoryName(categoryName);

        // Update Redux filter with category name
        dispatch(setFilter({ category_id: categoryName, subcategory_id: '' }));
        console.log('Dispatched filter with category_id:', categoryName);
        setSelectedSubcategory(null); // Clear subcategory when category changes
        setSelectedSubcategoryName(''); // Clear subcategory name

        // Toggle dropdown visibility
        if (openDropdown === categoryId) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(categoryId);
            // Fetch subcategories for this category using ID
            dispatch(subCategories(categoryId));
            setSubCategoriesId(categoryId);
        }
    };

    const handleSubcategoryClick = (subcategory, e) => {
        e.preventDefault();
        e.stopPropagation();

        // Handle both object and ID for backwards compatibility
        const subcategoryId = typeof subcategory === 'object' ? subcategory.id : subcategory;
        const subcategoryName = typeof subcategory === 'object' ? subcategory.name : subcategory;

        // Set selected subcategory for visual feedback
        setSelectedSubcategory(subcategoryId);
        setSelectedSubcategoryName(subcategoryName);

        // Update Redux filter with subcategory name
        dispatch(setFilter({ subcategory_id: subcategoryName }));

        // Close modal if open
        setShowSubcategoryModal(false);
    };

    const handleShowMoreCategories = (e) => {
        e.preventDefault();
        setShowCategoryModal(true);
    };

    const handleShowMoreSubcategories = (e) => {
        e.preventDefault();
        setShowSubcategoryModal(true);
    };

    const handleCategoryExpandInModal = (categoryId) => {
        if (modalExpandedCategory === categoryId) {
            setModalExpandedCategory(null);
        } else {
            setModalExpandedCategory(categoryId);
            // Fetch subcategories for this category if not already fetched
            if (!modalSubcategories[categoryId]) {
                dispatch(subCategories(categoryId)).then((result) => {
                    if (result.payload && result.payload.data) {
                        setModalSubcategories(prev => ({
                            ...prev,
                            [categoryId]: result.payload.data
                        }));
                    }
                });
            }
        }
    };

    // Update modal subcategories when subcategories are loaded
    useEffect(() => {
        if (subcategories?.data && modalExpandedCategory) {
            setModalSubcategories(prev => ({
                ...prev,
                [modalExpandedCategory]: subcategories.data
            }));
        }
    }, [subcategories, modalExpandedCategory]);



    useEffect(() => {
        if (subCategoriesId) {
            dispatch(subCategories(subCategoriesId));
        }
    }, [subCategoriesId, dispatch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.category-item')) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    // Mobile sidebar open/close handlers
    const openSidebar = () => {
        setSidebarOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        document.body.style.overflow = '';
    };

    // Close sidebar on window resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 991 && sidebarOpen) {
                closeSidebar();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarOpen]);

    // Cleanup body overflow on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const [value, setValue] = useState([0, 10000]);

    // Initialize filters from URL on mount and when URL changes externally
    useEffect(() => {
        // Skip if this URL change was triggered by our own sync effect
        if (isProgrammaticNavigation.current) {
            isProgrammaticNavigation.current = false;
            return;
        }

        isUrlUpdate.current = true; // Mark as URL update

        // Clear ALL existing filters and local state first to prevent old filters persisting
        dispatch(clearFilters());
        setSelectedCategory(null);
        setSelectedCategoryName('');
        setSelectedSubcategory(null);
        setSelectedSubcategoryName('');
        setSelectedBrand(null);
        setSelectedRating(null);
        setSearchInput('');
        setValue([0, 10000]);
        setOpenDropdown(null);

        const urlFilters = {};
        const urlPage = searchParams.get('page');
        const urlSearch = searchParams.get('search');
        const urlName = searchParams.get('name');
        const urlCategory = searchParams.get('category');
        const urlSubcategory = searchParams.get('subcategory');
        const urlBrand = searchParams.get('brand');
        const urlPriceMin = searchParams.get('price_min');
        const urlPriceMax = searchParams.get('price_max');
        const urlSort = searchParams.get('sort');
        const urlShowSection = searchParams.get('show_section');
        const urlRating = searchParams.get('rating');

        // Support both 'search' and 'name' parameters
        if (urlSearch || urlName) {
            urlFilters.name = urlSearch || urlName;
            setSearchInput(urlSearch || urlName);
        }
        if (urlCategory) {
            urlFilters.category_id = urlCategory;
            setSelectedCategoryName(urlCategory);
        }
        if (urlSubcategory) {
            urlFilters.subcategory_id = urlSubcategory;
            setSelectedSubcategoryName(urlSubcategory);
        }
        if (urlBrand) {
            urlFilters.brand_id = urlBrand;
            setSelectedBrand(urlBrand);
        }
        if (urlPriceMin || urlPriceMax) {
            const min = urlPriceMin ? parseInt(urlPriceMin) : 0;
            const max = urlPriceMax ? parseInt(urlPriceMax) : 10000;
            setValue([min, max]);
            urlFilters.price_min = min;
            urlFilters.price_max = max;
        }
        if (urlSort) {
            urlFilters.sort_by = urlSort;
        }
        if (urlShowSection) {
            urlFilters.show_section = urlShowSection;
        }
        if (urlRating) {
            urlFilters.rating = parseInt(urlRating);
            setSelectedRating(parseInt(urlRating));
        }

        if (Object.keys(urlFilters).length > 0) {
            dispatch(setFilter(urlFilters));
        }
        if (urlPage) {
            dispatch(setPage(parseInt(urlPage)));
        }

        setIsInitialized(true);

        // Reset the flag after a short delay to allow URL-based updates to complete
        setTimeout(() => {
            isUrlUpdate.current = false;
        }, 200);
    }, [location.search, dispatch]);

    // Sync URL with filters (after initialization)
    useEffect(() => {
        if (!isInitialized || isUrlUpdate.current) return;

        const params = new URLSearchParams();

        if (filters.name) params.set('search', filters.name);
        if (filters.category_id) params.set('category', filters.category_id);
        if (filters.subcategory_id) params.set('subcategory', filters.subcategory_id);
        if (filters.brand_id) params.set('brand', filters.brand_id);
        if (filters.show_section) params.set('show_section', filters.show_section);
        if (filters.price_min !== 0) params.set('price_min', filters.price_min);
        if (filters.price_max !== 10000) params.set('price_max', filters.price_max);
        if (filters.sort_by !== 'popular') params.set('sort', filters.sort_by);
        if (filters.rating) params.set('rating', filters.rating);
        if (pagination.currentPage > 1) params.set('page', pagination.currentPage);

        const newSearch = params.toString() ? `?${params.toString()}` : '';
        const currentSearch = location.search;

        // Only navigate if URL actually changed to prevent loops
        if (newSearch !== currentSearch) {
            isProgrammaticNavigation.current = true;
            navigate(newSearch || '/shop', { replace: true });
        }
    }, [
        filters.name,
        filters.category_id,
        filters.subcategory_id,
        filters.brand_id,
        filters.show_section,
        filters.price_min,
        filters.price_max,
        filters.sort_by,
        filters.rating,
        pagination.currentPage,
        isInitialized,
        navigate,
        location.search
    ]);

    // Fetch products on mount and when filters change
    useEffect(() => {
        if (!isInitialized) return;

        const fetchFilters = {
            name: filters.name,
            vendor_id: filters.vendor_id,
            category_id: filters.category_id,
            subcategory_id: filters.subcategory_id,
            brand_id: filters.brand_id,
            show_section: filters.show_section,
            price_min: filters.price_min,
            price_max: filters.price_max,
            size: filters.size,
            color: filters.color,
            rating: filters.rating,
            per_page: pagination.perPage,
            page: pagination.currentPage,
        };

        dispatch(fetchProductsList(fetchFilters));
    }, [
        filters.name,
        filters.category_id,
        filters.subcategory_id,
        filters.brand_id,
        filters.show_section,
        filters.price_min,
        filters.price_max,
        filters.sort_by,
        filters.rating,
        pagination.currentPage,
        isInitialized,
        dispatch
    ]);

    // Debounced search handler (only for manual input changes, not URL-based)
    useEffect(() => {
        if (!isInitialized) return; // Don't run during initialization

        const delayDebounceFn = setTimeout(() => {
            // Only update if searchInput differs from current filter AND is not empty
            // This prevents clearing the search when navigating from SearchBar
            if (searchInput !== filters.name && isInitialized) {
                dispatch(setSearchQuery(searchInput));
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput, isInitialized]); // Removed filters.name and dispatch from dependencies

    // Handle price filter apply
    const handlePriceFilter = () => {
        dispatch(setPriceRange(value));
    };

    // Handle brand selection
    const handleBrandSelect = (brand) => {
        // Handle both object and ID for backwards compatibility
        const brandId = typeof brand === 'object' ? brand.id : brand;
        const brandName = typeof brand === 'object' ? brand.name : brand;

        setSelectedBrand(brandId);
        dispatch(setFilter({ brand_id: brandName }));
    };

    // Handle rating filter
    const handleRatingFilter = (rating) => {
        setSelectedRating(rating);
        dispatch(setFilter({ rating: rating }));
    };

    // Handle sort change
    const handleSortChange = (e) => {
        const sortValue = e.target.value;
        dispatch(setSortBy(sortValue));
    };

    // Handle page change
    const handlePageChange = (page) => {
        dispatch(setPage(page));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Clear category filter
    const clearCategoryFilter = () => {
        setSelectedCategory(null);
        setSelectedCategoryName('');
        setSelectedSubcategory(null);
        setSelectedSubcategoryName('');
        dispatch(setFilter({ category_id: '', subcategory_id: '' }));
    };

    // Clear subcategory filter
    const clearSubcategoryFilter = () => {
        setSelectedSubcategory(null);
        setSelectedSubcategoryName('');
        dispatch(setFilter({ subcategory_id: '' }));
    };

    // Clear search filter
    const clearSearchFilter = () => {
        setSearchInput('');
        dispatch(setSearchQuery(''));
    };

    // Clear brand filter
    const clearBrandFilter = () => {
        setSelectedBrand(null);
        dispatch(setFilter({ brand_id: '' }));
    };

    // Clear rating filter
    const clearRatingFilter = () => {
        setSelectedRating(null);
        dispatch(setFilter({ rating: '' }));
    };

    // Clear price filter
    const clearPriceFilter = () => {
        setValue([0, 10000]);
        dispatch(setPriceRange([0, 10000]));
    };

    // Clear show_section filter
    const clearShowSectionFilter = () => {
        dispatch(setFilter({ show_section: '' }));
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedCategory(null);
        setSelectedCategoryName('');
        setSelectedSubcategory(null);
        setSelectedSubcategoryName('');
        setSelectedBrand(null);
        setSelectedRating(null);
        setSearchInput('');
        setValue([0, 10000]);
        dispatch(clearFilters());
    };

    // Get active filters for display
    const activeFilters = useMemo(() => {
        const filters_list = [];

        if (filters.category_id) {
            filters_list.push({
                type: 'category',
                label: 'Category',
                value: filters.category_id,
                onRemove: clearCategoryFilter
            });
        }

        if (filters.subcategory_id) {
            filters_list.push({
                type: 'subcategory',
                label: 'Subcategory',
                value: filters.subcategory_id,
                onRemove: clearSubcategoryFilter
            });
        }

        if (filters.brand_id) {
            filters_list.push({
                type: 'brand',
                label: 'Brand',
                value: filters.brand_id,
                onRemove: clearBrandFilter
            });
        }

        if (filters.show_section) {
            const sectionLabels = {
                'featured': 'Featured',
                'trending': 'Trending',
                'new_arrival': 'New Arrival',
                'best_seller': 'Best Seller',
                'on_sale': 'On Sale'
            };
            filters_list.push({
                type: 'show_section',
                label: 'Section',
                value: sectionLabels[filters.show_section] || filters.show_section,
                onRemove: clearShowSectionFilter
            });
        }

        if (filters.name) {
            filters_list.push({
                type: 'search',
                label: 'Search',
                value: `"${filters.name}"`,
                onRemove: clearSearchFilter
            });
        }

        if (filters.price_min !== 0 || filters.price_max !== 10000) {
            filters_list.push({
                type: 'price',
                label: 'Price',
                value: `₹${filters.price_min.toLocaleString()} - ₹${filters.price_max.toLocaleString()}`,
                onRemove: clearPriceFilter
            });
        }

        if (filters.rating) {
            filters_list.push({
                type: 'rating',
                label: 'Rating',
                value: `${filters.rating}+ Stars`,
                onRemove: clearRatingFilter
            });
        }

        return filters_list;
    }, [filters]);

    // Check if any filters are active
    const hasActiveFilters = activeFilters.length > 0;

    // Calculate pagination range
    const getPaginationRange = () => {
        const totalPages = pagination.lastPage;
        const currentPage = pagination.currentPage;
        const range = [];
        const showPages = 7;

        if (totalPages <= showPages) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) range.push(i);
                range.push('...');
                range.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                range.push(1);
                range.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) range.push(i);
            } else {
                range.push(1);
                range.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) range.push(i);
                range.push('...');
                range.push(totalPages);
            }
        }

        return range;
    };


    return (
        <>
            {/* <!-- ========================= Breadcrumb Start =============================== --> */}
            <div className="breadcrumb mb-0 py-18 bg-main-two-50">
                <div className="container container-lg">
                    <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
                        <h6 className="mb-0">Shop</h6>
                        <ul className="flex-align gap-8 flex-wrap">
                            <li className="text-sm">
                                <Link to="/" className="text-gray-600 hover-text-main-600">
                                    Home
                                </Link>
                            </li>
                            <li className="flex-align text-gray-400">
                                <i className="ph ph-caret-right"></i>
                            </li>
                            <li className="text-sm">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Shop
                                </Link>
                            </li>

                            {/* Show Category Breadcrumb */}
                            {selectedCategoryName && (
                                <>
                                    <li className="flex-align text-gray-400">
                                        <i className="ph ph-caret-right"></i>
                                    </li>
                                    <li className="text-sm flex-align gap-2">
                                        <span className="text-main-600 fw-medium">{selectedCategoryName}</span>

                                    </li>
                                </>
                            )}

                            {/* Show Subcategory Breadcrumb */}
                            {selectedSubcategoryName && (
                                <>
                                    <li className="flex-align text-gray-400">
                                        <i className="ph ph-caret-right"></i>
                                    </li>
                                    <li className="text-sm flex-align gap-2">
                                        <span className="text-main-600 fw-medium">{selectedSubcategoryName}</span>

                                    </li>
                                </>
                            )}

                            {/* Show Search Term Breadcrumb */}
                            {filters.name && (
                                <>
                                    <li className="flex-align text-gray-400">
                                        <i className="ph ph-caret-right"></i>
                                    </li>
                                    <li className="text-sm flex-align gap-2">
                                        <span className="text-gray-600">Search:</span>
                                        <span className="text-main-600 fw-medium">"{filters.name}"</span>

                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div >
            </div >
            {/* <!-- ========================= Breadcrumb End =============================== --> */}

            {/* Shop Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="shop-sidebar-overlay"
                    onClick={closeSidebar}
                />
            )}

            <section className="shop py-10">
                <div className="container container-lg">
                    <div className="row">

                        {/* <!-- Sidebar Start --> */}
                        <div className="col-lg-3">
                            <div
                                className={`shop-sidebar${sidebarOpen ? ' active' : ''}`}
                                style={sidebarOpen ? { transform: 'translateX(0)', visibility: 'visible' } : {}}
                            >
                                <button type="button"
                                    className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
                                    onClick={closeSidebar}>
                                    <i className="ph ph-x"></i>
                                </button>
                                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-20 mb-10">
                                    <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Product Category</h6>
                                    <ul className="max-h-540 overflow-y-auto scroll-sm">
                                        {categoriesLoading ? (
                                            <li className="loading-text">Loading categories...</li>
                                        ) : (categories && categories.length > 0) ? (
                                            <>
                                                {categories.slice(0, CATEGORY_LIMIT).map((category) => (
                                                    <li className="category-item" key={category.id}>
                                                        <div>
                                                            <div
                                                                className="category-toggle text-gray-900 hover-text-main-600 d-flex align-items-center justify-content-between"
                                                                onClick={(e) => handleCategoryClick(category, e)}
                                                                data-expanded={openDropdown === category.id}
                                                                data-selected={selectedCategory === category.id}
                                                                role="button"
                                                                tabIndex={0}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        handleCategoryClick(category, e);
                                                                    }
                                                                }}
                                                            >
                                                                <span className="fw-medium">
                                                                    {category.name}
                                                                    {category.subcategory_count && (
                                                                        <span className="text-xs text-gray-500 ms-2">
                                                                            ({category.subcategory_count})
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                <i className={`ph ${openDropdown === category.id ? 'ph-caret-up' : 'ph-caret-down'} category-icon`}></i>
                                                            </div>
                                                            {/* Subcategories Dropdown */}
                                                            {openDropdown === category.id && (
                                                                <div className="subcategories-dropdown">
                                                                    {SubCategoriesLoading ? (
                                                                        <div className="loading-text">Loading subcategories...</div>
                                                                    ) : subcategories && subcategories.data && subcategories.data.length > 0 ? (
                                                                        <>
                                                                            <ul className="list-unstyled mb-0">
                                                                                {subcategories.data.slice(0, SUBCATEGORY_LIMIT).map((subcategory) => (
                                                                                    <li key={subcategory.id} className="subcategory-item mb-2">
                                                                                        <Link
                                                                                            to="#"
                                                                                            className={`subcategory-link ${selectedSubcategory === subcategory.id ? 'text-main-600 fw-medium' : ''}`}
                                                                                            onClick={(e) => handleSubcategoryClick(subcategory, e)}
                                                                                        >
                                                                                            {subcategory.name}
                                                                                            {selectedSubcategory === subcategory.id && (
                                                                                                <i className="ph ph-check ms-2"></i>
                                                                                            )}
                                                                                        </Link>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                            {subcategories.data.length > SUBCATEGORY_LIMIT && (
                                                                                <a
                                                                                    href="#"
                                                                                    className="more-link mt-2"
                                                                                    onClick={handleShowMoreSubcategories}
                                                                                >
                                                                                    +{subcategories.data.length - SUBCATEGORY_LIMIT} more
                                                                                    <i className="ph ph-arrow-right"></i>
                                                                                </a>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <div className="no-subcategories">No subcategories found</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                                {categories.length > CATEGORY_LIMIT && (
                                                    <li className="mt-3">
                                                        <a
                                                            href="#"
                                                            className="more-link"
                                                            onClick={handleShowMoreCategories}
                                                        >
                                                            +{categories.length - CATEGORY_LIMIT} more categories
                                                            <i className="ph ph-arrow-right"></i>
                                                        </a>
                                                    </li>
                                                )}
                                            </>
                                        ) : (
                                            <li>No categories found</li>
                                        )}
                                    </ul>
                                </div>

                                {/* price filter range */}
                                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-20 mb-10">
                                    <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Price</h6>

                                    <div className="card flex justify-content-center w-100">
                                        <Slider
                                            value={value}
                                            onChange={(e) => setValue(e.value)}
                                            className=""
                                            range
                                            min={0}
                                            max={10000}
                                            step={1000}
                                        />
                                    </div>
                                    <div className="gap-8 mt-24 ">
                                        <div className="custom--range__content flex-align gap-8">
                                            {/* <span className="text.-gray-500 text-md flex-shrink-0">Price:</span> */}
                                            <input type="text"
                                                className=" text-neutral-600 text-start p-7 text-md fw-medium"
                                                value={`₹${value[0].toLocaleString()} - ₹${value[1].toLocaleString()}`}
                                                readOnly />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-main btn-sm h-40 mt-5 flex-align"
                                            onClick={handlePriceFilter}
                                        >
                                            Filter
                                        </button>

                                    </div>

                                </div>
                                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                    <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Rating</h6>
                                    <div className="flex-align gap-8 position-relative mb-20">
                                        <label className="position-absolute w-100 h-100 cursor-pointer" htmlFor="rating5"> </label>
                                        <div className="common-check common-radio mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="flexRadioDefault"
                                                id="rating5"
                                                checked={selectedRating === 5}
                                                onChange={() => handleRatingFilter(5)}
                                            />
                                        </div>
                                        <div className="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar"
                                            aria-label="Basic example" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">
                                            <div className="progress-bar bg-main-600 rounded-pill" style={{ width: '100%' }}></div>
                                        </div>
                                        <div className="flex-align gap-4">
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                        </div>
                                        <span className="text-gray-900 flex-shrink-0">5</span>
                                    </div>
                                    <div className="flex-align gap-8 position-relative mb-20">
                                        <label className="position-absolute w-100 h-100 cursor-pointer" htmlFor="rating4"> </label>
                                        <div className="common-check common-radio mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="flexRadioDefault"
                                                id="rating4"
                                                checked={selectedRating === 4}
                                                onChange={() => handleRatingFilter(4)}
                                            />
                                        </div>
                                        <div className="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar"
                                            aria-label="Basic example" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                                            <div className="progress-bar bg-main-600 rounded-pill" style={{ width: '75%' }}></div>
                                        </div>
                                        <div className="flex-align gap-4">
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-gray-400 d-flex"><i
                                                className="ph ph-star"></i></span>
                                        </div>
                                        <span className="text-gray-900 flex-shrink-0">4</span>
                                    </div>
                                    <div className="flex-align gap-8 position-relative mb-20">
                                        <label className="position-absolute w-100 h-100 cursor-pointer" htmlFor="rating3"> </label>
                                        <div className="common-check common-radio mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="flexRadioDefault"
                                                id="rating3"
                                                checked={selectedRating === 3}
                                                onChange={() => handleRatingFilter(3)}
                                            />
                                        </div>
                                        <div className="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar"
                                            aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                                            <div className="progress-bar bg-main-600 rounded-pill" style={{ width: '50%' }}></div>
                                        </div>
                                        <div className="flex-align gap-4">
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-gray-400 d-flex"><i
                                                className="ph ph-star"></i></span>
                                            <span className="text-xs fw-medium text-gray-400 d-flex"><i
                                                className="ph ph-star"></i></span>
                                        </div>
                                        <span className="text-gray-900 flex-shrink-0">3</span>
                                    </div>
                                    <div className="flex-align gap-8 position-relative mb-20">
                                        <label className="position-absolute w-100 h-100 cursor-pointer" htmlFor="rating2"> </label>
                                        <div className="common-check common-radio mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="flexRadioDefault"
                                                id="rating2"
                                                checked={selectedRating === 2}
                                                onChange={() => handleRatingFilter(2)}
                                            />
                                        </div>
                                        <div className="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar"
                                            aria-label="Basic example" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                            <div className="progress-bar bg-main-600 rounded-pill" style={{ width: '30%' }}></div>
                                        </div>
                                        <div className="flex-align gap-4">
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-gray-400 d-flex"><i
                                                className="ph ph-star"></i></span>
                                            <span className="text-xs fw-medium text-gray-400 d-flex"><i
                                                className="ph ph-star"></i></span>
                                            <span className="text-xs fw-medium text-gray-400 d-flex"><i
                                                className="ph ph-star"></i></span>
                                        </div>
                                        <span className="text-gray-900 flex-shrink-0">2</span>
                                    </div>
                                    <div className="flex-align gap-8 position-relative mb-0">
                                        <label className="position-absolute w-100 h-100 cursor-pointer" htmlFor="rating1"> </label>
                                        <div className="common-check common-radio mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="flexRadioDefault"
                                                id="rating1"
                                                checked={selectedRating === 1}
                                                onChange={() => handleRatingFilter(1)}
                                            />
                                        </div>
                                        <div className="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar"
                                            aria-label="Basic example" aria-valuenow="5" aria-valuemin="0" aria-valuemax="100">
                                            <div className="progress-bar bg-main-600 rounded-pill" style={{ width: '15%' }}></div>
                                        </div>
                                        <div className="flex-align gap-4">
                                            <span className="text-xs fw-medium text-warning-600 d-flex"><i
                                                className="ph-fill ph-star"></i></span>
                                            <span className="text-xs fw-medium text-gray-400 d-flex"><i
                                                className="ph ph-star"></i></span>
                                            <span className="text-xs fw-medium text-gray-400 d-flex"><i
                                                className="ph ph-star"></i></span>
                                            <span className="text-xs fw-medium text-gray-400 d-flex"><i
                                                className="ph ph-star"></i></span>
                                            <span className="text-xs fw-medium text-gray-400 d-flex"><i
                                                className="ph ph-star"></i></span>
                                        </div>
                                        <span className="text-gray-900 flex-shrink-0">1</span>
                                    </div>
                                </div>


                                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                                    <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Brand</h6>
                                    <ul className="max-h-540 overflow-y-auto scroll-sm">
                                        <BrandFilter />

                                    </ul>
                                </div>
                                <div className="shop-sidebar__box rounded-8">
                                    {/* <img src="/images/thumbs/advertise-img1.png" alt="" /> */}
                                    <SwapBanner />
                                </div>
                            </div>
                        </div>
                        {/* <!-- Sidebar End --> */}

                        {/* <!-- Content Start --> */}
                        <div className="col-lg-9">
                            {/* <!-- Applied Filters Section --> */}
                            {hasActiveFilters && (
                                <div className="applied-filters-section mb-24">
                                    <div className="bg-white border border-gray-100 rounded-8 p-16">
                                        <div className="flex-between flex-wrap gap-12 mb-12">
                                            <div className="flex-align gap-8">
                                                <i className="ph ph-funnel text-main-600 text-xl"></i>
                                                <span className="fw-semibold text-gray-900">Applied Filters</span>
                                                <span className="badge bg-main-100 text-main-600 rounded-pill px-8 py-4 text-xs">
                                                    {activeFilters.length}
                                                </span>
                                                <span className='ms-16 text-gray-500'>
                                                    <Link to="/shop"><i className=' fa fa-times'></i></Link>
                                                </span>
                                            </div>

                                        </div>
                                        <div className="flex-align flex-wrap gap-8">
                                            {activeFilters.map((filter, index) => (
                                                <div
                                                    key={`${filter.type}-${index}`}
                                                    className="filter-tag flex-align gap-8 bg-main-50 border border-main-100 rounded-pill px-12 py-6"
                                                >
                                                    <span className="text-xs text-gray-500">{filter.label}:</span>
                                                    <span className="text-sm fw-medium text-main-600">{filter.value}</span>
                                                    <button
                                                        onClick={filter.onRemove}
                                                        className="filter-tag-remove w-20 h-20 flex-center rounded-circle bg-main-100 hover-bg-danger-100 text-main-600 hover-text-danger-600 border-0 transition-2"
                                                        title={`Remove ${filter.label} filter`}
                                                    >
                                                        <i className="ph ph-x text-xs"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* <!-- Top Start --> */}
                            <div className="flex-between gap-16 flex-wrap mb-40 ">
                                <div className="flex-align gap-16 flex-wrap">
                                    <span className="text-gray-900">
                                        Showing {pagination.currentPage === 1 ? 1 : ((pagination.currentPage - 1) * pagination.perPage) + 1}-
                                        {Math.min(pagination.currentPage * pagination.perPage, totalProducts)} of {totalProducts} results
                                    </span>
                                    {/* Search Input */}
                                    {/* <div className="position-relative">
                                        <input
                                            type="text"
                                            className="form-control common-input px-14 py-10 rounded-6"
                                            placeholder="Search products..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            style={{ minWidth: '200px' }}
                                        />
                                        {searchInput && (
                                            <button
                                                className="position-absolute top-50 translate-middle-y end-0 me-2 border-0 bg-transparent"
                                                onClick={() => setSearchInput('')}
                                            >
                                                <i className="ph ph-x"></i>
                                            </button>
                                        )}
                                    </div> */}
                                </div>
                                <div className="position-relative flex-align gap-16 flex-wrap">

                                    <div className="position-relative text-gray-500 flex-align gap-4 text-14">
                                        <label htmlFor="sorting" className="text-inherit flex-shrink-0">Sort by: </label>
                                        <select
                                            className="form-control common-input px-14 py-14 text-inherit rounded-6 w-auto"
                                            id="sorting"
                                            value={filters.sort_by}
                                            onChange={handleSortChange}
                                        >
                                            <option value="popular">Popular</option>
                                            <option value="latest">Latest</option>
                                            <option value="trending">Trending</option>
                                            <option value="price_low">Price: Low to High</option>
                                            <option value="price_high">Price: High to Low</option>
                                        </select>
                                    </div>
                                    <button type="button"
                                        className={`w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn${sidebarOpen ? ' bg-main-600 text-white' : ''}`}
                                        onClick={openSidebar}><i
                                            className="ph-bold ph-funnel"></i></button>
                                </div>
                            </div>
                            {/* <!-- Top End --> */}

                            <div className="list-grid-wrapper">

                                <ShopProducts />


                            </div>

                            {/* <!-- Pagination Start --> */}
                            {pagination.lastPage > 1 && (
                                <ul className="pagination flex-center flex-wrap gap-16">
                                    <li className="page-item">
                                        <button
                                            className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                            style={{
                                                cursor: pagination.currentPage === 1 ? 'not-allowed' : 'pointer',
                                                opacity: pagination.currentPage === 1 ? 0.5 : 1
                                            }}
                                        >
                                            <i className="ph-bold ph-arrow-left"></i>
                                        </button>
                                    </li>
                                    {getPaginationRange().map((page, index) => (
                                        page === '...' ? (
                                            <li key={`ellipsis-${index}`} className="page-item">
                                                <span className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border-0">
                                                    ...
                                                </span>
                                            </li>
                                        ) : (
                                            <li key={page} className={`page-item ${pagination.currentPage === page ? 'active' : ''}`}>
                                                <button
                                                    className={`page-link h-64 w-64 flex-center text-md rounded-8 fw-medium border border-gray-100 ${pagination.currentPage === page
                                                        ? 'bg-main-600 text-white border-main-600'
                                                        : 'text-neutral-600'
                                                        }`}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page < 10 ? `0${page}` : page}
                                                </button>
                                            </li>
                                        )
                                    ))}
                                    <li className="page-item">
                                        <button
                                            className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.lastPage}
                                            style={{
                                                cursor: pagination.currentPage === pagination.lastPage ? 'not-allowed' : 'pointer',
                                                opacity: pagination.currentPage === pagination.lastPage ? 0.5 : 1
                                            }}
                                        >
                                            <i className="ph-bold ph-arrow-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            )}
                            {/* <!-- Pagination End --> */}
                        </div>
                        {/* <!-- Content End --> */}

                    </div>
                </div>

                {/* Category Modal */}
                <FilterModal
                    isOpen={showCategoryModal}
                    onClose={() => {
                        setShowCategoryModal(false);
                        setModalExpandedCategory(null);
                    }}
                    title="All Categories"
                    items={categories}
                    onItemClick={handleCategoryClick}
                    selectedId={selectedCategory}
                    showSubcategories={true}
                    subcategoriesData={modalSubcategories}
                    onSubcategoryClick={handleSubcategoryClick}
                    selectedSubcategoryId={selectedSubcategory}
                    expandedCategoryId={modalExpandedCategory}
                    onCategoryExpand={handleCategoryExpandInModal}
                />

                {/* Subcategory Modal */}
                <FilterModal
                    isOpen={showSubcategoryModal}
                    onClose={() => setShowSubcategoryModal(false)}
                    title="All Subcategories"
                    items={subcategories?.data || []}
                    onItemClick={handleSubcategoryClick}
                    selectedId={selectedSubcategory}
                />
            </section>
        </>
    )
}

export default Shop