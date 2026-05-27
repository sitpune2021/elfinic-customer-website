import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import categoriesSlice from './slices/categoriesSlice';
import productsSlice from './slices/productsSlice';
import wishlistSlice from './slices/wishlistSlice';
import cartSlice from './slices/cartSlice';
import apiSlice from './slices/apiSlice';
import addressSlice from './slices/addressSlice';
import kycSlice from './slices/kycSlice';
import bannerSlice from './slices/bannerSlice';
import productSearchSlice from './slices/productSearchSlice';
import productDetailsSlice from './slices/productDetailsSlice';
import similarProductsSlice from './slices/similarProductsSlice';
import vendorSlice from './slices/vendorSlice';
import orderSlice from './slices/orderSlice';
import couponSlice from './slices/couponSlice';
import reviewEligibilitySlice from './slices/reviewEligibilitySlice';
import reviewSlice from './slices/reviewSlice';
import productReviewsSlice from './slices/productReviewsSlice';
import userProfileSlice from './slices/userProfileSlice';


export const store = configureStore({
    reducer: {
        auth: authSlice,
        categories: categoriesSlice,
        products: productsSlice,
        wishlist: wishlistSlice,
        cart: cartSlice,
        api: apiSlice,
        address: addressSlice,
        kyc: kycSlice,
        banner: bannerSlice,
        productSearch: productSearchSlice,
        productDetails: productDetailsSlice,
        similarProducts: similarProductsSlice,
        vendors: vendorSlice,
        order: orderSlice,
        coupon: couponSlice,
        reviewEligibility: reviewEligibilitySlice,
        review: reviewSlice,
        productReviews: productReviewsSlice,
        userProfile: userProfileSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

// Export store for use in components
export default store;