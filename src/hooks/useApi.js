import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    selectCategories,
    selectCategoriesLoading,
    selectCategoriesError,
    selectCategoryNameById,
    fetchCategories,
} from '../store/slices/categoriesSlice';
import {
    selectProducts,
    selectProductsLoading,
    selectProductsError,
    selectSelectedProduct,
    selectSelectedProductLoading,
    selectSelectedProductError,
    selectProductById,
    fetchProducts,
    fetchProductById,
    fetchProductsBySection,
    selectSectionProducts,
    selectSectionLoading,
    selectSectionError,
} from '../store/slices/productsSlice';
import {
    selectWishlistItems,
    selectWishlistLoading,
    selectWishlistError,
    selectIsInWishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
} from '../store/slices/wishlistSlice';
import {
    selectCartItems,
    selectCartLoading,
    selectCartError,
    selectCartTotalItems,
    selectCartTotalPrice,
    selectLocalCart,
    selectIsInCart,
    selectCartItemByProductId,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    addToLocalCart,
    removeFromLocalCart,
    clearLocalCart,
    clearError as clearCartError,
} from '../store/slices/cartSlice';
import {
    selectIsAuthenticated,
    selectToken,
    selectUser,
    selectAuthLoading,
    selectAuthError,
    loginSuccess,
    logout,
} from '../store/slices/authSlice';
import {
    makeApiCall,
    selectApiLoading,
    selectApiError,
    selectLastApiResponse,
    fetchAllBrands,
    selectBrands,
    selectBrandsLoading,
    selectBrandsError,
    API_BASE_URL,
    image_path,
} from '../store/slices/apiSlice';
import {
    getSlider,
} from '../store/slices/bannerSlice';
import {
    fetchCoupons,
    applyCoupon,
    clearAppliedCoupon,
    clearCouponError,
    selectCoupons,
    selectCouponsLoading,
    selectCouponsError,
    selectAppliedCoupon,
    selectDiscountInfo,
    selectApplyLoading,
    selectApplyError,
    selectApplySuccess,
} from '../store/slices/couponSlice';

/**
 * Custom hook that provides all API and state management functionality
 * This replaces the old useApi hook from ApiContext
 */
export const useApi = () => {
    const dispatch = useAppDispatch();

    // Auth selectors
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const token = useAppSelector(selectToken);
    const user = useAppSelector(selectUser);
    const authLoading = useAppSelector(selectAuthLoading);
    const authError = useAppSelector(selectAuthError);

    // Categories selectors
    const categories = useAppSelector(selectCategories);
    const categoriesLoading = useAppSelector(selectCategoriesLoading);
    const categoriesError = useAppSelector(selectCategoriesError);

    // Products selectors
    const products = useAppSelector(selectProducts);
    const productsLoading = useAppSelector(selectProductsLoading);
    const productsError = useAppSelector(selectProductsError);
    const selectedProduct = useAppSelector(selectSelectedProduct);
    const selectedProductLoading = useAppSelector(selectSelectedProductLoading);
    const selectedProductError = useAppSelector(selectSelectedProductError);

    // Wishlist selectors
    const wishlistItems = useAppSelector(selectWishlistItems);
    const wishlistLoading = useAppSelector(selectWishlistLoading);
    const wishlistError = useAppSelector(selectWishlistError);

    // Cart selectors
    const cartItems = useAppSelector(selectCartItems);
    const cartLoading = useAppSelector(selectCartLoading);
    const cartError = useAppSelector(selectCartError);
    const cartTotalItems = useAppSelector(selectCartTotalItems);
    const cartTotalPrice = useAppSelector(selectCartTotalPrice);
    const localCart = useAppSelector(selectLocalCart);

    // Address selectors
    const addressItems = useAppSelector((state) => state.address.items);

    // Generic API selectors
    const apiLoading = useAppSelector(selectApiLoading);
    const apiError = useAppSelector(selectApiError);
    const lastApiResponse = useAppSelector(selectLastApiResponse);

    // Brands selectors
    const brands = useAppSelector(selectBrands);
    const brandsLoading = useAppSelector(selectBrandsLoading);
    const brandsError = useAppSelector(selectBrandsError);

    // Coupon selectors
    const coupons = useAppSelector(selectCoupons);
    const couponsLoading = useAppSelector(selectCouponsLoading);
    const couponsError = useAppSelector(selectCouponsError);
    const appliedCoupon = useAppSelector(selectAppliedCoupon);
    const discountInfo = useAppSelector(selectDiscountInfo);
    const couponApplyLoading = useAppSelector(selectApplyLoading);
    const couponApplyError = useAppSelector(selectApplyError);
    const couponApplySuccess = useAppSelector(selectApplySuccess);

    // Action creators
    const fetchCategoriesData = useCallback(() => {
        return dispatch(fetchCategories());
    }, [dispatch]);

    const fetchProductsData = useCallback(() => {
        return dispatch(fetchProducts());
    }, [dispatch]);

    const fetchProductDetails = useCallback((productId) => {
        return dispatch(fetchProductById(productId));
    }, [dispatch]);

    const fetchProductsBySectionData = useCallback((params = {}) => {
        return dispatch(fetchProductsBySection(params));
    }, [dispatch]);

    const getSectionProducts = useCallback((section) => {
        return useAppSelector(state => selectSectionProducts(state, section));
    }, []);

    const getSectionLoading = useCallback((section) => {
        return useAppSelector(state => selectSectionLoading(state, section));
    }, []);

    const getSectionError = useCallback((section) => {
        return useAppSelector(state => selectSectionError(state, section));
    }, []);

    const fetchWishlistData = useCallback(() => {
        return dispatch(fetchWishlist());
    }, [dispatch]);

    const fetchAddToWishlist = useCallback((productId) => {
        return dispatch(addToWishlist(productId));
    }, [dispatch]);

    // Cart action creators
    const fetchCartData = useCallback(() => {
        return dispatch(fetchCart());
    }, [dispatch]);

    const fetchAddToCart = useCallback((productId, quantity = 1) => {
        if (isAuthenticated) {
            return dispatch(addToCart({ product_id: productId, quantity }));
        } else {
            return dispatch(addToLocalCart(productId));
        }
    }, [dispatch, isAuthenticated]);

    const fetchUpdateCartItem = useCallback((itemId, quantity) => {
        return dispatch(updateCartItem({ itemId, quantity }));
    }, [dispatch]);

    const fetchRemoveFromCart = useCallback((itemId) => {
        if (isAuthenticated) {
            return dispatch(removeFromCart(itemId));
        } else {
            return dispatch(removeFromLocalCart(itemId));
        }
    }, [dispatch, isAuthenticated]);

    const clearCart = useCallback(() => {
        return dispatch(clearLocalCart());
    }, [dispatch]);

    const clearCartErrorHandler = useCallback(() => {
        return dispatch(clearCartError());
    }, [dispatch]);

    const fetchRemoveFromWishlist = useCallback((productId) => {
        return dispatch(removeFromWishlist(productId));
    }, [dispatch]);

    const fetchBrandsData = useCallback(() => {
        return dispatch(fetchAllBrands());
    }, [dispatch]);

    // Coupon action creators
    const fetchCouponsData = useCallback(() => {
        return dispatch(fetchCoupons());
    }, [dispatch]);

    const applyCouponCode = useCallback((userId, couponCode, cartItems, cartSubtotal) => {
        return dispatch(applyCoupon({ userId, couponCode, cartItems, cartSubtotal }));
    }, [dispatch]);

    const removeCoupon = useCallback(() => {
        return dispatch(clearAppliedCoupon());
    }, [dispatch]);

    const clearCouponErrorHandler = useCallback(() => {
        return dispatch(clearCouponError());
    }, [dispatch]);

    const refreshAllData = useCallback(async () => {
        await Promise.all([
            dispatch(fetchCategories()),
            dispatch(fetchProducts()),
            dispatch(fetchAllBrands()),
        ]);
        if (isAuthenticated) {
            await Promise.all([
                dispatch(fetchWishlist()),
                dispatch(fetchCart())
            ]);
        }
    }, [dispatch, isAuthenticated]);

    const fetchFromAPI = useCallback((endpoint, options = {}) => {
        const { method = 'GET', data = null, requireAuth = false } = options;
        return dispatch(makeApiCall({ endpoint, method, data, requireAuth }));
    }, [dispatch]);

    // Helper functions - these need to access current state each time
    const categoryName = useCallback((categoryId) => {
        const category = categories.find(cat => String(cat.id) === String(categoryId));
        return category ? category.name : '';
    }, [categories]);

    const getProductById = useCallback((productId) => {
        return products.find(product => String(product.id) === String(productId));
    }, [products]);

    const isInWishlist = useCallback((productId) => {
        return wishlistItems.includes(String(productId));
    }, [wishlistItems]);

    // Cart helper functions
    const isInCart = useCallback((productId) => {
        if (isAuthenticated) {
            return cartItems.some(item => String(item.product_id) === String(productId));
        } else {
            return localCart.includes(String(productId));
        }
    }, [cartItems, localCart, isAuthenticated]);

    const getCartItemByProductId = useCallback((productId) => {
        return cartItems.find(item => String(item.product_id) === String(productId));
    }, [cartItems]);

    // Auth functions
    const IsLogin = useCallback(() => {
        return isAuthenticated;
    }, [isAuthenticated]);

    const handleLogin = useCallback((authData) => {
        return dispatch(loginSuccess(authData));
    }, [dispatch]);

    const handleLogout = useCallback(() => {
        return dispatch(logout());
    }, [dispatch]);

    return {
        // Auth state and functions
        isAuthenticated,
        token,
        user,
        authLoading,
        authError,
        IsLogin,
        handleLogin,
        handleLogout,

        // Categories data and state
        categories,
        categoriesLoading,
        categoriesError,
        fetchCategories: fetchCategoriesData,
        categoryName,

        // Products data and state
        products,
        productsLoading,
        productsError,
        selectedProduct,
        selectedProductLoading,
        selectedProductError,
        fetchProducts: fetchProductsData,
        fetchProductById: fetchProductDetails,
        fetchProductsBySection: fetchProductsBySectionData,
        getSectionProducts,
        getSectionLoading,
        getSectionError,
        getProductById,

        // Wishlist data and state
        wishlistItems,
        wishlistLoading,
        wishlistError,
        fetchWishlist: fetchWishlistData,
        fetchAddToWishlist,
        fetchRemoveFromWishlist,
        isInWishlist,

        // Cart data and state
        cartItems,
        cartLoading,
        cartError,
        cartTotalItems,
        cartTotalPrice,
        localCart,
        fetchCart: fetchCartData,
        fetchAddToCart,
        fetchUpdateCartItem,
        fetchRemoveFromCart,
        clearCart,
        clearCartError: clearCartErrorHandler,
        isInCart,
        getCartItemByProductId,

        // Brands data and state
        brands,
        brandsLoading,
        brandsError,
        fetchBrands: fetchBrandsData,

        // Coupon data and state
        coupons,
        couponsLoading,
        couponsError,
        appliedCoupon,
        discountInfo,
        couponApplyLoading,
        couponApplyError,
        couponApplySuccess,
        fetchCoupons: fetchCouponsData,
        applyCouponCode,
        removeCoupon,
        clearCouponError: clearCouponErrorHandler,

        // Generic API functions
        fetchFromAPI,
        apiLoading,
        apiError,
        lastApiResponse,
        refreshAllData,

        // Constants
        API_BASE_URL,
        image_path,
    };
};

export default useApi;