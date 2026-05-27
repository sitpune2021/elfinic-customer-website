import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllVendors as fetchVendorsAPI } from '../../services/vendorService';

// Async thunk for fetching vendors with filters and pagination
export const fetchVendors = createAsyncThunk(
    'vendors/fetchVendors',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await fetchVendorsAPI(params);
            const requestedPerPage = Number(params.per_page) || 12;
            const vendorRows = Array.isArray(response.data) ? response.data : [];
            const currentPage = Number(response.current_page) || Number(params.page) || 1;
            const hasExplicitTotal = Number.isFinite(Number(response.total)) && Number(response.total) > 0;
            const inferredTotalPages = vendorRows.length === requestedPerPage ? currentPage + 1 : currentPage;
            console.log('Vendors API response:', response);

            return {
                vendors: vendorRows,
                currentPage,
                perPage: requestedPerPage,
                totalPages: response.total_pages || (hasExplicitTotal
                    ? Math.ceil(Number(response.total) / requestedPerPage)
                    : inferredTotalPages),
                total: hasExplicitTotal ? Number(response.total) : vendorRows.length,
                message: response.message || '',
            };
        } catch (error) {
            console.error('Error fetching vendors:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunk for searching vendors
export const searchVendors = createAsyncThunk(
    'vendors/searchVendors',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await fetchVendorsAPI(params);
            const requestedPerPage = Number(params.per_page) || 12;
            const vendorRows = Array.isArray(response.data) ? response.data : [];
            const currentPage = Number(response.current_page) || Number(params.page) || 1;
            const hasExplicitTotal = Number.isFinite(Number(response.total)) && Number(response.total) > 0;
            const inferredTotalPages = vendorRows.length === requestedPerPage ? currentPage + 1 : currentPage;
            console.log('Search Vendors API response:', response);

            return {
                vendors: vendorRows,
                currentPage,
                perPage: requestedPerPage,
                totalPages: response.total_pages || (hasExplicitTotal
                    ? Math.ceil(Number(response.total) / requestedPerPage)
                    : inferredTotalPages),
                total: hasExplicitTotal ? Number(response.total) : vendorRows.length,
                message: response.message || '',
            };
        } catch (error) {
            console.error('Error searching vendors:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    // Vendors data
    data: [],
    loading: false,
    error: null,

    // Pagination
    currentPage: 1,
    perPage: 12,
    totalPages: 1,
    total: 0,

    // Search
    searchTerm: '',
    isSearching: false,

    // Filters
    filters: {
        country: '',
        state: '',
        city: '',
        company_name: '',
    },

    // Selected vendor for details
    selectedVendor: null,
    selectedVendorLoading: false,
    selectedVendorError: null,
};

const vendorSlice = createSlice({
    name: 'vendors',
    initialState,
    reducers: {
        // Clear error
        clearVendorError: (state) => {
            state.error = null;
        },

        // Reset vendors state
        resetVendors: (state) => {
            state.data = [];
            state.loading = false;
            state.error = null;
            state.currentPage = 1;
            state.totalPages = 1;
            state.total = 0;
        },

        // Set search term
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },

        // Set filters
        setFilters: (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },

        // Clear filters
        clearFilters: (state) => {
            state.filters = {
                country: '',
                state: '',
                city: '',
                company_name: '',
            };
            state.searchTerm = '';
        },

        // Set current page
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },

        // Set per page
        setPerPage: (state, action) => {
            state.perPage = action.payload;
            state.currentPage = 1; // Reset to first page when changing per page
        },

        // Set selected vendor
        setSelectedVendor: (state, action) => {
            state.selectedVendor = action.payload;
        },

        // Clear selected vendor
        clearSelectedVendor: (state) => {
            state.selectedVendor = null;
            state.selectedVendorError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch vendors
            .addCase(fetchVendors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.vendors;
                state.currentPage = action.payload.currentPage;
                state.perPage = action.payload.perPage;
                state.totalPages = action.payload.totalPages;
                state.total = action.payload.total;
                state.error = null;
            })
            .addCase(fetchVendors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = [];
            })

            // Search vendors
            .addCase(searchVendors.pending, (state) => {
                state.loading = true;
                state.isSearching = true;
                state.error = null;
            })
            .addCase(searchVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.isSearching = false;
                state.data = action.payload.vendors;
                state.currentPage = action.payload.currentPage;
                state.perPage = action.payload.perPage;
                state.totalPages = action.payload.totalPages;
                state.total = action.payload.total;
                state.error = null;
            })
            .addCase(searchVendors.rejected, (state, action) => {
                state.loading = false;
                state.isSearching = false;
                state.error = action.payload;
                state.data = [];
            });
    },
});

// Export actions
export const {
    clearVendorError,
    resetVendors,
    setSearchTerm,
    setFilters,
    clearFilters,
    setCurrentPage,
    setPerPage,
    setSelectedVendor,
    clearSelectedVendor,
} = vendorSlice.actions;

// Selectors
export const selectVendors = (state) => state.vendors.data;
export const selectVendorsLoading = (state) => state.vendors.loading;
export const selectVendorsError = (state) => state.vendors.error;
export const selectCurrentPage = (state) => state.vendors.currentPage;
export const selectPerPage = (state) => state.vendors.perPage;
export const selectTotalPages = (state) => state.vendors.totalPages;
export const selectTotal = (state) => state.vendors.total;
export const selectSearchTerm = (state) => state.vendors.searchTerm;
export const selectIsSearching = (state) => state.vendors.isSearching;
export const selectFilters = (state) => state.vendors.filters;
export const selectSelectedVendor = (state) => state.vendors.selectedVendor;
export const selectSelectedVendorLoading = (state) => state.vendors.selectedVendorLoading;
export const selectSelectedVendorError = (state) => state.vendors.selectedVendorError;

// Helper selector to get vendor by id
export const selectVendorById = (state, vendorId) => {
    return state.vendors.data.find(vendor => String(vendor.vendor_id) === String(vendorId));
};

export default vendorSlice.reducer;
