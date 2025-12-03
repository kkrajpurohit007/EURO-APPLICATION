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

export const initialClients: ClientItem[] = [
    {
        id: "1",
        tenantId: "tenant-1",
        name: "Scaffold Pro Ltd",
        ein: "123456789",
        abn: "",
        gstNumber: "GST001",
        vatNumber: "",
        address1: "123 Construction Ave",
        address2: "Building A",
        countryId: "1",
        countryName: "United Kingdom",
        zipcode: "SW1A 1AA",
        managerFirstName: "John",
        managerLastName: "Smith",
        managerEmailId: "john.smith@scaffoldpro.com",
        isDeleted: false,
    },
    {
        id: "2",
        tenantId: "tenant-1",
        name: "BuildRight Construction",
        ein: "987654321",
        abn: "",
        gstNumber: "GST002",
        vatNumber: "",
        address1: "456 Builder Street",
        address2: "Suite 200",
        countryId: "2",
        countryName: "Germany",
        zipcode: "10115",
        managerFirstName: "Emma",
        managerLastName: "Johnson",
        managerEmailId: "emma.johnson@buildright.de",
        isDeleted: false,
    },
];

