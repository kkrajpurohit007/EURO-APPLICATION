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
import StaffUsersList from "../pages/Staff/User/StaffUsersList";
import StaffUsersCreate from "../pages/Staff/User/StaffUsersCreate";
import StaffUsersEdit from "../pages/Staff/User/StaffUsersEdit";

// Account Management
import DepartmentList from "../pages/Account/Department/DepartmentList";
import DepartmentCreate from "../pages/Account/Department/DepartmentCreate";
import DepartmentEdit from "../pages/Account/Department/DepartmentEdit";
import StaffPositionList from "../pages/Account/StaffPosition/StaffPositionList";
import StaffPositionCreate from "../pages/Account/StaffPosition/StaffPositionCreate";
import StaffPositionEdit from "../pages/Account/StaffPosition/StaffPositionEdit";

// Settings
import SystemConfig from "../pages/Settings/General/SystemConfig";
import BasicInfo from "../pages/Settings/General/BasicInfo";
import TenantRentalConfig from "../pages/Settings/Rental/TenantRentalConfig";

// Client Rental Config
import ClientRentalConfigForm from "../pages/Clients/Client/ClientRentalConfigForm";

import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//login
import Login from "../pages/Authentication/Login";
import OtpVerification from "../pages/Authentication/OtpVerification";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";

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

  // Staff Management
  { path: "/staff/users", component: <StaffUsersList /> },
  { path: "/staff/users/create", component: <StaffUsersCreate /> },
  { path: "/staff/users/edit/:id", component: <StaffUsersEdit /> },

  // Account Management
  { path: "/account/departments", component: <DepartmentList /> },
  { path: "/account/departments/create", component: <DepartmentCreate /> },
  { path: "/account/departments/edit/:id", component: <DepartmentEdit /> },
  { path: "/account/staff-positions", component: <StaffPositionList /> },
  {
    path: "/account/staff-positions/create",
    component: <StaffPositionCreate />,
  },
  {
    path: "/account/staff-positions/edit/:id",
    component: <StaffPositionEdit />,
  },

  // Settings
  { path: "/settings/system-config", component: <SystemConfig /> },
  { path: "/settings/basic-info", component: <BasicInfo /> },
  {
    path: "/settings/tenant-rental-config",
    component: <TenantRentalConfig />,
  },

  // Client Rental Config
  {
    path: "/clients/:clientId/rental-config",
    component: <ClientRentalConfigForm />,
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