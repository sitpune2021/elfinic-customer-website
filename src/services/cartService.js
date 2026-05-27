import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

/**
 * Cart Service - Handles all cart-related API calls
 */
class CartService {
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
     * Fetch user's cart items
     */
    async getCart() {
        try {
            const response = await axios.get(`${this.baseURL}/cart`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    }

    /**
     * Add item to cart
     * @param {number} productId - Product ID to add
     * @param {number} quantity - Quantity to add (default: 1)
     */
    async addToCart(productId, quantity = 1) {
        try {
            const response = await axios.post(`${this.baseURL}/cart/add`, {
                product_id: productId,
                quantity: quantity
            }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    /**
     * Update cart item quantity
     * @param {number} itemId - Cart item ID
     * @param {number} quantity - New quantity
     */
    async updateCartItem(itemId, quantity) {
        try {
            const response = await axios.put(`${this.baseURL}/cart/items/${itemId}`, {
                quantity: quantity
            }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    }

    /**
     * Remove item from cart
     * @param {number} itemId - Cart item ID to remove
     */
    async removeFromCart(itemId) {
        try {
            const response = await axios.delete(`${this.baseURL}/cart/items/${itemId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }

    /**
     * Clear all items from cart
     */
    async clearCart() {
        try {
            const response = await axios.delete(`${this.baseURL}/cart/clear`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }

    /**
     * Get cart total
     */
    async getCartTotal() {
        try {
            const response = await axios.get(`${this.baseURL}/cart/total`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error getting cart total:', error);
            throw error;
        }
    }

    /**
     * Sync local cart with server cart (for when user logs in)
     * @param {Array} localCartItems - Array of product IDs from localStorage
     */
    async syncLocalCart(localCartItems) {
        try {
            const response = await axios.post(`${this.baseURL}/cart/sync`, {
                items: localCartItems
            }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error syncing local cart:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export const cartService = new CartService();

// Also export the class for custom instances
export default CartService;