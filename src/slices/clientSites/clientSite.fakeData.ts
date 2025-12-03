export interface ClientSiteItem {
  id: string;
  clientId: string;
  clientName?: string;
  tenantId: string;
  tenantName?: string;
  siteName: string;
  address1: string;
  address2: string;
  countryId: string;
  countryName?: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  siteRadiusMeters: number;
  requireGeofencing: boolean;
  isDeleted: boolean;
}

export interface ClientSitesResponse {
  items: ClientSiteItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const initialClientSites: ClientSiteItem[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "ABC Corporation",
    tenantId: "tenant-1",
    tenantName: "Tenant One",
    siteName: "ABC Main Office",
    address1: "123 Business St",
    address2: "Suite 100",
    countryId: "1",
    countryName: "United States",
    zipcode: "10001",
    latitude: 40.7128,
    longitude: -74.006,
    siteRadiusMeters: 200,
    requireGeofencing: true,
    isDeleted: false,
  },
  {
    id: "2",
    clientId: "1",
    clientName: "ABC Corporation",
    tenantId: "tenant-1",
    tenantName: "Tenant One",
    siteName: "ABC Warehouse",
    address1: "456 Industrial Ave",
    address2: "Building B",
    countryId: "1",
    countryName: "United States",
    zipcode: "11201",
    latitude: 40.6782,
    longitude: -73.9442,
    siteRadiusMeters: 300,
    requireGeofencing: false,
    isDeleted: false,
  },
];

