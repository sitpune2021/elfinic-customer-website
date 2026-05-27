import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

/**
 * Get authentication headers
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

/**
 * Place a new product order
 * Request body format:
 * {
 *   "user_id": 1,
 *   "address_id": 1,
 *   "total_amount": 1100,
 *   "coupon_code": "NEW50",
 *   "discount_amount": 200,
 *   "coins_used": 0,
 *   "cart": [
 *     {
 *       "product_id": 10,
 *       "variant_id": 5,
 *       "quantity": 2,
 *       "price": 500,
 *       "discount": 100
 *     }
 *   ]
 * }
 * 
 * Response format:
 * {
 *   "status": "success",
 *   "order_id": 6,
 *   "razorpay_order_id": "order_RvIqo8LW2CGxoY",
 *   "amount": 1100,
 *   "currency": "INR",
 *   "key_id": "rzp_live_RfAhEgkF5rf6Sw"
 * }
 */
export const placeProductOrder = createAsyncThunk(
    'order/placeOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/product-order/place`,
                orderData,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error placing order:', error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to place order'
            );
        }
    }
);

/**
 * Verify payment after Razorpay payment completion
 * Request body format:
 * {
 *   "order_id": "order_Rl4tFlnFkvTVD8",        // razorpay_order_id from place order response
 *   "razorpay_payment_id": "pay_Rl4tY8gO63dzeY",
 *   "razorpay_signature": "bf1f2304c24d888bacf07160577cacb84c4f61bce2a8ad6470b1fec50dee6384"
 * }
 */
export const verifyOrderPayment = createAsyncThunk(
    'order/verifyPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            // Ensure proper payload structure for verify-payment endpoint
            const verifyPayload = {
                order_id: paymentData.order_id || paymentData.razorpay_order_id,
                razorpay_payment_id: paymentData.razorpay_payment_id,
                razorpay_signature: paymentData.razorpay_signature
            };

            const response = await axios.post(
                `${API_BASE_URL}/product-order/verify-payment`,
                verifyPayload,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error verifying payment:', error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to verify payment'
            );
        }
    }
);

/**
 * Get user's order history
 * API: GET /UserOrdersHistoryList
 * Params: { user_id: user_id }
 */
export const fetchOrderHistory = createAsyncThunk(
    'order/fetchHistory',
    async (_, { rejectWithValue }) => {
        try {
            const userString = localStorage.getItem('user');
            if (!userString) {
                throw new Error('User not found');
            }
            const user = JSON.parse(userString);

            const response = await axios.get(
                `${API_BASE_URL}/UserOrdersHistoryList`,
                {
                    params: { user_id: user.id },
                    headers: getAuthHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching order history:', error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch order history'
            );
        }
    }
);

/**
 * Get order details by order ID
 * API: POST /OrdersHistoryDetails
 * Request body: { user_id: number, order_id: number }
 * 
 * Response format:
 * {
 *   "status": "success",
 *   "message": "Order history details fetched successfully",
 *   "data": [{
 *     "order_number": "ORD-2025123061222",
 *     "user_id": 156,
 *     "product_name": "test",
 *     "product_thumb": "6943e64bbb0d7.png",
 *     "total_amount": "1888.00",
 *     "delivered_status": "pending",
 *     "payment_status": "paid",
 *     "paid_at": "2025-12-30 07:37:43",
 *     "address": { ... },
 *     "history": [{ ... }]
 *   }]
 * }
 */
export const fetchOrderHistoryDetails = createAsyncThunk(
    'order/fetchHistoryDetails',
    async ({ order_id, product_id }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const userString = localStorage.getItem('user');
            if (!userString) {
                throw new Error('User not found');
            }
            const user = JSON.parse(userString);

            const response = await axios.get(
                `${API_BASE_URL}/OrdersHistoryDetails`,
                {
                    params: {
                        user_id: user.id,
                        order_id: order_id,
                        product_id: product_id
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching order history details:', error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch order details'
            );
        }
    }
);

// Initial state
const initialState = {
    // Current order being placed
    currentOrder: null,
    razorpayOrderId: null,
    razorpayKeyId: null,
    orderId: null,
    orderAmount: null,
    orderCurrency: 'INR',

    // Order history
    orderHistory: [],
    selectedOrder: null,

    // Order history details (detailed view)
    orderHistoryDetails: null,
    orderHistoryDetailsLoading: false,
    orderHistoryDetailsError: null,

    // Loading states
    placeOrderLoading: false,
    verifyPaymentLoading: false,
    historyLoading: false,
    detailsLoading: false,

    // Error states
    placeOrderError: null,
    verifyPaymentError: null,
    historyError: null,
    detailsError: null,

    // Payment verification
    paymentVerified: false,
    paymentResult: null
};

// Order slice
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        // Clear current order state
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
            state.razorpayOrderId = null;
            state.razorpayKeyId = null;
            state.orderId = null;
            state.orderAmount = null;
            state.orderCurrency = 'INR';
            state.placeOrderError = null;
            state.paymentVerified = false;
            state.paymentResult = null;
        },

        // Clear all errors
        clearOrderErrors: (state) => {
            state.placeOrderError = null;
            state.verifyPaymentError = null;
            state.historyError = null;
            state.detailsError = null;
        },

        // Reset order state completely
        resetOrderState: (state) => {
            return initialState;
        },

        // Set payment result after Razorpay callback
        setPaymentResult: (state, action) => {
            state.paymentResult = action.payload;
        },

        // Clear order history details when navigating back
        clearOrderHistoryDetails: (state) => {
            state.orderHistoryDetails = null;
            state.orderHistoryDetailsError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Place order
            .addCase(placeProductOrder.pending, (state) => {
                state.placeOrderLoading = true;
                state.placeOrderError = null;
                state.currentOrder = null;
            })
            .addCase(placeProductOrder.fulfilled, (state, action) => {
                state.placeOrderLoading = false;
                state.currentOrder = action.payload;
                state.orderId = action.payload.order_id;
                state.razorpayOrderId = action.payload.razorpay_order_id;
                state.razorpayKeyId = action.payload.key_id;
                state.orderAmount = action.payload.amount;
                state.orderCurrency = action.payload.currency || 'INR';
            })
            .addCase(placeProductOrder.rejected, (state, action) => {
                state.placeOrderLoading = false;
                state.placeOrderError = action.payload;
            })

            // Verify payment
            .addCase(verifyOrderPayment.pending, (state) => {
                state.verifyPaymentLoading = true;
                state.verifyPaymentError = null;
            })
            .addCase(verifyOrderPayment.fulfilled, (state, action) => {
                state.verifyPaymentLoading = false;
                state.paymentVerified = true;
                state.paymentResult = action.payload;
            })
            .addCase(verifyOrderPayment.rejected, (state, action) => {
                state.verifyPaymentLoading = false;
                state.verifyPaymentError = action.payload;
                state.paymentVerified = false;
            })

            // Fetch order history
            .addCase(fetchOrderHistory.pending, (state) => {
                state.historyLoading = true;
                state.historyError = null;
            })
            .addCase(fetchOrderHistory.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.orderHistory = action.payload.data || action.payload || [];
            })
            .addCase(fetchOrderHistory.rejected, (state, action) => {
                state.historyLoading = false;
                state.historyError = action.payload;
            })

            // Fetch order history details
            .addCase(fetchOrderHistoryDetails.pending, (state) => {
                state.orderHistoryDetailsLoading = true;
                state.orderHistoryDetailsError = null;
                state.orderHistoryDetails = null;
            })
            .addCase(fetchOrderHistoryDetails.fulfilled, (state, action) => {
                state.orderHistoryDetailsLoading = false;
                state.orderHistoryDetails = action.payload.data || action.payload;
            })
            .addCase(fetchOrderHistoryDetails.rejected, (state, action) => {
                state.orderHistoryDetailsLoading = false;
                state.orderHistoryDetailsError = action.payload;
            });
    }
});

// Actions
export const {
    clearCurrentOrder,
    clearOrderErrors,
    resetOrderState,
    setPaymentResult,
    clearOrderHistoryDetails
} = orderSlice.actions;

// Selectors
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectRazorpayOrderId = (state) => state.order.razorpayOrderId;
export const selectRazorpayKeyId = (state) => state.order.razorpayKeyId;
export const selectOrderId = (state) => state.order.orderId;
export const selectOrderAmount = (state) => state.order.orderAmount;
export const selectOrderCurrency = (state) => state.order.orderCurrency;

export const selectPlaceOrderLoading = (state) => state.order.placeOrderLoading;
export const selectPlaceOrderError = (state) => state.order.placeOrderError;
export const selectVerifyPaymentLoading = (state) => state.order.verifyPaymentLoading;
export const selectVerifyPaymentError = (state) => state.order.verifyPaymentError;

export const selectPaymentVerified = (state) => state.order.paymentVerified;
export const selectPaymentResult = (state) => state.order.paymentResult;

export const selectOrderHistory = (state) => state.order.orderHistory;
export const selectHistoryLoading = (state) => state.order.historyLoading;
export const selectHistoryError = (state) => state.order.historyError;

export const selectSelectedOrder = (state) => state.order.selectedOrder;
export const selectDetailsLoading = (state) => state.order.detailsLoading;
export const selectDetailsError = (state) => state.order.detailsError;

// Order history details selectors
export const selectOrderHistoryDetails = (state) => state.order.orderHistoryDetails;
export const selectOrderHistoryDetailsLoading = (state) => state.order.orderHistoryDetailsLoading;
export const selectOrderHistoryDetailsError = (state) => state.order.orderHistoryDetailsError;

export default orderSlice.reducer;
