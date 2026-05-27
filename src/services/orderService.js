import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

/**
 * Order Service - Handles all order-related API calls
 */
class OrderService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    /**
     * Get authentication headers
     */
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Place a new product order
     * @param {Object} orderData - Order details
     * @param {number} orderData.user_id - User ID
     * @param {number} orderData.address_id - Address ID
     * @param {number} orderData.total_amount - Total order amount
     * @param {string} orderData.coupon_code - Coupon code (optional)
     * @param {number} orderData.discount_amount - Discount amount (optional)
     * @param {number} orderData.coins_used - Coins used (optional)
     * @param {Array} orderData.cart - Array of cart items
     * @returns {Promise<Object>} - Order response with razorpay details
     */
    async placeOrder(orderData) {
        try {
            const response = await axios.post(`${this.baseURL}/product-order/place`, orderData, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    }

    /**
     * Verify payment after Razorpay payment completion
     * @param {Object} paymentData - Payment verification data
     * @param {string} paymentData.razorpay_order_id - Razorpay order ID
     * @param {string} paymentData.razorpay_payment_id - Razorpay payment ID
     * @param {string} paymentData.razorpay_signature - Razorpay signature
     * @param {number} paymentData.order_id - Internal order ID
     * @returns {Promise<Object>} - Verification response
     */
    async verifyOrderPayment(paymentData) {
        try {
            const response = await axios.post(`${this.baseURL}/product-order/verify`, paymentData, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    }

    /**
     * Get user's order history
     * @param {number} userId - User ID
     * @returns {Promise<Array>} - List of orders
     */
    async getOrderHistory(userId) {
        try {
            const response = await axios.get(`${this.baseURL}/product-order/history`, {
                params: { user_id: userId },
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching order history:', error);
            throw error;
        }
    }

    /**
     * Get order details by ID
     * @param {number} orderId - Order ID
     * @returns {Promise<Object>} - Order details
     */
    async getOrderDetails(orderId) {
        try {
            const response = await axios.get(`${this.baseURL}/product-order/${orderId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    }

    /**
     * Cancel an order
     * @param {number} orderId - Order ID
     * @param {string} reason - Cancellation reason
     * @returns {Promise<Object>} - Cancellation response
     */
    async cancelOrder(orderId, reason = '') {
        try {
            const response = await axios.post(`${this.baseURL}/product-order/cancel`, {
                order_id: orderId,
                reason
            }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error cancelling order:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export const orderService = new OrderService();

// Also export the class for custom instances
export default OrderService;
