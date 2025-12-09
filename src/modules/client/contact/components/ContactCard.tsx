/**
 * Contact Card Component
 * Migrated to use shared CardComponent for theme consistency
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CardComponent } from "../../../../shared/components";
import { selectClientContact } from "../../../../slices/clientContacts/clientContact.slice";
import { ClientContactItem } from "../../../../slices/clientContacts/clientContact.fakeData";
import {
  formatContactName,
  formatEmail,
  getPrimaryPhone,
  getContactStatusColor,
  getContactStatusLabel,
  hasPortalAccess,
  getContactInitials,
} from "../../../../pages/Clients/Contact/utils/contactUtils";

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

  const handleView = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dispatch(selectClientContact(contact.id));
    if (contact.clientId) {
      navigate(`/clients/contacts/view/${contact.id}?clientId=${contact.clientId}`);
    } else {
      navigate(`/clients/contacts/view/${contact.id}`);
    }
  };

  const handleEdit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dispatch(selectClientContact(contact.id));
    if (contact.clientId) {
      navigate(`/clients/contacts/edit/${contact.id}?clientId=${contact.clientId}`);
    } else {
      navigate(`/clients/contacts/edit/${contact.id}`);
    }
  };

  const handleDelete = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onDelete(contact.id);
  };

  // Build metadata array
  const metadata = [];
  if (email && email !== "-") {
    metadata.push({
      icon: <i className="ri-mail-line align-middle"></i>,
      label: "",
      value: email,
    });
  }
  if (phone && phone !== "-") {
    metadata.push({
      icon: <i className="ri-phone-line align-middle"></i>,
      label: "",
      value: phone,
    });
  }
  if (contact.clientName) {
    metadata.push({
      icon: <i className="ri-building-line align-middle"></i>,
      label: "",
      value: contact.clientName,
    });
  }

  // Build actions array
  const actions = [
    {
      type: "view" as const,
      onClick: handleView,
      show: true,
    },
    {
      type: "edit" as const,
      onClick: handleEdit,
      show: true,
    },
    {
      type: "delete" as const,
      onClick: handleDelete,
      show: true,
    },
  ];

  return (
    <CardComponent
      title={displayName}
      subtitle={contact.title}
      initials={initials}
      statusLabel={statusLabel}
      statusColor={statusColor as any}
      metadata={metadata}
      actions={actions}
      hover={true}
      onClick={handleView}
    >
      {hasPortalAccess(contact) && (
        <div className="mt-2">
          <span className="badge bg-info-subtle text-info fs-11">
            <i className="ri-shield-user-line align-middle me-1"></i>
            Portal Access
          </span>
        </div>
      )}
    </CardComponent>
  );
};

export default ContactCard;

