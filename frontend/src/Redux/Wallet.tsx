import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "@/Helper/utils";

// Define the interfaces and initial state here

interface Transaction {
    _id: string;
    type: string;
    commissionType: string | null;
    amount: number;
    details: string;
    transactionDate: string;
}

interface Wallet {
    _id: string;
    user: string;
    balance: number;
    selfRoi: number;
    teamRoi: number;
    directReferral: number;
    walletAddress: string;
    walletQrCode: string;
    totalInvestment: number;
    securitySettings: {
        twoFactorAuthEnabled: boolean;
    };
    transactions: Transaction[];
}

interface WalletResponse {
    success: boolean;
    message: string;
    wallet: Wallet[];
}

interface WithDrawalRequest {
    amount: number;
    walletAddress: string;
}

interface WithDrawalResponse {
    success: boolean;
    message: string;
}

interface AddFundResponse {
    success: boolean;
    message: string;
}

interface WalletState {
    wallet: Wallet | null;
    loading: boolean;
    error: string | null;
}

const initialState: WalletState = {
    wallet: null,   
    loading: false,
    error: null,
};


export const addFundToWallet = createAsyncThunk<AddFundResponse>(
    'wallet/addFundToWallet',
    async (_, { rejectWithValue }) => {
        try {
            const config = getConfig();

            const response = await axios.post<AddFundResponse>(
                `${process.env.API_URL}/api/v1/user/add-fund-wallet`,
                {},
                config
            );
            console.log("Response:", response);

            return response.data;
        } catch (error: any) {
            console.error("Error while adding amount to user wallet:", error.response ? error.response.data : error);
            return rejectWithValue("Failed to add amount in user wallet. Please try again.");
        }
    }
);

export const fetchWallet = createAsyncThunk<Wallet, void, { rejectValue: string }>(
    'wallet/fetchWallet',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<WalletResponse>(
                `${process.env.API_URL}/api/v1/user/get-user-wallet`,
                getConfig()
            );
            if (response.data.wallet && response.data.wallet.length > 0) {
                return response.data.wallet[0]; // Assuming there's only one wallet in the array
            } else {
                return rejectWithValue("No wallet found.");
            }
        } catch (error: any) {
            console.error("Error while fetching user wallet:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch user wallet. Please try again.");
        }
    }
);

export const withdrawalRequest = createAsyncThunk<WithDrawalResponse, WithDrawalRequest>(
    'wallet/withdrawalrequest',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${process.env.API_URL}/api/v1/user/withdrawal-request`,
                formData,
                getConfig()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while withdrawal request:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to make withdrawal. Please try again.");
        }
    }
);
const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        clearWalletState: (state) => {
            state.wallet = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWallet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWallet.fulfilled, (state, action: PayloadAction<Wallet>) => {
                state.wallet = action.payload;
                state.loading = false;
            })
            .addCase(fetchWallet.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload;
                } else {
                    state.error = action.error.message ?? "Failed to fetch user wallet.";
                }
            })
            .addCase(withdrawalRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(withdrawalRequest.fulfilled, (state, action: PayloadAction<WithDrawalResponse>) => {
                state.loading = false;
            })
            .addCase(withdrawalRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to make withdrawal.";
            })
            .addCase(addFundToWallet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFundToWallet.fulfilled, (state, action: PayloadAction<AddFundResponse>) => {
                state.loading = false;
            })
            .addCase(addFundToWallet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to add balace into user wallet.";
            });
    }
});

export const { clearWalletState } = walletSlice.actions;

export default walletSlice.reducer;
