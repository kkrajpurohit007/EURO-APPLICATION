export interface GlobalUserItem {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    mobileNumber?: string;
    dateOfBirth?: string;
    profileId?: string;
    profileName?: string;
    roleId?: string;
    roleName?: string;
    departmentId?: string;
    departmentName?: string;
    accessScope?: string;
    appUserCode?: string;
    emailVerified: boolean;
    initialSetupDone: boolean;
    disabled: boolean;
    isDeleted: boolean;
}

export interface GlobalUsersResponse {
    items: GlobalUserItem[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export const initialGlobalUsers: GlobalUserItem[] = [
    {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        username: "johndoe",
        mobileNumber: "+44 7700 900123",
        dateOfBirth: "1990-01-15",
        profileId: "profile-1",
        profileName: "Administrator",
        roleId: "role-1",
        roleName: "Admin",
        departmentId: "dept-1",
        departmentName: "IT",
        accessScope: "Global",
        appUserCode: "USR001",
        emailVerified: true,
        initialSetupDone: true,
        disabled: false,
        isDeleted: false,
    },
    {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        username: "janesmith",
        mobileNumber: "+44 7700 900456",
        dateOfBirth: "1985-05-20",
        profileId: "profile-2",
        profileName: "Manager",
        roleId: "role-2",
        roleName: "Manager",
        departmentId: "dept-2",
        departmentName: "Operations",
        accessScope: "Department",
        appUserCode: "USR002",
        emailVerified: true,
        initialSetupDone: true,
        disabled: false,
        isDeleted: false,
    },
];

