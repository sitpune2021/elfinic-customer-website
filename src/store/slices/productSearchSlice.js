import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

// Async thunk for fetching products with filters and pagination
export const fetchProductsList = createAsyncThunk(
    'productSearch/fetchProductsList',
    async (filters, { rejectWithValue }) => {
        try {
            // Build query params for GET request
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
                    params.append(key, filters[key]);
                }
            });

            const response = await axios.get(`${API_BASE_URL}/getProductsFilterList?${params.toString()}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch products:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    products: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        perPage: 12,
        total: 0,
        lastPage: 1,
    },
    filters: {
        name: '',
        vendor_id: '',
        category_id: '', // Store name, not ID
        subcategory_id: '', // Store name, not ID
        brand_id: '', // Store name, not ID
        show_section: '',
        price_min: 0,
        price_max: 10000,
        size: '',
        color: '',
        rating: '',
        sort_by: 'popular', // popular, latest, trending, price_low, price_high
    },
};

const productSearchSlice = createSlice({
    name: 'productSearch',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
            // Reset to page 1 when filters change
            state.pagination.currentPage = 1;
        },
        setPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        setPriceRange: (state, action) => {
            state.filters.price_min = action.payload[0];
            state.filters.price_max = action.payload[1];
            state.pagination.currentPage = 1;
        },
        clearFilters: (state) => {
            state.filters = { ...initialState.filters };
            state.pagination.currentPage = 1;
        },
        setSearchQuery: (state, action) => {
            state.filters.name = action.payload;
            state.pagination.currentPage = 1;
        },
        setSortBy: (state, action) => {
            state.filters.sort_by = action.payload;
            state.pagination.currentPage = 1;
        },
        setRating: (state, action) => {
            state.filters.rating = action.payload;
            state.pagination.currentPage = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsList.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                console.log('API Response:', action.payload);

                // Handle API response structure
                const response = action.payload;

                // Check for your API structure: { status, message, pagination: {...}, data: [...] }
                if (response?.pagination && Array.isArray(response?.data)) {
                    // Your API structure with pagination at root
                    state.products = response.data;
                    state.pagination = {
                        currentPage: response.pagination.current_page || 1,
                        perPage: response.pagination.per_page || 12,
                        total: response.pagination.total || 0,
                        lastPage: response.pagination.last_page || 1,
                    };
                } else if (response?.data?.data) {
                    // Nested data with pagination
                    state.products = response.data.data;
                    state.pagination = {
                        currentPage: response.data.current_page || 1,
                        perPage: response.data.per_page || 12,
                        total: response.data.total || 0,
                        lastPage: response.data.last_page || 1,
                    };
                } else if (response?.data && Array.isArray(response.data)) {
                    // Direct data array (might have pagination info at root)
                    state.products = response.data;
                    state.pagination = {
                        currentPage: response.current_page || 1,
                        perPage: response.per_page || 12,
                        total: response.total || response.data.length,
                        lastPage: response.last_page || 1,
                    };
                } else if (Array.isArray(response)) {
                    // Simple array response
                    state.products = response;
                    state.pagination = {
                        currentPage: 1,
                        perPage: 12,
                        total: response.length,
                        lastPage: Math.ceil(response.length / 12),
                    };
                } else if (response?.data) {
                    // Single data object with potential pagination
                    const data = response.data;
                    if (data.data && Array.isArray(data.data)) {
                        state.products = data.data;
                        state.pagination = {
                            currentPage: data.current_page || 1,
                            perPage: data.per_page || 12,
                            total: data.total || 0,
                            lastPage: data.last_page || 1,
                        };
                    } else {
                        state.products = Array.isArray(data) ? data : [];
                        state.pagination.total = state.products.length;
                    }
                } else {
                    state.products = [];
                }

                console.log('Processed Products:', state.products.length);
                console.log('Pagination:', state.pagination);
            })
            .addCase(fetchProductsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch products';
                state.products = [];
            });
    },
});

export const {
    setFilter,
    setPage,
    setPriceRange,
    clearFilters,
    setSearchQuery,
    setSortBy,
    setRating,
} = productSearchSlice.actions;

// Selectors
export const selectProducts = (state) => state.productSearch.products;
export const selectProductsLoading = (state) => state.productSearch.loading;
export const selectProductsError = (state) => state.productSearch.error;
export const selectPagination = (state) => state.productSearch.pagination;
export const selectFilters = (state) => state.productSearch.filters;
export const selectCurrentPage = (state) => state.productSearch.pagination.currentPage;
export const selectTotalPages = (state) => state.productSearch.pagination.lastPage;
export const selectTotalProducts = (state) => state.productSearch.pagination.total;

export default productSearchSlice.reducer;
