import { APIClient } from "../helpers/api_helper";
import { getLoggedinUser } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import {
    getGlobalUsers,
    addNewGlobalUser,
    updateGlobalUser as updateGlobalUserFake,
    deleteGlobalUser as deleteGlobalUserFake,
} from "../helpers/fakebackend_helper";
import { GlobalUserItem, GlobalUsersResponse } from "../slices/globalUsers/globalUser.fakeData";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

// Helper function to get tenantId from logged-in user
const getTenantId = (): string | null => {
    const authUser = getLoggedinUser();
    return authUser?.tenantId || null;
};

// Map API response to internal format
const mapApiUserToInternal = (apiUser: any): GlobalUserItem => {
    return {
        id: apiUser.id,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        email: apiUser.email,
        username: apiUser.userName || apiUser.email, // Map userName to username
        mobileNumber: apiUser.mobileNumber,
        dateOfBirth: apiUser.dateOfBirth,
        profileId: apiUser.profileId,
        profileName: apiUser.profileName,
        roleId: apiUser.roleId,
        roleName: apiUser.roleName,
        departmentId: apiUser.departmentId,
        departmentName: apiUser.departmentName,
        accessScope: apiUser.accessScope ? String(apiUser.accessScope) : undefined,
        appUserCode: apiUser.appUserCode,
        emailVerified: apiUser.isEmailVerified || false,
        initialSetupDone: apiUser.isInitialSetupDone || false,
        disabled: apiUser.isDisabled || false,
        isDeleted: apiUser.isDeleted || false,
    };
};

export const getAllGlobalUsers = async (
    pageNumber: number = 1,
    pageSize: number = 20,
    tenantId?: string | null
): Promise<GlobalUsersResponse> => {
    if (isFakeBackend) {
        return getGlobalUsers(pageNumber, pageSize) as unknown as Promise<GlobalUsersResponse>;
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
    
    const response: any = await api.get(url.GET_GLOBAL_USERS, queryParams);
    
    // Map API response items to internal format
    if (response && response.items && Array.isArray(response.items)) {
        response.items = response.items.map(mapApiUserToInternal);
    }
    
    return response as GlobalUsersResponse;
};

export const createGlobalUser = async (data: Partial<GlobalUserItem>): Promise<GlobalUserItem> => {
    if (isFakeBackend) {
        return addNewGlobalUser(data) as unknown as Promise<GlobalUserItem>;
    }
    // Get tenantId if not provided in data
    const tenantId = (data as any).tenantId || getTenantId();
    
    if (!tenantId) {
        return Promise.reject(new Error("Tenant ID is required"));
    }
    
    // Clean payload for backend - username should equal email
    const payload: any = {
        userName: data.username || data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        dateOfBirth: data.dateOfBirth,
        tenantId: tenantId,
        roleId: data.roleId,
        accessScope: typeof data.accessScope === 'string' ? parseInt(data.accessScope) : data.accessScope,
    };
    
    // Include optional fields if present
    if (data.profileId) {
        payload.profileId = data.profileId;
    }
    if (data.departmentId) {
        payload.departmentId = data.departmentId;
    }
    
    const response: any = await api.create(url.ADD_NEW_GLOBAL_USER, payload);
    // Handle API response wrapper if present
    const userData = response?.result || response;
    return mapApiUserToInternal(userData) as GlobalUserItem;
};

export const updateGlobalUser = async (
    id: string,
    data: Partial<GlobalUserItem>
): Promise<GlobalUserItem> => {
    if (isFakeBackend) {
        return updateGlobalUserFake(id, data) as unknown as Promise<GlobalUserItem>;
    }
    // Get tenantId if not provided in data
    const tenantId = (data as any).tenantId || getTenantId();
    
    if (!tenantId) {
        return Promise.reject(new Error("Tenant ID is required"));
    }
    
    // Clean payload for backend - username should equal email
    const payload: any = {
        userName: data.username || data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        dateOfBirth: data.dateOfBirth,
        tenantId: tenantId,
        roleId: data.roleId,
        accessScope: typeof data.accessScope === 'string' ? parseInt(data.accessScope) : data.accessScope,
        isDisabled: data.disabled || false,
    };
    
    // Include optional fields if present
    if (data.profileId) {
        payload.profileId = data.profileId;
    }
    if (data.departmentId) {
        payload.departmentId = data.departmentId;
    }
    
    const response: any = await api.put(url.UPDATE_GLOBAL_USER + "/" + id, payload);
    // Handle API response wrapper if present
    const userData = response?.result || response;
    return mapApiUserToInternal(userData) as GlobalUserItem;
};

export const deleteGlobalUser = (id: string): Promise<void> => {
    if (isFakeBackend) {
        return deleteGlobalUserFake(id) as unknown as Promise<void>;
    }
    return api.delete(url.DELETE_GLOBAL_USER + "/" + id) as unknown as Promise<void>;
};

