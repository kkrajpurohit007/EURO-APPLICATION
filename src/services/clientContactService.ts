import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import {
    getClientContacts,
    addNewClientContact,
    updateClientContact as updateClientContactFake,
    deleteClientContact as deleteClientContactFake,
} from "../helpers/fakebackend_helper";
import { ClientContactItem, ClientContactsResponse } from "../slices/clientContacts/clientContact.fakeData";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getAllClientContacts = (
    pageNumber: number = 1,
    pageSize: number = 50
): Promise<ClientContactsResponse> => {
    if (isFakeBackend) {
        return getClientContacts(pageNumber, pageSize) as unknown as Promise<ClientContactsResponse>;
    }
    // Real API call with query parameters
    return api.get(url.GET_CLIENT_CONTACTS, {
        pageNumber,
        pageSize,
    }) as unknown as Promise<ClientContactsResponse>;
};

export const createClientContact = (data: Partial<ClientContactItem>): Promise<ClientContactItem> => {
    if (isFakeBackend) {
        return addNewClientContact(data) as unknown as Promise<ClientContactItem>;
    }
    // Clean payload for backend - only required fields
    const payload = {
        clientId: data.clientId,
        tenantId: data.tenantId,
        title: data.title,
        contactFirstName: data.contactFirstName,
        contactLastName: data.contactLastName,
        email: data.email,
        workPhone: data.workPhone,
        mobile: data.mobile,
        notes: data.notes,
        isAllowPortalAccess: data.isAllowPortalAccess || false,
    };
    return api.create(url.ADD_NEW_CLIENT_CONTACT, payload) as unknown as Promise<ClientContactItem>;
};

export const updateClientContact = (
    id: string,
    data: Partial<ClientContactItem>
): Promise<ClientContactItem> => {
    if (isFakeBackend) {
        return updateClientContactFake(id, data) as unknown as Promise<ClientContactItem>;
    }
    // PUT payload must include these fields
    const payload = {
        title: data.title,
        contactFirstName: data.contactFirstName,
        contactLastName: data.contactLastName,
        email: data.email,
        workPhone: data.workPhone,
        mobile: data.mobile,
        notes: data.notes,
        isAllowPortalAccess: data.isAllowPortalAccess || false,
    };
    return api.put(url.UPDATE_CLIENT_CONTACT + "/" + id, payload) as unknown as Promise<ClientContactItem>;
};

export const deleteClientContact = (id: string): Promise<void> => {
    if (isFakeBackend) {
        return deleteClientContactFake(id) as unknown as Promise<void>;
    }
    return api.delete(url.DELETE_CLIENT_CONTACT + "/" + id) as unknown as Promise<void>;
};
