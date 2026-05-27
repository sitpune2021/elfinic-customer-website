import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

// Fetch all available coupons
export const fetchCoupons = createAsyncThunk(
    'coupon/fetchCoupons',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/coupons`);
            // Extract data from the API response structure
            const couponData = response.data?.data || response.data;
            return Array.isArray(couponData) ? couponData : [];
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Apply coupon to cart
export const applyCoupon = createAsyncThunk(
    'coupon/applyCoupon',
    async ({ userId, couponCode, cartItems, cartSubtotal }, { rejectWithValue }) => {
        try {
            // Format cart items for API
            const formattedItems = cartItems.map(item => {
                // Get product_id from different possible locations
                const productId = item.product_id || item.id || item.product?.id;
                
                // Get variant_id - check multiple possible field names
                let variantId = null;
                
                if (item.variant_id) {
                    variantId = item.variant_id;
                } else if (item.variants_id) {
                    variantId = item.variants_id;
                } else if (item.selected_variant_id) {
                    variantId = item.selected_variant_id;
                } else if (item.selectedVariant?.id) {
                    variantId = item.selectedVariant.id;
                } else if (item.product?.variants && item.product.variants.length > 0) {
                    if (item.product.selected_variant?.id) {
                        variantId = item.product.selected_variant.id;
                    } else if (item.product.variants.length === 1) {
                        variantId = item.product.variants[0].id;
                    } else {
                        const selectedVariant = item.product.variants.find(v => v.selected || v.is_selected);
                        if (selectedVariant) {
                            variantId = selectedVariant.id;
                        }
                    }
                }
                
                // Get quantity
                const quantity = item.quantity || 1;
                
                // Get price - handle different price field locations
                let clientPrice = item.client_price;
                if (!clientPrice && item.product) {
                    const totalPrice = item.product.total_price?.toString().replace(/,/g, '');
                    const regularPrice = item.product.price?.toString().replace(/,/g, '');
                    clientPrice = parseFloat(totalPrice) || parseFloat(regularPrice) || 0;
                }
                if (!clientPrice) {
                    clientPrice = parseFloat(item.price?.toString().replace(/,/g, '')) || 0;
                }
                
                return {
                    product_id: productId,
                    variant_id: variantId,
                    quantity: quantity,
                    client_price: clientPrice
                };
            });

            const requestBody = {
                user_id: userId,
                coupon_code: couponCode.trim(),
                cart: {
                    items: formattedItems,
                    cart_subtotal: cartSubtotal
                }
            };

            const response = await axios.post(`${API_BASE_URL}/applyCoupon`, requestBody);

            if (response.data.success === 'success') {
                return {
                    coupon: response.data.coupon,
                    pricing: response.data.pricing,
                    item_discounts: response.data.item_discounts
                };
            } else {
                return rejectWithValue(response.data.message || 'Failed to apply coupon');
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            if (error.response) {
                return rejectWithValue(error.response.data.message || 'Invalid or expired coupon code');
            } else if (error.request) {
                return rejectWithValue('Network error. Please check your connection');
            } else {
                return rejectWithValue('Failed to apply coupon. Please try again');
            }
        }
    }
);

const initialState = {
    // Available coupons list
    coupons: [],
    couponsLoading: false,
    couponsError: null,
    
    // Applied coupon state
    appliedCoupon: null,
    discountInfo: null,
    applyLoading: false,
    applyError: null,
    applySuccess: null,
};

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        clearCouponError: (state) => {
            state.applyError = null;
            state.couponsError = null;
        },
        clearAppliedCoupon: (state) => {
            state.appliedCoupon = null;
            state.discountInfo = null;
            state.applySuccess = null;
            state.applyError = null;
        },
        resetCouponState: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch coupons
            .addCase(fetchCoupons.pending, (state) => {
                state.couponsLoading = true;
                state.couponsError = null;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.couponsLoading = false;
                state.coupons = action.payload;
                state.couponsError = null;
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.couponsLoading = false;
                state.couponsError = action.payload;
            })
            // Apply coupon
            .addCase(applyCoupon.pending, (state) => {
                state.applyLoading = true;
                state.applyError = null;
                state.applySuccess = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.applyLoading = false;
                state.appliedCoupon = action.payload.coupon;
                state.discountInfo = {
                    totalDiscount: action.payload.pricing.total_discount,
                    cartSubtotal: action.payload.pricing.cart_subtotal,
                    totalPayableAmount: action.payload.pricing.total_payable_amount,
                    itemDiscounts: action.payload.item_discounts
                };
                state.applySuccess = action.payload.coupon.message || 'Coupon applied successfully!';
                state.applyError = null;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.applyLoading = false;
                state.applyError = action.payload;
                state.applySuccess = null;
            });
    },
});

export const { clearCouponError, clearAppliedCoupon, resetCouponState } = couponSlice.actions;

// Selectors
export const selectCoupons = (state) => state.coupon.coupons;
export const selectCouponsLoading = (state) => state.coupon.couponsLoading;
export const selectCouponsError = (state) => state.coupon.couponsError;

export const selectAppliedCoupon = (state) => state.coupon.appliedCoupon;
export const selectDiscountInfo = (state) => state.coupon.discountInfo;
export const selectApplyLoading = (state) => state.coupon.applyLoading;
export const selectApplyError = (state) => state.coupon.applyError;
export const selectApplySuccess = (state) => state.coupon.applySuccess;

export default couponSlice.reducer;
