/**
 * Client Module
 * Self-contained module for Client management
 * 
 * This module exports all public APIs for the Client module.
 * External modules should only import from this file.
 */

// Components
export { default as ClientList } from "./components/ClientList";
export { default as ClientCreate } from "./components/ClientCreate";
export { default as ClientEdit } from "./components/ClientEdit";
export { default as ClientView } from "./components/ClientView";
export { default as ClientCard } from "./components/ClientCard";

// Slice (Redux)
export {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  selectClient,
  clearError,
  selectClientList,
  selectSelectedClient,
  selectClientById,
  selectClientLoading,
  selectClientError,
  selectClientTotalCount,
} from "./slice/client.slice";
export { default as clientReducer } from "./slice/client.slice";

// Types
export type { ClientItem, ClientsResponse } from "./slice/client.types";

// Constants
export { CLIENT_MODULE_ROUTES, CLIENT_PAGE_SIZE, CLIENT_DEFAULT_PAGE } from "./constants";

// Middleware
export { CLIENT_PERMISSIONS } from "./middleware/guards";

// Service (usually internal, but exported for advanced use cases)
export * as clientService from "./service/clientService";

