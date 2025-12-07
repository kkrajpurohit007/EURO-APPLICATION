import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import {
  getClientMeetings,
  addNewClientMeeting,
  updateClientMeeting as updateClientMeetingFake,
  rescheduleClientMeeting as rescheduleClientMeetingFake,
  deleteClientMeeting as deleteClientMeetingFake,
} from "../helpers/fakebackend_helper";
import {
  ClientMeeting,
  ClientMeetingsResponse,
  ClientMeetingPayload,
} from "../slices/clientMeetings/clientMeeting.fakeData";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getAllClientMeetings = (
  pageNumber: number = 1,
  pageSize: number = 20,
  clientId?: string,
  startDate?: string,
  endDate?: string
): Promise<ClientMeetingsResponse> => {
  if (isFakeBackend) {
    return getClientMeetings(pageNumber, pageSize, clientId) as unknown as Promise<ClientMeetingsResponse>;
  }
  // Real API call with query parameters
  // Default: fetch meetings from today to upcoming 30 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  
  const params: any = {
    pageNumber,
    pageSize,
    startDate: startDate || today.toISOString().split('T')[0],
    endDate: endDate || thirtyDaysLater.toISOString().split('T')[0],
  };
  if (clientId) {
    params.clientId = clientId;
  }
  return api.get(url.GET_CLIENT_MEETINGS, params) as unknown as Promise<ClientMeetingsResponse>;
};

export const getClientMeetingById = (id: string): Promise<ClientMeeting> => {
  if (isFakeBackend) {
    return getClientMeetings(1, 20).then((response: any) => {
      const meeting = response.items.find((m: ClientMeeting) => m.id === id);
      if (!meeting) {
        throw new Error("Meeting not found");
      }
      return meeting;
    }) as unknown as Promise<ClientMeeting>;
  }
  return api.get(`${url.GET_CLIENT_MEETING_BY_ID}/${id}`, {}) as unknown as Promise<ClientMeeting>;
};

// Get meeting data for edit - includes participants
export const getClientMeetingForEdit = (
  id: string,
  clientId: string
): Promise<any> => {
  if (isFakeBackend) {
    return getClientMeetings(1, 20).then((response: any) => {
      const meeting = response.items.find((m: ClientMeeting) => m.id === id);
      if (!meeting) {
        throw new Error("Meeting not found");
      }
      return meeting;
    }) as unknown as Promise<any>;
  }
  // GET /ClientMeeting/{id}/ForEdit?clientId={clientId}
  const apiUrl = `${url.GET_CLIENT_MEETING_FOR_EDIT}/${id}/ForEdit?clientId=${clientId}`;
  // Pass undefined instead of {} to avoid adding extra ? when URL already has query params
  return api.get(apiUrl, undefined) as unknown as Promise<any>;
};

export const createClientMeeting = (
  data: ClientMeetingPayload
): Promise<ClientMeeting> => {
  if (isFakeBackend) {
    return addNewClientMeeting(data) as unknown as Promise<ClientMeeting>;
  }
  // Clean payload for backend
  const payload = {
    tenantId: data.tenantId,
    clientId: data.clientId,
    meetingTitle: data.meetingTitle,
    meetingDescription: data.meetingDescription,
    meetingDate: data.meetingDate,
    meetingStartTime: data.meetingStartTime,
    meetingEndTime: data.meetingEndTime,
    meetingLocation: data.meetingLocation,
    meetingType: data.meetingType,
    organizerUserId: data.organizerUserId,
    tenantUserIds: data.tenantUserIds || [],
    clientContactIds: data.clientContactIds || [],
    externalAttendees: data.externalAttendees || "",
  };
  return api
    .create(url.ADD_NEW_CLIENT_MEETING, payload)
    .then((response: any) => {
      // Handle API response wrapper
      if (response.result?.ClientMeeting) {
        return response.result.ClientMeeting;
      }
      return response as unknown as ClientMeeting;
    }) as unknown as Promise<ClientMeeting>;
};

export const updateClientMeeting = (
  id: string,
  data: Partial<ClientMeeting>
): Promise<ClientMeeting> => {
  if (isFakeBackend) {
    return updateClientMeetingFake(id, data) as unknown as Promise<ClientMeeting>;
  }
  // PUT payload - only editable fields (no tenant/client IDs)
  const payload = {
    meetingTitle: data.meetingTitle,
    meetingDescription: data.meetingDescription,
    meetingDate: data.meetingDate,
    meetingStartTime: data.meetingStartTime,
    meetingEndTime: data.meetingEndTime,
    meetingLocation: data.meetingLocation,
    meetingType: data.meetingType,
  };
  return api
    .put(`${url.UPDATE_CLIENT_MEETING}/${id}`, payload)
    .then((response: any) => {
      // Handle API response wrapper
      if (response.result?.ClientMeeting) {
        return response.result.ClientMeeting;
      }
      return response as unknown as ClientMeeting;
    }) as unknown as Promise<ClientMeeting>;
};

// Update meeting for edit - includes full payload with participants
export const updateClientMeetingForEdit = (
  id: string,
  clientId: string,
  data: ClientMeetingPayload
): Promise<ClientMeeting> => {
  if (isFakeBackend) {
    return updateClientMeetingFake(id, data) as unknown as Promise<ClientMeeting>;
  }
  // PUT /ClientMeeting/{id}/ForEdit?clientId={clientId}
  // Full payload including tenantId, clientId, tenantUserIds, clientContactIds, externalAttendees
  const payload = {
    tenantId: data.tenantId,
    clientId: data.clientId,
    meetingTitle: data.meetingTitle,
    meetingDescription: data.meetingDescription,
    meetingDate: data.meetingDate,
    meetingStartTime: data.meetingStartTime,
    meetingEndTime: data.meetingEndTime,
    meetingLocation: data.meetingLocation,
    meetingType: data.meetingType,
    organizerUserId: data.organizerUserId,
    tenantUserIds: data.tenantUserIds || [],
    clientContactIds: data.clientContactIds || null,
    externalAttendees: data.externalAttendees || "",
  };
  const apiUrl = `${url.UPDATE_CLIENT_MEETING_FOR_EDIT}/${id}/ForEdit?clientId=${clientId}`;
  console.log("API URL:", apiUrl);
  console.log("Payload:", payload);
  
  return api
    .put(apiUrl, payload)
    .then((response: any) => {
      console.log("API Response:", response);
      // Handle API response wrapper - response.result contains the meeting
      // API returns: { id, isSuccess, message, result: { ...meeting data... } }
      if (response?.result) {
        return response.result as ClientMeeting;
      }
      // If no wrapper, return response directly
      return response as unknown as ClientMeeting;
    })
    .catch((error: any) => {
      // Re-throw with more context
      console.error("Error updating meeting:", error);
      throw error;
    }) as unknown as Promise<ClientMeeting>;
};

export const rescheduleClientMeeting = (
  id: string,
  newDate: string,
  newStartTime: string,
  newEndTime: string
): Promise<ClientMeeting> => {
  if (isFakeBackend) {
    return rescheduleClientMeetingFake(id, newDate, newStartTime, newEndTime) as unknown as Promise<ClientMeeting>;
  }
  const payload = {
    newDate,
    newStartTime,
    newEndTime,
  };
  return api
    .put(`${url.RESCHEDULE_CLIENT_MEETING}/${id}/Reschedule`, payload)
    .then((response: any) => {
      // Handle API response wrapper
      if (response.result?.ClientMeeting) {
        return response.result.ClientMeeting;
      }
      return response as unknown as ClientMeeting;
    }) as unknown as Promise<ClientMeeting>;
};

export const deleteClientMeeting = (id: string): Promise<void> => {
  if (isFakeBackend) {
    return deleteClientMeetingFake(id) as unknown as Promise<void>;
  }
  return api.delete(`${url.DELETE_CLIENT_MEETING}/${id}`) as unknown as Promise<void>;
};

