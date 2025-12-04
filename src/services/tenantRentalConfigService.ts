import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import {
  getTenantRentalConfig as getTenantRentalConfigFake,
  updateTenantRentalConfig as updateTenantRentalConfigFake,
} from "../helpers/fakebackend_helper";
import { TenantRentalConfig } from "../slices/tenantRentalConfig/tenantRentalConfig.fakeData";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getRentalConfig = async (
  tenantId: string
): Promise<TenantRentalConfig | null> => {
  if (isFakeBackend) {
    try {
      const response = await getTenantRentalConfigFake(
        tenantId
      ) as unknown as Promise<TenantRentalConfig>;
      return response;
    } catch (error) {
      // If fake backend fails, return null to indicate no data found
      console.warn("Fake backend rental config not found:", error);
      return null;
    }
  }
  
  // Real API call
  try {
    const response = await api.get(
      url.GET_TENANT_RENTAL_CONFIG + "/tenant/" + tenantId,
      {}
    ) as unknown as Promise<TenantRentalConfig>;
    return response;
  } catch (error: any) {
    // If API returns 404 or similar, return null to indicate no data found
    if (error.response?.status === 404) {
      console.warn("Tenant rental config not found for tenant:", tenantId);
      return null;
    }
    // Re-throw other errors
    throw error;
  }
};

export const updateRentalConfig = (
  id: number,
  data: Partial<TenantRentalConfig>
): Promise<TenantRentalConfig> => {
  if (isFakeBackend) {
    return updateTenantRentalConfigFake(
      id,
      data
    ) as unknown as Promise<TenantRentalConfig>;
  }
  return api.put(
    url.UPDATE_TENANT_RENTAL_CONFIG + "/" + id,
    data
  ) as unknown as Promise<TenantRentalConfig>;
};