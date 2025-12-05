import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import {
    getProfiles,
    addNewProfile,
    updateProfile as updateProfileFake,
    deleteProfile as deleteProfileFake,
} from "../helpers/fakebackend_helper";
import { ProfileItem, ProfilesResponse } from "../slices/userProfiles/profile.fakeData";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getAllProfiles = (
    pageNumber: number = 1,
    pageSize: number = 50
): Promise<ProfilesResponse> => {
    if (isFakeBackend) {
        return getProfiles(pageNumber, pageSize) as unknown as Promise<ProfilesResponse>;
    }
    // Real API call with query parameters
    return api.get(url.GET_PROFILES, {
        pageNumber,
        pageSize,
    }) as unknown as Promise<ProfilesResponse>;
};

export const createProfile = (data: Partial<ProfileItem>): Promise<ProfileItem> => {
    if (isFakeBackend) {
        return addNewProfile(data) as unknown as Promise<ProfileItem>;
    }
    return api.create(url.POST_PROFILE, data) as unknown as Promise<ProfileItem>;
};

export const updateProfile = (
    id: string,
    data: Partial<ProfileItem>
): Promise<ProfileItem> => {
    if (isFakeBackend) {
        return updateProfileFake(id, data) as unknown as Promise<ProfileItem>;
    }
    return api.put(url.PUT_PROFILE + "/" + id, data) as unknown as Promise<ProfileItem>;
};

export const deleteProfile = (id: string): Promise<void> => {
    if (isFakeBackend) {
        return deleteProfileFake(id) as unknown as Promise<void>;
    }
    return api.delete(url.DELETE_PROFILE + "/" + id) as unknown as Promise<void>;
};