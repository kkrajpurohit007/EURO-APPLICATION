import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardEcommerce from "../pages/Dashboard";

// Lead Management
import LeadList from "../pages/Leads/Lead/LeadList";
import LeadCreate from "../pages/Leads/Lead/LeadCreate";
import LeadEdit from "../pages/Leads/Lead/LeadEdit";
import LeadView from "../pages/Leads/Lead/LeadView";

// Client Management
import ClientList from "../pages/Clients/Client/ClientList";
import ClientCreate from "../pages/Clients/Client/ClientCreate";
import ClientEdit from "../pages/Clients/Client/ClientEdit";
import ClientView from "../pages/Clients/Client/ClientView";
import MeetingSchedule from "../pages/Clients/Meeting/Meetings";
import MeetingsList from "../pages/Clients/Meeting/MeetingsList";
import MeetingCreate from "../pages/Clients/Meeting/MeetingCreate";
import MeetingEdit from "../pages/Clients/Meeting/MeetingEdit";
import MeetingView from "../pages/Clients/Meeting/MeetingView";
import MeetingCalendar from "../pages/Clients/Meeting/MeetingCalendar";

// Site Management
import SitesList from "../pages/Clients/Site/SitesList";
import SiteCreate from "../pages/Clients/Site/SiteCreate";
import SiteEdit from "../pages/Clients/Site/SiteEdit";
import SiteView from "../pages/Clients/Site/SiteView";

// Contact Management
import ContactsList from "../pages/Clients/Contact/ContactsList";
import ContactCreate from "../pages/Clients/Contact/ContactCreate";
import ContactEdit from "../pages/Clients/Contact/ContactEdit";
import ContactView from "../pages/Clients/Contact/ContactView";

// Staff Management

// Account Management
import DepartmentList from "../pages/Account/Department/DepartmentList";
import DepartmentCreate from "../pages/Account/Department/DepartmentCreate";
import DepartmentEdit from "../pages/Account/Department/DepartmentEdit";
import TenantRoleList from "../pages/Account/TenantRole/TenantRoleList";
import TenantRoleCreate from "../pages/Account/TenantRole/TenantRoleCreate";
import TenantRoleEdit from "../pages/Account/TenantRole/TenantRoleEdit";
import TenantRoleView from "../pages/Account/TenantRole/TenantRoleView";
import ProfileList from "../pages/Account/Profile/ProfileList";
import GlobalUserList from "../pages/Account/GlobalUser/GlobalUserList";
import GlobalUserCreate from "../pages/Account/GlobalUser/GlobalUserCreate";
import GlobalUserEdit from "../pages/Account/GlobalUser/GlobalUserEdit";
import GlobalUserView from "../pages/Account/GlobalUser/GlobalUserView";

// Settings
import SystemConfig from "../pages/Settings/General/SystemConfig";
import BasicInfo from "../pages/Settings/General/BasicInfo";
import TenantRentalConfig from "../pages/Settings/Rental/TenantRentalConfig";

// Tenant Locations
import TenantLocationList from "../pages/TenantLocations/TenantLocationList";
import TenantLocationCreate from "../pages/TenantLocations/TenantLocationCreate";
import TenantLocationEdit from "../pages/TenantLocations/TenantLocationEdit";
import TenantLocationView from "../pages/TenantLocations/TenantLocationView";

// Client Rental Config
import ClientRentalConfig from "../pages/Clients/ClientRentalConfig";

import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//login
import Login from "../pages/Authentication/components/Login";
import OtpVerification from "../pages/Authentication/components/OtpVerification";
import ForgetPasswordPage from "../pages/Authentication/components/ForgetPassword";
import Logout from "../pages/Authentication/components/Logout";

const authProtectedRoutes = [
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },

  // Lead Management
  { path: "/leads", component: <Navigate to="/leads/list" /> },
  { path: "/leads/list", component: <LeadList /> },
  { path: "/leads/create", component: <LeadCreate /> },
  { path: "/leads/edit/:id", component: <LeadEdit /> },
  { path: "/leads/view/:id", component: <LeadView /> },

  // Client Management
  { path: "/clients", component: <Navigate to="/clients/list" /> },
  { path: "/clients/list", component: <ClientList /> },
  { path: "/clients/create", component: <ClientCreate /> },
  { path: "/clients/view/:id", component: <ClientView /> },
  { path: "/clients/edit/:id", component: <ClientEdit /> },
  { path: "/clients/meetings", component: <MeetingSchedule /> },

  // Meeting Management
  { path: "/meetings", component: <MeetingSchedule /> },
  { path: "/meetings/list", component: <MeetingsList /> },
  { path: "/meetings/create", component: <MeetingCreate /> },
  { path: "/meetings/edit/:id", component: <MeetingEdit /> },
  { path: "/meetings/view/:id", component: <MeetingView /> },
  { path: "/meetings/calendar", component: <MeetingCalendar /> },

  // Site Management
  { path: "/clients/sites", component: <SitesList /> },
  { path: "/clients/sites/create", component: <SiteCreate /> },
  { path: "/clients/sites/edit/:id", component: <SiteEdit /> },
  { path: "/clients/sites/view/:id", component: <SiteView /> },

  // Contact Management
  { path: "/clients/contacts", component: <ContactsList /> },
  { path: "/clients/contacts/create", component: <ContactCreate /> },
  { path: "/clients/contacts/edit/:id", component: <ContactEdit /> },
  { path: "/clients/contacts/view/:id", component: <ContactView /> },

  // Account Management
  { path: "/account/departments", component: <DepartmentList /> },
  { path: "/account/departments/create", component: <DepartmentCreate /> },
  { path: "/account/departments/edit/:id", component: <DepartmentEdit /> },
  { path: "/account/tenant-roles", component: <TenantRoleList /> },
  {
    path: "/account/tenant-roles/create",
    component: <TenantRoleCreate />,
  },
  {
    path: "/account/tenant-roles/edit/:id",
    component: <TenantRoleEdit />,
  },
  {
    path: "/account/tenant-roles/view/:id",
    component: <TenantRoleView />,
  },
  { path: "/account/profiles", component: <ProfileList /> },
  { path: "/account/global-users", component: <GlobalUserList /> },
  { path: "/account/global-users/create", component: <GlobalUserCreate /> },
  { path: "/account/global-users/edit/:id", component: <GlobalUserEdit /> },
  { path: "/account/global-users/view/:id", component: <GlobalUserView /> },

  // Settings
  { path: "/settings/system-config", component: <SystemConfig /> },
  { path: "/settings/basic-info", component: <BasicInfo /> },
  {
    path: "/settings/tenant-rental-config",
    component: <TenantRentalConfig />,
  },

  // Tenant Locations
  { path: "/tenant-locations", component: <Navigate to="/tenant-locations/list" /> },
  { path: "/tenant-locations/list", component: <TenantLocationList /> },
  { path: "/tenant-locations/create", component: <TenantLocationCreate /> },
  { path: "/tenant-locations/view/:id", component: <TenantLocationView /> },
  { path: "/tenant-locations/edit/:id", component: <TenantLocationEdit /> },

  // Client Rental Config
  {
    path: "/clients/:clientId/rental-config",
    component: <ClientRentalConfig />,
  },
  {
    path: "/clients/rental-config",
    component: <ClientRentalConfig />,
  },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/otp-verification", component: <OtpVerification /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },

  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },
  { path: "/auth-offline", component: <Offlinepage /> },
];

export { authProtectedRoutes, publicRoutes };