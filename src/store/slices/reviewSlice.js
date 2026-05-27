import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

// Async thunk to submit a review
export const submitReview = createAsyncThunk(
    'review/submitReview',
    async (reviewData, { rejectWithValue, getState }) => {
        try {
            const token = localStorage.getItem('token');

            // Get user_id from Redux state if not provided
            let userId = reviewData.user_id;
            if (!userId) {
                const state = getState();
                userId = state.auth?.user?.id || localStorage.getItem('userId') || '';
            }

            if (!token) {
                console.error('No token found in localStorage');
                return rejectWithValue({
                    message: 'Authentication token not found. Please log in.'
                });
            }

            // Build FormData
            const formData = new FormData();
            formData.append('user_id', userId);
            formData.append('product_id', reviewData.productId);
            formData.append('rating', String(reviewData.rating));
            formData.append('title', reviewData.title);
            formData.append('content', reviewData.content);

            // Append image
            if (reviewData.image && reviewData.image.length > 0) {
                reviewData.image.forEach((img) => {
                    formData.append('image', img.file, img.file.name);
                });
            }

            // Append video
            if (reviewData.video && reviewData.video.length > 0) {
                reviewData.video.forEach((vid) => {
                    formData.append('video', vid.file, vid.file.name);
                });
            }

            console.log('Submitting review with token:', token ? 'Token exists' : 'No token');
            console.log('Review data:', {
                user_id: userId,
                productId: reviewData.productId,
                rating: reviewData.rating,
                title: reviewData.title,
                content: reviewData.content,
                image: reviewData.image?.length || 0,
                video: reviewData.video?.length || 0
            });

            const response = await axios.post(
                `${API_BASE_URL}/submitReview`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Review submitted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to submit review:', error);
            const message = error.response?.data?.message || error.message || 'Failed to submit review. Please try again.';
            return rejectWithValue({
                message,
                error: error.response?.data || error.message
            });
        }
    }
);

const initialState = {
    submitting: false,
    success: false,
    error: null,
    lastSubmittedReview: null,
};

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        resetReviewState: (state) => {
            state.submitting = false;
            state.success = false;
            state.error = null;
        },
        clearReviewError: (state) => {
            state.error = null;
        },
        clearReviewSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitReview.pending, (state) => {
                state.submitting = true;
                state.success = false;
                state.error = null;
            })
            .addCase(submitReview.fulfilled, (state, action) => {
                state.submitting = false;
                state.success = true;
                state.error = null;
                state.lastSubmittedReview = action.payload;
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.submitting = false;
                state.success = false;
                state.error = action.payload?.message || 'Failed to submit review';
            });
    },
});

export const {
    resetReviewState,
    clearReviewError,
    clearReviewSuccess
} = reviewSlice.actions;

// Selectors
export const selectReviewSubmitting = (state) => state.review.submitting;
export const selectReviewSuccess = (state) => state.review.success;
export const selectReviewError = (state) => state.review.error;
export const selectLastSubmittedReview = (state) => state.review.lastSubmittedReview;

export default reviewSlice.reducer;
