import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios';
import { getConfig } from "@/Helper/utils";
import Cookies from "js-cookie";

interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    referredBy: string;
    phone: string;
    terms: boolean;  
}

interface LoginRequest {
    identifier: string;
    password: string;
}

interface UpdateUserRequest {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}

interface changePasswordRequest {
    oldPassword: string,
    newPassword: string;
}

interface LoginResponse {
    message: string;
    success: boolean;
    error: string;
    token: string;
}

interface User {
    _id: string;
    username: string;
    firstName: string;
    lastName: string | '';
    email: string;
    isDisabled: boolean;
    isEmailVerified: boolean;
    tc: boolean;
    referralId: string;
    referredBy: string | null;
    phone: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface RegisterResponse {
    message: string;
    success: boolean;
    error: string;
}

interface FetchUserResponse {
    success: boolean;
    message: string;
    user: User;
}

interface UpdateUserResponse {
    success: boolean;
    message: string;
}

interface changePasswordResponse {
    success: boolean;
    message: string;
}
interface sendVerificationCodeResponse {
    success: boolean;
    message: string;
}

interface FetchReferralsParams {
    page: number;
    limit: number;
}

interface FetchReferralsResponse {
    success: boolean;
    message: string;
    directReferrals: any[];
    referralChain: any[];
    totalPages: number;
    currentPage: number;
}

interface AuthState {
    isLoading: boolean;
    error: string | null;
    token: string | null;
    user: User | null;
    referrals: FetchReferralsResponse | null;
}


// Load token from local storage
const loadToken = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

// Initial state for authentication
const initialState: AuthState = {
    isLoading: false,
    error: null,
    token: loadToken(),
    user: null,
    referrals: null,
};

// Async thunk for registering
export const register = createAsyncThunk<RegisterResponse, RegisterRequest>(
    "auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post<RegisterResponse>(
                `${process.env.API_URL}/api/v1/user/register`,
                formData,
                getConfig()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while registering user:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Registration failed. Please try again.");
        }
    }
);

// Async thunk for logging in
export const login = createAsyncThunk<LoginResponse, LoginRequest>(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post<LoginResponse>(
                `${process.env.API_URL}/api/v1/user/login`,
                credentials,
                getConfig()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while login user:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Login failed. Please try again.");
        }
    }
);

// Async thunk for current user details
export const fetchUser = createAsyncThunk<FetchUserResponse>(
    "auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<FetchUserResponse>(
                `${process.env.API_URL}/api/v1/user/fetchUser`,
                getConfig()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while fetching user:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch user details. Please try again.");
        }
    }
);

// Async thunk for current user details
export const sendVerificationCode = createAsyncThunk<sendVerificationCodeResponse>(
    "auth/sendVerificationCode",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post<sendVerificationCodeResponse>(
                `${process.env.API_URL}/api/v1/user/send-verification-mail`,
                {},
                getConfig()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while send verification email:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to send email verification mail. Please try again.");
        }
    }
);

// Async thunk for update current user details
export const updateUser = createAsyncThunk<UpdateUserResponse, UpdateUserRequest>(
    "auth/updateUser",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.patch<FetchUserResponse>(
                `${process.env.API_URL}/api/v1/user/update-user`,
                formData,
                getConfig()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while fetching user:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch user details. Please try again.");
        }
    }
);

// Async thunk for update current user details
export const changePassword = createAsyncThunk<changePasswordResponse, changePasswordRequest>(
    "auth/changePassword",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.patch<FetchUserResponse>(
                `${process.env.API_URL}/api/v1/user/change-password`,
                formData,
                getConfig()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while fetching user:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch user details. Please try again.");
        }
    }
);

// Async thunk for current user referrals
export const fetchReferrals = createAsyncThunk(
    "auth/fetchReferrals",
    async ({ page, limit }: FetchReferralsParams, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/v1/user/referrals?page=${page}&limit=${limit}`, getConfig());
            return response.data;
        } catch (error: any) {
            console.error("Error while fetching referrals:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch referrals. Please try again.");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            // Clear auth state on logout
            Cookies.remove("token")
            state.isLoading = false;
            state.error = null;
            state.token = null;
            state.user = null;
            state.referrals = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Reducers for register action
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
                state.isLoading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Reducers for login action
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? "Login failed.";
            })

            // Reducers for fetch current user Details action
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? "Failed to fetch user details.";
            })

            // Reducers for fetch current user referrals
            .addCase(fetchReferrals.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchReferrals.fulfilled, (state, action) => {
                state.isLoading = false;
                state.referrals = action.payload;
            })
            .addCase(fetchReferrals.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? "Failed to fetch user details.";
            })

            // Reducers for update user action
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<UpdateUserResponse>) => {
                state.isLoading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? "Failed to update user details.";
            })
            // Reducers for update user action
            .addCase(sendVerificationCode.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendVerificationCode.fulfilled, (state, action: PayloadAction<sendVerificationCodeResponse>) => {
                state.isLoading = false;
            })
            .addCase(sendVerificationCode.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? "Failed to send mail verification";
            })
            // Reducers for update user action
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state, action: PayloadAction<changePasswordResponse>) => {
                state.isLoading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? "Failed to change user password.";
            })

    }
});

// Export actions
export const { logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
