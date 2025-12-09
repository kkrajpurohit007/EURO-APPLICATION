/**
 * Account Module Middleware
 * Module-specific guards and interceptors
 */

import { Permission } from "../../../shared/middleware/rbac";

/**
 * Account module permissions
 */
export const ACCOUNT_PERMISSIONS = {
  VIEW: Permission.ACCOUNT_VIEW,
  MANAGE: Permission.ACCOUNT_MANAGE,
} as const;

/**
 * Check if user can view account settings
 */
export const canViewAccount = (): boolean => {
  return true;
};

/**
 * Check if user can manage account settings
 */
export const canManageAccount = (): boolean => {
  return true;
};

