/**
 * Meeting Module Utility Functions
 * Centralized utilities for meeting-related operations
 */

import {
  ClientMeeting,
  MEETING_TYPE_MAP,
  MEETING_STATUS_MAP,
} from "../../../../slices/clientMeetings/clientMeeting.fakeData";
import { formatDate } from "../../../../common/utils";

/**
 * Format time string (HH:mm:ss) to display format (HH:mm)
 */
export const formatTime = (time: string): string => {
  if (!time) return "-";
  return time.substring(0, 5);
};

/**
 * Format date string for HTML date input (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

/**
 * Format time string for HTML time input (HH:mm)
 */
export const formatTimeForInput = (timeString: string): string => {
  if (!timeString) return "";
  return timeString.substring(0, 5);
};

/**
 * Parse external attendees string (semicolon-separated emails) into array
 */
export const parseExternalAttendees = (externalAttendees?: string): string[] => {
  if (!externalAttendees) return [];
  return externalAttendees
    .split(";")
    .map((email: string) => email.trim())
    .filter((email: string) => email);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate multiple emails (semicolon-separated)
 */
export const validateEmails = (emailsString: string): boolean => {
  if (!emailsString.trim()) return true;
  const emails = parseExternalAttendees(emailsString);
  return emails.every((email) => isValidEmail(email));
};

/**
 * Get meeting status color for Badge component
 */
export const getStatusColor = (status: number): string => {
  switch (status) {
    case 1: // Scheduled
      return "info";
    case 2: // In Progress
      return "warning";
    case 3: // Completed
      return "success";
    case 4: // Cancelled
      return "danger";
    default:
      return "secondary";
  }
};

/**
 * Get meeting type color for Badge component
 */
export const getTypeColor = (type: number): string => {
  switch (type) {
    case 1: // In Person
      return "primary";
    case 2: // Virtual
      return "info";
    case 3: // Phone
      return "secondary";
    case 4: // Hybrid
      return "success";
    default:
      return "secondary";
  }
};

/**
 * Get meeting type icon class
 */
export const getMeetingTypeIcon = (type: number): string => {
  switch (type) {
    case 2: // Virtual
      return "ri-video-line";
    case 1: // In Person
      return "ri-map-pin-line";
    case 4: // Hybrid
      return "ri-global-line";
    case 3: // Phone
      return "ri-phone-line";
    default:
      return "ri-map-pin-line";
  }
};

/**
 * Calculate meeting duration in minutes
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 60;
  const start = startTime.split(":").map(Number);
  const end = endTime.split(":").map(Number);
  const startMinutes = start[0] * 60 + (start[1] || 0);
  const endMinutes = end[0] * 60 + (end[1] || 0);
  return Math.max(60, endMinutes - startMinutes);
};

/**
 * Format date for display (uses common formatDate utility)
 */
export const formatMeetingDate = (dateString: string): string => {
  return formatDate(dateString);
};

/**
 * Get meeting type options for Select dropdown
 */
export const getMeetingTypeOptions = () => [
  { value: 1, label: MEETING_TYPE_MAP[1] },
  { value: 2, label: MEETING_TYPE_MAP[2] },
  { value: 3, label: MEETING_TYPE_MAP[3] },
  { value: 4, label: MEETING_TYPE_MAP[4] },
];

/**
 * Get meeting status options for Select dropdown
 */
export const getMeetingStatusOptions = () => [
  { value: "", label: "All Statuses" },
  { value: 1, label: MEETING_STATUS_MAP[1] },
  { value: 2, label: MEETING_STATUS_MAP[2] },
  { value: 3, label: MEETING_STATUS_MAP[3] },
  { value: 4, label: MEETING_STATUS_MAP[4] },
];

/**
 * Check if meeting can be edited (not completed or cancelled)
 */
export const canEditMeeting = (meeting: ClientMeeting): boolean => {
  return meeting.meetingStatus !== 3 && meeting.meetingStatus !== 4;
};

/**
 * Check if meeting can be rescheduled (not completed or cancelled)
 */
export const canRescheduleMeeting = (meeting: ClientMeeting): boolean => {
  return meeting.meetingStatus !== 3 && meeting.meetingStatus !== 4;
};

/**
 * Check if meeting can be deleted (not completed or cancelled)
 */
export const canDeleteMeeting = (meeting: ClientMeeting): boolean => {
  return meeting.meetingStatus !== 3 && meeting.meetingStatus !== 4;
};

/**
 * Format date to ISO string for API payload
 */
export const formatDateToISO = (dateString: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toISOString();
};

/**
 * Format time with seconds for API payload (HH:mm -> HH:mm:ss)
 */
export const formatTimeWithSeconds = (timeString: string): string => {
  if (!timeString) return "00:00:00";
  return timeString.length === 5 ? `${timeString}:00` : timeString;
};

