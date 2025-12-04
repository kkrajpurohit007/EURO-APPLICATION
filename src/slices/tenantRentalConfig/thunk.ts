import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLoggedinUser } from "../../helpers/api_helper";
import { getRentalConfig, updateRentalConfig } from "../../services/tenantRentalConfigService";
import { TenantRentalConfig } from "./tenantRentalConfig.fakeData";

// Get tenant rental configuration
export const getTenantRentalConfig = createAsyncThunk(
    "tenantRentalConfig/getTenantRentalConfig",
    async () => {
        try {
            // Get tenantId from authenticated user
            const authUser = getLoggedinUser();
            const tenantId = authUser?.tenantId;

            if (!tenantId) {
                throw new Error("Tenant ID not found. Please ensure you are logged in.");
            }

            const response = await getRentalConfig(tenantId);
            return response;
        } catch (error) {
            throw error;
        }
    }
);

// Update tenant rental configuration
export const updateTenantRentalConfig = createAsyncThunk(
    "tenantRentalConfig/updateTenantRentalConfig",
    async (config: Partial<TenantRentalConfig> & { id: number }) => {
        try {
            const { id, ...data } = config;
            const response = await updateRentalConfig(id, data);
            return response;
        } catch (error) {
            throw error;
        }
    }
);
