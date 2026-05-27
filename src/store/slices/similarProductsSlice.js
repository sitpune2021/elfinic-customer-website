import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSimilarProducts } from '../../services/productService';

// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
    'similarProducts/fetch',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await getSimilarProducts(productId);
            if (response.status === 'success') {
                return response.data;
            }
            return rejectWithValue(response.message || 'Failed to fetch similar products');
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch similar products');
        }
    }
);

const initialState = {
    products: [],
    loading: false,
    error: null,
    productId: null,
};

const similarProductsSlice = createSlice({
    name: 'similarProducts',
    initialState,
    reducers: {
        clearSimilarProducts: (state) => {
            state.products = [];
            state.loading = false;
            state.error = null;
            state.productId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSimilarProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload || [];
                state.productId = action.meta.arg;
                state.error = null;
            })
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An error occurred';
                state.products = [];
            });
    },
});

export const { clearSimilarProducts } = similarProductsSlice.actions;

// Selectors
export const selectSimilarProducts = (state) => state.similarProducts.products;
export const selectSimilarProductsLoading = (state) => state.similarProducts.loading;
export const selectSimilarProductsError = (state) => state.similarProducts.error;

export default similarProductsSlice.reducer;
