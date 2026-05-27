import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

// Helper function to get selected variant from cart item
const getSelectedVariantForItem = (item) => {
    if (!item?.product?.variants || item.product.variants.length === 0) {
        return null;
    }
    // If variant_id is in cart item, find the matching variant
    if (item.variant_id) {
        return item.product.variants.find(v => v.id === item.variant_id) || null;
    }
    // If selected_variant is directly in cart item
    if (item.selected_variant) {
        return item.selected_variant;
    }
    // If variant name/string is stored
    if (item.variant) {
        return item.product.variants.find(v => v.variant === item.variant) || { variant: item.variant };
    }
    // Check if product has only one variant (auto-select)
    if (item.product.variants.length === 1) {
        return item.product.variants[0];
    }
    return null;
};

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
    'viewCart',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No authentication token found, skipping cart fetch');
                return [];
            }

            const userString = localStorage.getItem('user');
            if (!userString) {
                console.log('No user data found, skipping cart fetch');
                return [];
            }

            let user;
            try {
                user = JSON.parse(userString);
            } catch (parseError) {
                console.error('Invalid user data in localStorage:', parseError);
                return [];
            }

            if (!user || !user.id) {
                console.log('Invalid user information, skipping cart fetch');
                return [];
            }

            const response = await axios.get(`${API_BASE_URL}/viewCart`, {
                params: { user_id: user.id },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching cart:', error);
            // Don't throw error for missing user info in production
            if (error.message.includes('User information not found') ||
                error.message.includes('No authentication token found')) {
                return [];
            }
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/add',
    async ({ product_id, quantity = 1, variants_id = null }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const userString = localStorage.getItem('user');
            if (!userString) {
                throw new Error('No user data found');
            }

            let user;
            try {
                user = JSON.parse(userString);
            } catch (parseError) {
                throw new Error('Invalid user data in localStorage');
            }

            if (!user || !user.id) {
                throw new Error('User information not found');
            }

            const response = await axios.post(`${API_BASE_URL}/cart/add`, {
                user_id: user.id,
                product_id,
                quantity,
                variants_id // nullable - will be null for simple products
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'updateCartItem',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.put(`${API_BASE_URL}/updateCartItem/${itemId}`, {
                quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'removeFromCart',
    async (itemId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.delete(`${API_BASE_URL}/removeFromCart`, {
                params: {
                    cart_id: itemId
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Return the item ID so we can remove it from state
            return itemId;
        } catch (error) {
            console.error('Error removing from cart:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const increaseCartQuantity = createAsyncThunk(
    'cart/increase',
    async ({ product_id, quantity = 1, variants_id = null }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                throw new Error('User information not found');
            }

            const response = await axios.post(`${API_BASE_URL}/cart/add`, {
                user_id: user.id,
                product_id,
                quantity,
                variants_id // nullable - will be null for simple products
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return { product_id, quantity, response: response.data };
        } catch (error) {
            console.error('Error increasing cart quantity:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const decreaseCartQuantity = createAsyncThunk(
    'cart/decrease',
    async ({ product_id, quantity = 1 }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                throw new Error('User information not found');
            }

            const response = await axios.post(`${API_BASE_URL}/cart/decrease`, {
                user_id: user.id,
                product_id,
                quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return { product_id, quantity, response: response.data };
        } catch (error) {
            console.error('Error decreasing cart quantity:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Initial state
const initialState = {
    items: [],
    loading: false,
    error: null,
    totalItems: 0,
    totalPrice: 0,
    // Local cart for non-authenticated users
    localCart: JSON.parse(localStorage.getItem('cart')) || []
};

// Cart slice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Local cart operations for non-authenticated users
        addToLocalCart: (state, action) => {
            const productId = action.payload;
            if (!state.localCart.includes(productId)) {
                state.localCart.push(productId);
                localStorage.setItem('cart', JSON.stringify(state.localCart));
            }
        },
        removeFromLocalCart: (state, action) => {
            const productId = action.payload;
            state.localCart = state.localCart.filter(id => id !== productId);
            localStorage.setItem('cart', JSON.stringify(state.localCart));
        },
        clearLocalCart: (state) => {
            state.localCart = [];
            localStorage.removeItem('cart');
        },
        clearError: (state) => {
            state.error = null;
        },
        // Calculate totals
        calculateTotals: (state) => {
            // ✅ Total products (quantity ignore)
            state.totalItems = state.items.length;

            // ✅ Total price (quantity वापरून)
            state.totalPrice = state.items.reduce((total, item) => {
                const quantity = parseInt(item.quantity) || 0;
                let price = 0;

                // 1️⃣ Variant price
                const selectedVariant = getSelectedVariantForItem(item);
                if (selectedVariant && selectedVariant.variant_price) {
                    const variantPrice = parseFloat(selectedVariant.variant_price);
                    if (!isNaN(variantPrice) && variantPrice > 0) {
                        return total + (variantPrice * quantity);
                    }
                }

                // 2️⃣ total_price (price - discount already calculated)
                if (item.product?.total_price) {
                    const cleanPrice =
                        typeof item.product.total_price === "string"
                            ? item.product.total_price.replace(/,/g, "")
                            : item.product.total_price;

                    const totalPrice = parseFloat(cleanPrice);
                    if (!isNaN(totalPrice) && totalPrice > 0) {
                        return total + (totalPrice * quantity);
                    }
                }

                // 3️⃣ Fallback: price - discount_amount
                const regularPrice = parseFloat(item.product?.price) || 0;
                const discountAmount = parseFloat(item.product?.discount_price) || 0;
                price = regularPrice > 0 ? regularPrice - discountAmount : 0;

                return total + (price * quantity);
            }, 0);
        },
        // Optimistic updates
        optimisticIncreaseQuantity: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(item => String(item.product_id) === String(productId));
            if (item) {
                item.quantity += 1;
                cartSlice.caseReducers.calculateTotals(state);
            }
        },
        optimisticDecreaseQuantity: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(item => String(item.product_id) === String(productId));
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                cartSlice.caseReducers.calculateTotals(state);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                cartSlice.caseReducers.calculateTotals(state);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add to cart
            .addCase(addToCart.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                // Optimistic update - add temporary item immediately for instant UI feedback
                const productId = action.meta.arg.product_id;
                const quantity = action.meta.arg.quantity || 1;
                const existingIndex = state.items.findIndex(
                    item => String(item.product_id) === String(productId)
                );
                if (existingIndex === -1) {
                    // Add temporary item with _optimistic flag
                    state.items.push({
                        product_id: productId,
                        quantity: quantity,
                        _optimistic: true // Flag to identify optimistic entries
                    });
                    cartSlice.caseReducers.calculateTotals(state);
                }
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                // Replace optimistic item with real data from server
                if (action.payload && action.payload.data) {
                    const newItem = action.payload.data;
                    // Remove optimistic entry first
                    state.items = state.items.filter(
                        item => !(item._optimistic && String(item.product_id) === String(newItem.product_id))
                    );
                    // Check if item already exists (non-optimistic)
                    const existingIndex = state.items.findIndex(
                        item => String(item.product_id) === String(newItem.product_id)
                    );
                    if (existingIndex !== -1) {
                        // Update existing item
                        state.items[existingIndex] = newItem;
                    } else {
                        // Add new item
                        state.items.push(newItem);
                    }
                    cartSlice.caseReducers.calculateTotals(state);
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Remove optimistic entry on failure
                const productId = action.meta.arg.product_id;
                state.items = state.items.filter(
                    item => !(item._optimistic && String(item.product_id) === String(productId))
                );
                cartSlice.caseReducers.calculateTotals(state);
            })

            // Update cart item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                // Update the specific item in the cart
                const updatedItem = action.payload.data;
                const index = state.items.findIndex(item => item.id === updatedItem.id);
                if (index !== -1) {
                    state.items[index] = updatedItem;
                }
                cartSlice.caseReducers.calculateTotals(state);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                const removedCartId = action.payload;
                // Filter out the removed item by cart_id
                state.items = state.items.filter(item => item.cart_id !== removedCartId);
                cartSlice.caseReducers.calculateTotals(state);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Increase cart quantity
            .addCase(increaseCartQuantity.pending, (state, action) => {
                state.error = null;
                // Optimistically update the quantity
                const productId = action.meta.arg.product_id;
                const item = state.items.find(item => String(item.product_id) === String(productId));
                if (item) {
                    item.quantity += 1;
                    cartSlice.caseReducers.calculateTotals(state);
                }
            })
            .addCase(increaseCartQuantity.fulfilled, (state, action) => {
                // Quantity already updated optimistically, just ensure consistency
                const productId = action.payload.product_id;
                const item = state.items.find(item => String(item.product_id) === String(productId));
                // If the server response has updated data, use it
                if (action.payload.response?.data) {
                    const serverItem = action.payload.response.data;
                    if (item && serverItem.quantity) {
                        item.quantity = serverItem.quantity;
                        cartSlice.caseReducers.calculateTotals(state);
                    }
                }
            })
            .addCase(increaseCartQuantity.rejected, (state, action) => {
                state.error = action.payload;
                // Revert the optimistic update
                const productId = action.meta.arg.product_id;
                const item = state.items.find(item => String(item.product_id) === String(productId));
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                    cartSlice.caseReducers.calculateTotals(state);
                }
            })

            // Decrease cart quantity
            .addCase(decreaseCartQuantity.pending, (state, action) => {
                state.error = null;
                // Optimistically update the quantity
                const productId = action.meta.arg.product_id;
                const item = state.items.find(item => String(item.product_id) === String(productId));
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                    cartSlice.caseReducers.calculateTotals(state);
                }
            })
            .addCase(decreaseCartQuantity.fulfilled, (state, action) => {
                // Quantity already updated optimistically, just ensure consistency
                const productId = action.payload.product_id;
                const item = state.items.find(item => String(item.product_id) === String(productId));
                // If the server response has updated data, use it
                if (action.payload.response?.data) {
                    const serverItem = action.payload.response.data;
                    if (item && serverItem.quantity) {
                        item.quantity = serverItem.quantity;
                        cartSlice.caseReducers.calculateTotals(state);
                    }
                }
            })
            .addCase(decreaseCartQuantity.rejected, (state, action) => {
                state.error = action.payload;
                // Revert the optimistic update
                const productId = action.meta.arg.product_id;
                const item = state.items.find(item => String(item.product_id) === String(productId));
                if (item) {
                    item.quantity += 1;
                    cartSlice.caseReducers.calculateTotals(state);
                }
            });
    }
});

// Actions
export const {
    addToLocalCart,
    removeFromLocalCart,
    clearLocalCart,
    clearError,
    calculateTotals,
    optimisticIncreaseQuantity,
    optimisticDecreaseQuantity
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectLocalCart = (state) => state.cart.localCart;

// Helper selectors
export const selectIsInCart = (productId) => (state) => {
    if (state.auth.isAuthenticated) {
        return state.cart.items.some(item => String(item.product_id) === String(productId));
    } else {
        return state.cart.localCart.includes(String(productId));
    }
};

export const selectCartItemByProductId = (productId) => (state) => {
    return state.cart.items.find(item => String(item.product_id) === String(productId));
};

export default cartSlice.reducer;