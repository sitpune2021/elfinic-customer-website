import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://admin.elfinic.com/api';

// Async thunk to fetch product reviews
export const fetchProductReviews = createAsyncThunk(
    'productReviews/fetchProductReviews',
    async ({ productId, page = 1, limit = 10, sort = 'latest', rating = null }, { rejectWithValue }) => {
        try {
            let url = `${API_BASE_URL}/getReviewByProductId?product_id=${productId}&page=${page}&limit=${limit}&sort=${sort}`;
            
            if (rating) {
                url += `&rating=${rating}`;
            }
            
            const response = await axios.get(url);
            
            if (response.data.status === 'success') {
                return {
                    productId,
                    ...response.data.data,
                    currentPage: page,
                    limit,
                    sort,
                    rating
                };
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch reviews');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch reviews');
        }
    }
);

const initialState = {
    // Store reviews by productId
    reviewsByProduct: {},
    loading: false,
    error: null,
};

const productReviewsSlice = createSlice({
    name: 'productReviews',
    initialState,
    reducers: {
        clearReviews: (state, action) => {
            const { productId } = action.payload;
            if (productId) {
                delete state.reviewsByProduct[productId];
            } else {
                state.reviewsByProduct = {};
            }
        },
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                const { productId, ratingSummary, reviews, currentPage, limit, sort, rating } = action.payload;
                
                state.reviewsByProduct[productId] = {
                    ratingSummary,
                    reviews,
                    currentPage,
                    limit,
                    sort,
                    rating: rating || null,
                    lastFetched: Date.now(),
                };
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch reviews';
            });
    },
});

export const { clearReviews, resetError } = productReviewsSlice.actions;

// Selectors
export const selectProductReviews = (state, productId) => 
    state.productReviews.reviewsByProduct[productId] || null;

export const selectReviewsLoading = (state) => state.productReviews.loading;

export const selectReviewsError = (state) => state.productReviews.error;

export const selectRatingSummary = (state, productId) => 
    state.productReviews.reviewsByProduct[productId]?.ratingSummary || null;

export const selectReviewsList = (state, productId) => 
    state.productReviews.reviewsByProduct[productId]?.reviews || [];

export const selectReviewsCurrentPage = (state, productId) => 
    state.productReviews.reviewsByProduct[productId]?.currentPage || 1;

export const selectReviewsFilters = (state, productId) => ({
    sort: state.productReviews.reviewsByProduct[productId]?.sort || 'latest',
    rating: state.productReviews.reviewsByProduct[productId]?.rating || null,
    limit: state.productReviews.reviewsByProduct[productId]?.limit || 10,
});

export default productReviewsSlice.reducer;
