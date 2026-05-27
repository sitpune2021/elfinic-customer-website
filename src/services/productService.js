import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

/**
 * Product Service
 * Handles all product-related API calls
 */

/**
 * Fetch products list with filters and pagination
 * @param {Object} filters - Filter parameters (passed as query params)
 * @param {string} filters.name - Product name search
 * @param {string} filters.vendor_id - Vendor ID
 * @param {string} filters.category_id - Category ID
 * @param {string} filters.brand_id - Brand ID
 * @param {string} filters.show_section - Section to show (trending, featured, best_seller, discounted, recommended)
 * @param {number} filters.price_min - Minimum price
 * @param {number} filters.price_max - Maximum price
 * @param {string} filters.size - Product size
 * @param {string} filters.color - Product color
 * @param {number} filters.per_page - Items per page
 * @param {number} filters.page - Current page number
 * @returns {Promise} API response with products data
 * @example
 * // GET https://admin.elfinic.com/api/getProductsList?show_section=featured
 * getProductsList({ show_section: 'featured' })
 */
export const getProductsList = async (filters = {}) => {
    try {
        const params = new URLSearchParams();

        // Add filters as query parameters
        if (filters.name) params.append('name', filters.name);
        if (filters.vendor_id) params.append('vendor_id', filters.vendor_id);
        if (filters.category_id) params.append('category_id', filters.category_id);
        if (filters.brand_id) params.append('brand_id', filters.brand_id);
        if (filters.show_section) params.append('show_section', filters.show_section);
        if (filters.price_min !== undefined) params.append('price_min', filters.price_min);
        if (filters.price_max !== undefined) params.append('price_max', filters.price_max);
        if (filters.size) params.append('size', filters.size);
        if (filters.color) params.append('color', filters.color);
        if (filters.per_page) params.append('per_page', filters.per_page);
        if (filters.page) params.append('page', filters.page);

        const response = await axios.get(`${API_BASE_URL}/getProductsList?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

/**
 * Fetch product details by ID
 * @param {string|number} productId - Product ID
 * @returns {Promise} API response with product details
 */
export const getProductDetails = async (productId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getProductDetails/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};

/**
 * Fetch product details by slug
 * @param {string} slug - Product slug
 * @returns {Promise} API response with product details
 * @example
 * // GET https://admin.elfinic.com/api/productDetails/test-8zv7xowuex98ewoq
 * getProductDetailsBySlug('test-8zv7xowuex98ewoq')
 */
export const getProductDetailsBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/productDetails/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product details by slug:', error);
        throw error;
    }
};

/**
 * Search products by keyword
 * @param {string} keyword - Search keyword
 * @param {number} page - Page number
 * @param {number} perPage - Items per page
 * @returns {Promise} API response with search results
 */
export const searchProducts = async (keyword, page = 1, perPage = 12) => {
    try {
        const params = new URLSearchParams({
            name: keyword,
            page: page,
            per_page: perPage,
        });

        const response = await axios.get(`${API_BASE_URL}/getProductsList?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

/**
 * Fetch similar products based on product ID
 * @param {number} productId - Product ID
 * @returns {Promise} API response with similar products data
 * @example
 * // GET https://admin.elfinic.com/api/getSimilarProducts
 * // Body: { "product_id": 927 }
 * getSimilarProducts(927)
 */
export const getSimilarProducts = async (productId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getSimilarProducts`, {
            params: {
                product_id: productId,
                per_page: 12,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching similar products:', error);
        throw error;
    }
};

export default {
    getProductsList,
    getProductDetails,
    getProductDetailsBySlug,
    searchProducts,
    getSimilarProducts,
};
