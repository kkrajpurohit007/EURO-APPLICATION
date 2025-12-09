import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";
import OtpReducer from "./auth/otp/reducer";

// Departments (migrated to module structure)
import DepartmentsReducer from "../modules/account/department/slice/department.slice";

// Tenant Roles
import TenantRolesReducer from "./tenantRoles/tenantRole.slice";

// Tenant Rental Config
import TenantRentalConfigReducer from "./tenantRentalConfig/tenantRentalConfig.slice";

// Client Rental Config
import ClientRentalConfigReducer from "./clientRentalConfig/clientRentalConfig.slice";

// Meetings
import MeetingsReducer from "./meetings/reducer";

// Leads (migrated to module structure)
import LeadsReducer from "../modules/lead/slice/lead.slice";

// Lead Attachments
import LeadAttachmentsReducer from "./leadAttachments/leadAttachment.slice";

// Countries
import CountriesReducer from "./countries/country.slice";

// Clients (migrated to module structure)
import ClientsReducer from "../modules/client/slice/client.slice";

// Client Contacts
import ClientContactsReducer from "./clientContacts/clientContact.slice";

// Client Sites
import ClientSitesReducer from "./clientSites/clientSite.slice";

// Tenant Locations
import TenantLocationsReducer from "./tenantLocations/tenantLocation.slice";

// User Profiles
import UserProfilesReducer from "./userProfiles/profile.slice";

// Roles
import RolesReducer from "./roles/role.slice";

// Global Users
import GlobalUsersReducer from "./globalUsers/globalUser.slice";

// Client Meetings
import ClientMeetingsReducer from "./clientMeetings/clientMeeting.slice";

// Notifications
import NotificationReducer from "./notifications/notificationSlice";

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  Account: AccountReducer,
  ForgetPassword: ForgetPasswordReducer,
  Profile: ProfileReducer,
  Otp: OtpReducer,
  Departments: DepartmentsReducer,
  TenantRoles: TenantRolesReducer,
  TenantRentalConfig: TenantRentalConfigReducer,
  ClientRentalConfig: ClientRentalConfigReducer,
  Meetings: MeetingsReducer,
  Leads: LeadsReducer,
  LeadAttachments: LeadAttachmentsReducer,
  Countries: CountriesReducer,
  Clients: ClientsReducer,
  ClientContacts: ClientContactsReducer,
  ClientSites: ClientSitesReducer,
  TenantLocations: TenantLocationsReducer,
  UserProfiles: UserProfilesReducer,
  Roles: RolesReducer,
  GlobalUsers: GlobalUsersReducer,
  ClientMeetings: ClientMeetingsReducer,
  Notifications: NotificationReducer,
});

export default rootReducer;