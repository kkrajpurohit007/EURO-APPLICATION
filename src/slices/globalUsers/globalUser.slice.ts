import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    GlobalUserItem,
    GlobalUsersResponse,
} from "./globalUser.fakeData";
import * as globalUserService from "../../services/globalUserService";

interface GlobalUserState {
    items: GlobalUserItem[];
    selectedUser: GlobalUserItem | null;
    loading: boolean;
    error: string | null;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

const initialState: GlobalUserState = {
    items: [],
    selectedUser: null,
    loading: false,
    error: null,
    pageNumber: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
};

// Async thunk to fetch global users from API
export const fetchGlobalUsers = createAsyncThunk(
    "globalUsers/fetchGlobalUsers",
    async ({
        pageNumber = 1,
        pageSize = 20,
    }: {
        pageNumber?: number;
        pageSize?: number;
    } = {}) => {
        const response: GlobalUsersResponse = await globalUserService.getAllGlobalUsers(
            pageNumber,
            pageSize
        );
        return response;
    }
);

// Async thunk to create a new global user
export const createGlobalUser = createAsyncThunk(
    "globalUsers/createGlobalUser",
    async (data: Partial<GlobalUserItem>) => {
        const response = await globalUserService.createGlobalUser(data);
        return response;
    }
);

// Async thunk to update an existing global user
export const updateGlobalUser = createAsyncThunk(
    "globalUsers/updateGlobalUser",
    async ({ id, data }: { id: string; data: Partial<GlobalUserItem> }) => {
        const response = await globalUserService.updateGlobalUser(id, data);
        return response;
    }
);

// Async thunk to delete a global user
export const deleteGlobalUser = createAsyncThunk(
    "globalUsers/deleteGlobalUser",
    async (id: string) => {
        await globalUserService.deleteGlobalUser(id);
        return id;
    }
);

const globalUserSlice = createSlice({
    name: "GlobalUsers",
    initialState,
    reducers: {
        selectGlobalUser(state, action: PayloadAction<string>) {
            state.selectedUser =
                state.items.find((u) => u.id === action.payload) || null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch global users
            .addCase(fetchGlobalUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGlobalUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.pageNumber = action.payload.pageNumber;
                state.pageSize = action.payload.pageSize;
                state.totalCount = action.payload.totalCount;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchGlobalUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch global users";
            })
            // Create global user
            .addCase(createGlobalUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGlobalUser.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.totalCount += 1;
            })
            .addCase(createGlobalUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create global user";
            })
            // Update global user
            .addCase(updateGlobalUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGlobalUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((u) => u.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateGlobalUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update global user";
            })
            // Delete global user
            .addCase(deleteGlobalUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGlobalUser.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((u) => u.id !== action.payload);
                state.totalCount -= 1;
            })
            .addCase(deleteGlobalUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete global user";
            });
    },
});

export const { selectGlobalUser, clearError } = globalUserSlice.actions;
export default globalUserSlice.reducer;

// Selectors
export const selectGlobalUserList = (state: any) => state.GlobalUsers?.items || [];
export const selectSelectedGlobalUser = (state: any) =>
    state.GlobalUsers?.selectedUser || null;
export const selectGlobalUserById = (state: any, id: string) =>
    state.GlobalUsers?.items?.find((u: GlobalUserItem) => u.id === id) || null;
export const selectGlobalUserLoading = (state: any) => state.GlobalUsers?.loading || false;
export const selectGlobalUserError = (state: any) => state.GlobalUsers?.error || null;
export const selectGlobalUserTotalCount = (state: any) =>
    state.GlobalUsers?.totalCount || 0;

