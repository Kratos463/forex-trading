import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "@/Helper/utils";

interface Promotion {
    name: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    image: any;
    totalSelfInvestment: number;
    totalTeamInvestment: number;
    totalDirectReferral: number;
    _id: string;
    createdAt: string;
    status: string;
}

interface GetPromotionsResponse {
    success: boolean;
    message: string;
    promotions: Promotion[];
}

// Initial state
const initialState = {
    isLoading: false,
    error: null as string | null,
    promotions: [] as Promotion[],
};

// Create async thunk for getting promotions
export const getPromotions = createAsyncThunk<GetPromotionsResponse>(
    "promotion/getPromotions",
    async (_,  { rejectWithValue }) => {
        try {
            const response = await axios.get<GetPromotionsResponse>(
                `${process.env.API_URL}/api/v1/user/get-promotions?page=1&limit=15`,
                getConfig()
            );
            return response.data;
        } catch (error) {
            console.error("Error while fetching promotions:", error);
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || "Failed to fetch promotions. Please try again.");
            }
            return rejectWithValue("Failed to fetch promotions. Please try again.");
        }
    }
);

const promotionSlice = createSlice({
    name: "promotion",
    initialState,
    reducers: {
        clearPromotions: (state) => {
            state.promotions = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPromotions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPromotions.fulfilled, (state, action: PayloadAction<GetPromotionsResponse>) => {
                state.isLoading = false;
                state.promotions = action.payload.promotions;
            })
            .addCase(getPromotions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearPromotions } = promotionSlice.actions;

export default promotionSlice.reducer;

