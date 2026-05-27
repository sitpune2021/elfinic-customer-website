import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

/**
 * Address Service - Handles all address-related API calls
 */
class AddressService {
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
     * Get user ID from localStorage
     */
    getUserId() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.id;
    }

    /**
     * Fetch all addresses for the user
     */
    async getAllAddresses() {
        try {
            const response = await axios.get(`${this.baseURL}/addresses/getallAdresses`, {
                params: { user_id: this.getUserId() },
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching addresses:', error);
            throw error;
        }
    }

    /**
     * Add a new address
     * @param {Object} addressData - Address data to add
     */
    async addAddress(addressData) {
        try {
            const userId = this.getUserId();
            const payload = {
                user_id: userId,
                name: addressData.name,
                type: addressData.type || 'Home',
                phone: addressData.phone,
                address_line1: addressData.address_line1,
                address_line2: addressData.address_line2 || '',
                city: addressData.city,
                state: addressData.state,
                country: addressData.country || 'India',
                postal_code: addressData.postal_code,
                is_default: addressData.is_default || 0
            };

            const response = await axios.post(
                `${this.baseURL}/addresses/addaddress`,
                payload,
                {
                    headers: this.getAuthHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding address:', error);
            throw error;
        }
    }

    /**
     * Update an existing address
     * @param {Object} addressData - Address data to update
     */
    async updateAddress(addressData) {

        try {

            const updatedata = {
                id: addressData.id,
                user_id: this.getUserId(),
                type: addressData.type,
                name: addressData.name,
                phone: addressData.phone,
                address_line1: addressData.address_line1, // ← Capital L
                address_line2: addressData.address_line2 || '', // ← Capital L
                city: addressData.city,
                state: addressData.state,
                country: addressData.country || 'India',
                postal_code: addressData.postal_code,
                is_default: addressData.is_default || 0
            };


            const response = await axios.post(
                `${this.baseURL}/addresses/updateAddress`,
                updatedata,
                {
                    headers: this.getAuthHeaders(),
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error updating address:', error);
            throw error;
        }
    }

    /**
     * Delete an address
     * @param {number} addressId - Address ID to delete
     */
    async deleteAddress(addressId) {

        try {
            // console.log('Deleting address with ID:', addressId);
            // return;
            const response = await axios.delete(
                `${this.baseURL}/addresses/deleteAddress`,
                {
                    params: { address_id: addressId },
                    headers: this.getAuthHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting address:', error);
            throw error;
        }
    }
}

// Export a singleton instance
const addressService = new AddressService();
export default addressService;
