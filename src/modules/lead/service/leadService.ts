/**
 * Lead Module Service
 * Self-contained API service for lead operations
 */

import { APIClient } from "../../../helpers/api_helper";
import * as url from "../../../helpers/url_helper";
import {
  getLeads,
  addNewLead,
  updateLead as updateLeadFake,
  deleteLead as deleteLeadFake,
} from "../../../helpers/fakebackend_helper";
import { LeadItem, LeadsResponse } from "../slice/lead.types";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getAllLeads = (
  pageNumber: number = 1,
  pageSize: number = 500
): Promise<LeadsResponse> => {
  if (isFakeBackend) {
    return getLeads(pageNumber, pageSize) as unknown as Promise<LeadsResponse>;
  }
  return api.get(url.GET_LEADS, {
    pageNumber,
    pageSize,
  }) as unknown as Promise<LeadsResponse>;
};

export const createLead = async (data: Partial<LeadItem & { attachments?: File[] }>): Promise<LeadItem> => {
  if (isFakeBackend) {
    return addNewLead(data) as unknown as Promise<LeadItem>;
  }
  
  // Real API implementation would go here
  // For now, use fake backend
  return addNewLead(data) as unknown as Promise<LeadItem>;
};

export const updateLead = (
  id: string,
  data: Partial<LeadItem>
): Promise<LeadItem> => {
  if (isFakeBackend) {
    return updateLeadFake(id, data) as unknown as Promise<LeadItem>;
  }
  return api.put(url.UPDATE_LEAD + "/" + id, data) as unknown as Promise<LeadItem>;
};

export const deleteLead = (id: string): Promise<void> => {
  if (isFakeBackend) {
    return deleteLeadFake(id) as unknown as Promise<void>;
  }
  return api.delete(url.DELETE_LEAD + "/" + id) as unknown as Promise<void>;
};

