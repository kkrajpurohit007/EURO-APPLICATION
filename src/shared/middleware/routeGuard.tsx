/**
 * Route Guard Component
 * Protects routes with RBAC permissions
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { checkPermissions, PermissionConfig } from "./rbac";

interface RouteGuardProps {
  children: React.ReactNode;
  config: PermissionConfig;
  redirectTo?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  config,
  redirectTo = "/dashboard",
}) => {
  const hasAccess = checkPermissions(config);
  
  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

/**
 * HOC for protecting components with RBAC
 */
export const withRBAC = <P extends object>(
  Component: React.ComponentType<P>,
  config: PermissionConfig
): React.ComponentType<P> => {
  const ProtectedComponent: React.FC<P> = (props: P) => {
    if (!checkPermissions(config)) {
      return (
        <div className="alert alert-danger">
          You do not have permission to access this resource.
        </div>
      );
    }
    return <Component {...props} />;
  };
  return ProtectedComponent;
};

