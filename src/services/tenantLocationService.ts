import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export interface TenantLocationItem {
    id: string;
    tenantId: string;
    tenantName?: string;
    name: string;
    description: string;
    isDeleted: boolean;
    created?: string;
    modified?: string | null;
}

export interface TenantLocationsResponse {
    items: TenantLocationItem[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface TenantLocationCreatePayload {
    tenantId: string;
    name: string;
    description: string;
}

export interface TenantLocationUpdatePayload {
    name: string;
    description: string;
}

export interface TenantLocationApiResponse {
    id: string;
    isSuccess: boolean;
    notFound: boolean;
    message: string;
    modelErrors: any[];
    result: TenantLocationItem;
}

export const getAllTenantLocations = async (
    pageNumber: number = 1,
    pageSize: number = 20
): Promise<TenantLocationsResponse> => {
    try {
        const response = await api.get(url.GET_TENANT_LOCATIONS, {
            pageNumber,
            pageSize,
        }) as unknown as TenantLocationsResponse;
        
        // Ensure response has the expected structure
        return {
            items: response?.items || [],
            pageNumber: response?.pageNumber || pageNumber,
            pageSize: response?.pageSize || pageSize,
            totalCount: response?.totalCount || 0,
            totalPages: response?.totalPages || 0,
            hasPreviousPage: response?.hasPreviousPage || false,
            hasNextPage: response?.hasNextPage || false,
        };
    } catch (error) {
        // Return empty structure on error
        return {
            items: [],
            pageNumber,
            pageSize,
            totalCount: 0,
            totalPages: 0,
            hasPreviousPage: false,
            hasNextPage: false,
        };
    }
};

export const createTenantLocation = (
    data: TenantLocationCreatePayload
): Promise<TenantLocationApiResponse> => {
    return api.create(url.ADD_NEW_TENANT_LOCATION, data) as unknown as Promise<TenantLocationApiResponse>;
};

export const updateTenantLocation = (
    id: string,
    data: TenantLocationUpdatePayload
): Promise<TenantLocationApiResponse> => {
    return api.put(url.UPDATE_TENANT_LOCATION + "/" + id, data) as unknown as Promise<TenantLocationApiResponse>;
};

export const deleteTenantLocation = (id: string): Promise<void> => {
    return api.delete(url.DELETE_TENANT_LOCATION + "/" + id) as unknown as Promise<void>;
};


