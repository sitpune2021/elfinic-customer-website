import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

// Helper function to get user safely
const getUser = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return user;
    } catch (error) {
        return null;
    }
};

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const user = getUser();

            if (!token || !user?.id) {
                return { data: [] };
            }

            const response = await axios.get(`${API_BASE_URL}/getWishlist`, {
                params: { user_id: user.id },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Wishlist API response:", response.data);

            // Extract product IDs - handle both nested product objects and direct product_id
            const productIds = response.data?.data?.map(item => {
                // If the response has a nested product object, use product.id
                // Otherwise, use product_id directly
                const id = item.product?.id || item.product_id || item.id;
                return String(id);
            }) || [];

            console.log("Extracted product IDs for wishlist:", productIds);

            // Store in localStorage
            localStorage.setItem('wishlist', JSON.stringify(productIds));

            return response.data;
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            localStorage.setItem('wishlist', JSON.stringify([]));
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// Async thunk for adding to wishlist
export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (productId, { getState, dispatch, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            if (!token) {
                throw new Error('Authentication required');
            }

            const user = getUser();
            if (!user?.id) {
                throw new Error('User information not found');
            }

            const response = await axios.post(
                `${API_BASE_URL}/wishlist/add`,
                {
                    user_id: user.id,
                    product_id: productId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Add to wishlist response:", response.data);

            // Refetch wishlist to get updated full data
            dispatch(fetchWishlist());

            return String(productId);
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async thunk for removing from wishlist
export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (productId, { getState, dispatch, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            if (!token) {
                throw new Error('Authentication required');
            }

            const user = getUser();
            if (!user?.id) {
                throw new Error('User information not found');
            }

            const response = await axios.post(
                `${API_BASE_URL}/removeFromWishlist`,
                {
                    user_id: user.id,
                    product_id: productId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Remove from wishlist response:", response.data);

            // Refetch wishlist to get updated full data
            dispatch(fetchWishlist());

            return String(productId);
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Get initial wishlist from localStorage
const getInitialWishlist = () => {
    try {
        const stored = localStorage.getItem('wishlist');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        return [];
    }
};

const initialState = {
    items: getInitialWishlist(), // This will be product IDs for localStorage compatibility
    fullWishlistData: [], // This will store the full wishlist data from API
    loading: false,
    error: null,
    addLoading: false,
    removeLoading: false,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlistError: (state) => {
            state.error = null;
        },
        resetWishlist: (state) => {
            state.items = [];
            state.fullWishlistData = [];
            state.loading = false;
            state.error = null;
            state.addLoading = false;
            state.removeLoading = false;
            localStorage.setItem('wishlist', JSON.stringify([]));
        },
        syncWishlistFromStorage: (state) => {
            state.items = getInitialWishlist();
        },
        toggleWishlistItem: (state, action) => {
            const productId = String(action.payload);
            const index = state.items.indexOf(productId);

            if (index > -1) {
                state.items.splice(index, 1);
            } else {
                state.items.push(productId);
            }

            // Update localStorage
            localStorage.setItem('wishlist', JSON.stringify(state.items));
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                // Store full wishlist data
                state.fullWishlistData = action.payload?.data || [];
                // Extract product IDs - handle both nested product objects and direct product_id
                const productIds = action.payload?.data?.map(item => {
                    const id = item.product?.id || item.product_id || item.id;
                    return String(id);
                }) || [];
                state.items = productIds;
                console.log("Wishlist items updated in Redux:", productIds);
                state.error = null;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to wishlist
            .addCase(addToWishlist.pending, (state) => {
                state.addLoading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.addLoading = false;
                const productId = action.payload;
                // Ensure state.items is an array
                if (!Array.isArray(state.items)) {
                    state.items = [];
                }
                if (!state.items.includes(productId)) {
                    state.items.push(productId);
                    localStorage.setItem('wishlist', JSON.stringify(state.items));
                }
                state.error = null;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.addLoading = false;
                state.error = action.payload;
            })
            // Remove from wishlist
            .addCase(removeFromWishlist.pending, (state) => {
                state.removeLoading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.removeLoading = false;
                const productId = action.payload;
                // Ensure state.items is an array
                if (!Array.isArray(state.items)) {
                    state.items = [];
                } else {
                    state.items = state.items.filter(id => id !== productId);
                    localStorage.setItem('wishlist', JSON.stringify(state.items));
                }
                state.error = null;
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.removeLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearWishlistError,
    resetWishlist,
    syncWishlistFromStorage,
    toggleWishlistItem,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistFullData = (state) => state.wishlist.fullWishlistData;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectWishlistAddLoading = (state) => state.wishlist.addLoading;
export const selectWishlistRemoveLoading = (state) => state.wishlist.removeLoading;

// Helper selector to check if product is in wishlist
export const selectIsInWishlist = (state, productId) => {
    return Array.isArray(state.wishlist.items) && state.wishlist.items.includes(String(productId));
};

export default wishlistSlice.reducer;