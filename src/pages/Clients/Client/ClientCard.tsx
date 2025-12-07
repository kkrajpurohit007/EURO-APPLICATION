import React from "react";
import { Card, CardBody, Button, Badge } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectClient } from "../../../slices/clients/client.slice";

interface ClientCardProps {
  client: any;
  onDelete: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get initials from client name
  const getClientInitials = (name: string): string => {
    if (!name) return "C";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getClientInitials(client.name || "Client");
  const statusColor = client.isPriority ? "warning" : "secondary";
  const statusLabel = client.isPriority ? "Priority" : "Standard";

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
        dispatch(selectClient(client.id));
        navigate(`/clients/view/${client.id}`);
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
            <h6 className="mb-1 text-truncate" title={client.name}>
              {client.name}
            </h6>
          </div>
          <Badge color={statusColor} className="fs-11">
            {statusLabel}
          </Badge>
        </div>

        {/* Content Section */}
        <div className="flex-grow-1 mb-3">
          {/* Registration */}
          {client.registeredNumber && (
            <div className="mb-2">
              <p className="text-muted mb-0 fs-13 d-flex align-items-center">
                <i className="ri-file-text-line align-middle me-2"></i>
                <span className="text-truncate" title={client.registeredNumber} style={{ maxWidth: "200px" }}>
                  Registration: {client.registeredNumber}
                </span>
              </p>
            </div>
          )}

          {/* GST */}
          {client.gstNumber && (
            <div className="mb-2">
              <p className="text-muted mb-0 fs-13 d-flex align-items-center">
                <i className="ri-file-list-line align-middle me-2"></i>
                <span className="text-truncate" title={client.gstNumber} style={{ maxWidth: "200px" }}>
                  GST: {client.gstNumber}
                </span>
              </p>
            </div>
          )}

          {/* Manager */}
          {(client.managerFirstName || client.managerLastName) && (
            <div className="mb-2">
              <p className="text-muted mb-0 fs-13 d-flex align-items-center">
                <i className="ri-user-line align-middle me-2"></i>
                <span className="text-truncate" title={`${client.managerFirstName || ""} ${client.managerLastName || ""}`.trim()} style={{ maxWidth: "200px" }}>
                  Manager: {client.managerFirstName} {client.managerLastName}
                </span>
              </p>
            </div>
          )}

          {/* Email */}
          {client.managerEmailId && (
            <div className="mb-2">
              <p className="text-muted mb-0 fs-13 d-flex align-items-center">
                <i className="ri-mail-line align-middle me-2"></i>
                <span className="text-truncate" title={client.managerEmailId} style={{ maxWidth: "200px" }}>
                  {client.managerEmailId}
                </span>
              </p>
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
                dispatch(selectClient(client.id));
                navigate(`/clients/view/${client.id}`);
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
                dispatch(selectClient(client.id));
                navigate(`/clients/edit/${client.id}`);
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
                onDelete(client.id);
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

export default ClientCard;