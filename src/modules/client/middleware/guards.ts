/**
 * Client Module Middleware
 * Module-specific guards and interceptors
 */

import { Permission } from "../../../shared/middleware/rbac";

/**
 * Client module permissions
 */
export const CLIENT_PERMISSIONS = {
  VIEW: Permission.CLIENT_VIEW,
  CREATE: Permission.CLIENT_CREATE,
  EDIT: Permission.CLIENT_EDIT,
  DELETE: Permission.CLIENT_DELETE,
} as const;

/**
 * Check if user can view clients
 */
export const canViewClients = (): boolean => {
  // This will be implemented with actual permission checking
  // For now, return true (permission check happens at route/component level)
  return true;
};

/**
 * Check if user can create clients
 */
export const canCreateClient = (): boolean => {
  return true;
};

/**
 * Check if user can edit clients
 */
export const canEditClient = (): boolean => {
  return true;
};

/**
 * Check if user can delete clients
 */
export const canDeleteClient = (): boolean => {
  return true;
};

