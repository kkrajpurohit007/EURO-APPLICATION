export interface TenantRoleItem {
    id: string;
    tenantId: string;
    tenantName?: string;
    profileId: string;
    profileName?: string;
    name: string;
    description: string;
    isSensitive: boolean;
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface TenantRolesResponse {
    items: TenantRoleItem[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export const initialTenantRoles: TenantRoleItem[] = [
    {
        id: "9370449f-f82b-4787-a4b3-523e4f2faea0",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "b9c0d1e2-f3a4-4567-c89a-bcdef0123456",
        profileName: "QualityInspector",
        name: "Quality Inspector",
        description: "Quality inspector - perform safety and quality inspections, approve/reject inspection results.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "34113027-9476-41c6-bb7b-4a27f9b38e3b",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "c0d1e2f3-a4b5-4678-d9ab-cdef01234567",
        profileName: "SalesExecutive",
        name: "Sales Executive",
        description: "Sales executive - manage leads, convert leads to clients, handle sales pipeline, create quotes.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "3465640e-22df-484f-a58e-932ff83fa2e3",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "d5e6f7a8-b9c0-4123-e456-789abcdef012",
        profileName: "FieldWorker",
        name: "Rigger",
        description: "Rigger - specialized field worker focused on rigging and lifting operations.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "86c0ca89-f05d-4aed-8d6f-424fd4a49920",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "d5e6f7a8-b9c0-4123-e456-789abcdef012",
        profileName: "FieldWorker",
        name: "FieldStaff",
        description: "Field staff - general field personnel for various on-site operations and support.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "9d3b8173-b398-4485-ae05-b5347d518831",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "d5e6f7a8-b9c0-4123-e456-789abcdef012",
        profileName: "FieldWorker",
        name: "Labourer",
        description: "Labourer - general field worker providing support for scaffolding operations.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "e657dbb3-2e87-4be9-935a-8e91dc26c1cd",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "d5e6f7a8-b9c0-4123-e456-789abcdef012",
        profileName: "FieldWorker",
        name: "Scaffolder",
        description: "Scaffolder - standard field worker responsible for scaffolding construction and maintenance.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "d8f6a78e-aca7-4ae2-8e34-7560c6e07b77",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "d5e6f7a8-b9c0-4123-e456-789abcdef012",
        profileName: "FieldWorker",
        name: "AdvancedScaffolder",
        description: "Advanced scaffolder - experienced field worker with advanced scaffolding skills and certifications.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "b2d16c93-a81d-4657-a700-9d27c2c2868d",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "e3f4a5b6-c7d8-4900-fcde-0123456789ab",
        profileName: "ComplianceUser",
        name: "Compliance",
        description: "Compliance officer - handle compliance checks, conduct audits, ensure regulatory compliance.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "c7ee3c35-942a-4242-810b-f79f67063ccf",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "e6f7a8b9-c0d1-4234-f567-89abcdef0123",
        profileName: "Supervisor",
        name: "Supervisor",
        description: "Field supervisor - oversee field operations, approve/reject tasks and timesheets, manage team assignments.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "45d75b08-f31e-44c3-9bd2-f23da592a311",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "f4a5b6c7-d8e9-4901-adef-123456789abc",
        profileName: "AccountManager",
        name: "Account Manager",
        description: "Account manager - manage client relationships, handle client communications, coordinate client requirements.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "485ccf09-4837-4c9f-a906-a9973b801e69",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "f7a8b9c0-d1e2-4345-a678-9abcdef01234",
        profileName: "ProjectManager",
        name: "Testing manager",
        description: "Testing  manager - manage projects end-to-end, create work orders, allocate resources, track budgets.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "78d11b0d-656b-49e2-b37e-a0f48d8a2c2b",
        tenantId: "00000000-0000-0000-0000-000000000010",
        tenantName: "Euro",
        profileId: "f7a8b9c0-d1e2-4345-a678-9abcdef01234",
        profileName: "ProjectManager",
        name: "Project Manager",
        description: "Project manager - manage projects end-to-end, create work orders, allocate resources, track budgets.",
        isSensitive: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

