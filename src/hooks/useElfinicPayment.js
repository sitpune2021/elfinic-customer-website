/**
 * Elfinic Payment Hook
 * Custom hook for easy payment integration
 */

import { useState, useCallback } from 'react';
import { usePayment, PAYMENT_STATES } from '../contexts/PaymentContext';

// Payment hook for component-level integration
const useElfinicPayment = () => {
    const paymentContext = usePayment();
    const [localLoading, setLocalLoading] = useState(false);

    // Enhanced payment methods with local state management
    const processPayment = useCallback(async (paymentData, options = {}) => {
        const {
            onStart,
            onSuccess,
            onError,
            onCancel,
            showLoading = true
        } = options;

        try {
            if (showLoading) setLocalLoading(true);
            if (onStart) onStart();

            const result = await paymentContext.startPayment(paymentData);

            if (onSuccess) onSuccess(result);
            return result;

        } catch (error) {
            if (error.message.includes('cancelled')) {
                if (onCancel) onCancel();
            } else {
                if (onError) onError(error);
            }
            throw error;
        } finally {
            if (showLoading) setLocalLoading(false);
        }
    }, [paymentContext]);

    // Quick payment with minimal setup
    const quickPayment = useCallback(async (amount, description, customerInfo = {}, callbacks = {}) => {
        return processPayment({
            amount,
            currency: 'INR',
            description,
            customerName: customerInfo.name || '',
            customerEmail: customerInfo.email || '',
            customerPhone: customerInfo.phone || '',
            orderType: 'quick_pay'
        }, callbacks);
    }, [processPayment]);

    // Vendor registration payment
    const vendorRegistrationPayment = useCallback(async (planData, vendorInfo, callbacks = {}) => {
        const paymentData = {
            amount: planData.totalAmount,
            currency: 'INR',
            description: `Vendor Registration - ${planData.planName}`,
            customerName: vendorInfo.fullName,
            customerEmail: vendorInfo.email,
            customerPhone: `${vendorInfo.countryCode}${vendorInfo.phone}`,
            orderType: 'vendor_registration',
            planId: planData.planId,
            notes: {
                plan_id: planData.planId,
                plan_name: planData.planName,
                company_name: vendorInfo.companyName,
                registration_type: 'vendor'
            }
        };

        return processPayment(paymentData, callbacks);
    }, [processPayment]);

    // Product purchase payment
    const productPurchasePayment = useCallback(async (productData, customerInfo, callbacks = {}) => {
        const paymentData = {
            amount: productData.totalAmount,
            currency: 'INR',
            description: `Purchase: ${productData.productName}`,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            orderType: 'product_purchase',
            productId: productData.productId,
            notes: {
                product_id: productData.productId,
                product_name: productData.productName,
                quantity: productData.quantity || 1
            }
        };

        return processPayment(paymentData, callbacks);
    }, [processPayment]);

    // Subscription payment
    const subscriptionPayment = useCallback(async (subscriptionData, customerInfo, callbacks = {}) => {
        const paymentData = {
            amount: subscriptionData.amount,
            currency: 'INR',
            description: `${subscriptionData.planName} Subscription`,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            orderType: 'subscription',
            planId: subscriptionData.planId,
            notes: {
                plan_id: subscriptionData.planId,
                plan_name: subscriptionData.planName,
                subscription_period: subscriptionData.period
            }
        };

        return processPayment(paymentData, callbacks);
    }, [processPayment]);

    // Service payment (general services)
    const servicePayment = useCallback(async (serviceData, customerInfo, callbacks = {}) => {
        const paymentData = {
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
                service_type: serviceData.serviceType
            }
        };

        return processPayment(paymentData, callbacks);
    }, [processPayment]);

    // Return all payment methods and context state
    return {
        // Payment states from context
        status: paymentContext.status,
        loading: paymentContext.loading || localLoading,
        error: paymentContext.error,
        paymentData: paymentContext.paymentData,
        currentOrder: paymentContext.currentOrder,
        paymentHistory: paymentContext.paymentHistory,

        // Payment methods
        processPayment,
        quickPayment,
        vendorRegistrationPayment,
        productPurchasePayment,
        subscriptionPayment,
        servicePayment,

        // Context methods
        clearError: paymentContext.clearError,
        resetPaymentState: paymentContext.resetPaymentState,
        getPaymentHistory: paymentContext.getPaymentHistory,
        getLastPayment: paymentContext.getLastPayment,
        isPaymentInProgress: paymentContext.isPaymentInProgress,
        formatAmount: paymentContext.formatAmount,
        getPaymentConfig: paymentContext.getPaymentConfig,

        // Payment states enum
        paymentStates: paymentContext.paymentStates
    };
};

export default useElfinicPayment;