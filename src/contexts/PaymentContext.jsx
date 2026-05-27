/**
 * Elfinic Payment Context
 * React Context for global payment state management
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import paymentService from '../services/paymentService';

// Payment states - Export for use in components
export const PAYMENT_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

// Initial state
const initialState = {
    status: PAYMENT_STATES.IDLE,
    loading: false,
    error: null,
    paymentData: null,
    paymentHistory: [],
    currentOrder: null
};

// Action types
const PAYMENT_ACTIONS = {
    START_PAYMENT: 'START_PAYMENT',
    PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
    PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    PAYMENT_CANCELLED: 'PAYMENT_CANCELLED',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_CURRENT_ORDER: 'SET_CURRENT_ORDER',
    ADD_TO_HISTORY: 'ADD_TO_HISTORY',
    RESET_PAYMENT_STATE: 'RESET_PAYMENT_STATE'
};

// Reducer
const paymentReducer = (state, action) => {
    switch (action.type) {
        case PAYMENT_ACTIONS.START_PAYMENT:
            return {
                ...state,
                status: PAYMENT_STATES.LOADING,
                loading: true,
                error: null,
                currentOrder: action.payload
            };

        case PAYMENT_ACTIONS.PAYMENT_PROCESSING:
            return {
                ...state,
                status: PAYMENT_STATES.PROCESSING,
                loading: true,
                error: null
            };

        case PAYMENT_ACTIONS.PAYMENT_SUCCESS:
            return {
                ...state,
                status: PAYMENT_STATES.SUCCESS,
                loading: false,
                error: null,
                paymentData: action.payload,
                paymentHistory: [action.payload, ...state.paymentHistory]
            };

        case PAYMENT_ACTIONS.PAYMENT_FAILED:
            return {
                ...state,
                status: PAYMENT_STATES.FAILED,
                loading: false,
                error: action.payload,
                paymentData: null
            };

        case PAYMENT_ACTIONS.PAYMENT_CANCELLED:
            return {
                ...state,
                status: PAYMENT_STATES.CANCELLED,
                loading: false,
                error: 'Payment was cancelled by user',
                paymentData: null
            };

        case PAYMENT_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
                status: state.status === PAYMENT_STATES.FAILED ? PAYMENT_STATES.IDLE : state.status
            };

        case PAYMENT_ACTIONS.SET_CURRENT_ORDER:
            return {
                ...state,
                currentOrder: action.payload
            };

        case PAYMENT_ACTIONS.ADD_TO_HISTORY:
            return {
                ...state,
                paymentHistory: [action.payload, ...state.paymentHistory]
            };

        case PAYMENT_ACTIONS.RESET_PAYMENT_STATE:
            return {
                ...initialState,
                paymentHistory: state.paymentHistory // Preserve history
            };

        default:
            return state;
    }
};

// Create context
const PaymentContext = createContext();

// Payment Provider Component
export const PaymentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(paymentReducer, initialState);

    // Start payment process
    const startPayment = useCallback(async (orderDetails) => {
        try {
            dispatch({ type: PAYMENT_ACTIONS.START_PAYMENT, payload: orderDetails });

            // Add timestamp and unique ID to order
            const enhancedOrder = {
                ...orderDetails,
                orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString(),
                platform: 'elfinic'
            };

            dispatch({ type: PAYMENT_ACTIONS.PAYMENT_PROCESSING });

            // Create payment using payment service
            const paymentResult = await paymentService.createPayment(enhancedOrder);

            // Add additional data to payment result
            const enhancedResult = {
                ...paymentResult,
                orderDetails: enhancedOrder,
                completedAt: new Date().toISOString(),
                amount: orderDetails.amount,
                currency: orderDetails.currency || 'INR'
            };

            dispatch({ type: PAYMENT_ACTIONS.PAYMENT_SUCCESS, payload: enhancedResult });

            return enhancedResult;

        } catch (error) {
            const errorMessage = error.message || 'Payment failed';

            if (errorMessage.includes('cancelled')) {
                dispatch({ type: PAYMENT_ACTIONS.PAYMENT_CANCELLED });
            } else {
                dispatch({ type: PAYMENT_ACTIONS.PAYMENT_FAILED, payload: errorMessage });
            }

            throw error;
        }
    }, []);

    // Quick payment for simple scenarios
    const quickPay = useCallback(async (amount, description, customerInfo = {}) => {
        const orderDetails = {
            amount,
            currency: 'INR',
            description,
            customerName: customerInfo.name || '',
            customerEmail: customerInfo.email || '',
            customerPhone: customerInfo.phone || '',
            orderType: 'quick_pay'
        };

        return startPayment(orderDetails);
    }, [startPayment]);

    // Subscription payment
    const subscriptionPayment = useCallback(async (subscriptionData) => {
        const orderDetails = {
            amount: subscriptionData.amount,
            currency: 'INR',
            description: `${subscriptionData.planName} Subscription`,
            customerName: subscriptionData.customerName,
            customerEmail: subscriptionData.customerEmail,
            customerPhone: subscriptionData.customerPhone,
            orderType: 'subscription',
            planId: subscriptionData.planId,
            notes: {
                plan_id: subscriptionData.planId,
                plan_name: subscriptionData.planName,
                subscription_period: subscriptionData.period || 'monthly'
            }
        };

        return startPayment(orderDetails);
    }, [startPayment]);

    // Product purchase payment
    const productPayment = useCallback(async (productData, customerInfo) => {
        const orderDetails = {
            amount: productData.totalAmount,
            currency: 'INR',
            description: `Purchase: ${productData.productName || 'Product'}`,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            orderType: 'product_purchase',
            productId: productData.productId,
            notes: {
                product_id: productData.productId,
                product_name: productData.productName,
                quantity: productData.quantity || 1,
                shipping_address: productData.shippingAddress
            }
        };

        return startPayment(orderDetails);
    }, [startPayment]);

    // Service payment (for vendor registration, etc.)
    const servicePayment = useCallback(async (serviceData, customerInfo) => {
        const orderDetails = {
            amount: serviceData.amount,
            currency: 'INR',
            description: `Service: ${serviceData.serviceName}`,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            orderType: 'service_payment',
            serviceId: serviceData.serviceId,
            notes: {
                service_id: serviceData.serviceId,
                service_name: serviceData.serviceName,
                service_type: serviceData.serviceType || 'general'
            }
        };

        return startPayment(orderDetails);
    }, [startPayment]);

    // Clear error
    const clearError = useCallback(() => {
        dispatch({ type: PAYMENT_ACTIONS.CLEAR_ERROR });
    }, []);

    // Reset payment state
    const resetPaymentState = useCallback(() => {
        dispatch({ type: PAYMENT_ACTIONS.RESET_PAYMENT_STATE });
    }, []);

    // Get payment history
    const getPaymentHistory = useCallback(() => {
        return state.paymentHistory;
    }, [state.paymentHistory]);

    // Get last payment
    const getLastPayment = useCallback(() => {
        return state.paymentHistory[0] || null;
    }, [state.paymentHistory]);

    // Check if payment is in progress
    const isPaymentInProgress = useCallback(() => {
        return state.status === PAYMENT_STATES.LOADING || state.status === PAYMENT_STATES.PROCESSING;
    }, [state.status]);

    // Format amount
    const formatAmount = useCallback((amount) => {
        return paymentService.formatAmount(amount);
    }, []);

    // Get payment service configuration
    const getPaymentConfig = useCallback(() => {
        return paymentService.getConfiguration();
    }, []);

    const value = {
        // State
        ...state,
        paymentStates: PAYMENT_STATES,

        // Actions
        startPayment,
        quickPay,
        subscriptionPayment,
        productPayment,
        servicePayment,
        clearError,
        resetPaymentState,

        // Utilities
        getPaymentHistory,
        getLastPayment,
        isPaymentInProgress,
        formatAmount,
        getPaymentConfig
    };

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
};

// Custom hook to use payment context
export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};

export default PaymentContext;