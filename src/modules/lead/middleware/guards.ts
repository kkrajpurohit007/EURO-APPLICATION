/**
 * Lead Module Middleware
 * Module-specific guards and interceptors
 */

import { Permission } from "../../../shared/middleware/rbac";

/**
 * Lead module permissions
 */
export const LEAD_PERMISSIONS = {
  VIEW: Permission.LEAD_VIEW,
  CREATE: Permission.LEAD_CREATE,
  EDIT: Permission.LEAD_EDIT,
  DELETE: Permission.LEAD_DELETE,
} as const;

/**
 * Check if user can view leads
 */
export const canViewLeads = (): boolean => {
  return true;
};

/**
 * Check if user can create leads
 */
export const canCreateLead = (): boolean => {
  return true;
};

/**
 * Check if user can edit leads
 */
export const canEditLead = (): boolean => {
  return true;
};

/**
 * Check if user can delete leads
 */
export const canDeleteLead = (): boolean => {
  return true;
};

