import React from "react";
import { Card, CardBody, Button, Badge } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectClientContact } from "../../../slices/clientContacts/clientContact.slice";
import { ClientContactItem } from "../../../slices/clientContacts/clientContact.fakeData";
import {
  formatContactName,
  formatEmail,
  getPrimaryPhone,
  getContactStatusColor,
  getContactStatusLabel,
  hasPortalAccess,
  getContactInitials,
} from "./utils/contactUtils";

interface ContactCardProps {
  contact: ClientContactItem;
  onDelete: (id: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const displayName = formatContactName(contact);
  const email = formatEmail(contact.email);
  const phone = getPrimaryPhone(contact);
  const initials = getContactInitials(contact);
  const isActive = !contact.isDeleted;
  const statusColor = getContactStatusColor(isActive);
  const statusLabel = getContactStatusLabel(isActive);

  return (
    <Card
      className="h-100 border shadow-sm"
      style={{
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
      onClick={() => {
        dispatch(selectClientContact(contact.id));
        navigate(`/clients/contacts/view/${contact.id}`);
      }}
    >
      <CardBody className="d-flex flex-column p-3">
        {/* Header Section */}
        <div className="d-flex align-items-start mb-3">
          <div className="avatar-sm me-3">
            <div
              className="avatar-title rounded-circle bg-primary-subtle text-primary fw-semibold"
              style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {initials}
            </div>
          </div>
          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            <h6 className="mb-1 text-truncate" title={displayName}>
              {displayName}
            </h6>
            {contact.title && (
              <p className="text-muted mb-0 fs-12">{contact.title}</p>
            )}
          </div>
          <Badge color={statusColor} className="fs-11">
            {statusLabel}
          </Badge>
        </div>

        {/* Content Section */}
        <div className="flex-grow-1 mb-3">
          {/* Email */}
          <div className="mb-2">
            <p className="text-muted mb-0 fs-13 d-flex align-items-center">
              <i className="ri-mail-line align-middle me-2"></i>
              <span className="text-truncate" title={email} style={{ maxWidth: "200px" }}>
                {email}
              </span>
            </p>
          </div>

          {/* Phone */}
          {phone !== "-" && (
            <div className="mb-2">
              <p className="text-muted mb-0 fs-13 d-flex align-items-center">
                <i className="ri-phone-line align-middle me-2"></i>
                <span className="text-truncate" title={phone} style={{ maxWidth: "200px" }}>
                  {phone}
                </span>
              </p>
            </div>
          )}

          {/* Client Name */}
          {contact.clientName && (
            <div className="mb-2">
              <p className="text-muted mb-0 fs-13 d-flex align-items-center">
                <i className="ri-building-line align-middle me-2"></i>
                <span className="text-truncate" title={contact.clientName} style={{ maxWidth: "200px" }}>
                  {contact.clientName}
                </span>
              </p>
            </div>
          )}

          {/* Portal Access Badge */}
          {hasPortalAccess(contact) && (
            <div className="mt-2">
              <Badge color="info" className="fs-11">
                <i className="ri-shield-user-line align-middle me-1"></i>
                Portal Access
              </Badge>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex gap-1 flex-wrap">
            <Button
              size="sm"
              color="soft-primary"
              className="flex-fill"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(selectClientContact(contact.id));
                navigate(`/clients/contacts/view/${contact.id}`);
              }}
            >
              <i className="ri-eye-line align-bottom me-1"></i>
              View
            </Button>
            <Button
              size="sm"
              color="soft-secondary"
              className="flex-fill"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(selectClientContact(contact.id));
                navigate(`/clients/contacts/edit/${contact.id}`);
              }}
            >
              <i className="ri-pencil-line align-bottom me-1"></i>
              Edit
            </Button>
            <Button
              size="sm"
              color="soft-danger"
              className="flex-fill"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(contact.id);
              }}
            >
              <i className="ri-delete-bin-line align-bottom me-1"></i>
              Delete
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ContactCard;

