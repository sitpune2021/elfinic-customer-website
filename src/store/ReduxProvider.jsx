import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { fetchProducts, fetchProductsBySection } from '../store/slices/productsSlice';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import { fetchCart } from '../store/slices/cartSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { fetchAllBrands } from '../store/slices/apiSlice';
import { getSlider } from '../store/slices/bannerSlice';

// Internal component that handles initial data loading
const DataInitializer = ({ children }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    useEffect(() => {
        // Load initial data when provider mounts
        const initializeData = async () => {
            try {
                console.log('Initializing app data...');

                // Fetch categories and essential public data in parallel
                // This ensures the service worker caches API responses for offline use
                const publicDataPromises = [
                    dispatch(fetchCategories()),
                    dispatch(fetchAllBrands()),
                    dispatch(fetchProductsBySection({ show_section: 'trending' })),
                    dispatch(fetchProductsBySection({ show_section: 'featured' })),
                    dispatch(fetchProductsBySection({ show_section: 'recommended' })),
                    dispatch(getSlider('slider')),
                    dispatch(getSlider('slider2')),
                    dispatch(getSlider('marquee')),
                    dispatch(getSlider('section1')),
                    dispatch(getSlider('section2')),
                ];

                await Promise.allSettled(publicDataPromises);

                // Fetch user-specific data if authenticated and user data exists
                if (isAuthenticated) {
                    const token = localStorage.getItem('token');
                    const userString = localStorage.getItem('user');

                    if (token && userString) {
                        try {
                            JSON.parse(userString); // Validate user data
                            const userDataPromises = [
                                dispatch(fetchWishlist()),
                                dispatch(fetchCart())
                            ];
                            await Promise.allSettled(userDataPromises);
                        } catch (parseError) {
                            console.error('Invalid user data in localStorage:', parseError);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to initialize data:', error);
            }
        };

        initializeData();
    }, [dispatch]);

    // Fetch user-specific data when user logs in
    useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('token');
            const userString = localStorage.getItem('user');

            if (token && userString) {
                try {
                    JSON.parse(userString); // Validate user data
                    dispatch(fetchWishlist());
                    dispatch(fetchCart());
                } catch (parseError) {
                    console.error('Invalid user data in localStorage:', parseError);
                }
            }
        }
    }, [isAuthenticated, dispatch]);

    return children;
};

// Main Redux Provider component
export const ReduxProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <DataInitializer>
                {children}
            </DataInitializer>
        </Provider>
    );
};

export default ReduxProvider;