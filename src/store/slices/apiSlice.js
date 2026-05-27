import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';
export const image_path = `${API_BASE_URL.replace('/api', '')}/assets/img/`;

// Vendor registration API call
export const submitVendorRegistration = createAsyncThunk(
    'api/submitVendorRegistration',
    async (formDataPayload, { rejectWithValue }) => {
        console.log("Form Data Payload:", formDataPayload);
        return;
        try {
            const response = await axios.post(`${API_BASE_URL}/submitVendorRegistration`, formDataPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },

            });
            return response.data;
        } catch (error) {
            console.error('Vendor registration failed:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Generic API call thunk
export const makeApiCall = createAsyncThunk(
    'api/makeApiCall',
    async ({ endpoint, method = 'GET', data = null, requireAuth = false }, { getState, rejectWithValue }) => {
        try {
            const config = {
                method,
                url: `${API_BASE_URL}${endpoint}`,
            };

            // Add data for POST/PUT requests
            if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                config.data = data;
            }

            // Add authorization header if required
            if (requireAuth) {
                const token = getState().auth.token;
                if (!token) {
                    throw new Error('Authentication required');
                }
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`API call failed for ${endpoint}:`, error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const getallDeliveryType = createAsyncThunk(
    'api/getallDeliveryType',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/delivery-charges/getallDeliveryType`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch delivery types:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const subCategories = createAsyncThunk(
    'api/subCategories',
    async (category_id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getSubcategories?category_id=${category_id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch subcategories:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch all brands
export const fetchAllBrands = createAsyncThunk(
    'api/fetchAllBrands',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getAllBrands`);
            // console.log('Brands API response:', response.data);

            // Extract data from the API response structure
            const brandData = response.data?.data || response.data;
            return Array.isArray(brandData) ? brandData : [];
        } catch (error) {
            console.error('Failed to fetch brands:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



const initialState = {
    loading: false,
    error: null,
    lastResponse: null,
    deliveryTypes: {
        data: null,
        loading: false,
        error: null,
    },
    subCategories: {
        data: null,
        loading: false,
        error: null,
    },
    brands: {
        data: null,
        loading: false,
        error: null,
    },
};

const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {
        clearApiError: (state) => {
            state.error = null;
        },
        resetApiState: (state) => {
            state.loading = false;
            state.error = null;
            state.lastResponse = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(makeApiCall.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(makeApiCall.fulfilled, (state, action) => {
                state.loading = false;
                state.lastResponse = action.payload;
                state.error = null;
            })
            .addCase(makeApiCall.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitVendorRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitVendorRegistration.fulfilled, (state, action) => {
                state.loading = false;
                state.lastResponse = action.payload;
                state.error = null;
            })
            .addCase(submitVendorRegistration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getallDeliveryType.pending, (state) => {
                state.deliveryTypes.loading = true;
                state.deliveryTypes.error = null;
            })
            .addCase(getallDeliveryType.fulfilled, (state, action) => {
                state.deliveryTypes.loading = false;
                state.deliveryTypes.data = action.payload;
                state.deliveryTypes.error = null;
            })
            .addCase(getallDeliveryType.rejected, (state, action) => {
                state.deliveryTypes.loading = false;
                state.deliveryTypes.error = action.payload;
            })
            .addCase(subCategories.pending, (state) => {
                state.subCategories.loading = true;
                state.subCategories.data = null; // Clear old data when fetching new subcategories
                state.subCategories.error = null;
            })
            .addCase(subCategories.fulfilled, (state, action) => {
                state.subCategories.loading = false;
                state.subCategories.data = action.payload;
                state.subCategories.error = null;
            })
            .addCase(subCategories.rejected, (state, action) => {
                state.subCategories.loading = false;
                state.subCategories.error = action.payload;
            })
            .addCase(fetchAllBrands.pending, (state) => {
                state.brands.loading = true;
                state.brands.error = null;
            })
            .addCase(fetchAllBrands.fulfilled, (state, action) => {
                state.brands.loading = false;
                state.brands.data = action.payload;
                state.brands.error = null;
            })
            .addCase(fetchAllBrands.rejected, (state, action) => {
                state.brands.loading = false;
                state.brands.error = action.payload;
                // Keep existing brand data if available (important for offline support)
            });
    },
});

export const { clearApiError, resetApiState } = apiSlice.actions;

// Selectors
export const selectApiLoading = (state) => state.api.loading;
export const selectApiError = (state) => state.api.error;
export const selectLastApiResponse = (state) => state.api.lastResponse;

// Delivery Types Selectors
export const selectDeliveryTypes = (state) => state.api.deliveryTypes.data;
export const selectDeliveryTypesLoading = (state) => state.api.deliveryTypes.loading;
export const selectDeliveryTypesError = (state) => state.api.deliveryTypes.error;

// SubCategories Selectors
export const selectSubCategories = (state) => state.api.subCategories.data;
export const selectSubCategoriesLoading = (state) => state.api.subCategories.loading;
export const selectSubCategoriesError = (state) => state.api.subCategories.error;

// Brands Selectors
export const selectBrands = (state) => state.api.brands.data;
export const selectBrandsLoading = (state) => state.api.brands.loading;
export const selectBrandsError = (state) => state.api.brands.error;

// Export constants for use in components
export { API_BASE_URL };

export default apiSlice.reducer;