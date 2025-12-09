/**
 * Meeting Card Component
 * Migrated to use shared CardComponent for theme consistency
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { CardComponent } from "../../../../shared/components";
import { ClientMeeting, MEETING_TYPE_MAP, MEETING_STATUS_MAP } from "../../../../slices/clientMeetings/clientMeeting.fakeData";
import {
  formatTime,
  calculateDuration,
  getStatusColor,
  getMeetingTypeIcon,
  canEditMeeting,
  canRescheduleMeeting,
  canDeleteMeeting,
} from "../../../../pages/Clients/Meeting/utils/meetingUtils";

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
  
  const duration = calculateDuration(meeting.meetingStartTime, meeting.meetingEndTime);
  const statusLabel = MEETING_STATUS_MAP[meeting.meetingStatus] || "Unknown";
  const typeLabel = MEETING_TYPE_MAP[meeting.meetingType] || "Unknown";
  const statusColor = getStatusColor(meeting.meetingStatus);

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

  // Build metadata array
  const metadata = [];
  
  if (meeting.clientName) {
    metadata.push({
      icon: <i className="ri-building-line align-middle"></i>,
      label: "",
      value: meeting.clientName,
    });
  }
  
  if (meeting.organizerUserName) {
    metadata.push({
      icon: <i className="ri-user-line align-middle"></i>,
      label: "",
      value: meeting.organizerUserName,
    });
  }

  if (meeting.meetingStartTime) {
    metadata.push({
      icon: <i className="ri-calendar-event-line align-middle"></i>,
      label: "Date & Time",
      value: formatTime(meeting.meetingStartTime),
    });
  }

  if (duration) {
    metadata.push({
      icon: <i className="ri-time-line align-middle"></i>,
      label: "Duration",
      value: `${duration} min`,
    });
  }

  // Build actions array
  const actions = [];
  actions.push({
    type: "view" as const,
    onClick: handleView,
    show: true,
  });

  if (canEdit) {
    actions.push({
      type: "edit" as const,
      onClick: handleEdit,
      show: true,
    });
  }

  if (canReschedule) {
    actions.push({
      type: "reschedule" as const,
      onClick: handleReschedule,
      show: true,
    });
  }

  if (canDelete) {
    actions.push({
      type: "delete" as const,
      onClick: handleDelete,
      show: true,
    });
  }

  return (
    <CardComponent
      title={meeting.meetingTitle || "Untitled Meeting"}
      subtitle={typeLabel}
      statusLabel={statusLabel}
      statusColor={statusColor as any}
      metadata={metadata}
      actions={actions}
      hover={true}
      onClick={handleView}
    >
      {getMeetingTypeIcon(meeting.meetingType) && (
        <div className="mb-2">
          <span className="badge bg-light text-muted fs-11">
            {getMeetingTypeIcon(meeting.meetingType)}
            <span className="ms-1">{typeLabel}</span>
          </span>
        </div>
      )}
    </CardComponent>
  );
};

export default MeetingCard;

