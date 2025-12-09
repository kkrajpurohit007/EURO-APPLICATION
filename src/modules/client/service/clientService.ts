/**
 * Client Module Service
 * Self-contained API service for client operations
 */

import { APIClient } from "../../../helpers/api_helper";
import * as url from "../../../helpers/url_helper";
import {
  getClients,
  addNewClient,
  updateClient as updateClientFake,
  deleteClient as deleteClientFake,
} from "../../../helpers/fakebackend_helper";
import { ClientItem, ClientsResponse } from "../slice/client.types";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getAllClients = (
  pageNumber: number = 1,
  pageSize: number = 50
): Promise<ClientsResponse> => {
  if (isFakeBackend) {
    return getClients(pageNumber, pageSize) as unknown as Promise<ClientsResponse>;
  }
  return api.get(url.GET_CLIENTS, {
    pageNumber,
    pageSize,
  }) as unknown as Promise<ClientsResponse>;
};

export const createClient = (data: Partial<ClientItem> & { registeredNumber?: string }): Promise<ClientItem> => {
  if (isFakeBackend) {
    return addNewClient(data) as unknown as Promise<ClientItem>;
  }
  const payload = {
    tenantId: data.tenantId,
    name: data.name,
    registeredNumber: data.registeredNumber || "",
    gstNumber: data.gstNumber || "",
    address1: data.address1,
    address2: data.address2,
    countryId: data.countryId,
    zipcode: data.zipcode,
    managerFirstName: data.managerFirstName,
    managerLastName: data.managerLastName,
    managerEmailId: data.managerEmailId,
    isPriority: data.isPriority || false,
    priorityReason: data.priorityReason || "",
    logoPath: null,
  };
  return api.create(url.ADD_NEW_CLIENT, payload) as unknown as Promise<ClientItem>;
};

export const updateClient = (
  id: string,
  data: Partial<ClientItem> & { registeredNumber?: string }
): Promise<ClientItem> => {
  if (isFakeBackend) {
    return updateClientFake(id, data) as unknown as Promise<ClientItem>;
  }
  const payload = {
    name: data.name,
    registeredNumber: data.registeredNumber || "",
    gstNumber: data.gstNumber || "",
    address1: data.address1,
    address2: data.address2,
    countryId: data.countryId,
    zipcode: data.zipcode,
    managerFirstName: data.managerFirstName,
    managerLastName: data.managerLastName,
    managerEmailId: data.managerEmailId,
    isPriority: data.isPriority || false,
    priorityReason: data.priorityReason || "",
    logoPath: null,
  };
  return api.put(url.UPDATE_CLIENT + "/" + id, payload) as unknown as Promise<ClientItem>;
};

export const deleteClient = (id: string): Promise<void> => {
  if (isFakeBackend) {
    return deleteClientFake(id) as unknown as Promise<void>;
  }
  return api.delete(url.DELETE_CLIENT + "/" + id) as unknown as Promise<void>;
};

