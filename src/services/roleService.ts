import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import {
    getRoles,
    addNewRole,
    updateRole as updateRoleFake,
    deleteRole as deleteRoleFake,
} from "../helpers/fakebackend_helper";
import { RoleItem, RolesResponse } from "../slices/roles/role.fakeData";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getAllRoles = (
    pageNumber: number = 1,
    pageSize: number = 50
): Promise<RolesResponse> => {
    if (isFakeBackend) {
        return getRoles(pageNumber, pageSize) as unknown as Promise<RolesResponse>;
    }
    // Real API call with query parameters - using Profile endpoint
    return api.get(url.GET_ROLES, {
        pageNumber,
        pageSize,
    }) as unknown as Promise<RolesResponse>;
};

export const createRole = (data: Partial<RoleItem>): Promise<RoleItem> => {
    if (isFakeBackend) {
        return addNewRole(data) as unknown as Promise<RoleItem>;
    }
    return api.create(url.POST_ROLE, data) as unknown as Promise<RoleItem>;
};

export const updateRole = (
    id: string,
    data: Partial<RoleItem>
): Promise<RoleItem> => {
    if (isFakeBackend) {
        return updateRoleFake(id, data) as unknown as Promise<RoleItem>;
    }
    return api.put(url.PUT_ROLE + "/" + id, data) as unknown as Promise<RoleItem>;
};

export const deleteRole = (id: string): Promise<void> => {
    if (isFakeBackend) {
        return deleteRoleFake(id) as unknown as Promise<void>;
    }
    return api.delete(url.DELETE_ROLE + "/" + id) as unknown as Promise<void>;
};