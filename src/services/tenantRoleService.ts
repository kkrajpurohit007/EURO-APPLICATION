import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import {
    getTenantRoles,
    getTenantRoleById,
    addNewTenantRole,
    updateTenantRole,
    deleteTenantRole,
} from "../helpers/fakebackend_helper";
import { TenantRoleItem, TenantRolesResponse } from "../slices/tenantRoles/tenantRole.fakeData";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getAllTenantRoles = (
    pageNumber: number = 1,
    pageSize: number = 20
): Promise<TenantRolesResponse> => {
    if (isFakeBackend) {
        return getTenantRoles(pageNumber, pageSize) as unknown as Promise<TenantRolesResponse>;
    }
    // Real API call with query parameters
    return api.get(url.GET_TENANT_ROLES, {
        pageNumber,
        pageSize,
    }) as unknown as Promise<TenantRolesResponse>;
};

export const getTenantRoleByIdService = (id: string): Promise<TenantRoleItem> => {
    if (isFakeBackend) {
        return getTenantRoleById(id) as unknown as Promise<TenantRoleItem>;
    }
    return api.get(url.GET_TENANT_ROLES + "/" + id, {}) as unknown as Promise<TenantRoleItem>;
};

export const createTenantRoleService = (data: Partial<TenantRoleItem>): Promise<TenantRoleItem> => {
    if (isFakeBackend) {
        return addNewTenantRole(data as any) as unknown as Promise<TenantRoleItem>;
    }
    return api.create(url.POST_TENANT_ROLE, data) as unknown as Promise<TenantRoleItem>;
};

export const updateTenantRoleService = (
    id: string,
    data: Partial<TenantRoleItem>
): Promise<TenantRoleItem> => {
    if (isFakeBackend) {
        return updateTenantRole(id, data as any) as unknown as Promise<TenantRoleItem>;
    }
    return api.put(url.PUT_TENANT_ROLE + "/" + id, data) as unknown as Promise<TenantRoleItem>;
};

export const deleteTenantRoleService = (id: string): Promise<void> => {
    if (isFakeBackend) {
        return deleteTenantRole(id) as unknown as Promise<void>;
    }
    return api.delete(url.DELETE_TENANT_ROLE + "/" + id) as unknown as Promise<void>;
};

