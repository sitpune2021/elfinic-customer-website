import axios from 'axios';
const QUICKEKYC_BASE_URL = import.meta.env.REACT_APP_QUICKEKYC_BASE_URL;
const API_KEY = import.meta.env.REACT_APP_QUICKEKYC_API_KEY;

export const initiateKYC = async (userData) => {
    try {
        const response = await axios.post(`${QUICKEKYC_BASE_URL}/kyc/initiate`, userData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('QuickeKYC Initiate Error:', error);
        throw error;
    }
};

export const getKYCStatus = async (kycId) => {
    try {
        const response = await axios.get(`${QUICKEKYC_BASE_URL}/kyc/status/${kycId}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('QuickeKYC Status Error:', error);
        throw error;
    }
};
