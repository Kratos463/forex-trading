import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "../utils";

interface User {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    isEmailVerified: boolean;
    createdAt: string,
    wallet?: {
        balance: number;
        totalInvestment: number;
    };
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    totalInvestments: number;
}

interface Settings {
    investmentReturnRate: {
        weeklyReturnRate: number;
        weeklyMaximumReturnRate: number;
    };
    referralCommissionRates: {
        level1: number;
        level2: number;
        level3: number;
        level4: number;
        level5: number;
        level6: number;
        level7: number;
        level8: number;
        level9: number;
        level10: number;
        level11: number;
        level12: number;
        level13: number;
        level14: number;
        level15: number;
    };
    _id: string;
    withdrawalApprovalProcess: string;
    directReferralReturnRate: number;
    createdAt: string;
    updatedAt: string;
}

interface SettingsResponse {
    success: boolean;
    message: string;
    settings: Settings;
}

interface Investment {
    _id: string;
    amount: number;
    investmentDate: string;
    weeklyRewardPercentage: number;
    status: string;
    totalRewardEarned: number;
    weeklyRewardEarned: number;
    returnStartFrom: string;
    totalReward: number;
    referralBonusGiven: boolean;
    endDate: string;
    isDisabled: boolean;
    updatedAt: string;
    userDetails: User;
}

interface WithdrawalRequest {
    _id: string,
    amount: number,
    requestDate: string,
    walletAddress: string,
    status: string,
    approvalDate: string,
    processedDate: string,
    userDetails: User;
}

interface UpdateStatusRequest {
    withdrawalId: string,
    status: string;
}

interface UpdateStatusResponse {
    message: string;
    status: boolean
}

interface FetchUsersResponse {
    status: boolean;
    message: string;
    users: User[];
    pagination: Pagination;
}

interface FetchWithdrawalReqResponse {
    status: boolean;
    message: string;
    requests: WithdrawalRequest[];
}

interface FetchInvestmentResponse {
    status: boolean;
    message: string;
    investments: Investment[];
    pagination: Pagination;
}

interface AddAmountRequest {
    amount: number;
    email: string;
    password: string;
}

interface AddAmountResponse {
    message: string;
    status: boolean
}

interface UserState {
    isLoading: boolean;
    error: string | null;
    users: User[];
    investments: Investment[];
    user: User | null;
    requests: WithdrawalRequest[];
    settings: Settings | null;
    currentPage: number;
    totalPages: number;
    pagination: Pagination;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UserState = {
    isLoading: false,
    error: null,
    users: [],
    user: null,
    investments: [],
    requests: [],
    settings: null,
    currentPage: 1,
    totalPages: 1,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        totalInvestments: 0,
    },
    status: 'idle',
};


export const getUsers = createAsyncThunk<FetchUsersResponse, { page: number, limit: number }>(
    "users/getUsers",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get<FetchUsersResponse>(
                `${process.env.API_URL}/api/v1/admin/get-users?page=${page}&limit=${limit}`,
                getConfig()
            );
            return response.data;
        } catch (error) {
            console.error("Error while fetching users:", error);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                }
                return rejectWithValue("Failed to fetch users list. Please try again.");
            }
            return rejectWithValue("Failed to fetch users list. Please try again.");
        }
    }
);


export const fetchInvestments = createAsyncThunk<FetchInvestmentResponse, { page: number, limit: number }>(
    "users/fetchInvestments",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get<FetchInvestmentResponse>(
                `${process.env.API_URL}/api/v1/admin/get-investments?page=${page}&limit=${limit}`,
                getConfig()
            );
            return response.data;
        } catch (error) {
            console.error("Error while fetching investment list:", error);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                }
                return rejectWithValue("Failed to fetch investment list. Please try again.");
            }
            return rejectWithValue("Failed to fetch investment list. Please try again.");
        }
    }
);

export const fetchWithdrawalRequests = createAsyncThunk<FetchWithdrawalReqResponse>(
    "users/fetchWithdrawalRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<FetchWithdrawalReqResponse>(
                `${process.env.API_URL}/api/v1/admin/get-withdrawal-req`,
                getConfig()
            );
            return response.data;
        } catch (error) {
            console.error("Error while fetching withdrawal request list:", error);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                }
                return rejectWithValue("Failed to fetch withdrawal request. Please try again.");
            }
            return rejectWithValue("Failed to fetch withdrawal request. Please try again.");
        }
    }
);

export const updateWithdrawalRequest = createAsyncThunk<UpdateStatusResponse, UpdateStatusRequest>(
    "users/updateWithdrawalRequest",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post<UpdateStatusResponse>(
                `${process.env.API_URL}/api/v1/admin/update-withdrawal`,
                formData,
                getConfig()
            )

            return response.data
        } catch (error) {
            console.error("Error while updating withdrawal request:", error);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                }
                return rejectWithValue("Failed to update withdrawal request. Please try again.");
            }
            return rejectWithValue("Failed to update withdrawal request. Please try again.");
        }
    }
)

export const fetchROISettings = createAsyncThunk<SettingsResponse>(
    "users/fetchROISettings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<SettingsResponse>(
                `${process.env.API_URL}/api/v1/admin/get-settings`,
                getConfig()
            );
            return response.data;
        } catch (error) {
            console.error("Error while fetching roi settings:", error);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                }
                return rejectWithValue("Failed to fetch roi settings. Please try again.");
            }
            return rejectWithValue("Failed to fetch roi settings. Please try again.");
        }
    }
);

export const addAmounttoUserWallet = createAsyncThunk<AddAmountResponse, AddAmountRequest>(
    "users/addAmounttoUserWallet",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post<AddAmountResponse>(
                `${process.env.API_URL}/api/v1/admin/add-fund`,
                formData,
                getConfig()
            )

            return response.data
        } catch (error) {
            console.error("Error while add fund to user wallet:", error);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                }
                return rejectWithValue("Failed to add fund to user wallet. Please try again.");
            }
            return rejectWithValue("Failed to add fund to user wallet. Please try again.");
        }
    }
)

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(getUsers.fulfilled, (state, action: PayloadAction<FetchUsersResponse>) => {
                state.isLoading = false;
                state.users = action.payload.users;
                state.pagination = action.payload.pagination;
                state.status = 'succeeded';
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.status = 'failed';
            })
            .addCase(updateWithdrawalRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(updateWithdrawalRequest.fulfilled, (state, action: PayloadAction<UpdateStatusResponse>) => {
                state.isLoading = false;
                state.status = 'succeeded';
            })
            .addCase(updateWithdrawalRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.status = 'failed';
            })
            .addCase(fetchInvestments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchInvestments.fulfilled, (state, action: PayloadAction<FetchInvestmentResponse>) => {
                state.isLoading = false;
                state.investments = action.payload.investments;
                state.pagination = action.payload.pagination;
                state.status = 'succeeded';
            })
            .addCase(fetchInvestments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.status = 'failed';
            })
            .addCase(fetchWithdrawalRequests.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchWithdrawalRequests.fulfilled, (state, action: PayloadAction<FetchWithdrawalReqResponse>) => {
                state.isLoading = false;
                state.requests = action.payload.requests;
                state.status = 'succeeded';
            })
            .addCase(fetchWithdrawalRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.status = 'failed';
            })
            .addCase(fetchROISettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchROISettings.fulfilled, (state, action: PayloadAction<SettingsResponse>) => {
                state.isLoading = false;
                state.settings = action.payload.settings;
                state.status = 'succeeded';
            })
            .addCase(fetchROISettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.status = 'failed';
            })
            .addCase(addAmounttoUserWallet.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(addAmounttoUserWallet.fulfilled, (state, action: PayloadAction<AddAmountResponse>) => {
                state.isLoading = false;
                state.status = 'succeeded';
            })
            .addCase(addAmounttoUserWallet.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.status = 'failed';
            });
    },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
