export interface RoleItem {
    id: string;
    name: string;
    description: string;
    applicableUserGroup: number | null;
    isAllowToSelfRegister: boolean;
    isDeleted: boolean;
    // Legacy fields for backward compatibility
    tenantId?: string;
    tenantName?: string;
    profileId?: string;
    profileName?: string;
    isSensitive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface RolesResponse {
    items: RoleItem[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export const initialRoles: RoleItem[] = [
    {
        id: "1",
        name: "System Administrator",
        description: "Full system access with administrative privileges",
        applicableUserGroup: 3,
        isAllowToSelfRegister: false,
        isDeleted: false,
        // Legacy fields for backward compatibility
        tenantId: "tenant-1",
        tenantName: "Euro",
        profileId: "profile-1",
        profileName: "Administrator",
        isSensitive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Operations Manager",
        description: "Access to management features and reporting",
        applicableUserGroup: 3,
        isAllowToSelfRegister: false,
        isDeleted: false,
        // Legacy fields for backward compatibility
        tenantId: "tenant-1",
        tenantName: "Euro",
        profileId: "profile-2",
        profileName: "Manager",
        isSensitive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Standard Employee",
        description: "Standard user access to basic features",
        applicableUserGroup: 3,
        isAllowToSelfRegister: false,
        isDeleted: false,
        // Legacy fields for backward compatibility
        tenantId: "tenant-1",
        tenantName: "Euro",
        profileId: "profile-3",
        profileName: "Employee",
        isSensitive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
