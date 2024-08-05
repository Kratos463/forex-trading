import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "../utils";


interface Pagination {
    currentPage: number;
    totalPages: number;
    totalPromotions: number;
}

// Define types for promotion 
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
    updatedAt: string;
    status: string;
}

interface PromotionRequest {
    name: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    coverImage: File;
    totalSelfInvestment: number;
    totalTeamInvestment: number;
    totalDirectReferral: number;
}

interface PromotionResponse {
    message: string;
    success: boolean;
}

interface GetPromotionsResponse {
    success: boolean;
    message: string;
    promotions: Promotion[];
    pagination: Pagination;
}

// Initial state
const initialState = {
    isLoading: false,
    error: null as string | null,
    promotions: [] as Promotion[],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalPromotions: 0,
    } as Pagination,
};

// Create async thunk for creating promotion
export const createPromotion = createAsyncThunk<PromotionResponse, PromotionRequest>(
    "promotion/createPromotion",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post<PromotionResponse>(
                `${process.env.API_URL}/api/v1/admin/add-promotion`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-api-key': process.env.API_KEY as string,
                        'access-token': process.env.ACCESS_TOKEN as string,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error while creating promotion request:", error);
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || "Failed to create promotion request. Please try again.");
            }
            return rejectWithValue("Failed to create promotion request. Please try again.");
        }
    }
);

// Create async thunk for getting promotions
export const getPromotions = createAsyncThunk<GetPromotionsResponse, { page: number, limit: number }>(
    "promotion/getPromotions",
    async ({ page, limit },  { rejectWithValue }) => {
        try {
            const response = await axios.get<GetPromotionsResponse>(
                `${process.env.API_URL}/api/v1/admin/get-promotions?page=${page}&limit=${limit}`,
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

// Slice
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
            .addCase(createPromotion.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPromotion.fulfilled, (state, action: PayloadAction<PromotionResponse>) => {
                state.isLoading = false;
                // Handle success, e.g., add new promotion to the list
                console.log('Promotion created successfully:', action.payload);
            })
            .addCase(createPromotion.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getPromotions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPromotions.fulfilled, (state, action: PayloadAction<GetPromotionsResponse>) => {
                state.isLoading = false;
                state.promotions = action.payload.promotions;
                state.pagination = action.payload.pagination;
            })
            .addCase(getPromotions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearPromotions } = promotionSlice.actions;

export default promotionSlice.reducer;
