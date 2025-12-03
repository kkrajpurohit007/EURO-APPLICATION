import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  tenantRentalConfigData,
  TenantRentalConfig,
} from "./tenantRentalConfig.fakeData";
import * as tenantRentalConfigService from "../../services/tenantRentalConfigService";

interface TenantRentalConfigState {
  config: TenantRentalConfig | null;
  loading: boolean;
  error: string | null;
}

const initialState: TenantRentalConfigState = {
  config: tenantRentalConfigData,
  loading: false,
  error: null,
};

// Async thunk to fetch tenant rental configuration
export const fetchRentalConfig = createAsyncThunk(
  "tenantRentalConfig/fetchRentalConfig",
  async (tenantId: string) => {
    const response = await tenantRentalConfigService.getRentalConfig(tenantId);
    return response;
  }
);

// Async thunk to update tenant rental configuration
export const updateRentalConfig = createAsyncThunk(
  "tenantRentalConfig/updateRentalConfig",
  async ({ id, data }: { id: number; data: Partial<TenantRentalConfig> }) => {
    const response = await tenantRentalConfigService.updateRentalConfig(
      id,
      data
    );
    return response;
  }
);

const tenantRentalConfigSlice = createSlice({
  name: "TenantRentalConfig",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rental config
      .addCase(fetchRentalConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRentalConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(fetchRentalConfig.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch rental configuration";
      })
      // Update rental config
      .addCase(updateRentalConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRentalConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(updateRentalConfig.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to update rental configuration";
      });
  },
});

export const { clearError } = tenantRentalConfigSlice.actions;
export default tenantRentalConfigSlice.reducer;

// Selectors
export const selectRentalConfig = (state: any) =>
  state.TenantRentalConfig.config;
export const selectRentalConfigLoading = (state: any) =>
  state.TenantRentalConfig.loading;
export const selectRentalConfigError = (state: any) =>
  state.TenantRentalConfig.error;
