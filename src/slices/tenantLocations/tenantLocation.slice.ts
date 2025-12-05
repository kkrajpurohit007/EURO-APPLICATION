import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as tenantLocationService from "../../services/tenantLocationService";
import { TenantLocationItem, TenantLocationsResponse } from "../../services/tenantLocationService";

interface TenantLocationState {
    items: TenantLocationItem[];
    selectedTenantLocation: TenantLocationItem | null;
    loading: boolean;
    error: string | null;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

const initialState: TenantLocationState = {
    items: [],
    selectedTenantLocation: null,
    loading: false,
    error: null,
    pageNumber: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
};

// Async thunk to fetch tenant locations from API
export const fetchTenantLocations = createAsyncThunk(
    "tenantLocations/fetchTenantLocations",
    async ({
        pageNumber = 1,
        pageSize = 20,
    }: {
        pageNumber?: number;
        pageSize?: number;
    } = {}) => {
        const response: TenantLocationsResponse = await tenantLocationService.getAllTenantLocations(
            pageNumber,
            pageSize
        );
        return response;
    }
);

// Async thunk to create a new tenant location
export const createTenantLocation = createAsyncThunk(
    "tenantLocations/createTenantLocation",
    async (data: tenantLocationService.TenantLocationCreatePayload) => {
        const response = await tenantLocationService.createTenantLocation(data);
        return response.result;
    }
);

// Async thunk to update an existing tenant location
export const updateTenantLocation = createAsyncThunk(
    "tenantLocations/updateTenantLocation",
    async ({ id, data }: { id: string; data: tenantLocationService.TenantLocationUpdatePayload }) => {
        const response = await tenantLocationService.updateTenantLocation(id, data);
        return response.result;
    }
);

// Async thunk to delete a tenant location
export const deleteTenantLocation = createAsyncThunk(
    "tenantLocations/deleteTenantLocation",
    async (id: string) => {
        await tenantLocationService.deleteTenantLocation(id);
        return id;
    }
);

const tenantLocationSlice = createSlice({
    name: "TenantLocations",
    initialState,
    reducers: {
        selectTenantLocation(state, action: PayloadAction<string>) {
            state.selectedTenantLocation =
                state.items.find((tl) => tl.id === action.payload) || null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tenant locations
            .addCase(fetchTenantLocations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTenantLocations.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                state.pageNumber = action.payload?.pageNumber || 1;
                state.pageSize = action.payload?.pageSize || 20;
                state.totalCount = action.payload?.totalCount || 0;
                state.totalPages = action.payload?.totalPages || 0;
            })
            .addCase(fetchTenantLocations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch tenant locations";
            })
            // Create tenant location
            .addCase(createTenantLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTenantLocation.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.totalCount += 1;
            })
            .addCase(createTenantLocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create tenant location";
            })
            // Update tenant location
            .addCase(updateTenantLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTenantLocation.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((tl) => tl.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateTenantLocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update tenant location";
            })
            // Delete tenant location
            .addCase(deleteTenantLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTenantLocation.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((tl) => tl.id !== action.payload);
                state.totalCount -= 1;
            })
            .addCase(deleteTenantLocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete tenant location";
            });
    },
});

export const { selectTenantLocation, clearError } = tenantLocationSlice.actions;
export default tenantLocationSlice.reducer;

// Selectors
export const selectTenantLocationList = (state: any) => state.TenantLocations?.items || [];
export const selectSelectedTenantLocation = (state: any) => state.TenantLocations?.selectedTenantLocation || null;
export const selectTenantLocationById = (state: any, id: string) =>
    state.TenantLocations?.items?.find((tl: TenantLocationItem) => tl.id === id) || null;
export const selectTenantLocationLoading = (state: any) => state.TenantLocations?.loading || false;
export const selectTenantLocationError = (state: any) => state.TenantLocations?.error || null;
export const selectTenantLocationTotalCount = (state: any) => state.TenantLocations?.totalCount || 0;


