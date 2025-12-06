import axios from "axios";
import config from "../config";
import * as url from "../helpers/url_helper";
import {
  getLeadAttachments as getLeadAttachmentsFake,
  addNewLeadAttachment as addNewLeadAttachmentFake,
  deleteLeadAttachment as deleteLeadAttachmentFake,
} from "../helpers/fakebackend_helper";

const { api } = config;

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export interface LeadAttachmentItem {
  id: string;
  tenantId: string;
  tenantName?: string;
  leadId: string;
  leadTitle?: string;
  fileName: string;
  filePath: string;
  fileSizeBytes: number;
  isDeleted: boolean;
}

export interface LeadAttachmentResponse {
  items: LeadAttachmentItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface LeadAttachmentCreatePayload {
  tenantId: string;
  leadId: string;
  attachment: File;
}

export interface LeadAttachmentApiResponse {
  id: string;
  isSuccess: boolean;
  notFound: boolean;
  message: string;
  modelErrors: any[];
  result: LeadAttachmentItem;
}

// Get auth token
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

// Get all attachments for a lead
export const getLeadAttachments = async (
  leadId: string,
  pageNumber: number = 1,
  pageSize: number = 100
): Promise<LeadAttachmentResponse> => {
  if (isFakeBackend) {
    try {
      const response = await getLeadAttachmentsFake(
        leadId,
        pageNumber,
        pageSize
      ) as unknown as Promise<LeadAttachmentResponse>;
      return response;
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
  }

  const token = getAuthToken();
  const response = await axios.get(`${api.API_URL}${url.GET_LEAD_ATTACHMENTS}`, {
    params: {
      leadId,
      pageNumber,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
    },
  });
  
  // Axios interceptor already unwraps response.data, so response IS the data
  // Return directly - API returns: { items: [], pageNumber, pageSize, totalCount, ... }
  // The API should already filter by leadId and non-deleted items
  return response as unknown as LeadAttachmentResponse;
};

// Upload a new attachment
export const uploadLeadAttachment = async (
  payload: LeadAttachmentCreatePayload
): Promise<LeadAttachmentItem> => {
  if (isFakeBackend) {
    // For fake backend, we'll simulate file upload by creating a fake file object
    const fakeFileData = {
      tenantId: payload.tenantId,
      leadId: payload.leadId,
      fileName: payload.attachment.name,
      filePath: URL.createObjectURL(payload.attachment),
      fileSizeBytes: payload.attachment.size,
    };

    try {
      const response = await addNewLeadAttachmentFake(
        fakeFileData
      ) as unknown as Promise<LeadAttachmentItem>;
      return response;
    } catch (error) {
      throw new Error("Failed to upload attachment in fake mode");
    }
  }

  const token = getAuthToken();
  const formData = new FormData();
  formData.append("TenantId", payload.tenantId);
  formData.append("LeadId", payload.leadId);
  formData.append("Attachment", payload.attachment);

  const response = await axios.post<LeadAttachmentApiResponse>(
    `${api.API_URL}${url.ADD_LEAD_ATTACHMENT}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.result;
};

// Delete an attachment
export const deleteLeadAttachment = async (attachmentId: string): Promise<void> => {
  if (isFakeBackend) {
    try {
      await deleteLeadAttachmentFake(attachmentId);
      return;
    } catch (error) {
      throw new Error("Failed to delete attachment in fake mode");
    }
  }

  const token = getAuthToken();
  await axios.delete(`${api.API_URL}${url.DELETE_LEAD_ATTACHMENT}/${attachmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json;odata.metadata=minimal;odata.streaming=true",
    },
  });
};

// Download attachment file - uses direct filePath URL
export const downloadLeadAttachment = async (
  attachment: LeadAttachmentItem
): Promise<Blob> => {
  if (isFakeBackend) {
    // For fake backend, we can't actually download files, so we'll just return a dummy blob
    // In a real implementation, you might want to handle this differently
    return new Blob(["Dummy file content for fake backend"], { type: "text/plain" });
  }

  const token = getAuthToken();
  // Download directly from filePath URL
  const response = await axios.get(attachment.filePath, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
