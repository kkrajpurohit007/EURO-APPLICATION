/**
 * Generic Card Component
 * Reusable card component for displaying entity cards (Client, Lead, Contact, etc.)
 */

import React from "react";
import { Card, CardBodyShared } from "./Card";
import { Button, ActionButton } from "./Button";
import { Badge, StatusBadge } from "./Badge";
import { theme } from "../theme";

export interface CardComponentProps {
  // Card content
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: React.ReactNode;
  initials?: string;
  
  // Status
  status?: "active" | "inactive" | "pending" | "completed" | "cancelled" | "priority" | "standard";
  statusLabel?: string;
  statusColor?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  
  // Metadata fields
  metadata?: Array<{
    icon?: React.ReactNode;
    label: string;
    value: string;
  }>;
  
  // Actions
  actions?: Array<{
    type: "view" | "edit" | "delete" | "reschedule" | "download" | "preview";
    onClick: () => void;
    title?: string;
    show?: boolean;
  }>;
  
  // Card behavior
  hover?: boolean;
  onClick?: () => void;
  className?: string;
  
  // Children (for custom content)
  children?: React.ReactNode;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  title,
  subtitle,
  description,
  avatar,
  initials,
  status,
  statusLabel,
  statusColor,
  metadata = [],
  actions = [],
  hover = true,
  onClick,
  className = "",
  children,
}) => {
  // Generate initials if not provided
  const getInitials = (name: string): string => {
    if (!name) return "?";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayInitials = initials || getInitials(title);
  const cardClickHandler = onClick;

  return (
    <Card
      hover={hover}
      className={className}
      onClick={cardClickHandler}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <CardBodyShared padding="md" className="d-flex flex-column">
        {/* Header Section */}
        <div className="d-flex align-items-start mb-3">
          {avatar || (
            <div className="avatar-sm me-3">
              <div
                className="avatar-title rounded-circle bg-primary-subtle text-primary fw-semibold"
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {displayInitials}
              </div>
            </div>
          )}
          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            <h6 className="mb-1 text-truncate" title={title}>
              {title}
            </h6>
            {subtitle && (
              <p className="text-muted mb-0 fs-13 text-truncate" title={subtitle}>
                {subtitle}
              </p>
            )}
          </div>
          {(status || statusLabel) && (
            <div className="ms-2">
              {status ? (
                <StatusBadge status={status} />
              ) : (
                <Badge variant={statusColor || "secondary"} size="sm">
                  {statusLabel}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="mb-3">
            <p className="text-muted mb-0 fs-13">{description}</p>
          </div>
        )}

        {/* Metadata Section */}
        {metadata.length > 0 && (
          <div className="flex-grow-1 mb-3">
            {metadata.map((item, index) => (
              <div key={index} className="mb-2">
                <p className="text-muted mb-0 fs-13 d-flex align-items-center">
                  {item.icon && (
                    <span className="me-2">{item.icon}</span>
                  )}
                  <span className="text-truncate" style={{ maxWidth: "200px" }} title={item.value}>
                    {item.label ? `${item.label}: ${item.value}` : item.value}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Custom Children */}
        {children}

        {/* Action Buttons Section */}
        {actions.length > 0 && (
          <div className="mt-auto pt-3 border-top">
            <div className="d-flex gap-1 flex-wrap">
              {actions
                .filter((action) => action.show !== false)
                .map((action, index) => (
                  <ActionButton
                    key={index}
                    action={action.type}
                    onClick={action.onClick}
                    title={action.title}
                    className="flex-fill"
                  />
                ))}
            </div>
          </div>
        )}
      </CardBodyShared>
    </Card>
  );
};

export default CardComponent;

