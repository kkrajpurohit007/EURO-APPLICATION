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
  clientId: string | null;
  clientName: string;
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

export const initialLeads: LeadItem[] = [
  {
    id: "1",
    tenantId: "tenant-1",
    tenantName: "Tenant One",
    clientId: "client-1",
    clientName: "Client One",
    userId: "user-1",
    userName: "John Doe",
    title: "Premium Plan Lead",
    contactPerson: "Jane Smith",
    contactEmail: "jane.smith@example.com",
    description: "Interested in premium plan",
    leadStatus: LeadStatus.New,
    tentativeWorkDays: 20,
    notes: "Initial contact made",
    tentativeProjectStartDate: null,
    phoneNumber: null,
    siteAddress: null,
    tenantLocationId: null,
    tenantLocationName: null,
    isDeleted: false,
  },
  {
    id: "2",
    tenantId: "tenant-1",
    tenantName: "Tenant One",
    clientId: "client-2",
    clientName: "Client Two",
    userId: "user-1",
    userName: "John Doe",
    title: "Consultation Lead",
    contactPerson: "Alice Johnson",
    contactEmail: "alice.j@example.com",
    description: "Looking for consultation",
    leadStatus: LeadStatus.Open,
    tentativeWorkDays: 10,
    notes: "Scheduled a meeting",
    tentativeProjectStartDate: null,
    phoneNumber: null,
    siteAddress: null,
    tenantLocationId: null,
    tenantLocationName: null,
    isDeleted: false,
  },
];
