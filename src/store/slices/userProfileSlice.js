import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
    'userProfile/fetchProfile',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_BASE_URL}/user/profile?user_id=${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
    'userProfile/updateProfile',
    async ({ userId, name, mobile, photo }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
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
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState: {
        profile: null,
        loading: false,
        error: null,
        updateLoading: false,
        updateError: null,
    },
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
        },
        clearErrors: (state) => {
            state.error = null;
            state.updateError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update profile
            .addCase(updateUserProfile.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            });
    },
});

export const { clearProfile, clearErrors } = userProfileSlice.actions;
export default userProfileSlice.reducer;
