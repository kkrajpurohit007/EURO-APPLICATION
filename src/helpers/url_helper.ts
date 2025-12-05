//REGISTER
export const POST_FAKE_REGISTER = "/auth/signup";

//LOGIN
export const POST_FAKE_LOGIN = "/auth/signin";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/auth/forgot-password";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

// OTP
export const POST_OTP_VERIFY = "/auth/verify-otp";
export const POST_OTP_RESEND = "/auth/resend-otp";

// ROLES (using Profile endpoint)
export const GET_ROLES = "/Profile";
export const POST_ROLE = "/Role";
export const PUT_ROLE = "/Role";
export const DELETE_ROLE = "/Role";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/user";
export const GET_PROFILES = "/Profile";
export const POST_PROFILE = "/Profile";
export const PUT_PROFILE = "/Profile";
export const DELETE_PROFILE = "/Profile";

//DEPARTMENTS
export const GET_DEPARTMENTS = "/Department";
export const POST_DEPARTMENT = "/Department";
export const PUT_DEPARTMENT = "/Department";
export const DELETE_DEPARTMENT = "/Department";

// LEADS
export const GET_LEADS = "/Lead";
export const ADD_NEW_LEAD = "/Lead";
export const UPDATE_LEAD = "/Lead";
export const DELETE_LEAD = "/Lead";

// LEAD ATTACHMENTS
export const GET_LEAD_ATTACHMENTS = "/LeadAttachment";
export const ADD_LEAD_ATTACHMENT = "/LeadAttachment";
export const DELETE_LEAD_ATTACHMENT = "/LeadAttachment";

// CLIENTS
export const GET_CLIENTS = "/Client";
export const ADD_NEW_CLIENT = "/Client";
export const UPDATE_CLIENT = "/Client";
export const DELETE_CLIENT = "/Client";

// CLIENT CONTACTS
export const GET_CLIENT_CONTACTS = "/ClientContact";
export const ADD_NEW_CLIENT_CONTACT = "/ClientContact";
export const UPDATE_CLIENT_CONTACT = "/ClientContact";
export const DELETE_CLIENT_CONTACT = "/ClientContact";

// COUNTRIES
export const GET_COUNTRIES = "/Country";

// CLIENT SITES
export const GET_CLIENT_SITES = "/ClientSite";
export const ADD_NEW_CLIENT_SITE = "/ClientSite";
export const UPDATE_CLIENT_SITE = "/ClientSite";
export const DELETE_CLIENT_SITE = "/ClientSite";

// TENANT RENTAL CONFIGURATION
export const GET_TENANT_RENTAL_CONFIG = "/TenantRentalConfiguration";
export const UPDATE_TENANT_RENTAL_CONFIG = "/TenantRentalConfiguration";

// TENANT LOCATIONS
export const GET_TENANT_LOCATIONS = "/TenantLocation";
export const ADD_NEW_TENANT_LOCATION = "/TenantLocation";
export const UPDATE_TENANT_LOCATION = "/TenantLocation";
export const DELETE_TENANT_LOCATION = "/TenantLocation";

// TENANT ROLES
export const GET_TENANT_ROLES = "/Role";
export const POST_TENANT_ROLE = "/Role";
export const PUT_TENANT_ROLE = "/Role";
export const DELETE_TENANT_ROLE = "/Role";

// CLIENT RENTAL CONFIGURATION
export const CLIENT_RENTAL_CONFIG = "/ClientRentalConfiguration";
