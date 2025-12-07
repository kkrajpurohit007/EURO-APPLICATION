/**
 * Meeting Module Validation Schemas
 * Centralized Yup validation schemas for meeting forms
 */

import * as Yup from "yup";
import { validateEmails } from "./meetingUtils";

/**
 * Base meeting validation schema (for create/edit)
 */
export const meetingFormSchema = Yup.object({
  meetingTitle: Yup.string()
    .required("Meeting title is required")
    .max(200, "Meeting title must be at most 200 characters"),
  meetingDescription: Yup.string().max(
    1000,
    "Description must be at most 1000 characters"
  ),
  meetingDate: Yup.string().required("Meeting date is required"),
  meetingStartTime: Yup.string().required("Start time is required"),
  meetingEndTime: Yup.string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { meetingStartTime } = this.parent;
        if (!meetingStartTime || !value) return true;
        return value > meetingStartTime;
      }
    ),
  meetingLocation: Yup.string().max(500, "Location must be at most 500 characters"),
  meetingType: Yup.number()
    .required("Meeting type is required")
    .oneOf([1, 2, 3, 4], "Invalid meeting type"),
});

/**
 * Create meeting validation schema (includes participants)
 */
export const createMeetingSchema = meetingFormSchema.shape({
  clientId: Yup.string().required("Client is required"),
  organizerUserId: Yup.string().required("Organizer is required"),
  externalAttendees: Yup.string().test(
    "valid-emails",
    "Invalid email format. Use semicolon to separate emails",
    function (value) {
      if (!value) return true;
      return validateEmails(value);
    }
  ),
});

/**
 * Reschedule meeting validation schema
 */
export const rescheduleMeetingSchema = Yup.object({
  newDate: Yup.string().required("New date is required"),
  newStartTime: Yup.string().required("New start time is required"),
  newEndTime: Yup.string()
    .required("New end time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { newStartTime } = this.parent;
        if (!newStartTime || !value) return true;
        return value > newStartTime;
      }
    ),
});

