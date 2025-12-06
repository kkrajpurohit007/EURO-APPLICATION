import { APIClient } from "../helpers/api_helper";
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

export const getAllGlobalUsers = (
    pageNumber: number = 1,
    pageSize: number = 20
): Promise<GlobalUsersResponse> => {
    if (isFakeBackend) {
        return getGlobalUsers(pageNumber, pageSize) as unknown as Promise<GlobalUsersResponse>;
    }
    // Real API call with query parameters
    return api.get(url.GET_GLOBAL_USERS, {
        pageNumber,
        pageSize,
    }) as unknown as Promise<GlobalUsersResponse>;
};

export const createGlobalUser = (data: Partial<GlobalUserItem>): Promise<GlobalUserItem> => {
    if (isFakeBackend) {
        return addNewGlobalUser(data) as unknown as Promise<GlobalUserItem>;
    }
    // Clean payload for backend
    const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        mobileNumber: data.mobileNumber,
        dateOfBirth: data.dateOfBirth,
        profileId: data.profileId,
        roleId: data.roleId,
        departmentId: data.departmentId,
        accessScope: data.accessScope,
    };
    return api.create(url.ADD_NEW_GLOBAL_USER, payload) as unknown as Promise<GlobalUserItem>;
};

export const updateGlobalUser = (
    id: string,
    data: Partial<GlobalUserItem>
): Promise<GlobalUserItem> => {
    if (isFakeBackend) {
        return updateGlobalUserFake(id, data) as unknown as Promise<GlobalUserItem>;
    }
    const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        mobileNumber: data.mobileNumber,
        dateOfBirth: data.dateOfBirth,
        profileId: data.profileId,
        roleId: data.roleId,
        departmentId: data.departmentId,
        accessScope: data.accessScope,
        disabled: data.disabled,
    };
    return api.put(url.UPDATE_GLOBAL_USER + "/" + id, payload) as unknown as Promise<GlobalUserItem>;
};

export const deleteGlobalUser = (id: string): Promise<void> => {
    if (isFakeBackend) {
        return deleteGlobalUserFake(id) as unknown as Promise<void>;
    }
    return api.delete(url.DELETE_GLOBAL_USER + "/" + id) as unknown as Promise<void>;
};

