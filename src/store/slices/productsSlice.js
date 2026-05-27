import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://admin.elfinic.com/api';

// Async thunk for fetching products
// ❌ REMOVED: getAllProducts API - causing integration issues
export const fetchProducts = createAsyncThunk(
    'getAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            // const response = await axios.get(`${API_BASE_URL}/getAllProducts`);
            // console.log('Products API response:', response.data);

            // Extract data from the API response structure
            // const productData = response.data?.data || response.data;
            // return Array.isArray(productData) ? productData : [];

            // Return empty array instead
            return [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching products by section
// Params: featured, best_seller, trending, discounted, recommended
export const fetchProductsBySection = createAsyncThunk(
    'products/fetchBySection',
    async (params = {}, { rejectWithValue }) => {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            if (params.show_section) {
                queryParams.append('show_section', params.show_section);
            }

            const response = await axios.get(`${API_BASE_URL}/getProductsList?${queryParams.toString()}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Products by section API response:', response.data);

            // Extract data from the API response structure
            const productData = response.data?.data || response.data;
            return {
                products: Array.isArray(productData) ? productData : [],
                section: params.show_section || 'all',
            };
        } catch (error) {
            console.error('Error fetching products by section:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching single product
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getProduct/${productId}`);
            console.log('Product detail API response:', response.data);

            const productData = response.data?.data || response.data;
            return productData;
        } catch (error) {
            console.error('Error fetching product details:', error);
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    data: [],
    loading: false,
    error: null,
    selectedProduct: null,
    selectedProductLoading: false,
    selectedProductError: null,
    // Section-based products
    sectionProducts: {},  // Will store products by section: { trending: [], featured: [], etc. }
    sectionLoading: {},   // Loading state for each section
    sectionError: {},     // Error state for each section
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductsError: (state) => {
            state.error = null;
        },
        clearSelectedProductError: (state) => {
            state.selectedProductError = null;
        },
        resetProducts: (state) => {
            state.data = [];
            state.loading = false;
            state.error = null;
        },
        resetSelectedProduct: (state) => {
            state.selectedProduct = null;
            state.selectedProductLoading = false;
            state.selectedProductError = null;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        clearSectionError: (state, action) => {
            const section = action.payload;
            if (section && state.sectionError[section]) {
                delete state.sectionError[section];
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = [];
            })
            // Fetch single product
            .addCase(fetchProductById.pending, (state) => {
                state.selectedProductLoading = true;
                state.selectedProductError = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.selectedProductLoading = false;
                state.selectedProduct = action.payload;
                state.selectedProductError = null;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.selectedProductLoading = false;
                state.selectedProductError = action.payload;
                state.selectedProduct = null;
            })
            // Fetch products by section
            .addCase(fetchProductsBySection.pending, (state, action) => {
                const section = action.meta.arg?.show_section || 'all';
                state.sectionLoading[section] = true;
                state.sectionError[section] = null;
            })
            .addCase(fetchProductsBySection.fulfilled, (state, action) => {
                const { products, section } = action.payload;
                state.sectionLoading[section] = false;
                state.sectionProducts[section] = products;
                state.sectionError[section] = null;
            })
            .addCase(fetchProductsBySection.rejected, (state, action) => {
                const section = action.meta.arg?.show_section || 'all';
                state.sectionLoading[section] = false;
                state.sectionError[section] = action.payload;
                // Keep existing data if available (important for offline support)
                if (!state.sectionProducts[section] || state.sectionProducts[section].length === 0) {
                    state.sectionProducts[section] = [];
                }
            });
    },
});

export const {
    clearProductsError,
    clearSelectedProductError,
    resetProducts,
    resetSelectedProduct,
    setSelectedProduct,
    clearSectionError,
} = productsSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.data;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectSelectedProductLoading = (state) => state.products.selectedProductLoading;
export const selectSelectedProductError = (state) => state.products.selectedProductError;

// Section-based selectors
export const selectSectionProducts = (state, section) => state.products.sectionProducts[section] || [];
export const selectSectionLoading = (state, section) => state.products.sectionLoading[section] || false;
export const selectSectionError = (state, section) => state.products.sectionError[section] || null;
export const selectAllSectionProducts = (state) => state.products.sectionProducts;

// Helper selector to get product by id
export const selectProductById = (state, productId) => {
    return state.products.data.find(product => String(product.id) === String(productId));
};

export default productsSlice.reducer;