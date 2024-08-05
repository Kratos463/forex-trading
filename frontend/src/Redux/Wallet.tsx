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

interface USDTTransaction {
    _id: string;
    amount: number;
    createdAt: string;
    transactionHash: string;
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
    usdtTransactions: USDTTransaction[];
}

interface WalletResponse {
    success: boolean;
    message: string;
    wallet: Wallet;
}

interface WithdrawalResponse {
    _id: string;
    amount: number;
    walletAddress: string;
    status: string;
    approvalDate: string;
    processedDate: string;
    requestDate: string;
}

interface WithDrawalRequestResponse {
    success: boolean;
    message: string;
    withdrawalRequests: WithdrawalResponse[];
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
    success: boolean;
    error: string | null;
    withdrawalRequests: WithdrawalResponse[];

}

const initialState: WalletState = {
    wallet: null,
    loading: false,
    error: null,
    success: false,
    withdrawalRequests: [],
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
            return response.data.wallet;
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
            if (error.response && error.response.data && error.response.data.error) {
                return rejectWithValue(error.response.data.error);
            }
            return rejectWithValue("Failed to make withdrawal. Please try again.");
        }
    }
);



export const fetchWithdrawalRequest = createAsyncThunk<WithDrawalRequestResponse>(
    'wallet/fetchWithdrawalRequest',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${process.env.API_URL}/api/v1/user/withdrawal-request`,
                getConfig()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while fetching withdrawal requests:", error);
            if (error.response && error.response.data && error.response.data.error) {
                return rejectWithValue(error.response.data.error);
            }
            return rejectWithValue("Failed to fetch withdrawal requests. Please try again.");
        }
    }
);

export const verifyWithdrawalRequest = createAsyncThunk<
    WithDrawalResponse, 
    { requestId: string, code: string }, 
    { rejectValue: string }  
>(
    'wallet/verifyWithdrawalRequest',
    async ({ requestId, code }, { rejectWithValue }) => {
        try {
            const response = await axios.post<WithDrawalResponse>(
                `${process.env.API_URL}/api/v1/user/withdrawal-request-verify`,
                { requestId, code },
                getConfig()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while verifying withdrawal request:", error);
            if (error.response && error.response.data && error.response.data.error) {
                return rejectWithValue(error.response.data.error);
            }
            return rejectWithValue("Failed to verify withdrawal request. Please try again.");
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
            state.success = false;
            state.withdrawalRequests = [];
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
                state.success = false;
            })
            .addCase(withdrawalRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(withdrawalRequest.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
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
                state.error = action.error.message ?? "Failed to add balance into user wallet.";
            })
            .addCase(fetchWithdrawalRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchWithdrawalRequest.fulfilled, (state, action: PayloadAction<WithDrawalRequestResponse>) => {
                state.loading = false;
                state.success = true;
                state.withdrawalRequests = action.payload.withdrawalRequests;
                state.error = null;
            })
            .addCase(fetchWithdrawalRequest.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            .addCase(verifyWithdrawalRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(verifyWithdrawalRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(verifyWithdrawalRequest.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });;
    }
});

export const { clearWalletState } = walletSlice.actions;

export default walletSlice.reducer;
