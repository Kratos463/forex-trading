import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "@/Helper/utils";

interface Investment {
    _id: string;
    user: string;
    amount: number;
    weeklyRewardPercentage: number;
    status: string;
    returns: any[]; 
    totalRewardEarned: number;
    weeklyRewardEarned: number;
    returnStartFrom: string;
    totalReward: number;
    referralBonusGiven: boolean;
    endDate: string;
    isDisabled: boolean;
    investmentDate: string;
}

interface MakeinvestmentRequest{
    amount: number
}

interface MakeinvestmentResponse{
    success: boolean;
    message: string
}

interface InvestmentResponse {
    success: boolean;
    message: string;
    investments: Investment[];
}

interface InvestmentState {
    investments: Investment[];
    loading: boolean;
    error: string | null;
}

const initialState: InvestmentState = {
    investments: [],
    loading: false,
    error: null,
};

export const fetchInvestments = createAsyncThunk<Investment[], void, { rejectValue: string }>(
    'investment/fetchInvestments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<InvestmentResponse>(
                `${process.env.API_URL}/api/v1/user/investment`,
                getConfig()
            );
            return response.data.investments; // Return the investments array from response.data
        } catch (error: any) {
            console.error("Error while fetching investments:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch investments. Please try again.");
        }
    }
);

export const makeInvestment = createAsyncThunk<MakeinvestmentResponse, MakeinvestmentRequest>(
    "investment/makeInvestment",
    async (amount, { rejectWithValue }) => {
        try {
            const response = await axios.post<MakeinvestmentResponse>(
                `${process.env.API_URL}/api/v1/user/investment`,
                amount,
                getConfig()
            );
            return response.data;
        } catch (error: any) {
            console.error("Error while makeing investment:", error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to make an investment. Please try again.");
        }
    }
);

const investmentSlice = createSlice({
    name: 'investment',
    initialState,
    reducers: {
        clearInvestmentState: (state) => {
            state.investments = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        // reducers for fetch investments
            .addCase(fetchInvestments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvestments.fulfilled, (state, action: PayloadAction<Investment[]>) => {
                state.investments = action.payload;
                state.loading = false;
            })
            .addCase(fetchInvestments.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload;
                } else {
                    state.error = action.error.message ?? "Failed to fetch investments.";
                }
            })

            // reducers for make investment
            .addCase(makeInvestment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(makeInvestment.fulfilled, (state, action: PayloadAction<MakeinvestmentResponse>) => {
                state.loading = false;
            })
            .addCase(makeInvestment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to make investment";
            });
    }
});

export const { clearInvestmentState } = investmentSlice.actions;

export default investmentSlice.reducer;
