import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllTenantRoles,
  getTenantRoleByIdService,
  createTenantRoleService,
  updateTenantRoleService,
  deleteTenantRoleService,
} from "../../services/tenantRoleService";
import { TenantRoleItem, TenantRolesResponse } from "./tenantRole.fakeData";

interface TenantRoleState {
  tenantRoles: TenantRoleItem[];
  tenantRole: TenantRoleItem | null;
  error: any;
  isTenantRoleCreated: boolean;
  isTenantRoleSuccess: boolean;
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const initialState: TenantRoleState = {
  tenantRoles: [],
  tenantRole: null,
  error: {},
  isTenantRoleCreated: false,
  isTenantRoleSuccess: false,
  loading: false,
  pageNumber: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
};

// Async thunk to fetch tenant roles
export const getTenantRoles = createAsyncThunk(
  "tenantRoles/getTenantRoles",
  async ({ pageNumber = 1, pageSize = 20 }: { pageNumber?: number; pageSize?: number } = {}, { rejectWithValue }) => {
    try {
      // Get tenantId from logged-in user
      const { getLoggedinUser } = await import("../../helpers/api_helper");
      const authUser = getLoggedinUser();
      const tenantId = authUser?.tenantId;
      
      const response: TenantRolesResponse = await getAllTenantRoles(pageNumber, pageSize, tenantId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user roles");
    }
  }
);

// Async thunk to get tenant role by ID
export const getTenantRoleById = createAsyncThunk(
  "tenantRoles/getTenantRoleById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getTenantRoleByIdService(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user role details");
    }
  }
);

// Async thunk to create tenant role
export const addNewTenantRole = createAsyncThunk(
  "tenantRoles/addNewTenantRole",
  async (tenantRole: Partial<TenantRoleItem>, { rejectWithValue }) => {
    try {
      const response = await createTenantRoleService(tenantRole);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create user role");
    }
  }
);

// Async thunk to update tenant role
export const updateTenantRole = createAsyncThunk(
  "tenantRoles/updateTenantRole",
  async ({ id, data }: { id: string; data: Partial<TenantRoleItem> }, { rejectWithValue }) => {
    try {
      const response = await updateTenantRoleService(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update user role");
    }
  }
);

// Async thunk to delete tenant role
export const deleteTenantRole = createAsyncThunk(
  "tenantRoles/deleteTenantRole",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTenantRoleService(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete user role");
    }
  }
);

const TenantRolesSlice = createSlice({
  name: "TenantRoles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTenantRoles.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTenantRoles.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.tenantRoles = action.payload.items || action.payload;
        state.pageNumber = action.payload.pageNumber || 1;
        state.pageSize = action.payload.pageSize || 20;
        state.totalCount = action.payload.totalCount || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.isTenantRoleCreated = false;
        state.isTenantRoleSuccess = true;
      })
      .addCase(getTenantRoles.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload || null;
        state.isTenantRoleCreated = false;
        state.isTenantRoleSuccess = false;
      })
      .addCase(getTenantRoleById.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTenantRoleById.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.tenantRole = action.payload;
      })
      .addCase(getTenantRoleById.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(addNewTenantRole.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewTenantRole.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.tenantRoles.unshift(action.payload);
        state.isTenantRoleCreated = true;
      })
      .addCase(addNewTenantRole.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(updateTenantRole.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTenantRole.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.tenantRoles = state.tenantRoles.map((role: any) =>
          role.id === action.payload.id ? { ...role, ...action.payload } : role
        );
        if (state.tenantRole && state.tenantRole.id === action.payload.id) {
          state.tenantRole = action.payload;
        }
      })
      .addCase(updateTenantRole.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(deleteTenantRole.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenantRole.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.tenantRoles = state.tenantRoles.filter(
          (role: any) => role.id !== action.payload
        );
      })
      .addCase(deleteTenantRole.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export default TenantRolesSlice.reducer;

// Selectors - Export selectors for use in components
export const selectTenantRoleList = (state: any) => state.TenantRoles.tenantRoles || [];
export const selectSelectedTenantRole = (state: any) => state.TenantRoles.tenantRole;
export const selectTenantRoleById = (state: any, id: string) =>
  state.TenantRoles.tenantRoles?.find((role: TenantRoleItem) => role.id === id);
export const selectTenantRoleLoading = (state: any) => state.TenantRoles.loading;
export const selectTenantRoleError = (state: any) => state.TenantRoles.error;
export const selectTenantRoleTotalCount = (state: any) => state.TenantRoles.totalCount;

