import { APIClient } from "./api_helper";

import * as url from "./url_helper";

import { staffPositions } from "../common/data/staffPositions";
import { tenantRentalConfigData } from "../common/data/tenantRentalConfig";
import { clientRentalConfigData } from "../common/data/clientRentalConfig";
import { meetingsData } from "../common/data/meetings";
import { initialLeads, LeadItem } from "../slices/leads/lead.fakeData";
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

// Staff Positions
export const getStaffPositions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(staffPositions);
    }, 300);
  });
};

export const getStaffPositionById = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const position = staffPositions.find((p) => p.id === id);
      resolve(position);
    }, 300);
  });
};

export const addNewStaffPosition = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPosition = {
        ...data,
        id: staffPositions.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      staffPositions.unshift(newPosition);
      resolve(newPosition);
    }, 300);
  });
};

export const updateStaffPosition = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = staffPositions.findIndex((p) => p.id === data.id);
      if (index !== -1) {
        staffPositions[index] = {
          ...staffPositions[index],
          ...data,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        resolve(staffPositions[index]);
      }
    }, 300);
  });
};

export const deleteStaffPosition = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = staffPositions.findIndex((p) => p.id === id);
      if (index !== -1) {
        staffPositions.splice(index, 1);
      }
      resolve({ success: true });
    }, 300);
  });
};

// Tenant Rental Configuration
export const getTenantRentalConfig = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tenantRentalConfigData);
    }, 300);
  });
};

export const updateTenantRentalConfig = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      Object.assign(tenantRentalConfigData, {
        ...data,
        updatedAt: new Date().toISOString().split("T")[0],
      });
      resolve(tenantRentalConfigData);
    }, 300);
  });
};

// Client Rental Configuration
export const getClientRentalConfigs = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(clientRentalConfigData);
    }, 300);
  });
};

export const getClientRentalConfigByClientId = (clientId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const config = clientRentalConfigData.find(
        (c) => c.clientId === clientId
      );
      resolve(config);
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
        clientRentalConfigData[index] = {
          ...clientRentalConfigData[index],
          ...data,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        resolve(clientRentalConfigData[index]);
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

let leadsData = [...initialLeads];

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

export const updateLead = (id: string, lead: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = leadsData.findIndex((l) => l.id === id);
      if (index !== -1) {
        leadsData[index] = { ...leadsData[index], ...lead };
        resolve(leadsData[index]);
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

export const addNewClient = (client: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newClient: ClientItem = {
        ...client,
        id: (clientsData.length + 1).toString(),
        isDeleted: false,
      };
      clientsData.unshift(newClient);
      resolve(newClient);
    }, 300);
  });
};

export const updateClient = (id: string, client: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = clientsData.findIndex((c) => c.id === id);
      if (index !== -1) {
        clientsData[index] = { ...clientsData[index], ...client };
        resolve(clientsData[index]);
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
