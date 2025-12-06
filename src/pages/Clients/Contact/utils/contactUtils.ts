/**
 * Contact Module Utility Functions
 * Centralized utilities for contact-related operations
 */

import { ClientContactItem } from "../../../../slices/clientContacts/clientContact.fakeData";

/**
 * Format contact full name (first + last)
 */
export const formatContactName = (contact: ClientContactItem): string => {
  const firstName = contact.contactFirstName || "";
  const lastName = contact.contactLastName || "";
  const title = contact.title || "";
  
  const parts = [title, firstName, lastName].filter(Boolean);
  return parts.join(" ").trim() || "-";
};

/**
 * Format contact display name (first + last, no title)
 */
export const formatContactDisplayName = (contact: ClientContactItem): string => {
  const firstName = contact.contactFirstName || "";
  const lastName = contact.contactLastName || "";
  
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(" ").trim() || "-";
};

/**
 * Generate avatar initials from contact name
 */
export const getContactInitials = (contact: ClientContactItem): string => {
  const firstName = contact.contactFirstName || "";
  const lastName = contact.contactLastName || "";
  
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  
  if (firstInitial && lastInitial) {
    return `${firstInitial}${lastInitial}`;
  } else if (firstInitial) {
    return firstInitial;
  } else if (lastInitial) {
    return lastInitial;
  }
  return "?";
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string | undefined): string => {
  if (!phone || phone.trim() === "") return "-";
  return phone.trim();
};

/**
 * Format email for display
 */
export const formatEmail = (email: string | undefined): string => {
  if (!email || email.trim() === "") return "-";
  return email.trim();
};

/**
 * Get primary phone (mobile preferred, fallback to work phone)
 */
export const getPrimaryPhone = (contact: ClientContactItem): string => {
  return contact.mobile || contact.workPhone || "-";
};

/**
 * Get status badge color
 */
export const getContactStatusColor = (isActive: boolean): string => {
  return isActive ? "success" : "secondary";
};

/**
 * Get status label
 */
export const getContactStatusLabel = (isActive: boolean): string => {
  return isActive ? "Active" : "Inactive";
};

/**
 * Check if contact has portal access
 */
export const hasPortalAccess = (contact: ClientContactItem): boolean => {
  return contact.isAllowPortalAccess === true;
};

/**
 * Filter contacts by search query
 */
export const filterContactsBySearch = (
  contacts: ClientContactItem[],
  searchQuery: string
): ClientContactItem[] => {
  if (!searchQuery.trim()) return contacts;
  
  const query = searchQuery.toLowerCase().trim();
  
  return contacts.filter((contact) => {
    const firstName = (contact.contactFirstName || "").toLowerCase();
    const lastName = (contact.contactLastName || "").toLowerCase();
    const email = (contact.email || "").toLowerCase();
    const mobile = (contact.mobile || "").toLowerCase();
    const workPhone = (contact.workPhone || "").toLowerCase();
    const clientName = (contact.clientName || "").toLowerCase();
    
    return (
      firstName.includes(query) ||
      lastName.includes(query) ||
      email.includes(query) ||
      mobile.includes(query) ||
      workPhone.includes(query) ||
      clientName.includes(query) ||
      formatContactName(contact).toLowerCase().includes(query)
    );
  });
};

/**
 * Filter contacts by status
 */
export const filterContactsByStatus = (
  contacts: ClientContactItem[],
  statusFilter: "all" | "active" | "inactive"
): ClientContactItem[] => {
  if (statusFilter === "all") return contacts;
  
  return contacts.filter((contact) => {
    const isActive = !contact.isDeleted;
    return statusFilter === "active" ? isActive : !isActive;
  });
};

/**
 * Filter contacts by client
 */
export const filterContactsByClient = (
  contacts: ClientContactItem[],
  clientId: string | undefined
): ClientContactItem[] => {
  if (!clientId) return contacts;
  
  return contacts.filter((contact) => contact.clientId === clientId);
};

