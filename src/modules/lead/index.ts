/**
 * Lead Module
 * Self-contained module for Lead management
 * 
 * This module exports all public APIs for the Lead module.
 * External modules should only import from this file.
 */

// Components
export { default as LeadList } from "./components/LeadList";
export { default as LeadCreate } from "./components/LeadCreate";
export { default as LeadEdit } from "./components/LeadEdit";
export { default as LeadView } from "./components/LeadView";

// Slice (Redux)
export {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
  selectLead,
  clearError,
  selectLeadList,
  selectSelectedLead,
  selectLeadById,
  selectLeadLoading,
  selectLeadError,
  selectLeadTotalCount,
} from "./slice/lead.slice";
export { default as leadReducer } from "./slice/lead.slice";

// Types
export type { LeadItem, LeadsResponse, LeadNote } from "./slice/lead.types";
export { LeadStatus, LeadStatusLabels } from "./slice/lead.types";

// Constants
export { LEAD_MODULE_ROUTES, LEAD_PAGE_SIZE, LEAD_DEFAULT_PAGE } from "./constants";

// Middleware
export { LEAD_PERMISSIONS } from "./middleware/guards";

// Service (usually internal, but exported for advanced use cases)
export * as leadService from "./service/leadService";

