/**
 * Lead Module Constants
 * Module-specific constants and configuration
 */

export const LEAD_MODULE_ROUTES = {
  LIST: "/leads/list",
  CREATE: "/leads/create",
  EDIT: "/leads/edit/:id",
  VIEW: "/leads/view/:id",
} as const;

export const LEAD_PAGE_SIZE = 500;
export const LEAD_DEFAULT_PAGE = 1;

