/**
 * Shared Card Component
 * Consistent card styling across all modules
 */

import React from "react";
import { Card as ReactstrapCard, CardBody, CardHeader, CardProps } from "reactstrap";
import { theme } from "../theme";

export interface SharedCardProps extends CardProps {
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Card: React.FC<SharedCardProps> = ({
  hover = false,
  padding = "md",
  className = "",
  style,
  children,
  ...props
}) => {
  const cardClasses = [
    "h-100",
    hover ? "card-hover" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const cardStyle: React.CSSProperties = {
    borderRadius: theme.card.borderRadius,
    borderWidth: theme.card.borderWidth,
    boxShadow: theme.card.shadow,
    transition: hover ? theme.card.transition : undefined,
    ...style,
  };

  const handleMouseEnter = hover ? (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement;
    target.style.transform = "translateY(-4px)";
    target.style.boxShadow = theme.card.shadowHover;
  } : undefined;

  const handleMouseLeave = hover ? (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement;
    target.style.transform = "translateY(0)";
    target.style.boxShadow = theme.card.shadow;
  } : undefined;

  return (
    <ReactstrapCard
      className={cardClasses}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </ReactstrapCard>
  );
};

export interface CardBodyProps {
  padding?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

export const CardBodyShared: React.FC<CardBodyProps> = ({
  padding = "md",
  className = "",
  children,
}) => {
  const paddingClass = `p-${padding === "sm" ? "2" : padding === "lg" ? "4" : "3"}`;
  
  return (
    <CardBody className={`${paddingClass} ${className}`.trim()}>
      {children}
    </CardBody>
  );
};

export interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const CardHeaderShared: React.FC<CardHeaderProps> = ({
  className = "",
  children,
}) => {
  return (
    <CardHeader className={`${className}`.trim()}>
      {children}
    </CardHeader>
  );
};

export default Card;

