import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';


// Create the API context
const ApiContext = createContext();

// Base API URL
const API_BASE_URL = 'https://admin.elfinic.com/api';
const image_path = `${API_BASE_URL.replace('/api', '')}/assets/img/`;

// Custom hook to use the API context
export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};

// API Provider component
export const ApiProvider = ({ children }) => {
    // State for categories
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState(null);

    // State for products
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState(null);

    // country codes
    const [countryCodes, setCountryCodes] = useState([]);

    // Generic API fetch function using axios
    const fetchFromAPI = async (endpoint, options = {}) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${API_BASE_URL}${endpoint}`,
                ...options
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch from ${endpoint}: ${error.message}`);
        }
    };

    // Fetch categories function
    const fetchCategories = async () => {
        setCategoriesLoading(true);
        setCategoriesError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/getAllCategories`);
            // console.log('Categories API response:', response.data);

            // Extract data from the API response structure
            const categoryData = response.data?.data || response.data;
            setCategories(Array.isArray(categoryData) ? categoryData : []);
        } catch (error) {
            setCategoriesError(error.message);
            console.error('Error fetching categories:', error);
            setCategories([]); // Set empty array on error
        } finally {
            setCategoriesLoading(false);
        }
    };

    // Fetch products function
    // ❌ REMOVED: getAllProducts API - causing integration issues
    const fetchProducts = async () => {
        setProductsLoading(true);
        setProductsError(null);

        try {
            // const response = await axios.get(`${API_BASE_URL}/getAllProducts`);
            // console.log('Products API response:', response.data);

            // Extract data from the API response structure
            // const productData = response.data?.data || response.data;
            // setProducts(Array.isArray(productData) ? productData : []);

            // Set empty array instead
            setProducts([]);
        } catch (error) {
            setProductsError(error.message);
            console.error('Error fetching products:', error);
            setProducts([]); // Set empty array on error
        } finally {
            setProductsLoading(false);
        }
    };

    // Refresh all data function
    const refreshAllData = async () => {
        await Promise.all([fetchCategories(), fetchProducts()]);
    };

    // Load initial data when provider mounts
    useEffect(() => {
        const initializeData = async () => {
            try {
                await fetchCategories();
                await fetchProducts();
            } catch (error) {
                console.error('Failed to initialize data:', error);
            }
        };

        initializeData();
    }, []); // Empty dependency array to run only once on mount
    function categoryName(id) {
        const category = categories.find(cat => String(cat.id) === String(id));
        return category ? category.name : '';
    }
    function IsLogin() {
        const token = localStorage.getItem('token');
        if (token) {
            return true;
        }
        return false;
    }
    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getWishlist`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("Wishlist data:", response.data);
            const productIds = response.data.data.map(item => String(item.product_id));
            localStorage.setItem('wishlist', JSON.stringify(productIds));
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            localStorage.setItem('wishlist', JSON.stringify([]));
        }
    };

    const fetchRemoveFromWishlist = async (product_id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/removeFromWishlist`, { product_id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("Remove from wishlist response:", response.data);
            const updatedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]').filter(id => String(id) !== String(product_id));
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            return response.data;
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            throw error;
        }
    };
    const fetchAddToWishlist = async (product_id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/wishlist/add`, { product_id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("Add to wishlist response:", response.data);
            const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            const updatedWishlist = [...currentWishlist, String(product_id)];
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            return response.data;
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            throw error;
        }
    };
    const fetchCountryCode = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,idd,cca2,flags');
            const countryData = response.data.map(country => {
                const dialCode = country.idd.root
                    ? country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '')
                    : '';
                return {
                    name: country.name.common,
                    code: country.cca2,
                    dialCode,
                    flag: country.flags.png
                };
            });
            countryData.sort((a, b) => a.name.localeCompare(b.name));
            // console.log("Fetched country codes:", countryData);
            setCountryCodes(countryData);
        } catch (error) {
            console.error("Error fetching country code:", error);
            throw error;
        }
    };
    useEffect(() => {
        fetchCountryCode();
    }, []);

    // Context value
    const contextValue = {
        // Categories data and state
        categories,
        categoriesLoading,
        categoriesError,

        // Products data and state
        products,
        productsLoading,
        productsError,

        // country codes
        countryCodes,

        // API functions
        fetchCategories,
        fetchProducts,
        refreshAllData,
        fetchFromAPI, // For custom API calls if needed
        categoryName,
        IsLogin,
        fetchWishlist,
        fetchRemoveFromWishlist,
        fetchAddToWishlist,
        fetchCountryCode,

        // API base URL for reference
        API_BASE_URL,

        // image_path
        image_path,


    };

    return (
        <ApiContext.Provider value={contextValue}>
            {children}
        </ApiContext.Provider>
    );
};

export default ApiContext;
