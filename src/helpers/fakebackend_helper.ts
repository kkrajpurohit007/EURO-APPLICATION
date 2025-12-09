import { APIClient } from "./api_helper";

import * as url from "./url_helper";

// Staff Positions module removed - no longer used
import { tenantRentalConfigData } from "../common/data/tenantRentalConfig";
import { clientRentalConfigData } from "../common/data/clientRentalConfig";
import { meetingsData } from "../common/data/meetings";
import { LeadItem } from "../slices/leads/lead.fakeData";
import {
  initialDepartments,
  DepartmentItem,
} from "../slices/departments/department.fakeData";
import { initialCountries } from "../slices/countries/country.fakeData";
import { initialClients, ClientItem } from "../slices/clients/client.fakeData";
import {
  initialClientContacts,
  ClientContactItem,
} from "../slices/clientContacts/clientContact.fakeData";
import {
  initialClientSites,
  ClientSiteItem,
} from "../slices/clientSites/clientSite.fakeData";
import {
  LeadAttachmentItem,
} from "../services/leadAttachmentService";
import {
  initialProfiles,
  ProfileItem,
} from "../slices/userProfiles/profile.fakeData";
import {
  initialRoles,
  RoleItem,
} from "../slices/roles/role.fakeData";
import {
  initialTenantRoles,
  TenantRoleItem,
} from "../slices/tenantRoles/tenantRole.fakeData";
import {
  initialGlobalUsers,
  GlobalUserItem,
} from "../slices/globalUsers/globalUser.fakeData";
import {
  initialClientMeetings,
  ClientMeeting,
} from "../slices/clientMeetings/clientMeeting.fakeData";

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postFakeRegister = (data: any) =>
  api.create(url.POST_FAKE_REGISTER, data);

// Login Method
export const postFakeLogin = (data: any) =>
  api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = (data: any) =>
  api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = (data: any) =>
  api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = (data: any) =>
  api.update(url.POST_EDIT_PROFILE + "/" + data.idx, data);

// Register Method
export const postJwtRegister = (url: string, data: any) => {
  return api.create(url, data).catch((err) => {
    var message;
    if (err.response && err.response.status) {
      switch (err.response.status) {
        case 404:
          message = "Sorry! the page you are looking for could not be found";
          break;
        case 500:
          message =
            "Sorry! something went wrong, please contact our support team";
          break;
        case 401:
          message = "Invalid credentials";
          break;
        default:
          message = err[1];
          break;
      }
    }
    throw message;
  });
};

// Login Method
export const postJwtLogin = (data: any) =>
  api.create(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = (data: any) =>
  api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = (data: any) =>
  api.create(url.SOCIAL_LOGIN, data);

// ========================
// TWO-STEP OTP VERIFICATION
// ========================

// Store session tokens temporarily (in-memory)
const sessionTokens: any = {};
const otpCodes: any = {};

// Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Fake OTP Verification - Step 2
export const postFakeOtpVerify = (data: any) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const { sessionToken, otp } = data;

      if (!sessionTokens[sessionToken]) {
        resolve({
          status: "error",
          message: "Invalid or expired session",
        });
        return;
      }

      // Check if OTP matches (default: 123456 for demo)
      if (otp === "123456" || otp === String(otpCodes[sessionToken])) {
        const userData = sessionTokens[sessionToken];
        delete sessionTokens[sessionToken];
        delete otpCodes[sessionToken];

        resolve({
          status: "success",
          message: "OTP verified successfully",
          data: {
            ...userData,
            token: "demo-token-" + Date.now(),
            refreshToken: "demo-refresh-token-" + Date.now(),
            expiresIn: 3600,
          },
        });
      } else {
        resolve({
          status: "error",
          message: "Invalid OTP",
        });
      }
    }, 300);
  });

// Fake OTP Resend
export const postFakeOtpResend = (data: any) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const { sessionToken } = data;

      if (!sessionTokens[sessionToken]) {
        resolve({
          status: "error",
          message: "Invalid or expired session",
        });
        return;
      }

      const newOtp = generateOtp();
      otpCodes[sessionToken] = newOtp;

      // Log OTP for demo (in production, send via SMS/Email)
      console.log(`OTP sent: ${newOtp}`);

      resolve({
        status: "success",
        message: "OTP resent successfully",
      });
    }, 300);
  });

// JWT OTP Verification
export const postJwtOtpVerify = (data: any) =>
  api.create(url.POST_OTP_VERIFY || "/auth/verify-otp", data);

// JWT OTP Resend
export const postJwtOtpResend = (data: any) =>
  api.create(url.POST_OTP_RESEND || "/auth/resend-otp", data);

// Override postFakeLogin to support OTP flow
export const postFakeLoginWithOtp = (data: any) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const { email, password } = data;

      // Mock credentials validation
      if (email === "admin@example.com" && password === "123456") {
        const sessionToken = "session-" + Date.now();
        const otp = generateOtp();

        sessionTokens[sessionToken] = {
          id: 1,
          email,
          name: "Admin User",
          avatar: "",
          role: "admin",
        };
        otpCodes[sessionToken] = otp;

        // Log OTP for demo (in production, send via SMS/Email)
        console.log(`OTP sent to ${email}: ${otp}`);

        resolve({
          status: "success",
          message: "Login successful, OTP sent",
          data: {
            sessionToken,
          },
        });
      } else {
        resolve({
          status: "error",
          message: "Invalid email or password",
        });
      }
    }, 300);
  });

// Departments
let departmentsData = [...initialDepartments];

export const getDepartments = (
  pageNumber: number = 1,
  pageSize: number = 50
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = departmentsData.slice(start, end);
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: departmentsData.length,
        totalPages: Math.ceil(departmentsData.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < departmentsData.length,
      });
    }, 300);
  });
};

export const addNewDepartment = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDepartment: DepartmentItem = {
        ...data,
        id: (departmentsData.length + 1).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
      };
      departmentsData.unshift(newDepartment);
      resolve(newDepartment);
    }, 300);
  });
};

export const updateDepartment = (id: string, data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = departmentsData.findIndex((d) => d.id === id);
      if (index !== -1) {
        departmentsData[index] = {
          ...departmentsData[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        resolve(departmentsData[index]);
      }
    }, 300);
  });
};

export const deleteDepartment = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      departmentsData = departmentsData.filter((d) => d.id !== id);
      resolve({ success: true });
    }, 300);
  });
};

// Staff Positions - Removed (module no longer exists)
// These functions have been deprecated and removed

// Tenant Rental Configuration
export const getTenantRentalConfig = (tenantId: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real implementation, this would filter by tenantId
      // For fake backend, we check if the requested tenantId matches our config
      if (tenantRentalConfigData.tenantId === tenantId) {
        resolve(tenantRentalConfigData);
      } else {
        // If no config found for this tenant, reject with 404-like error
        reject({ message: "Rental config not found", status: 404 });
      }
    }, 300);
  });
};

export const updateTenantRentalConfig = (id: string, data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would update the config by id
      Object.assign(tenantRentalConfigData, {
        ...data,
        id: id,
        modified: new Date().toISOString(),
        lastConfigurationUpdate: new Date().toISOString(),
      });
      resolve(tenantRentalConfigData);
    }, 300);
  });
};

// Client Rental Configuration
export const getClientRentalConfigs = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Map client names from actual client data
      const mappedConfigs = clientRentalConfigData.map(config => {
        const client = initialClients.find(c => parseInt(c.id) === config.clientId);
        return {
          ...config,
          clientName: client ? client.name : config.clientName
        };
      });
      resolve(mappedConfigs);
    }, 300);
  });
};

export const getClientRentalConfigByClientId = (clientId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const config = clientRentalConfigData.find(
        (c) => c.clientId === clientId
      );
      
      if (config) {
        // Map client name from actual client data
        const client = initialClients.find(c => parseInt(c.id) === clientId);
        resolve({
          ...config,
          clientName: client ? client.name : config.clientName
        });
      } else {
        resolve(null);
      }
    }, 300);
  });
};

export const updateClientRentalConfig = (clientId: number, data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = clientRentalConfigData.findIndex(
        (c) => c.clientId === clientId
      );
      if (index !== -1) {
        // Update existing config
        clientRentalConfigData[index] = {
          ...clientRentalConfigData[index],
          ...data,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        resolve(clientRentalConfigData[index]);
      } else {
        // Create new config
        const newConfig: any = {
          id: clientRentalConfigData.length + 1,
          clientId: clientId,
          clientName: data.clientName || "Unknown Client",
          overrideGracePeriodDays: data.overrideGracePeriodDays ?? null,
          overrideMinimumHireWeeks: data.overrideMinimumHireWeeks ?? null,
          overrideInvoiceFrequency: data.overrideInvoiceFrequency ?? null,
          overrideInvoiceDay: data.overrideInvoiceDay ?? null,
          overrideIncludeWeekends: data.overrideIncludeWeekends ?? false,
          overrideExcludePublicHolidays: data.overrideExcludePublicHolidays ?? false,
          reason: data.reason || "",
          effectiveFrom: data.effectiveFrom || "",
          effectiveTo: data.effectiveTo || "",
          approvedByUserId: data.approvedByUserId || "",
          approvedDate: data.approvedDate || "",
          tenantId: data.tenantId || 0,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        clientRentalConfigData.push(newConfig);
        resolve(newConfig);
      }
    }, 300);
  });
};

// ========================
// MEETINGS API
// ========================

export const getMeetings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(meetingsData);
    }, 300);
  });
};

export const getMeetingById = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const meeting = meetingsData.find((m) => m.id === id);
      resolve(meeting);
    }, 300);
  });
};

export const addNewMeeting = (meeting: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMeeting = {
        id: meetingsData.length + 1,
        ...meeting,
        createdAt: new Date().toISOString().split("T")[0],
      };
      meetingsData.unshift(newMeeting);
      resolve(newMeeting);
    }, 300);
  });
};

export const updateMeeting = (id: number, meeting: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = meetingsData.findIndex((m) => m.id === id);
      if (index !== -1) {
        meetingsData[index] = {
          ...meetingsData[index],
          ...meeting,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        resolve(meetingsData[index]);
      }
    }, 300);
  });
};

export const deleteMeeting = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = meetingsData.findIndex((m) => m.id === id);
      if (index !== -1) {
        meetingsData.splice(index, 1);
      }
      resolve({});
    }, 300);
  });
};
// ========================
// LEADS API
// ========================

let leadsData: LeadItem[] = [
  {
    id: "1",
    tenantId: "tenant-1",
    tenantName: "Tenant One",
    userId: "user-1",
    userName: "John Doe",
    title: "Premium Plan Lead",
    contactPerson: "Jane Smith",
    contactEmail: "jane.smith@example.com",
    description: "Interested in premium plan",
    leadStatus: 0,
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
    userId: "user-1",
    userName: "John Doe",
    title: "Consultation Lead",
    contactPerson: "Alice Johnson",
    contactEmail: "alice.j@example.com",
    description: "Looking for consultation",
    leadStatus: 1,
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

export const getLeads = (pageNumber: number = 1, pageSize: number = 50) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = leadsData.slice(start, end);
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: leadsData.length,
        totalPages: Math.ceil(leadsData.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < leadsData.length,
      });
    }, 300);
  });
};

export const addNewLead = (lead: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLead: LeadItem = {
        ...lead,
        id: (leadsData.length + 1).toString(),
        isDeleted: false,
      };
      leadsData.unshift(newLead);
      resolve(newLead);
    }, 300);
  });
};

export const updateLead = (id: string, lead: Partial<LeadItem>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = leadsData.findIndex((l) => l.id === id);
      if (index !== -1) {
        leadsData[index] = { 
          ...leadsData[index], 
          ...lead,
          id: leadsData[index].id, // Preserve the original ID
          tenantId: lead.tenantId ?? leadsData[index].tenantId,
          title: lead.title ?? leadsData[index].title,
          contactPerson: lead.contactPerson ?? leadsData[index].contactPerson,
          contactEmail: lead.contactEmail ?? leadsData[index].contactEmail,
          description: lead.description ?? leadsData[index].description,
          leadStatus: lead.leadStatus ?? leadsData[index].leadStatus,
          tentativeWorkDays: lead.tentativeWorkDays ?? leadsData[index].tentativeWorkDays,
          notes: lead.notes ?? leadsData[index].notes,
          tentativeProjectStartDate: lead.tentativeProjectStartDate ?? leadsData[index].tentativeProjectStartDate,
          phoneNumber: lead.phoneNumber ?? leadsData[index].phoneNumber,
          siteAddress: lead.siteAddress ?? leadsData[index].siteAddress,
          tenantLocationId: lead.tenantLocationId ?? leadsData[index].tenantLocationId,
          tenantLocationName: lead.tenantLocationName ?? leadsData[index].tenantLocationName,
        };
        resolve(leadsData[index]);
      } else {
        // Lead not found - reject the promise
        reject(new Error(`Lead with id ${id} not found`));
      }
    }, 300);
  });
};

export const deleteLead = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      leadsData = leadsData.filter((l) => l.id !== id);
      resolve({ success: true });
    }, 300);
  });
};

// ========================
// COUNTRIES API
// ========================

let countriesData = [...initialCountries];

export const getCountries = (pageNumber: number = 1, pageSize: number = 50) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = countriesData.slice(start, end);
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: countriesData.length,
        totalPages: Math.ceil(countriesData.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < countriesData.length,
      });
    }, 300);
  });
};

// ========================
// CLIENTS API
// ========================

let clientsData = [...initialClients];

export const getClients = (pageNumber: number = 1, pageSize: number = 50) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = clientsData.slice(start, end);
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: clientsData.length,
        totalPages: Math.ceil(clientsData.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < clientsData.length,
      });
    }, 300);
  });
};

export const addNewClient = (client: Partial<ClientItem> & { registeredNumber?: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newClient: ClientItem = {
        id: (clientsData.length + 1).toString(),
        tenantId: client.tenantId || "",
        name: client.name || "",
        ein: client.registeredNumber || client.ein || "",
        abn: "",
        gstNumber: client.gstNumber || "",
        vatNumber: "",
        address1: client.address1 || "",
        address2: client.address2 || "",
        countryId: client.countryId || "",
        zipcode: client.zipcode || "",
        managerFirstName: client.managerFirstName || "",
        managerLastName: client.managerLastName || "",
        managerEmailId: client.managerEmailId || "",
        logoPath: "",
        isPriority: client.isPriority || false,
        priorityReason: client.priorityReason || "",
        isDeleted: false,
      };
      clientsData.unshift(newClient);
      resolve(newClient);
    }, 300);
  });
};

export const updateClient = (id: string, client: Partial<ClientItem> & { registeredNumber?: string }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = clientsData.findIndex((c) => c.id === id);
      if (index !== -1) {
        clientsData[index] = { 
          ...clientsData[index], 
          ...client,
          id: clientsData[index].id, // Preserve the original ID
          tenantId: client.tenantId ?? clientsData[index].tenantId,
          name: client.name ?? clientsData[index].name,
          ein: client.registeredNumber ?? client.ein ?? clientsData[index].ein,
          abn: "",
          gstNumber: client.gstNumber ?? clientsData[index].gstNumber,
          vatNumber: "",
          address1: client.address1 ?? clientsData[index].address1,
          address2: client.address2 ?? clientsData[index].address2,
          countryId: client.countryId ?? clientsData[index].countryId,
          zipcode: client.zipcode ?? clientsData[index].zipcode,
          managerFirstName: client.managerFirstName ?? clientsData[index].managerFirstName,
          managerLastName: client.managerLastName ?? clientsData[index].managerLastName,
          managerEmailId: client.managerEmailId ?? clientsData[index].managerEmailId,
          logoPath: "",
          isPriority: client.isPriority ?? clientsData[index].isPriority,
          priorityReason: client.priorityReason ?? clientsData[index].priorityReason,
        };
        resolve(clientsData[index]);
      } else {
        // Client not found - reject the promise
        reject(new Error(`Client with id ${id} not found`));
      }
    }, 300);
  });
};

export const deleteClient = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      clientsData = clientsData.filter((c) => c.id !== id);
      resolve({ success: true });
    }, 300);
  });
};

// ========================
// CLIENT CONTACTS API
// ========================

let clientContactsData = [...initialClientContacts];

export const getClientContacts = (
  pageNumber: number = 1,
  pageSize: number = 50
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = clientContactsData.slice(start, end);
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: clientContactsData.length,
        totalPages: Math.ceil(clientContactsData.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < clientContactsData.length,
      });
    }, 300);
  });
};

export const addNewClientContact = (contact: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newContact: ClientContactItem = {
        ...contact,
        id: (clientContactsData.length + 1).toString(),
        isDeleted: false,
      };
      clientContactsData.unshift(newContact);
      resolve(newContact);
    }, 300);
  });
};

export const updateClientContact = (id: string, contact: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = clientContactsData.findIndex((c) => c.id === id);
      if (index !== -1) {
        clientContactsData[index] = {
          ...clientContactsData[index],
          ...contact,
        };
        resolve(clientContactsData[index]);
      }
    }, 300);
  });
};

export const deleteClientContact = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      clientContactsData = clientContactsData.filter((c) => c.id !== id);
      resolve({ success: true });
    }, 300);
  });
};

// ========================
// CLIENT SITES API
// ========================

let clientSitesData = [...initialClientSites];

export const getClientSites = (
  pageNumber: number = 1,
  pageSize: number = 50
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = clientSitesData.slice(start, end);
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: clientSitesData.length,
        totalPages: Math.ceil(clientSitesData.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < clientSitesData.length,
      });
    }, 300);
  });
};

export const addNewClientSite = (site: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSite: ClientSiteItem = {
        ...site,
        id: (clientSitesData.length + 1).toString(),
        isDeleted: false,
      };
      clientSitesData.unshift(newSite);
      resolve(newSite);
    }, 300);
  });
};

export const updateClientSite = (id: string, site: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = clientSitesData.findIndex((s) => s.id === id);
      if (index !== -1) {
        clientSitesData[index] = { ...clientSitesData[index], ...site };
        resolve(clientSitesData[index]);
      }
    }, 300);
  });
};

export const deleteClientSite = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      clientSitesData = clientSitesData.filter((s) => s.id !== id);
      resolve({ success: true });
    }, 300);
  });
};

// ========================
// CLIENT MEETINGS API
// ========================

let clientMeetingsData = [...initialClientMeetings];

export const getClientMeetings = (
  pageNumber: number = 1,
  pageSize: number = 20,
  clientId?: string
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = clientMeetingsData.filter((m) => !m.isDeleted);
      
      // Filter by clientId if provided
      if (clientId) {
        filteredData = filteredData.filter((m) => m.clientId === clientId);
      }
      
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = filteredData.slice(start, end);
      
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: filteredData.length,
        totalPages: Math.ceil(filteredData.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < filteredData.length,
      });
    }, 300);
  });
};

export const addNewClientMeeting = (meeting: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMeeting: ClientMeeting = {
        ...meeting,
        id: (clientMeetingsData.length + 1).toString(),
        isDeleted: false,
        created: new Date().toISOString(),
        meetingStatus: meeting.meetingStatus || 1,
      };
      clientMeetingsData.unshift(newMeeting);
      resolve(newMeeting);
    }, 300);
  });
};

export const updateClientMeeting = (id: string, meeting: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = clientMeetingsData.findIndex((m) => m.id === id);
      if (index !== -1) {
        clientMeetingsData[index] = {
          ...clientMeetingsData[index],
          ...meeting,
          modified: new Date().toISOString(),
        };
        resolve(clientMeetingsData[index]);
      } else {
        resolve(null);
      }
    }, 300);
  });
};

export const rescheduleClientMeeting = (
  id: string,
  newDate: string,
  newStartTime: string,
  newEndTime: string
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = clientMeetingsData.findIndex((m) => m.id === id);
      if (index !== -1) {
        clientMeetingsData[index] = {
          ...clientMeetingsData[index],
          meetingDate: newDate,
          meetingStartTime: newStartTime,
          meetingEndTime: newEndTime,
          modified: new Date().toISOString(),
        };
        resolve(clientMeetingsData[index]);
      } else {
        resolve(null);
      }
    }, 300);
  });
};

export const deleteClientMeeting = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = clientMeetingsData.findIndex((m) => m.id === id);
      if (index !== -1) {
        // Soft delete
        clientMeetingsData[index].isDeleted = true;
        clientMeetingsData[index].modified = new Date().toISOString();
      }
      resolve({ success: true });
    }, 300);
  });
};

// ========================
// LEAD ATTACHMENTS API
// ========================

let leadAttachmentsData: LeadAttachmentItem[] = [];

export const getLeadAttachments = (
  leadId: string,
  pageNumber: number = 1,
  pageSize: number = 100
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter attachments by leadId and non-deleted items
      const filteredAttachments = leadAttachmentsData.filter(
        (attachment) => attachment.leadId === leadId && !attachment.isDeleted
      );
      
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = filteredAttachments.slice(start, end);
      
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: filteredAttachments.length,
        totalPages: Math.ceil(filteredAttachments.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < filteredAttachments.length,
      });
    }, 300);
  });
};

export const addNewLeadAttachment = (attachment: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAttachment: LeadAttachmentItem = {
        ...attachment,
        id: (leadAttachmentsData.length + 1).toString(),
        isDeleted: false,
      };
      leadAttachmentsData.unshift(newAttachment);
      resolve(newAttachment);
    }, 300);
  });
};

export const deleteLeadAttachment = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = leadAttachmentsData.findIndex((a) => a.id === id);
      if (index !== -1) {
        leadAttachmentsData[index] = {
          ...leadAttachmentsData[index],
          isDeleted: true,
        };
        resolve({ success: true });
      } else {
        resolve({ success: false });
      }
    }, 300);
  });
};

// ========================
// PROFILES API
// ========================

let profilesData = [...initialProfiles];

export const getProfiles = (
  pageNumber: number = 1,
  pageSize: number = 50
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = profilesData.slice(start, end);
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: profilesData.length,
        totalPages: Math.ceil(profilesData.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < profilesData.length,
      });
    }, 300);
  });
};

export const addNewProfile = (profile: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProfile: ProfileItem = {
        ...profile,
        id: (profilesData.length + 1).toString(),
        isDeleted: false,
      };
      profilesData.unshift(newProfile);
      resolve(newProfile);
    }, 300);
  });
};

export const updateProfile = (id: string, profile: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = profilesData.findIndex((p) => p.id === id);
      if (index !== -1) {
        profilesData[index] = { ...profilesData[index], ...profile };
        resolve(profilesData[index]);
      }
    }, 300);
  });
};

export const deleteProfile = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      profilesData = profilesData.filter((p) => p.id !== id);
      resolve({ success: true });
    }, 300);
  });
};

// ========================
// ROLES API
// ========================

let rolesData = [...initialRoles];

export const getRoles = (
  pageNumber: number = 1,
  pageSize: number = 50
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter out deleted roles
      const activeRoles = rolesData.filter(role => !role.isDeleted);
      
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = activeRoles.slice(start, end);
      
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: activeRoles.length,
        totalPages: Math.ceil(activeRoles.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < activeRoles.length,
      });
    }, 300);
  });
};

export const addNewRole = (role: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRole: RoleItem = {
        ...role,
        id: (rolesData.length + 1).toString(),
        isDeleted: false,
      };
      rolesData.unshift(newRole);
      resolve(newRole);
    }, 300);
  });
};

export const updateRole = (id: string, role: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = rolesData.findIndex((r) => r.id === id);
      if (index !== -1) {
        rolesData[index] = { ...rolesData[index], ...role };
        resolve(rolesData[index]);
      }
    }, 300);
  });
};

export const deleteRole = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = rolesData.findIndex((r) => r.id === id);
      if (index !== -1) {
        rolesData[index] = {
          ...rolesData[index],
          isDeleted: true,
        };
        resolve({ success: true });
      } else {
        resolve({ success: false });
      }
    }, 300);
  });
};

// ========================
// TENANT ROLES API
// ========================

let tenantRolesData = [...initialTenantRoles];

export const getTenantRoles = (
  pageNumber: number = 1,
  pageSize: number = 20
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter out deleted roles
      const activeRoles = tenantRolesData.filter(role => !role.isDeleted);
      
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = activeRoles.slice(start, end);
      
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: activeRoles.length,
        totalPages: Math.ceil(activeRoles.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < activeRoles.length,
      });
    }, 300);
  });
};

export const getTenantRoleById = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const role = tenantRolesData.find((r) => r.id === id);
      resolve(role);
    }, 300);
  });
};

export const addNewTenantRole = (role: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRole: TenantRoleItem = {
        ...role,
        id: (tenantRolesData.length + 1).toString(),
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tenantRolesData.unshift(newRole);
      resolve(newRole);
    }, 300);
  });
};

export const updateTenantRole = (id: string, role: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = tenantRolesData.findIndex((r) => r.id === id);
      if (index !== -1) {
        tenantRolesData[index] = { 
          ...tenantRolesData[index], 
          ...role,
          updatedAt: new Date().toISOString(),
        };
        resolve(tenantRolesData[index]);
      }
    }, 300);
  });
};

export const deleteTenantRole = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = tenantRolesData.findIndex((r) => r.id === id);
      if (index !== -1) {
        tenantRolesData[index] = {
          ...tenantRolesData[index],
          isDeleted: true,
          updatedAt: new Date().toISOString(),
        };
        resolve(tenantRolesData[index]);
      }
    }, 300);
  });
};

// ========================
// GLOBAL USERS API
// ========================

let globalUsersData = [...initialGlobalUsers];

export const getGlobalUsers = (
  pageNumber: number = 1,
  pageSize: number = 20
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const items = globalUsersData.slice(start, end);
      resolve({
        items,
        pageNumber,
        pageSize,
        totalCount: globalUsersData.length,
        totalPages: Math.ceil(globalUsersData.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: end < globalUsersData.length,
      });
    }, 300);
  });
};

export const addNewGlobalUser = (user: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: GlobalUserItem = {
        ...user,
        id: (globalUsersData.length + 1).toString(),
        emailVerified: false,
        initialSetupDone: false,
        disabled: false,
        isDeleted: false,
        appUserCode: `USR${String(globalUsersData.length + 1).padStart(3, '0')}`,
      };
      globalUsersData.unshift(newUser);
      resolve(newUser);
    }, 300);
  });
};

export const updateGlobalUser = (id: string, user: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = globalUsersData.findIndex((u) => u.id === id);
      if (index !== -1) {
        globalUsersData[index] = {
          ...globalUsersData[index],
          ...user,
        };
        resolve(globalUsersData[index]);
      } else {
        // Global user not found - reject the promise
        reject(new Error(`Global user with id ${id} not found`));
      }
    }, 300);
  });
};

export const deleteGlobalUser = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      globalUsersData = globalUsersData.filter((u) => u.id !== id);
      resolve({ success: true });
    }, 300);
  });
};






























