/**
 * Elfinic Payment Service
 * Global Razorpay Payment Gateway Integration
 * Reusable across all components and pages
 */

class PaymentService {
    constructor() {
        // Razorpay Configuration from Environment Variables
        this.RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RMUfaKMC7moQpC';
        this.RAZORPAY_SECRET = import.meta.env.VITE_RAZORPAY_SECRET || 'tHfV5VmW2LygU9OIw7P6NSP0';
        this.scriptLoaded = false;
        this.scriptPromise = null;

        // Validate Razorpay configuration
        if (!this.RAZORPAY_KEY_ID || !this.RAZORPAY_KEY_ID.startsWith('rzp_')) {
            console.error('❌ Invalid Razorpay Key ID. Please check your environment configuration.');
        }

        // Default company information from Environment Variables
        this.companyInfo = {
            name: import.meta.env.VITE_APP_NAME || 'Elfinic',
            description: 'Digital Commerce Platform',
            logo: import.meta.env.VITE_APP_LOGO || '/images/logo/logo.png',
            supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@elfinic.com',
            supportPhone: import.meta.env.VITE_SUPPORT_PHONE || '+91-9876543210'
        };

        console.log('💳 Payment Service Initialized:', {
            keyId: this.RAZORPAY_KEY_ID.substring(0, 8) + '***',
            companyName: this.companyInfo.name
        });
    }

    /**
     * Load Razorpay script dynamically
     * @returns {Promise<boolean>} - Returns true if script loaded successfully
     */
    async loadRazorpayScript() {
        if (this.scriptLoaded) {
            return true;
        }

        if (this.scriptPromise) {
            return this.scriptPromise;
        }

        this.scriptPromise = new Promise((resolve) => {
            // Check if script already exists
            const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
            if (existingScript) {
                this.scriptLoaded = true;
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;

            script.onload = () => {
                console.log('✅ Razorpay script loaded successfully');
                this.scriptLoaded = true;
                resolve(true);
            };

            script.onerror = (error) => {
                console.error('❌ Failed to load Razorpay script:', error);
                this.scriptLoaded = false;
                this.scriptPromise = null;
                resolve(false);
            };

            document.head.appendChild(script);
        });

        return this.scriptPromise;
    }

    /**
     * Create server-side order via backend API
     * @param {Object} orderDetails - Order details
     * @returns {Promise<Object>} - Order creation response
     */
    async createOrder(orderDetails) {
        try {
            // Get backend API URL
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

            const response = await fetch(`${API_BASE_URL}/createOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: orderDetails.amount // Send amount in rupees, not paisa
                })
            });

            if (!response.ok) {
                throw new Error(`Order creation failed: ${response.status} ${response.statusText}`);
            }

            const orderData = await response.json();
            console.log('✅ Order created via backend:', orderData);
            return orderData;

        } catch (error) {
            console.error('❌ Order creation failed:', error);
            throw new Error(`Failed to create payment order: ${error.message}`);
        }
    }

    /**
     * Verify payment via backend API
     * @param {Object} paymentData - Payment verification data
     * @returns {Promise<Object>} - Verification response
     */
    async verifyPayment(paymentData) {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

            const response = await fetch(`${API_BASE_URL}/verifyPayment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    razorpay_order_id: paymentData.razorpay_order_id || '',
                    razorpay_payment_id: paymentData.razorpay_payment_id || '',
                    razorpay_signature: paymentData.razorpay_signature || ''
                })
            });

            if (!response.ok) {
                throw new Error(`Payment verification failed: ${response.status} ${response.statusText}`);
            }

            const verificationData = await response.json();
            console.log('✅ Payment verified:', verificationData);
            return verificationData;

        } catch (error) {
            console.error('❌ Payment verification failed:', error);
            throw new Error(`Failed to verify payment: ${error.message}`);
        }
    }

    /**
     * Create payment order
     * @param {Object} orderDetails - Payment order details
     * @returns {Promise<Object>} - Payment response
     */
    async createPayment(orderDetails) {
        try {
            console.log('🚀 Starting payment process:', {
                amount: orderDetails.amount,
                description: orderDetails.description,
                keyId: this.RAZORPAY_KEY_ID.substring(0, 8) + '***'
            });

            // Validate Razorpay key before proceeding
            if (!this.RAZORPAY_KEY_ID || !this.RAZORPAY_KEY_ID.startsWith('rzp_')) {
                throw new Error('Invalid Razorpay configuration. Please check your API keys.');
            }

            // Load Razorpay script
            const scriptLoaded = await this.loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Payment gateway failed to load. Please check your internet connection.');
            }

            // Check if Razorpay is available
            if (typeof window.Razorpay === 'undefined') {
                console.log('⏳ Waiting for Razorpay to initialize...');
                // Wait a bit for script to initialize
                await new Promise(resolve => setTimeout(resolve, 2000));
                if (typeof window.Razorpay === 'undefined') {
                    throw new Error('Razorpay library not available. Please refresh the page and try again.');
                }
            }

            // Validate required fields
            this.validateOrderDetails(orderDetails);

            // Create order via backend API
            let razorpayOrder = null;
            try {
                razorpayOrder = await this.createOrder(orderDetails);
                console.log('✅ Order created via backend:', razorpayOrder);
            } catch (orderError) {
                console.error('❌ Backend order creation failed:', orderError);
                throw orderError; // Always fail if backend order creation fails
            }

            // Create Razorpay options
            const options = this.createRazorpayOptions(orderDetails, razorpayOrder);

            console.log('💳 Razorpay options configured:', {
                key: options.key,
                amount: options.amount,
                currency: options.currency,
                name: options.name,
                order_id: options.order_id || 'none'
            });

            // Return promise that resolves with payment result
            return new Promise((resolve, reject) => {
                options.handler = async (response) => {
                    console.log('✅ Payment successful, verifying...:', response.razorpay_payment_id);

                    try {
                        // Verify payment through backend
                        const verificationResult = await this.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id || '',
                            razorpay_payment_id: response.razorpay_payment_id || '',
                            razorpay_signature: response.razorpay_signature || ''
                        });

                        resolve({
                            success: true,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            verified: verificationResult,
                            ...response
                        });
                    } catch (verifyError) {
                        console.error('❌ Payment verification failed:', verifyError);
                        reject(new Error(`Payment verification failed: ${verifyError.message}`));
                    }
                };

                options.modal = {
                    ...options.modal,
                    ondismiss: () => {
                        console.log('❌ Payment cancelled by user');
                        reject(new Error('Payment cancelled by user'));
                    },
                    escape: false,
                    backdropclose: false
                };

                try {
                    // Add timeout for payment initialization
                    const initTimeout = setTimeout(() => {
                        reject(new Error('Payment initialization timeout. Please try again.'));
                    }, 10000); // 10 seconds timeout

                    const paymentObject = new window.Razorpay(options);

                    // Clear timeout on successful initialization
                    clearTimeout(initTimeout);

                    // Handle payment errors
                    paymentObject.on('payment.failed', (response) => {
                        console.error('❌ Payment failed:', response.error);
                        const errorMsg = response.error?.description || response.error?.reason || 'Payment failed';
                        reject(new Error(errorMsg));
                    });

                    // Handle network errors
                    paymentObject.on('payment.error', (response) => {
                        console.error('❌ Payment error:', response);
                        reject(new Error('Network error occurred. Please try again.'));
                    });

                    console.log('🔓 Opening Razorpay checkout...');

                    // Add error handling for payment open
                    try {
                        paymentObject.open();
                    } catch (openError) {
                        console.error('❌ Failed to open payment:', openError);
                        reject(new Error('Failed to open payment dialog. Please refresh and try again.'));
                    }
                } catch (razorpayError) {
                    console.error('❌ Razorpay initialization error:', razorpayError);

                    // Provide more specific error messages
                    if (razorpayError.message.includes('key')) {
                        reject(new Error('Invalid payment gateway configuration. Please contact support.'));
                    } else if (razorpayError.message.includes('network')) {
                        reject(new Error('Network connectivity issue. Please check your internet connection.'));
                    } else {
                        reject(new Error('Failed to initialize payment gateway. Please refresh the page and try again.'));
                    }
                }
            });

        } catch (error) {
            console.error('Payment creation failed:', error);
            throw error;
        }
    }

    /**
     * Validate order details
     * @param {Object} orderDetails - Order details to validate
     */
    validateOrderDetails(orderDetails) {
        const required = ['amount', 'currency', 'description'];
        const missing = required.filter(field => !orderDetails[field]);

        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        if (orderDetails.amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        if (orderDetails.currency !== 'INR') {
            throw new Error('Only INR currency is supported');
        }
    }

    /**
     * Create Razorpay options object
     * @param {Object} orderDetails - Order details
     * @param {Object} razorpayOrder - Razorpay order object (optional)
     * @returns {Object} - Razorpay options
     */
    createRazorpayOptions(orderDetails, razorpayOrder = null) {
        const options = {
            key: this.RAZORPAY_KEY_ID,
            amount: Math.round(orderDetails.amount * 100), // Convert to paisa
            currency: orderDetails.currency || 'INR',
            name: orderDetails.companyName || this.companyInfo.name,
            description: orderDetails.description || this.companyInfo.description,
            image: orderDetails.logo || this.companyInfo.logo,

            // Include order_id from backend response
            ...(razorpayOrder && (razorpayOrder.id || razorpayOrder.order_id) ? {
                order_id: razorpayOrder.id || razorpayOrder.order_id
            } : {}),

            // Customer details
            prefill: {
                name: orderDetails.customerName || '',
                email: orderDetails.customerEmail || '',
                contact: orderDetails.customerPhone || ''
            },

            // Notes for tracking
            notes: {
                order_type: orderDetails.orderType || 'general',
                customer_id: orderDetails.customerId || '',
                product_id: orderDetails.productId || '',
                plan_id: orderDetails.planId || '',
                ...orderDetails.notes
            },

            // Theme customization
            theme: {
                backdrop_color: 'rgba(0,0,0,0.6)'
            },

            // Modal settings
            modal: {
                ondismiss: null, // Will be set in createPayment method
                confirm_close: true,
                escape: false,
                backdropclose: false,
                animation: true
            },

            // Retry settings
            retry: {
                enabled: true,
                max_count: 3
            },

            // Timeout (in milliseconds)
            timeout: 900, // 15 minutes

            // Additional options
            remember_customer: false,
            readonly: {
                email: orderDetails.readonlyEmail || false,
                contact: orderDetails.readonlyPhone || false,
                name: orderDetails.readonlyName || false
            }
        };

        return options;
    }

    /**
     * Verify payment signature (client-side basic check)
     * Note: Always verify on server-side for security
     * @param {Object} paymentData - Payment response data
     * @returns {boolean} - Basic validation result
     */
    validatePaymentResponse(paymentData) {
        return !!(
            paymentData.razorpay_payment_id &&
            paymentData.razorpay_payment_id.startsWith('pay_')
        );
    }

    /**
     * Get payment status from Razorpay
     * Note: This should be done on server-side for security
     * @param {string} paymentId - Razorpay payment ID
     * @returns {Promise<Object>} - Payment status
     */
    async getPaymentStatus(paymentId) {
        // This is a placeholder - implement server-side API call
        console.warn('Payment status check should be implemented on server-side');
        return {
            id: paymentId,
            status: 'captured',
            method: 'card'
        };
    }

    /**
     * Create refund (server-side only)
     * @param {string} paymentId - Payment ID to refund
     * @param {number} amount - Refund amount (optional, defaults to full refund)
     * @returns {Promise<Object>} - Refund response
     */
    async createRefund(paymentId, amount = null) {
        throw new Error('Refund operations must be performed on server-side for security');
    }

    /**
     * Format amount for display
     * @param {number} amount - Amount in rupees
     * @returns {string} - Formatted amount string
     */
    formatAmount(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Get supported payment methods
     * @returns {Array} - Array of supported payment methods
     */
    getSupportedPaymentMethods() {
        return [
            'card',
            'netbanking',
            'wallet',
            'upi',
            'emi',
            'cardless_emi',
            'paylater'
        ];
    }

    /**
     * Create quick payment for common scenarios
     * @param {Object} quickPaymentData - Quick payment configuration
     * @returns {Promise<Object>} - Payment response
     */
    async quickPay(quickPaymentData) {
        const {
            amount,
            description,
            customerEmail,
            customerName,
            customerPhone,
            orderType = 'quick_pay',
            onSuccess,
            onFailure
        } = quickPaymentData;

        try {
            const orderDetails = {
                amount,
                currency: 'INR',
                description,
                customerEmail,
                customerName,
                customerPhone,
                orderType,
                notes: {
                    payment_type: 'quick_pay',
                    timestamp: new Date().toISOString()
                }
            };

            const paymentResult = await this.createPayment(orderDetails);

            if (onSuccess) {
                onSuccess(paymentResult);
            }

            return paymentResult;

        } catch (error) {
            if (onFailure) {
                onFailure(error);
            }
            throw error;
        }
    }

    /**
     * Create subscription payment
     * @param {Object} subscriptionData - Subscription payment data
     * @returns {Promise<Object>} - Payment response
     */
    async createSubscriptionPayment(subscriptionData) {
        const {
            planId,
            planName,
            amount,
            customerData,
            subscriptionPeriod
        } = subscriptionData;

        const orderDetails = {
            amount,
            currency: 'INR',
            description: `${planName} - ${subscriptionPeriod}`,
            customerEmail: customerData.email,
            customerName: customerData.name,
            customerPhone: customerData.phone,
            orderType: 'subscription',
            planId,
            notes: {
                plan_id: planId,
                plan_name: planName,
                subscription_period: subscriptionPeriod,
                customer_id: customerData.id,
                payment_type: 'subscription'
            }
        };

        return this.createPayment(orderDetails);
    }

    /**
     * Update company information
     * @param {Object} newCompanyInfo - New company information
     */
    updateCompanyInfo(newCompanyInfo) {
        this.companyInfo = {
            ...this.companyInfo,
            ...newCompanyInfo
        };
    }

    /**
     * Get current configuration
     * @returns {Object} - Current payment service configuration
     */
    getConfiguration() {
        return {
            keyId: this.RAZORPAY_KEY_ID,
            companyInfo: this.companyInfo,
            scriptLoaded: this.scriptLoaded,
            supportedMethods: this.getSupportedPaymentMethods()
        };
    }
}

// Create singleton instance
const paymentService = new PaymentService();

// Export singleton instance
export default paymentService;

// Export class for custom instances
export { PaymentService };