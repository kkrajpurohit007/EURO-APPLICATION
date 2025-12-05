import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    initialProfiles,
    ProfileItem,
    ProfilesResponse,
} from "./profile.fakeData";
import * as profileService from "../../services/profileService";

interface ProfileState {
    items: ProfileItem[];
    selectedProfile: ProfileItem | null;
    loading: boolean;
    error: string | null;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

const initialState: ProfileState = {
    items: initialProfiles,
    selectedProfile: null,
    loading: false,
    error: null,
    pageNumber: 1,
    pageSize: 50,
    totalCount: 0,
    totalPages: 0,
};

// Async thunk to fetch profiles from API
export const fetchProfiles = createAsyncThunk(
    "userProfiles/fetchProfiles",
    async ({
        pageNumber = 1,
        pageSize = 50,
    }: {
        pageNumber?: number;
        pageSize?: number;
    } = {}) => {
        const response: ProfilesResponse = await profileService.getAllProfiles(
            pageNumber,
            pageSize
        );
        return response;
    }
);

// Async thunk to create a new profile
export const createProfile = createAsyncThunk(
    "userProfiles/createProfile",
    async (data: Partial<ProfileItem>) => {
        const response = await profileService.createProfile(data);
        return response;
    }
);

// Async thunk to update an existing profile
export const updateProfile = createAsyncThunk(
    "userProfiles/updateProfile",
    async ({ id, data }: { id: string; data: Partial<ProfileItem> }) => {
        const response = await profileService.updateProfile(id, data);
        return response;
    }
);

// Async thunk to delete a profile
export const deleteProfile = createAsyncThunk(
    "userProfiles/deleteProfile",
    async (id: string) => {
        await profileService.deleteProfile(id);
        return id;
    }
);

const profileSlice = createSlice({
    name: "UserProfiles",
    initialState,
    reducers: {
        selectProfile(state, action: PayloadAction<string>) {
            state.selectedProfile =
                state.items.find((p) => p.id === action.payload) || null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch profiles
            .addCase(fetchProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfiles.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.pageNumber = action.payload.pageNumber;
                state.pageSize = action.payload.pageSize;
                state.totalCount = action.payload.totalCount;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch profiles";
            })
            // Create profile
            .addCase(createProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProfile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create profile";
            })
            // Update profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update profile";
            })
            // Delete profile
            .addCase(deleteProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProfile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete profile";
            });
    },
});

export const { selectProfile, clearError } = profileSlice.actions;
export default profileSlice.reducer;

// Selectors
export const selectProfileList = (state: any) => state.UserProfiles.items;
export const selectSelectedProfile = (state: any) => state.UserProfiles.selectedProfile;
export const selectProfileById = (state: any, id: string) =>
    state.UserProfiles.items.find((p: ProfileItem) => p.id === id);
export const selectProfileLoading = (state: any) => state.UserProfiles.loading;
export const selectProfileError = (state: any) => state.UserProfiles.error;
export const selectProfileTotalCount = (state: any) => state.UserProfiles.totalCount;