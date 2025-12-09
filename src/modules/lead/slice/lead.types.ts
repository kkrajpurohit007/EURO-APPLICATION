/**
 * Lead Module Types
 * Type definitions for the Lead module
 */

export enum LeadStatus {
  New = 0,
  Open = 1,
  Approved = 2,
  Converted = 3,
  Cancelled = 4,
  Churned = 5
}

export const LeadStatusLabels: Record<LeadStatus, string> = {
  0: "New",
  1: "Open",
  2: "Approved",
  3: "Converted",
  4: "Cancelled",
  5: "Churned"
};

export interface LeadNote {
  id: string;
  timestamp: string;
  text: string;
}

export interface LeadItem {
  id: string;
  tenantId: string;
  tenantName: string;
  userId: string;
  userName: string;
  title: string; // Lead name, not person title
  contactPerson: string;
  contactEmail: string;
  description: string;
  leadStatus: LeadStatus;
  tentativeWorkDays: number;
  notes: string;
  tentativeProjectStartDate: string | null;
  phoneNumber: string | null;
  siteAddress: string | null;
  tenantLocationId: string | null;
  tenantLocationName: string | null;
  isDeleted: boolean;
}

export interface LeadsResponse {
  items: LeadItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

