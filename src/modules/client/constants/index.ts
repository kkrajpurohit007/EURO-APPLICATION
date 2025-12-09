/**
 * Client Module Constants
 * Module-specific constants and configuration
 */

export const CLIENT_MODULE_ROUTES = {
  LIST: "/clients/list",
  CREATE: "/clients/create",
  EDIT: "/clients/edit/:id",
  VIEW: "/clients/view/:id",
} as const;

export const CLIENT_PAGE_SIZE = 50;
export const CLIENT_DEFAULT_PAGE = 1;

