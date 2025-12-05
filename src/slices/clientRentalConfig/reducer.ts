import { createSlice } from "@reduxjs/toolkit";
import {
  getClientRentalConfigs,
  getClientRentalConfigByClientId,
  updateClientRentalConfig,
} from "./thunk";

export interface ClientRentalConfig {
  id: number;
  clientId: number;
  clientName: string;
  overrideGracePeriodDays: number | null;
  overrideMinimumHireWeeks: number | null;
  overrideInvoiceFrequency: number | null;
  overrideInvoiceDay: number | null;
  overrideIncludeWeekends: boolean;
  overrideExcludePublicHolidays: boolean;
  reason: string;
  effectiveFrom: string;
  effectiveTo: string;
  approvedByUserId: string;
  approvedDate: string;
  tenantId?: number;
  updatedAt?: string;
}

export interface ClientRentalConfigState {
  configs: ClientRentalConfig[];
  config: ClientRentalConfig | null;
  error: any;
  loading: boolean;
  isConfigSuccess: boolean;
}

export const initialState: ClientRentalConfigState = {
  configs: [],
  config: null,
  error: {},
  loading: false,
  isConfigSuccess: false,
};

const ClientRentalConfigSlice = createSlice({
  name: "ClientRentalConfigSlice",
  initialState,
  reducers: {
    resetClientRentalConfig: (state) => {
      state.config = null;
      state.error = {};
      state.loading = false;
      state.isConfigSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getClientRentalConfigs.pending,
      (state: any) => {
        state.loading = true;
        state.error = {};
      }
    );
    builder.addCase(
      getClientRentalConfigs.fulfilled,
      (state: any, action: any) => {
        state.configs = action.payload;
        state.loading = false;
        state.isConfigSuccess = true;
      }
    );
    builder.addCase(
      getClientRentalConfigs.rejected,
      (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || action.error || null;
        state.isConfigSuccess = false;
      }
    );

    builder.addCase(
      getClientRentalConfigByClientId.pending,
      (state: any) => {
        state.loading = true;
        state.error = {};
      }
    );
    builder.addCase(
      getClientRentalConfigByClientId.fulfilled,
      (state: any, action: any) => {
        state.config = action.payload;
        state.loading = false;
        state.isConfigSuccess = true;
      }
    );
    builder.addCase(
      getClientRentalConfigByClientId.rejected,
      (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || action.error || null;
        state.isConfigSuccess = false;
      }
    );

    builder.addCase(
      updateClientRentalConfig.pending,
      (state: any) => {
        state.loading = true;
        state.error = {};
      }
    );
    builder.addCase(
      updateClientRentalConfig.fulfilled,
      (state: any, action: any) => {
        state.loading = false;
        // Check if config already exists in configs array
        const existingIndex = state.configs.findIndex(
          (config: any) => config.clientId === action.payload.clientId
        );
        
        if (existingIndex !== -1) {
          // Update existing config
          state.configs[existingIndex] = action.payload;
        } else {
          // Add new config
          state.configs.push(action.payload);
        }
        
        state.config = action.payload;
        state.isConfigSuccess = true;
      }
    );
    builder.addCase(
      updateClientRentalConfig.rejected,
      (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || action.error || null;
        state.isConfigSuccess = false;
      }
    );
  },
});

export const { resetClientRentalConfig } = ClientRentalConfigSlice.actions;
export default ClientRentalConfigSlice.reducer;