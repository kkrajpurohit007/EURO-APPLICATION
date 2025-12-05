import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    initialRoles,
    RoleItem,
    RolesResponse,
} from "./role.fakeData";
import * as roleService from "../../services/roleService";

interface RoleState {
    items: RoleItem[];
    selectedRole: RoleItem | null;
    loading: boolean;
    error: string | null;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

const initialState: RoleState = {
    items: initialRoles,
    selectedRole: null,
    loading: false,
    error: null,
    pageNumber: 1,
    pageSize: 50,
    totalCount: 0,
    totalPages: 0,
};

// Async thunk to fetch roles from API
export const fetchRoles = createAsyncThunk(
    "roles/fetchRoles",
    async ({
        pageNumber = 1,
        pageSize = 20,
    }: {
        pageNumber?: number;
        pageSize?: number;
    } = {}) => {
        const response: RolesResponse = await roleService.getAllRoles(
            pageNumber,
            pageSize
        );
        return response;
    }
);

// Async thunk to create a new role
export const createRole = createAsyncThunk(
    "roles/createRole",
    async (data: Partial<RoleItem>) => {
        const response = await roleService.createRole(data);
        return response;
    }
);

// Async thunk to update an existing role
export const updateRole = createAsyncThunk(
    "roles/updateRole",
    async ({ id, data }: { id: string; data: Partial<RoleItem> }) => {
        const response = await roleService.updateRole(id, data);
        return response;
    }
);

// Async thunk to delete a role
export const deleteRole = createAsyncThunk(
    "roles/deleteRole",
    async (id: string) => {
        await roleService.deleteRole(id);
        return id;
    }
);

const roleSlice = createSlice({
    name: "Roles",
    initialState,
    reducers: {
        selectRole(state, action: PayloadAction<string>) {
            state.selectedRole =
                state.items.find((r) => r.id === action.payload) || null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch roles
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.pageNumber = action.payload.pageNumber;
                state.pageSize = action.payload.pageSize;
                state.totalCount = action.payload.totalCount;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch roles";
            })
            // Create role
            .addCase(createRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.totalCount += 1;
            })
            .addCase(createRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create role";
            })
            // Update role
            .addCase(updateRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((r) => r.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update role";
            })
            // Delete role
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((r) => r.id !== action.payload);
                state.totalCount -= 1;
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete role";
            });
    },
});

export const { selectRole, clearError } = roleSlice.actions;
export default roleSlice.reducer;

// Selectors
export const selectRoleList = (state: any) => state.Roles.items;
export const selectSelectedRole = (state: any) => state.Roles.selectedRole;
export const selectRoleById = (state: any, id: string) =>
    state.Roles.items.find((r: RoleItem) => r.id === id);
export const selectRoleLoading = (state: any) => state.Roles.loading;
export const selectRoleError = (state: any) => state.Roles.error;
export const selectRoleTotalCount = (state: any) => state.Roles.totalCount;