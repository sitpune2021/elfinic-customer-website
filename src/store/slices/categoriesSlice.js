import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://admin.elfinic.com/api';

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
    'getAllCategories',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching categories from:', `${API_BASE_URL}/getAllCategories`);
            const response = await axios.get(`${API_BASE_URL}/getAllCategories`, {
                timeout: 10000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Extract data from the API response structure
            const categoryData = response.data?.data || response.data;
            console.log('Categories API response:', categoryData);

            if (!Array.isArray(categoryData)) {
                console.warn('Categories API returned non-array data:', categoryData);
                return [];
            }

            return categoryData;
        } catch (error) {
            console.error('Error fetching categories:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url
            });
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearCategoriesError: (state) => {
            state.error = null;
        },
        resetCategories: (state) => {
            state.data = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = [];
            });
    },
});

export const { clearCategoriesError, resetCategories } = categoriesSlice.actions;

// Selectors
export const selectCategories = (state) => state.categories.data;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;

// Helper selector to get category name by id
export const selectCategoryById = (state, categoryId) => {
    return state.categories.data.find(cat => String(cat.id) === String(categoryId));
};

export const selectCategoryNameById = (state, categoryId) => {
    const category = selectCategoryById(state, categoryId);
    return category ? category.name : '';
};

export default categoriesSlice.reducer;