import { APIClient } from "../helpers/api_helper";
import { getLoggedinUser } from "../helpers/api_helper";
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

// Helper function to get tenantId from logged-in user
const getTenantId = (): string | null => {
    const authUser = getLoggedinUser();
    return authUser?.tenantId || null;
};

export const getAllTenantRoles = (
    pageNumber: number = 1,
    pageSize: number = 20,
    tenantId?: string | null
): Promise<TenantRolesResponse> => {
    if (isFakeBackend) {
        return getTenantRoles(pageNumber, pageSize) as unknown as Promise<TenantRolesResponse>;
    }
    // Get tenantId if not provided
    const finalTenantId = tenantId || getTenantId();
    
    // Real API call with query parameters including tenantId
    const queryParams: any = {
        pageNumber,
        pageSize,
    };
    
    if (finalTenantId) {
        queryParams.tenantId = finalTenantId;
    }
    
    return api.get(url.GET_TENANT_ROLES, queryParams) as unknown as Promise<TenantRolesResponse>;
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
    // Get tenantId if not provided in data
    const tenantId = (data as any).tenantId || getTenantId();
    
    if (!tenantId) {
        return Promise.reject(new Error("Tenant ID is required"));
    }
    
    // Format payload according to API specification
    const payload = {
        tenantId: tenantId,
        profileId: data.profileId,
        name: data.name,
        description: data.description,
        isSensitive: data.isSensitive || false,
    };
    
    return api.create(url.POST_TENANT_ROLE, payload) as unknown as Promise<TenantRoleItem>;
};

export const updateTenantRoleService = (
    id: string,
    data: Partial<TenantRoleItem>
): Promise<TenantRoleItem> => {
    if (isFakeBackend) {
        return updateTenantRole(id, data as any) as unknown as Promise<TenantRoleItem>;
    }
    // Get tenantId if not provided in data
    const tenantId = (data as any).tenantId || getTenantId();
    
    if (!tenantId) {
        return Promise.reject(new Error("Tenant ID is required"));
    }
    
    // Format payload according to API specification
    const payload = {
        tenantId: tenantId,
        profileId: data.profileId,
        name: data.name,
        description: data.description,
        isSensitive: data.isSensitive || false,
    };
    
    return api.put(url.PUT_TENANT_ROLE + "/" + id, payload) as unknown as Promise<TenantRoleItem>;
};

export const deleteTenantRoleService = (id: string): Promise<void> => {
    if (isFakeBackend) {
        return deleteTenantRole(id) as unknown as Promise<void>;
    }
    return api.delete(url.DELETE_TENANT_ROLE + "/" + id) as unknown as Promise<void>;
};

