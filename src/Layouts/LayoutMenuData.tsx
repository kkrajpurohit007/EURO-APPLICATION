import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  // Menu state variables for expandable sections
  const [isDashboard, setIsDashboard] = useState<boolean>(false); // Client Management
  const [isApps, setIsApps] = useState<boolean>(false); // Account Management
  const [isAuth, setIsAuth] = useState<boolean>(false); // Settings

  const [iscurrentState] = useState("Dashboard");

  useEffect(() => {
    if (iscurrentState !== "Clients") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Account") {
      setIsApps(false);
    }
    if (iscurrentState !== "Settings") {
      setIsAuth(false);
    }
  }, [history, iscurrentState, isDashboard, isApps, isAuth]);

  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
    },
    {
      label: "Lead Management",
      isHeader: true,
    },
    {
      id: "leads",
      label: "Lead Management",
      icon: "ri-user-search-line",
      link: "/leads",
    },
    {
      label: "Client Management",
      isHeader: true,
    },
    {
      id: "clientlist",
      label: "Clients",
      link: "/clients",
      icon: "ri-group-line",
    },
    {
      id: "sites",
      label: "Sites",
      link: "/clients/sites",
      icon: "ri-building-2-line",
    },
    {
      id: "contacts",
      label: "Contacts",
      link: "/clients/contacts",
      icon: "ri-contacts-line",
    },
    {
      id: "meetings",
      label: "Meetings",
      link: "/clients/meetings",
      icon: "ri-calendar-event-line",
    },
    {
      label: "Account Management",
      isHeader: true,
    },
    {
      id: "departments",
      label: "Departments",
      link: "/account/departments",
      icon: "ri-building-line",
    },
    // {
    //   id: "staffpositions",
    //   label: "Staff Positions",
    //   link: "/account/staff-positions",
    //   icon: "ri-file-user-line",
    // },
    // {
    //   id: "staff",
    //   label: "Staff Management",
    //   icon: "ri-team-line",
    //   link: "/staff/users",
    // },
    {
      label: "Settings",
      isHeader: true,
    },
    {
      id: "systemConfig",
      label: "System Config",
      link: "/settings/system-config",
      icon: "ri-settings-3-line",
    },
    {
      id: "tenantRentalConfig",
      label: "Rental Configuration",
      link: "/settings/tenant-rental-config",
      icon: "ri-file-settings-line",
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;