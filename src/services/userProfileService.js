import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

// Get authentication token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Fetch user profile
export const getUserProfile = async (userId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/user/profile`,
            { user_id: userId },
            {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update user profile
export const updateUserProfile = async (userId, name, mobile, photo) => {
    try {
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('name', name);
        formData.append('mobile', mobile);

        if (photo instanceof File) {
            formData.append('photo', photo);
        }

        const response = await axios.post(
            `${API_BASE_URL}/user/profile/update`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get dashboard counts
export const getDashboardCounts = async (userId) => {
    console.log("Getting dashboard counts for user ID:", userId);
    try {
        const response = await axios.get(
            `${API_BASE_URL}/dashboardCounts?user_id=${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export default {
    getUserProfile,
    updateUserProfile,
    getDashboardCounts,
};
