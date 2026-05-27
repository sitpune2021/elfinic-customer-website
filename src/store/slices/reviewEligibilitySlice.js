import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

// Async thunk to check review eligibility
export const checkReviewEligibility = createAsyncThunk(
    'reviewEligibility/checkEligibility',
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error('No token found in localStorage');
                return rejectWithValue({
                    productId,
                    message: 'Authentication token not found. Please log in.'
                });
            }
            
            console.log('Token from localStorage:', token ? 'Token exists' : 'No token');
            console.log('Request details:', {
                url: `${API_BASE_URL}/reviews/check-eligibility`,
                userId,
                productId,
                hasToken: !!token
            });
            
            const response = await axios.post(
                `${API_BASE_URL}/reviews/check-eligibility`,
                {
                    user_id: userId,
                    product_id: productId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            
           
            return {
                productId,
                ...response.data
            };
        } catch (error) {
            console.error('Failed to check review eligibility:', error);
            return rejectWithValue({
                productId,
                message: error.response?.data?.message || error.message
            });
        }
    }
);

const initialState = {
    // Store eligibility by productId for caching
    eligibilityByProduct: {},
    loading: false,
    error: null,
};

const reviewEligibilitySlice = createSlice({
    name: 'reviewEligibility',
    initialState,
    reducers: {
        clearEligibility: (state) => {
            state.eligibilityByProduct = {};
            state.error = null;
        },
        clearEligibilityForProduct: (state, action) => {
            const productId = action.payload;
            delete state.eligibilityByProduct[productId];
        },
        clearEligibilityError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkReviewEligibility.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkReviewEligibility.fulfilled, (state, action) => {
                state.loading = false;
                const { productId, status, eligible, message } = action.payload;
                state.eligibilityByProduct[productId] = {
                    status,
                    eligible,
                    message,
                    checked: true,
                };
                state.error = null;
            })
            .addCase(checkReviewEligibility.rejected, (state, action) => {
                state.loading = false;
                const { productId, message } = action.payload || {};
                if (productId) {
                    state.eligibilityByProduct[productId] = {
                        status: false,
                        eligible: false,
                        message: message || 'Failed to check eligibility',
                        checked: true,
                        error: true,
                    };
                }
                state.error = action.payload?.message || 'Failed to check eligibility';
            });
    },
});

export const { 
    clearEligibility, 
    clearEligibilityForProduct, 
    clearEligibilityError 
} = reviewEligibilitySlice.actions;

// Selectors
export const selectReviewEligibilityLoading = (state) => state.reviewEligibility.loading;
export const selectReviewEligibilityError = (state) => state.reviewEligibility.error;
export const selectEligibilityByProduct = (state) => state.reviewEligibility.eligibilityByProduct;

// Selector to get eligibility for a specific product
export const selectProductEligibility = (state, productId) => 
    state.reviewEligibility.eligibilityByProduct[productId] || null;

// Selector to check if user is eligible to review a specific product
export const selectIsEligibleToReview = (state, productId) => {
    const eligibility = state.reviewEligibility.eligibilityByProduct[productId];
    return eligibility?.eligible ?? false;
};

// Selector to check if eligibility has been checked for a product
export const selectHasCheckedEligibility = (state, productId) => {
    const eligibility = state.reviewEligibility.eligibilityByProduct[productId];
    return eligibility?.checked ?? false;
};

export default reviewEligibilitySlice.reducer;
