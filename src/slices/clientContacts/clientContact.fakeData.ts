export interface ClientContactItem {
    id: string;
    clientId: string;
    clientName?: string;
    tenantId: string;
    tenantName?: string;
    title: string;
    contactFirstName: string;
    contactLastName: string;
    email: string;
    workPhone: string;
    mobile: string;
    notes: string;
    isAllowPortalAccess: boolean;
    isDeleted: boolean;
}

export interface ClientContactsResponse {
    items: ClientContactItem[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export const initialClientContacts: ClientContactItem[] = [
    {
        id: "1",
        clientId: "1",
        clientName: "Euro Scaffolds",
        tenantId: "tenant-1",
        tenantName: "Euro Scaffolds",
        title: "Mr.",
        contactFirstName: "John",
        contactLastName: "Smith",
        email: "john.smith@euroscaffolds.com",
        workPhone: "+44 20 1234 5678",
        mobile: "+44 7700 900123",
        notes: "Primary contact for all projects",
        isAllowPortalAccess: true,
        isDeleted: false,
    },
    {
        id: "2",
        clientId: "2",
        clientName: "BuildRight Construction",
        tenantId: "tenant-1",
        tenantName: "Euro Scaffolds",
        title: "Ms.",
        contactFirstName: "Emma",
        contactLastName: "Johnson",
        email: "emma.johnson@buildright.co.uk",
        workPhone: "+44 131 9876 5432",
        mobile: "+44 7700 900987",
        notes: "Finance and procurement contact",
        isAllowPortalAccess: false,
        isDeleted: false,
    },
];



