/**
 * RBAC (Role-Based Access Control) Middleware
 * Centralized permission checking and route/component guards
 */

import { getCurrentUser, hasRole, hasGroup } from "../utils/authUtils";

export enum Permission {
  // Client Module
  CLIENT_VIEW = "client:view",
  CLIENT_CREATE = "client:create",
  CLIENT_EDIT = "client:edit",
  CLIENT_DELETE = "client:delete",
  
  // Lead Module
  LEAD_VIEW = "lead:view",
  LEAD_CREATE = "lead:create",
  LEAD_EDIT = "lead:edit",
  LEAD_DELETE = "lead:delete",
  
  // Meeting Module
  MEETING_VIEW = "meeting:view",
  MEETING_CREATE = "meeting:create",
  MEETING_EDIT = "meeting:edit",
  MEETING_DELETE = "meeting:delete",
  
  // Account Module
  ACCOUNT_VIEW = "account:view",
  ACCOUNT_MANAGE = "account:manage",
  
  // Settings Module
  SETTINGS_VIEW = "settings:view",
  SETTINGS_EDIT = "settings:edit",
}

export interface PermissionConfig {
  requiredPermissions?: Permission[];
  requiredRoles?: string[];
  requiredGroups?: string[];
}

/**
 * Check if user has required permissions
 */
export const hasPermission = (permission: Permission): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // TODO: Implement permission checking logic based on user's permissions array
  // For now, check if user has admin role (full access)
  if (hasRole("Admin") || hasRole("SuperAdmin")) {
    return true;
  }
  
  // Check user's permissions array if available
  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }
  
  return false;
};

/**
 * Check if user has any of the required permissions
 */
export const hasAnyPermission = (permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(permission));
};

/**
 * Check if user has all required permissions
 */
export const hasAllPermissions = (permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(permission));
};

/**
 * Check if user meets permission requirements
 */
export const checkPermissions = (config: PermissionConfig): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Admin/SuperAdmin has full access
  if (hasRole("Admin") || hasRole("SuperAdmin")) {
    return true;
  }
  
  // Check required roles
  if (config.requiredRoles && config.requiredRoles.length > 0) {
    const hasRequiredRole = config.requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) return false;
  }
  
  // Check required groups
  if (config.requiredGroups && config.requiredGroups.length > 0) {
    const hasRequiredGroup = config.requiredGroups.some(group => hasGroup(group));
    if (!hasRequiredGroup) return false;
  }
  
  // Check required permissions
  if (config.requiredPermissions && config.requiredPermissions.length > 0) {
    const hasRequiredPermissions = hasAllPermissions(config.requiredPermissions);
    if (!hasRequiredPermissions) return false;
  }
  
  return true;
};


