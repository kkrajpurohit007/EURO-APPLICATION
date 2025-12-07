import { APIClient } from "../helpers/api_helper";
import axios from "axios";
import config from "../config";
import * as url from "../helpers/url_helper";
import {
  getLeads,
  addNewLead,
  updateLead as updateLeadFake,
  deleteLead as deleteLeadFake,
} from "../helpers/fakebackend_helper";
import { LeadItem, LeadsResponse } from "../slices/leads/lead.fakeData";

const api = new APIClient();
const { api: apiConfig } = config;

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

// Helper function to get auth token
const getAuthToken = () => {
  const authUser = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (authUser) {
    try {
      const user = JSON.parse(authUser);
      return user.token || user.jwt || null;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const getAllLeads = (
  pageNumber: number = 1,
  pageSize: number = 50
): Promise<LeadsResponse> => {
  if (isFakeBackend) {
    return getLeads(pageNumber, pageSize) as unknown as Promise<LeadsResponse>;
  }
  // Real API call with query parameters
  return api.get(url.GET_LEADS, {
    pageNumber,
    pageSize,
  }) as unknown as Promise<LeadsResponse>;
};

export const createLead = async (data: Partial<LeadItem & { attachments?: File[] }>): Promise<LeadItem> => {
  if (isFakeBackend) {
    return addNewLead(data) as unknown as Promise<LeadItem>;
  }

  // Check if attachments are provided
  const attachments = (data as any).attachments;
  const hasAttachments = attachments && Array.isArray(attachments) && attachments.length > 0;

  if (hasAttachments) {
    // Use new endpoint with multipart/form-data
    const token = getAuthToken();
    const formData = new FormData();

    // Append all form fields
    if (data.tenantId) formData.append("TenantId", data.tenantId);
    if (data.title) formData.append("Title", data.title);
    if (data.contactPerson) formData.append("ContactPerson", data.contactPerson);
    if (data.contactEmail) formData.append("ContactEmail", data.contactEmail);
    if (data.description) formData.append("Description", data.description);
    if (data.leadStatus !== undefined) formData.append("LeadStatus", String(data.leadStatus));
    if (data.tentativeWorkDays !== undefined) formData.append("TentativeWorkDays", String(data.tentativeWorkDays));
    if (data.notes) formData.append("Notes", data.notes);
    if (data.phoneNumber) formData.append("PhoneNumber", data.phoneNumber);
    if (data.siteAddress) formData.append("SiteAddress", data.siteAddress);
    if (data.tenantLocationId) formData.append("TenantLocationId", data.tenantLocationId);
    if (data.tentativeProjectStartDate) formData.append("TentativeProjectStartDate", data.tentativeProjectStartDate);
    // Handle ClientId if provided (may not be in LeadItem type but could be in payload)
    if ((data as any).clientId) formData.append("ClientId", (data as any).clientId);

    // Append attachments (multiple files)
    attachments.forEach((file: File) => {
      formData.append("Attachments", file);
    });

    const response = await axios.post(
      `${apiConfig.API_URL}${url.ADD_NEW_LEAD_WITH_ATTACHMENTS}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Use exact same pattern as leadAttachmentService.ts: response.data.result
    // The axios interceptor may modify the response, but leadAttachmentService uses response.data,
    // so we'll follow that pattern
    const responseData = (response as any).data || response;
    
    // Debug logging
    console.log("=== Lead Creation Response Debug ===");
    console.log("Raw response:", response);
    console.log("response.data:", (response as any)?.data);
    console.log("Final responseData:", responseData);
    console.log("responseData.result:", responseData?.result);
    console.log("responseData.isSuccess:", responseData?.isSuccess);
    console.log("================================");
    
    // Check if the response indicates failure
    if (responseData?.isSuccess === false) {
      const errorMessage = responseData?.message || "Failed to create lead";
      const modelErrors = responseData?.modelErrors || [];
      if (modelErrors.length > 0) {
        const errorDetails = modelErrors.map((err: any) => `${err.key}: ${err.value}`).join(", ");
        throw new Error(`${errorMessage}. ${errorDetails}`);
      }
      throw new Error(errorMessage);
    }
    
    // Extract the result from the response wrapper
    // The API returns: { isSuccess: true, result: { id, title, ... }, message: "..." }
    // Use the same pattern as leadAttachmentService: response.data.result
    
    // Try multiple ways to access the result
    let leadData: any = null;
    
    if (responseData?.result) {
      leadData = responseData.result;
    } else if (responseData?.data?.result) {
      // Nested data.result
      leadData = responseData.data.result;
    } else if (responseData?.id && responseData?.isSuccess !== false) {
      // Fallback: if result doesn't exist but id does, use the responseData itself
      leadData = responseData;
    }
    
    if (leadData && leadData.id) {
      return leadData as LeadItem;
    }
    
    // If no valid response structure, throw an error with more details
    console.error("Invalid response structure - missing result.");
    console.error("responseData keys:", responseData ? Object.keys(responseData) : 'null');
    console.error("Full responseData:", JSON.stringify(responseData, null, 2));
    throw new Error(responseData?.message || "Invalid response from server: missing result");
  } else {
    // Use original endpoint for leads without attachments
    return api.create(url.ADD_NEW_LEAD, data) as unknown as Promise<LeadItem>;
  }
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
