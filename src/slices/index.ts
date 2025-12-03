import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";
import OtpReducer from "./auth/otp/reducer";

// Departments
import DepartmentsReducer from "./departments/department.slice";

// Staff Positions
import StaffPositionsReducer from "./staffPositions/reducer";

// Tenant Rental Config
import TenantRentalConfigReducer from "./tenantRentalConfig/tenantRentalConfig.slice";

// Client Rental Config
import ClientRentalConfigReducer from "./clientRentalConfig/reducer";

// Meetings
import MeetingsReducer from "./meetings/reducer";

// Leads
import LeadsReducer from "./leads/lead.slice";

// Countries
import CountriesReducer from "./countries/country.slice";

// Clients
import ClientsReducer from "./clients/client.slice";

// Client Contacts
import ClientContactsReducer from "./clientContacts/clientContact.slice";

// Client Sites
import ClientSitesReducer from "./clientSites/clientSite.slice";

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  Account: AccountReducer,
  ForgetPassword: ForgetPasswordReducer,
  Profile: ProfileReducer,
  Otp: OtpReducer,
  Departments: DepartmentsReducer,
  StaffPositions: StaffPositionsReducer,
  TenantRentalConfig: TenantRentalConfigReducer,
  ClientRentalConfig: ClientRentalConfigReducer,
  Meetings: MeetingsReducer,
  Leads: LeadsReducer,
  Countries: CountriesReducer,
  Clients: ClientsReducer,
  ClientContacts: ClientContactsReducer,
  ClientSites: ClientSitesReducer,
});

export default rootReducer;
