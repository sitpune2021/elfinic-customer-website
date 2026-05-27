import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';
export const image_path = `${API_BASE_URL.replace('/api', '')}/assets/img/`;



export const getSlider = createAsyncThunk(
    'banner/getSlider',
    async (slidertype, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getBannersByType?type=${slidertype}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch slider banners:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    loading: {},
    error: {},
    responses: {},
};

const bannerSlice = createSlice({
    name: 'banner',
    initialState,
    reducers: {
        clearApiError: (state, action) => {
            const sliderType = action.payload;
            if (sliderType) {
                state.error[sliderType] = null;
            } else {
                state.error = {};
            }
        },
        resetApiState: (state, action) => {
            const sliderType = action.payload;
            if (sliderType) {
                state.loading[sliderType] = false;
                state.error[sliderType] = null;
                state.responses[sliderType] = null;
            } else {
                state.loading = {};
                state.error = {};
                state.responses = {};
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSlider.pending, (state, action) => {
                const sliderType = action.meta.arg;
                state.loading[sliderType] = true;
                state.error[sliderType] = null;
            })
            .addCase(getSlider.fulfilled, (state, action) => {
                const sliderType = action.meta.arg;
                state.loading[sliderType] = false;
                state.responses[sliderType] = action.payload;
                state.error[sliderType] = null;
            })
            .addCase(getSlider.rejected, (state, action) => {
                const sliderType = action.meta.arg;
                state.loading[sliderType] = false;
                state.error[sliderType] = action.payload;
            })

    },
});

export const { clearApiError, resetApiState } = bannerSlice.actions;

// Selectors with slider type parameter
export const selectApiLoading = (sliderType) => (state) => state.banner.loading[sliderType] || false;
export const selectApiError = (sliderType) => (state) => state.banner.error[sliderType] || null;
export const selectApiResponse = (sliderType) => (state) => state.banner.responses[sliderType] || null;

// Legacy selector for backward compatibility (returns all responses)
export const selectLastApiResponse = (state) => state.banner.responses;

// Export constants for use in components
export { API_BASE_URL };
export default bannerSlice.reducer;