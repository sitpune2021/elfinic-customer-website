import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProductsList,
    setFilter,
    setPriceRange,
    setSearchQuery,
    setSortBy,
    setPage,
    clearFilters,
    selectProducts,
    selectProductsLoading,
    selectProductsError,
    selectFilters,
    selectPagination,
    selectTotalProducts,
} from '../store/slices/productSearchSlice';

/**
 * Custom hook for managing product search and filtering
 * Provides methods and state for product search functionality
 */
export const useProductSearch = () => {
    const dispatch = useDispatch();

    // Selectors
    const products = useSelector(selectProducts);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);
    const filters = useSelector(selectFilters);
    const pagination = useSelector(selectPagination);
    const totalProducts = useSelector(selectTotalProducts);

    // Fetch products with current filters
    const fetchProducts = useCallback(() => {
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
    }, [filters, pagination, dispatch]);

    // Update single filter
    const updateFilter = useCallback((filterObj) => {
        dispatch(setFilter(filterObj));
    }, [dispatch]);

    // Update price range
    const updatePriceRange = useCallback((priceRange) => {
        dispatch(setPriceRange(priceRange));
    }, [dispatch]);

    // Update search query
    const updateSearchQuery = useCallback((query) => {
        dispatch(setSearchQuery(query));
    }, [dispatch]);

    // Update sort option
    const updateSortBy = useCallback((sortOption) => {
        dispatch(setSortBy(sortOption));
    }, [dispatch]);

    // Change page
    const changePage = useCallback((page) => {
        dispatch(setPage(page));
    }, [dispatch]);

    // Reset all filters
    const resetFilters = useCallback(() => {
        dispatch(clearFilters());
    }, [dispatch]);

    // Get pagination range for display
    const getPaginationRange = useCallback(() => {
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
    }, [pagination]);

    // Calculate showing text
    const getShowingText = useCallback(() => {
        const start = pagination.currentPage === 1 ? 1 : ((pagination.currentPage - 1) * pagination.perPage) + 1;
        const end = Math.min(pagination.currentPage * pagination.perPage, totalProducts);
        return `Showing ${start}-${end} of ${totalProducts} results`;
    }, [pagination, totalProducts]);

    return {
        // State
        products,
        loading,
        error,
        filters,
        pagination,
        totalProducts,

        // Methods
        fetchProducts,
        updateFilter,
        updatePriceRange,
        updateSearchQuery,
        updateSortBy,
        changePage,
        resetFilters,
        getPaginationRange,
        getShowingText,
    };
};

export default useProductSearch;
