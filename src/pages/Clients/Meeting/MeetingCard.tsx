import React from "react";
import { Card, CardBody, Badge, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { ClientMeeting, MEETING_TYPE_MAP, MEETING_STATUS_MAP } from "../../../slices/clientMeetings/clientMeeting.fakeData";
import {
  formatTime,
  calculateDuration,
  getStatusColor,
  getMeetingTypeIcon,
  canEditMeeting,
  canRescheduleMeeting,
  canDeleteMeeting,
} from "./utils/meetingUtils";

interface MeetingCardProps {
  meeting: ClientMeeting;
  onView?: () => void;
  onEdit?: () => void;
  onReschedule?: () => void;
  onDelete?: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onView,
  onEdit,
  onReschedule,
  onDelete,
}) => {
  const navigate = useNavigate();
  
  const attendeeCount = meeting.attendees?.length || 0;
  const duration = calculateDuration(meeting.meetingStartTime, meeting.meetingEndTime);
  const statusLabel = MEETING_STATUS_MAP[meeting.meetingStatus] || "Unknown";
  const typeLabel = MEETING_TYPE_MAP[meeting.meetingType] || "Unknown";

  const handleView = () => {
    if (onView) {
      onView();
    } else {
      navigate(`/meetings/view/${meeting.id}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/meetings/edit/${meeting.id}`);
    }
  };

  const handleReschedule = () => {
    if (onReschedule) {
      onReschedule();
    } else {
      navigate(`/meetings/reschedule/${meeting.id}`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const canEdit = canEditMeeting(meeting);
  const canReschedule = canRescheduleMeeting(meeting);
  const canDelete = canDeleteMeeting(meeting);

  return (
    <Card className="h-100 border card-border-primary">
      <CardBody className="d-flex flex-column">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1 pe-2" style={{ minWidth: 0 }}>
            <h5 
              className="card-title mb-1 text-truncate" 
              title={meeting.meetingTitle || "Untitled Meeting"}
              style={{ fontSize: "16px", lineHeight: "1.4" }}
            >
              {meeting.meetingTitle || "Untitled Meeting"}
            </h5>
            <p className="text-muted mb-1 text-truncate" title={meeting.clientName || "-"}>
              <i className="ri-building-line align-middle me-1"></i>
              {meeting.clientName || "-"}
            </p>
            <p className="text-muted mb-0 text-truncate" title={meeting.organizerUserName || "-"} style={{ fontSize: "12px" }}>
              <i className="ri-user-line align-middle me-1"></i>
              {meeting.organizerUserName || "-"}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Badge color={getStatusColor(meeting.meetingStatus)} className="fs-11">
              {statusLabel}
            </Badge>
          </div>
        </div>

        {/* Content Section - Flex grow to fill space */}
        <div className="flex-grow-1 mb-3">
          {/* Description */}
          {meeting.meetingDescription && (
            <div className="mb-2">
              <p 
                className="text-muted mb-0" 
                style={{ fontSize: "12px", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                title={meeting.meetingDescription}
              >
                {meeting.meetingDescription}
              </p>
            </div>
          )}

          <div className="mb-2">
            <div className="text-muted mb-1" style={{ fontSize: "13px" }}>
              <i className="ri-calendar-line align-middle me-1"></i>
              {new Date(meeting.meetingDate).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-muted mb-1" style={{ fontSize: "13px" }}>
              <i className="ri-time-line align-middle me-1"></i>
              {formatTime(meeting.meetingStartTime)} - {formatTime(meeting.meetingEndTime)} ({duration} mins)
            </div>
            <div className="text-muted mb-1" style={{ fontSize: "13px" }}>
              <i
                className={`${getMeetingTypeIcon(
                  meeting.meetingType
                )} align-middle me-1`}
              ></i>
              <span className="text-truncate d-inline-block" style={{ maxWidth: "200px" }} title={meeting.meetingLocation || "-"}>
                {meeting.meetingLocation || "-"}
              </span>
            </div>
          </div>

          <div className="mb-2">
            <Badge color="light" className="text-muted me-1 mb-1" style={{ fontSize: "11px" }}>
              <i className="ri-group-line align-middle me-1"></i>
              {attendeeCount} Attendee
              {attendeeCount !== 1 ? "s" : ""}
            </Badge>
            <Badge color="light" className="text-muted mb-1" style={{ fontSize: "11px" }}>
              <i className="ri-calendar-event-line align-middle me-1"></i>
              {typeLabel}
            </Badge>
          </div>
        </div>

        {/* Action Buttons Section - Fixed at bottom */}
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex gap-1 flex-wrap">
            <Button
              size="sm"
              color="soft-primary"
              onClick={handleView}
              className="flex-fill"
              style={{ minWidth: "60px" }}
            >
              <i className="ri-eye-line align-bottom me-1"></i>
              View
            </Button>
            {canEdit && (
              <Button
                size="sm"
                color="soft-secondary"
                onClick={handleEdit}
                className="flex-fill"
                style={{ minWidth: "60px" }}
              >
                <i className="ri-pencil-line align-bottom me-1"></i>
                Edit
              </Button>
            )}
            {canReschedule && (
              <Button
                size="sm"
                color="soft-warning"
                onClick={handleReschedule}
                className="flex-fill"
                style={{ minWidth: "60px" }}
              >
                <i className="ri-calendar-event-line align-bottom me-1"></i>
                Reschedule
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                color="soft-danger"
                onClick={handleDelete}
                className="flex-fill"
                style={{ minWidth: "60px" }}
              >
                <i className="ri-delete-bin-line align-bottom me-1"></i>
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default MeetingCard;
