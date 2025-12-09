/**
 * Department Types
 * Type definitions for Department sub-module
 */

export interface DepartmentItem {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface DepartmentsResponse {
  items: DepartmentItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

