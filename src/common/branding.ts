/**
 * Branding Constants
 * Centralized configuration for all branding values used throughout the application
 */

export const APP_NAME = "Euro Scaffolds";
export const COMPANY_NAME = "Euro Scaffolds";
export const APP_TAGLINE =
  "Professional Scaffold & Equipment Rental Services";

/**
 * Helper function to generate consistent page titles
 * @param pageTitle - The specific page title (e.g., "Create Lead", "View Client")
 * @returns Formatted page title with app branding
 */
export const getPageTitle = (pageTitle: string): string => {
    return `${pageTitle} | ${APP_NAME}`;
};

// Page titles
export const PAGE_TITLES = {
  dashboard: `Dashboard | ${APP_NAME} - ${APP_TAGLINE}`,
  login: `Basic SignIn | ${APP_NAME} - ${APP_TAGLINE}`,
  profile: `Profile | ${APP_NAME} - ${APP_TAGLINE}`,
  resetPassword: `Reset Password | ${APP_NAME} - ${APP_TAGLINE}`,
  error404Basic: `404 Error Basic | ${APP_NAME} - ${APP_TAGLINE}`,
  error404Cover: `404 Error Cover | ${APP_NAME} - ${APP_TAGLINE}`,
  error404Alt: `404 Error Alt | ${APP_NAME} - ${APP_TAGLINE}`,
  error500: `500 Error | ${APP_NAME} - ${APP_TAGLINE}`,
  offline: `Offline Page | ${APP_NAME} - ${APP_TAGLINE}`,
  
  // Leads
  LEADS_LIST: getPageTitle("Leads"),
  LEAD_CREATE: getPageTitle("Create Lead"),
  LEAD_EDIT: getPageTitle("Edit Lead"),
  LEAD_VIEW: getPageTitle("View Lead"),

  // Departments
  DEPARTMENTS_LIST: getPageTitle("Departments"),
  DEPARTMENT_CREATE: getPageTitle("Create Department"),
  DEPARTMENT_EDIT: getPageTitle("Edit Department"),
  DEPARTMENT_VIEW: getPageTitle("View Department"),

  // Clients
  CLIENTS_LIST: getPageTitle("Clients"),
  CLIENT_CREATE: getPageTitle("Create Client"),
  CLIENT_EDIT: getPageTitle("Edit Client"),
  CLIENT_VIEW: getPageTitle("View Client"),
  CLIENT_MANAGEMENT: getPageTitle("Client Management"),

  // Client Contacts
  CLIENT_CONTACTS_LIST: getPageTitle("Client Contacts"),
  CLIENT_CONTACT_CREATE: getPageTitle("Create Client Contact"),
  CLIENT_CONTACT_EDIT: getPageTitle("Edit Client Contact"),
  CLIENT_CONTACT_VIEW: getPageTitle("View Client Contact"),

  // Client Sites
  CLIENT_SITES_LIST: getPageTitle("Client Sites"),
  CLIENT_SITE_CREATE: getPageTitle("Create Site"),
  CLIENT_SITE_EDIT: getPageTitle("Edit Site"),
  CLIENT_SITE_VIEW: getPageTitle("View Site"),

  // Meetings
  MEETINGS_LIST: getPageTitle("Meetings List"),
  MEETINGS_SCHEDULE: getPageTitle("Meetings & Schedule"),
  MEETING_CREATE: getPageTitle("Schedule Meeting"),
  MEETING_EDIT: getPageTitle("Edit Meeting"),
  MEETING_VIEW: getPageTitle("Meeting Details"),
  MEETING_CALENDAR: getPageTitle("Meeting Calendar"),

  // Staff Roles (formerly Tenant Roles)
  TENANT_ROLES_LIST: getPageTitle("Staff Roles"),
  TENANT_ROLE_CREATE: getPageTitle("Create Staff Role"),
  TENANT_ROLE_EDIT: getPageTitle("Edit Staff Role"),
  TENANT_ROLE_VIEW: getPageTitle("View Staff Role"),

  // Profiles
  PROFILES_LIST: getPageTitle("Profiles"),

  // Staff Users
  STAFF_USERS_LIST: getPageTitle("Staff Users"),
  STAFF_USER_CREATE: getPageTitle("Create Staff User"),
  STAFF_USER_EDIT: getPageTitle("Edit Staff User"),

  // Staff Profile
  STAFF_PROFILE_VIEW: getPageTitle("Staff Profile"),
  STAFF_PROFILE_EDIT: getPageTitle("Edit Staff Profile"),

  // Settings
  SETTINGS_BASIC_INFO: getPageTitle("Basic Information"),
  SETTINGS_SYSTEM_CONFIG: getPageTitle("System Configuration"),
  SETTINGS_TENANT_RENTAL: getPageTitle("Global Rental Configuration"),
  SETTINGS_CLIENT_RENTAL: getPageTitle("Client Rental Configuration"),

  // Global Locations (formerly Tenant Locations)
  TENANT_LOCATIONS_LIST: getPageTitle("Global Locations"),
  TENANT_LOCATION_CREATE: getPageTitle("Create Global Location"),
  TENANT_LOCATION_EDIT: getPageTitle("Edit Global Location"),
  TENANT_LOCATION_VIEW: getPageTitle("View Global Location"),

  // Global Users
  GLOBAL_USERS_LIST: getPageTitle("Global Users"),
  GLOBAL_USER_CREATE: getPageTitle("Create Global User"),
  GLOBAL_USER_EDIT: getPageTitle("Edit Global User"),
  GLOBAL_USER_VIEW: getPageTitle("View Global User"),

  // Auth
  LOGIN_PAGE: getPageTitle("Login"),
  REGISTER: getPageTitle("Register"),
  FORGOT_PASSWORD: getPageTitle("Forgot Password"),
  RESET_PASSWORD: getPageTitle("Reset Password"),
  OTP_VERIFICATION: getPageTitle("OTP Verification"),
  TWO_STEP_VERIFICATION: getPageTitle("Two Step Verification"),

  // Error Pages
  ERROR_404_BASIC: getPageTitle("404 Error"),
  ERROR_404_COVER: getPageTitle("404 Error"),
  ERROR_404_ALT: getPageTitle("404 Error"),
  ERROR_500: getPageTitle("500 Error"),
  OFFLINE: getPageTitle("Offline"),

  // Profile
  PROFILE: getPageTitle("Profile"),
  SETTINGS: getPageTitle("Settings"),
};

// Email domains
export const ADMIN_EMAIL = "info@euroscaffolds.com";

// External URLs
export const COMPANY_WEBSITE = "https://euroscaffolds.com/";
export const EXTERNAL_ASSETS_URL = "https://img.euroscaffolds.com";

// Footer text
export const FOOTER_TEXT = `${new Date().getFullYear()} © ${APP_NAME}`;
export const FOOTER_CREDIT = `Powered by ${COMPANY_NAME}`;

// Authentication messages
export const AUTH_MESSAGES = {
  loginWelcome: `Sign in to continue to ${APP_NAME}.`,
  resetPassword: `Reset password with ${APP_NAME.toLowerCase()}`,
  copyright: `© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`,
};