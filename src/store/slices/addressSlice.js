import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import addressService from '../../services/addressService';
import { toast } from 'react-toastify';

// Async thunks for address operations

/**
 * Fetch all addresses for the logged-in user
 */
export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await addressService.getAllAddresses();
            return response.data || [];
        } catch (error) {
            console.error('Error fetching addresses:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Add a new address
 */
export const addAddress = createAsyncThunk(
    'address/addAddress',
    async (addressData, { rejectWithValue }) => {
        try {

            const response = await addressService.addAddress(addressData);
            return response.data;
        } catch (error) {
            console.error('Error adding address:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Update an existing address
 */
export const updateAddress = createAsyncThunk(
    'address/updateAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            // console.log('Updating address:', addressData);
            // return;
            const response = await addressService.updateAddress(addressData);
            return response.data;
        } catch (error) {
            console.error('Error updating address:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Delete an address
 */
export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            await addressService.deleteAddress(addressId);
            toast.success('Address deleted successfully!');
            return addressId;
        } catch (error) {
            console.error('Error deleting address:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Initial state
const initialState = {
    addresses: [],
    selectedAddressId: null,
    loading: false,
    error: null,
    actionLoading: false, // For add/update/delete operations
    actionError: null,
};

// Address slice
const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        // Select an address
        selectAddress: (state, action) => {
            state.selectedAddressId = action.payload;
        },
        // Clear errors
        clearError: (state) => {
            state.error = null;
            state.actionError = null;
        },
        // Set default address
        setDefaultAddress: (state, action) => {
            state.addresses = state.addresses.map(addr => ({
                ...addr,
                is_default: addr.id === action.payload ? 1 : 0
            }));
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
                // Auto-select default address or first address
                const defaultAddress = action.payload.find(addr => addr.is_default === 1);
                if (defaultAddress) {
                    state.selectedAddressId = defaultAddress.id;
                } else if (action.payload.length > 0) {
                    state.selectedAddressId = action.payload[0].id;
                }
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add address
            .addCase(addAddress.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.addresses.push(action.payload);
                // If this is the first address or set as default, select it
                if (action.payload.is_default === 1 || state.addresses.length === 1) {
                    state.selectedAddressId = action.payload.id;
                }
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })

            // Update address
            .addCase(updateAddress.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })

            // Delete address
            .addCase(deleteAddress.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
                // If deleted address was selected, select first remaining address
                if (state.selectedAddressId === action.payload && state.addresses.length > 0) {
                    state.selectedAddressId = state.addresses[0].id;
                }
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            });
    }
});

// Export actions
export const { selectAddress, clearError, setDefaultAddress } = addressSlice.actions;

// Selectors
export const selectAddresses = (state) => state.address.addresses;
export const selectSelectedAddressId = (state) => state.address.selectedAddressId;
export const selectSelectedAddress = (state) => {
    const addresses = state.address.addresses;
    const selectedId = state.address.selectedAddressId;
    return addresses.find(addr => addr.id === selectedId) || null;
};
export const selectAddressLoading = (state) => state.address.loading;
export const selectAddressError = (state) => state.address.error;
export const selectActionLoading = (state) => state.address.actionLoading;
export const selectActionError = (state) => state.address.actionError;

export default addressSlice.reducer;