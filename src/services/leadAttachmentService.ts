import axios from "axios";
import config from "../config";
import * as url from "../helpers/url_helper";

const { api } = config;

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
  // Filter items by leadId and non-deleted on client side
  const data = response.data;
  if (data.items) {
    data.items = data.items.filter(
      (item: LeadAttachmentItem) => item.leadId === leadId && !item.isDeleted
    );
    data.totalCount = data.items.length;
  }
  return data;
};

// Upload a new attachment
export const uploadLeadAttachment = async (
  payload: LeadAttachmentCreatePayload
): Promise<LeadAttachmentItem> => {
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

