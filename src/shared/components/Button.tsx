/**
 * Shared Button Component
 * Consistent button styling across all modules
 */

import React from "react";
import { Button as ReactstrapButton, ButtonProps } from "reactstrap";
import { theme } from "../theme";

export interface SharedButtonProps extends ButtonProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button: React.FC<SharedButtonProps> = ({
  size = "md",
  variant = "primary",
  icon,
  iconPosition = "left",
  fullWidth = false,
  children,
  className = "",
  style,
  ...props
}) => {
  // Map variant to reactstrap color
  const colorMap: Record<string, string> = {
    primary: "primary",
    secondary: "secondary",
    success: "success",
    danger: "danger",
    warning: "warning",
    info: "info",
    light: "light",
    dark: "dark",
  };

  const buttonClasses = [
    fullWidth ? "w-100" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const buttonStyle: React.CSSProperties = {
    borderRadius: theme.button.borderRadius,
    fontWeight: theme.button.fontWeight,
    transition: theme.button.transition,
    ...style,
  };

  const iconElement = icon && (
    <span className={iconPosition === "left" ? "me-1" : "ms-1"}>
      {icon}
    </span>
  );

  // Use color prop if provided, otherwise map variant to color
  const buttonColor = props.color || colorMap[variant] || "primary";

  return (
    <ReactstrapButton
      color={buttonColor}
      size={size}
      className={buttonClasses}
      style={buttonStyle}
      {...props}
    >
      {iconPosition === "left" && iconElement}
      {children}
      {iconPosition === "right" && iconElement}
    </ReactstrapButton>
  );
};

// Action Button Variants (commonly used in cards/tables)
export interface ActionButtonProps extends Omit<SharedButtonProps, "variant"> {
  action: "view" | "edit" | "delete" | "reschedule" | "download" | "preview";
  onClick?: () => void;
  title?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  onClick,
  title,
  size = "sm",
  className = "",
  ...props
}) => {
  const actionConfig = {
    view: {
      variant: "primary" as const,
      icon: <i className="ri-eye-line align-bottom"></i>,
      color: "soft-primary",
      defaultTitle: "View",
    },
    edit: {
      variant: "secondary" as const,
      icon: <i className="ri-pencil-line align-bottom"></i>,
      color: "soft-secondary",
      defaultTitle: "Edit",
    },
    delete: {
      variant: "danger" as const,
      icon: <i className="ri-delete-bin-line align-bottom"></i>,
      color: "soft-danger",
      defaultTitle: "Delete",
    },
    reschedule: {
      variant: "warning" as const,
      icon: <i className="ri-calendar-event-line align-bottom"></i>,
      color: "soft-warning",
      defaultTitle: "Reschedule",
    },
    download: {
      variant: "info" as const,
      icon: <i className="ri-download-line align-bottom"></i>,
      color: "soft-info",
      defaultTitle: "Download",
    },
    preview: {
      variant: "info" as const,
      icon: <i className="ri-eye-line align-bottom"></i>,
      color: "soft-info",
      defaultTitle: "Preview",
    },
  };

  const config = actionConfig[action];

  return (
    <Button
      size={size}
      variant={config.variant}
      color={config.color}
      icon={config.icon}
      onClick={onClick}
      title={title || config.defaultTitle}
      className={className}
      {...props}
    />
  );
};

export default Button;

