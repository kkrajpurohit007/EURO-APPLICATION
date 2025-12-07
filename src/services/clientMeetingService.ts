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
  clientId?: string
): Promise<ClientMeetingsResponse> => {
  if (isFakeBackend) {
    return getClientMeetings(pageNumber, pageSize, clientId) as unknown as Promise<ClientMeetingsResponse>;
  }
  // Real API call with query parameters
  const params: any = {
    pageNumber,
    pageSize,
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

