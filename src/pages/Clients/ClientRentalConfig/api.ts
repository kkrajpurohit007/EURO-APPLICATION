import { APIClient } from "../../../helpers/api_helper";
import * as url from "../../../helpers/url_helper";

const api = new APIClient();

// Get client rental config by client ID
export const getClientRentalConfigByClientId = (clientId: number) => {
  return api.get(url.CLIENT_RENTAL_CONFIG, { params: { clientId } });
};

// Create client rental config
export const createClientRentalConfig = (data: any) => {
  return api.create(url.CLIENT_RENTAL_CONFIG, data);
};

// Update client rental config
export const updateClientRentalConfig = (id: number, data: any) => {
  return api.update(`${url.CLIENT_RENTAL_CONFIG}/${id}`, data);
};