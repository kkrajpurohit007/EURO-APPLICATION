// ClientMeeting interfaces matching the API schema
export interface ClientMeetingAttendee {
  id: string;
  clientMeetingId: string;
  userId?: string;
  userName?: string;
  clientContactId?: string;
  clientContactName?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  isRequired: boolean;
  attendanceStatus: number;
  responseDate?: string;
  isDeleted: boolean;
}

export interface ClientMeeting {
  id: string;
  tenantId: string;
  tenantName?: string;
  clientId: string;
  clientName?: string;
  meetingTitle?: string;
  meetingDescription?: string;
  meetingDate: string; // date-time
  meetingStartTime: string; // "HH:mm:ss"
  meetingEndTime: string; // "HH:mm:ss"
  meetingLocation?: string;
  meetingType: number; // 1..4
  organizerUserId: string;
  organizerUserName?: string;
  meetingStatus: number;
  isDeleted: boolean;
  created: string; // date-time
  modified?: string;
  attendees?: ClientMeetingAttendee[];
  externalAttendees?: string; // Semicolon-separated emails
}

// Payload interface for creating/updating meetings
export interface ClientMeetingPayload {
  tenantId: string;
  clientId: string;
  meetingTitle?: string;
  meetingDescription?: string;
  meetingDate: string;
  meetingStartTime: string;
  meetingEndTime: string;
  meetingLocation?: string;
  meetingType: number;
  organizerUserId: string;
  tenantUserIds?: string[];
  clientContactIds?: string[];
  externalAttendees?: string;
}

export interface ClientMeetingsResponse {
  items: ClientMeeting[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

// API Response wrapper for create/update operations
export interface ClientMeetingApiResponse {
  id: string;
  isSuccess: boolean;
  notFound?: boolean;
  message?: string;
  modelErrors?: any;
  result?: {
    ClientMeeting: ClientMeeting;
  };
}

// Mock data for fake backend
export const initialClientMeetings: ClientMeeting[] = [
  {
    id: "1",
    tenantId: "00000000-0000-0000-0000-000000000010",
    tenantName: "Demo Tenant",
    clientId: "aaab2f85-065a-48cc-b5ef-e10523194540",
    clientName: "Skyline Construction",
    meetingTitle: "Project Kickoff Meeting",
    meetingDescription: "Initial discussion about the new construction project",
    meetingDate: "2025-01-15T00:00:00Z",
    meetingStartTime: "10:00:00",
    meetingEndTime: "11:30:00",
    meetingLocation: "Conference Room A",
    meetingType: 1, // In Person
    organizerUserId: "d267a683-5244-4649-8925-7f852b5c180e",
    organizerUserName: "John Doe",
    meetingStatus: 1,
    isDeleted: false,
    created: "2025-01-10T08:00:00Z",
    modified: "2025-01-10T08:00:00Z",
  },
  {
    id: "2",
    tenantId: "00000000-0000-0000-0000-000000000010",
    tenantName: "Demo Tenant",
    clientId: "aaab2f85-065a-48cc-b5ef-e10523194540",
    clientName: "Skyline Construction",
    meetingTitle: "Virtual Progress Review",
    meetingDescription: "Review project progress and discuss next steps",
    meetingDate: "2025-01-20T00:00:00Z",
    meetingStartTime: "14:00:00",
    meetingEndTime: "15:00:00",
    meetingLocation: "Zoom Meeting",
    meetingType: 2, // Virtual
    organizerUserId: "d267a683-5244-4649-8925-7f852b5c180e",
    organizerUserName: "John Doe",
    meetingStatus: 1,
    isDeleted: false,
    created: "2025-01-12T09:00:00Z",
  },
];

// Meeting Type mapping
export const MEETING_TYPE_MAP: Record<number, string> = {
  1: "In Person",
  2: "Virtual",
  3: "Phone",
  4: "Hybrid",
};

// Meeting Status mapping (common statuses - adjust based on API)
export const MEETING_STATUS_MAP: Record<number, string> = {
  1: "Scheduled",
  2: "In Progress",
  3: "Completed",
  4: "Cancelled",
};

