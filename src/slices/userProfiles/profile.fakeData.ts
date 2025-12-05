export interface ProfileItem {
    id: string;
    name: string;
    description: string;
    applicableUserGroup: number;
    isAllowToSelfRegister: boolean;
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProfilesResponse {
    items: ProfileItem[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export const initialProfiles: ProfileItem[] = [
    {
        id: "1",
        name: "Administrator",
        description: "Full system access with administrative privileges",
        applicableUserGroup: 1,
        isAllowToSelfRegister: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Manager",
        description: "Access to management features and reporting",
        applicableUserGroup: 2,
        isAllowToSelfRegister: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Employee",
        description: "Standard user access to basic features",
        applicableUserGroup: 3,
        isAllowToSelfRegister: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
