import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    token: null,
    user: null,
    loading: false,
    error: null,
};

// Check if user is logged in from localStorage
const checkAuthFromStorage = () => {
    const token = localStorage.getItem('token');
    return {
        isAuthenticated: !!token,
        token: token,
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        ...initialState,
        ...checkAuthFromStorage(),
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.loading = false;
            state.error = null;

            // Store in localStorage
            localStorage.setItem('token', action.payload.token);
            if (action.payload.user) {
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            }
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.loading = false;
            state.error = null;

            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('wishlist');
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
    },
});

export const {
    setLoading,
    setError,
    clearError,
    loginSuccess,
    logout,
    updateUser,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;