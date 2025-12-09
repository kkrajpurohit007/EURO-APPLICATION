/**
 * Account Module
 * Self-contained module for Account management
 * 
 * This module exports all public APIs for the Account module.
 * External modules should only import from this file.
 */

// Department sub-module
export * as Department from "./department";

// Constants
export { ACCOUNT_MODULE_ROUTES, ACCOUNT_PAGE_SIZE, ACCOUNT_DEFAULT_PAGE } from "./constants";

// Middleware
export { ACCOUNT_PERMISSIONS } from "./middleware/guards";

