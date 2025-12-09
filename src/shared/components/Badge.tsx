/**
 * Shared Badge Component
 * Consistent badge styling across all modules
 */

import React from "react";
import { Badge as ReactstrapBadge, BadgeProps } from "reactstrap";
import { theme } from "../theme";

export interface SharedBadgeProps extends BadgeProps {
  size?: "sm" | "md";
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
}

export const Badge: React.FC<SharedBadgeProps> = ({
  size = "md",
  variant = "primary",
  className = "",
  style,
  children,
  ...props
}) => {
  const badgeClasses = [
    size === "sm" ? "fs-11" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const badgeStyle: React.CSSProperties = {
    borderRadius: theme.badge.borderRadius,
    fontWeight: theme.badge.fontWeight,
    ...style,
  };

  return (
    <ReactstrapBadge
      color={variant}
      className={badgeClasses}
      style={badgeStyle}
      {...props}
    >
      {children}
    </ReactstrapBadge>
  );
};

// Status Badge (for common status types)
export interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "completed" | "cancelled" | "priority" | "standard";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const statusConfig = {
    active: { color: "success" as const, label: "Active" },
    inactive: { color: "secondary" as const, label: "Inactive" },
    pending: { color: "warning" as const, label: "Pending" },
    completed: { color: "success" as const, label: "Completed" },
    cancelled: { color: "danger" as const, label: "Cancelled" },
    priority: { color: "warning" as const, label: "Priority" },
    standard: { color: "secondary" as const, label: "Standard" },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.color} className={className}>
      {config.label}
    </Badge>
  );
};

export default Badge;

