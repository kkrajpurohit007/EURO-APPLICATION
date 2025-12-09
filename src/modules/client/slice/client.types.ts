/**
 * Client Module Types
 * Type definitions for the Client module
 */

export interface ClientItem {
  id: string;
  tenantId: string;
  name: string;
  ein: string;
  abn: string;
  gstNumber: string;
  vatNumber: string;
  address1: string;
  address2: string;
  countryId: string;
  countryName?: string;
  zipcode: string;
  managerFirstName: string;
  managerLastName: string;
  managerEmailId: string;
  logoPath?: string;
  isPriority?: boolean;
  priorityReason?: string;
  prioritySetByUserId?: string;
  prioritySetAt?: string;
  isDeleted: boolean;
  registeredNumber?: string;
}

export interface ClientsResponse {
  items: ClientItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

