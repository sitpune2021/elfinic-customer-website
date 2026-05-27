import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Correct
const KYC_API_BASE = import.meta.env.VITE_QUICKEKYC_BASE_URL;
const KYC_API_KEY = import.meta.env.VITE_QUICKEKYC_API_KEY;


// Async thunk for Aadhaar verification
export const verifyAadhaar = createAsyncThunk(
    'kyc/verifyAadhaar',
    async (aadhaarData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${KYC_API_BASE}/aadhaar/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${KYC_API_KEY}`
                },
                body: JSON.stringify({
                    aadhaar_number: aadhaarData.number,
                    name: aadhaarData.name
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Aadhaar verification failed');
            }

            const data = await response.json();
            return {
                verified: data.verified,
                name: data.name,
                address: data.address,
                message: data.message
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for PAN verification
export const verifyPAN = createAsyncThunk(
    'kyc/verifyPAN',
    async (panData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${KYC_API_BASE}/pan/pan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${KYC_API_KEY}`
                },
                body: JSON.stringify({
                    pan_number: panData.number,
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'PAN verification failed');
            }

            const data = await response.json();
            return {
                verified: data.verified,
                name: data.name,
                category: data.category,
                message: data.message
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for GST verification
export const verifyGST = createAsyncThunk(
    'kyc/verifyGST',
    async (gstData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${KYC_API_BASE}/gst/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${KYC_API_KEY}`
                },
                body: JSON.stringify({
                    gst_number: gstData.number,
                    business_name: gstData.businessName
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'GST verification failed');
            }

            const data = await response.json();
            return {
                verified: data.verified,
                businessName: data.business_name,
                address: data.address,
                status: data.status,
                message: data.message
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for MSME/Udyog Aadhaar verification
export const verifyMSME = createAsyncThunk(
    'kyc/verifyMSME',
    async (msmeData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${KYC_API_BASE}/msme/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${KYC_API_KEY}`
                },
                body: JSON.stringify({
                    udyog_aadhaar: msmeData.number,
                    enterprise_name: msmeData.enterpriseName
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'MSME verification failed');
            }

            const data = await response.json();
            return {
                verified: data.verified,
                enterpriseName: data.enterprise_name,
                category: data.category,
                type: data.type,
                message: data.message
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    // Aadhaar verification state
    aadhaar: {
        isVerifying: false,
        isVerified: false,
        data: null,
        error: null
    },
    // PAN verification state
    pan: {
        isVerifying: false,
        isVerified: false,
        data: null,
        error: null
    },
    // GST verification state
    gst: {
        isVerifying: false,
        isVerified: false,
        data: null,
        error: null
    },
    // MSME verification state
    msme: {
        isVerifying: false,
        isVerified: false,
        data: null,
        error: null
    },
    // Overall verification status
    allVerified: false
};

const kycSlice = createSlice({
    name: 'kyc',
    initialState,
    reducers: {
        // Reset specific verification
        resetAadhaarVerification: (state) => {
            state.aadhaar = initialState.aadhaar;
            state.allVerified = false;
        },
        resetPANVerification: (state) => {
            state.pan = initialState.pan;
            state.allVerified = false;
        },
        resetGSTVerification: (state) => {
            state.gst = initialState.gst;
        },
        resetMSMEVerification: (state) => {
            state.msme = initialState.msme;
        },
        // Reset all verifications
        resetAllVerifications: (state) => {
            return initialState;
        },
        // Clear specific errors
        clearAadhaarError: (state) => {
            state.aadhaar.error = null;
        },
        clearPANError: (state) => {
            state.pan.error = null;
        },
        clearGSTError: (state) => {
            state.gst.error = null;
        },
        clearMSMEError: (state) => {
            state.msme.error = null;
        },
        // Update overall verification status
        updateAllVerifiedStatus: (state) => {
            state.allVerified = state.aadhaar.isVerified && state.pan.isVerified;
        }
    },
    extraReducers: (builder) => {
        // Aadhaar verification
        builder
            .addCase(verifyAadhaar.pending, (state) => {
                state.aadhaar.isVerifying = true;
                state.aadhaar.error = null;
            })
            .addCase(verifyAadhaar.fulfilled, (state, action) => {
                state.aadhaar.isVerifying = false;
                state.aadhaar.isVerified = action.payload.verified;
                state.aadhaar.data = action.payload;
                if (!action.payload.verified) {
                    state.aadhaar.error = action.payload.message || 'Aadhaar verification failed';
                }
            })
            .addCase(verifyAadhaar.rejected, (state, action) => {
                state.aadhaar.isVerifying = false;
                state.aadhaar.isVerified = false;
                state.aadhaar.error = action.payload;
            })

        // PAN verification
        builder
            .addCase(verifyPAN.pending, (state) => {
                state.pan.isVerifying = true;
                state.pan.error = null;
            })
            .addCase(verifyPAN.fulfilled, (state, action) => {
                state.pan.isVerifying = false;
                state.pan.isVerified = action.payload.verified;
                state.pan.data = action.payload;
                if (!action.payload.verified) {
                    state.pan.error = action.payload.message || 'PAN verification failed';
                }
            })
            .addCase(verifyPAN.rejected, (state, action) => {
                state.pan.isVerifying = false;
                state.pan.isVerified = false;
                state.pan.error = action.payload;
            })

        // GST verification
        builder
            .addCase(verifyGST.pending, (state) => {
                state.gst.isVerifying = true;
                state.gst.error = null;
            })
            .addCase(verifyGST.fulfilled, (state, action) => {
                state.gst.isVerifying = false;
                state.gst.isVerified = action.payload.verified;
                state.gst.data = action.payload;
                if (!action.payload.verified) {
                    state.gst.error = action.payload.message || 'GST verification failed';
                }
            })
            .addCase(verifyGST.rejected, (state, action) => {
                state.gst.isVerifying = false;
                state.gst.isVerified = false;
                state.gst.error = action.payload;
            })

        // MSME verification
        builder
            .addCase(verifyMSME.pending, (state) => {
                state.msme.isVerifying = true;
                state.msme.error = null;
            })
            .addCase(verifyMSME.fulfilled, (state, action) => {
                state.msme.isVerifying = false;
                state.msme.isVerified = action.payload.verified;
                state.msme.data = action.payload;
                if (!action.payload.verified) {
                    state.msme.error = action.payload.message || 'MSME verification failed';
                }
            })
            .addCase(verifyMSME.rejected, (state, action) => {
                state.msme.isVerifying = false;
                state.msme.isVerified = false;
                state.msme.error = action.payload;
            });
    }
});

// Action creators
export const {
    resetAadhaarVerification,
    resetPANVerification,
    resetGSTVerification,
    resetMSMEVerification,
    resetAllVerifications,
    clearAadhaarError,
    clearPANError,
    clearGSTError,
    clearMSMEError,
    updateAllVerifiedStatus
} = kycSlice.actions;

// Selectors
export const selectAadhaarVerification = (state) => state.kyc.aadhaar;
export const selectPANVerification = (state) => state.kyc.pan;
export const selectGSTVerification = (state) => state.kyc.gst;
export const selectMSMEVerification = (state) => state.kyc.msme;
export const selectAllVerified = (state) => state.kyc.allVerified;
export const selectRequiredVerificationsComplete = (state) =>
    state.kyc.aadhaar.isVerified && state.kyc.pan.isVerified;

export default kycSlice.reducer;
