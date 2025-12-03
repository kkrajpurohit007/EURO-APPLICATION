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

export const getRentalConfig = (
  tenantId: string
): Promise<TenantRentalConfig> => {
  if (isFakeBackend) {
    return getTenantRentalConfigFake(
      tenantId
    ) as unknown as Promise<TenantRentalConfig>;
  }
  // Real API call
  return api.get(
    url.GET_TENANT_RENTAL_CONFIG + "/tenant/" + tenantId,
    {}
  ) as unknown as Promise<TenantRentalConfig>;
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
