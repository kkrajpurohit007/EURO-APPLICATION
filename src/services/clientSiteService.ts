import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import {
  getClientSites,
  addNewClientSite,
  updateClientSite as updateClientSiteFake,
  deleteClientSite as deleteClientSiteFake,
} from "../helpers/fakebackend_helper";
import { ClientSiteItem, ClientSitesResponse } from "../slices/clientSites/clientSite.fakeData";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getAllClientSites = (
  pageNumber: number = 1,
  pageSize: number = 50
): Promise<ClientSitesResponse> => {
  if (isFakeBackend) {
    return getClientSites(pageNumber, pageSize) as unknown as Promise<ClientSitesResponse>;
  }
  // Real API call with query parameters
  return api.get(url.GET_CLIENT_SITES, {
    pageNumber,
    pageSize,
  }) as unknown as Promise<ClientSitesResponse>;
};

export const createClientSite = (data: Partial<ClientSiteItem>): Promise<ClientSiteItem> => {
  if (isFakeBackend) {
    return addNewClientSite(data) as unknown as Promise<ClientSiteItem>;
  }
  // Clean payload for backend - only required fields
  const payload = {
    clientId: data.clientId,
    tenantId: data.tenantId,
    siteName: data.siteName,
    address1: data.address1,
    address2: data.address2,
    countryId: data.countryId,
    zipcode: data.zipcode,
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    siteRadiusMeters: data.siteRadiusMeters || 200,
    requireGeofencing: data.requireGeofencing || false,
  };
  return api.create(url.ADD_NEW_CLIENT_SITE, payload) as unknown as Promise<ClientSiteItem>;
};

export const updateClientSite = (
  id: string,
  data: Partial<ClientSiteItem>
): Promise<ClientSiteItem> => {
  if (isFakeBackend) {
    return updateClientSiteFake(id, data) as unknown as Promise<ClientSiteItem>;
  }
  // PUT payload - exclude clientId and tenantId
  const payload = {
    siteName: data.siteName,
    address1: data.address1,
    address2: data.address2,
    countryId: data.countryId,
    zipcode: data.zipcode,
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    siteRadiusMeters: data.siteRadiusMeters || 200,
    requireGeofencing: data.requireGeofencing || false,
  };
  return api.put(url.UPDATE_CLIENT_SITE + "/" + id, payload) as unknown as Promise<ClientSiteItem>;
};

export const deleteClientSite = (id: string): Promise<void> => {
  if (isFakeBackend) {
    return deleteClientSiteFake(id) as unknown as Promise<void>;
  }
  return api.delete(url.DELETE_CLIENT_SITE + "/" + id) as unknown as Promise<void>;
};
