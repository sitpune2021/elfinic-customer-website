import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

/**
 * Vendor Service
 * Handles all vendor-related API calls
 */

/**
 * Fetch all vendors with filters and pagination
 * @param {Object} filters - Filter parameters
 * @param {string} filters.country - Country code (e.g., "IN")
 * @param {string} filters.state - State code (e.g., "MH")
 * @param {string} filters.city - City name
 * @param {string} filters.company_name - Company name for search
 * @param {number} filters.page - Current page number
 * @param {number} filters.per_page - Items per page
 * @returns {Promise} API response with vendors data
 * @example
 * // GET https://admin.elfinic.com/api/vendor/getAllVendors
 * getAllVendors({ country: 'IN', state: 'MH', company_name: 'Gaurav patil' })
 */
export const getAllVendors = async (filters = {}) => {
    try {
        const requestBody = {};

        // Add filters to request body
        if (filters.country) requestBody.country = filters.country;
        if (filters.state) requestBody.state = filters.state;
        if (filters.city) requestBody.city = filters.city;
        if (filters.company_name !== undefined) requestBody.company_name = filters.company_name;
        if (filters.page) requestBody.page = filters.page;
        requestBody.per_page = filters.per_page || 12;

        const response = await axios.get(`${API_BASE_URL}/vendor/getAllVendors`, {
            params: requestBody,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching vendors:', error);
        throw error;
    }
};

/**
 * Search vendors by company name
 * @param {string} searchTerm - Search term for company name
 * @param {Object} additionalFilters - Additional filter parameters
 * @returns {Promise} API response with search results
 */
export const searchVendors = async (searchTerm, additionalFilters = {}) => {
    try {
        const filters = {
            company_name: searchTerm,
            ...additionalFilters,
        };

        return await getAllVendors(filters);
    } catch (error) {
        console.error('Error searching vendors:', error);
        throw error;
    }
};

/**
 * Fetch vendor details by ID
 * @param {string|number} vendorId - Vendor ID
 * @returns {Promise} API response with vendor details
 */
export const getVendorDetails = async (vendorId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendor/getVendorDetails/${vendorId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching vendor details:', error);
        throw error;
    }
};

export default {
    getAllVendors,
    searchVendors,
    getVendorDetails,
};
