/**
 * Account Module Constants
 * Module-specific constants and configuration
 */

export const ACCOUNT_MODULE_ROUTES = {
  // Department routes
  DEPARTMENTS_LIST: "/account/departments",
  DEPARTMENTS_CREATE: "/account/departments/create",
  DEPARTMENTS_EDIT: "/account/departments/edit/:id",
  
  // Tenant Role routes
  TENANT_ROLES_LIST: "/account/tenant-roles",
  TENANT_ROLES_CREATE: "/account/tenant-roles/create",
  TENANT_ROLES_EDIT: "/account/tenant-roles/edit/:id",
  TENANT_ROLES_VIEW: "/account/tenant-roles/view/:id",
  
  // Profile routes
  PROFILES_LIST: "/account/profiles",
  
  // Global User routes
  GLOBAL_USERS_LIST: "/account/global-users",
  GLOBAL_USERS_CREATE: "/account/global-users/create",
  GLOBAL_USERS_EDIT: "/account/global-users/edit/:id",
  GLOBAL_USERS_VIEW: "/account/global-users/view/:id",
} as const;

export const ACCOUNT_PAGE_SIZE = 50;
export const ACCOUNT_DEFAULT_PAGE = 1;

