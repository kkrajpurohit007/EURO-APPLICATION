import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Navdata = () => {
  const location = useLocation();
  
  // Menu state variables for expandable sections
  const [isLeads, setIsLeads] = useState<boolean>(false);
  const [isClients, setIsClients] = useState<boolean>(false);
  const [isAccountSettings, setIsAccountSettings] = useState<boolean>(false);

  // Auto-expand menu based on current route
  useEffect(() => {
    const pathname = location.pathname;
    
    // Expand Leads section if on leads routes
    if (pathname.includes("/leads")) {
      setIsLeads(true);
    }
    
    // Expand Clients section if on client-related routes
    if (
      pathname.includes("/clients") ||
      pathname.includes("/meetings") ||
      pathname.includes("/sites") ||
      pathname.includes("/contacts") ||
      pathname.includes("/rental-config")
    ) {
      setIsClients(true);
    }
    
    // Expand Account Settings section if on account/settings routes
    if (
      pathname.includes("/account/departments") ||
      pathname.includes("/account/tenant-roles") ||
      pathname.includes("/account/profiles") ||
      pathname.includes("/settings/tenant-rental-config") ||
      pathname.includes("/tenant-locations")
    ) {
      setIsAccountSettings(true);
    }
  }, [location.pathname]);

  // Toggle functions for collapsible menus
  const toggleLeads = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLeads(!isLeads);
  };

  const toggleClients = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsClients(!isClients);
  };

  const toggleAccountSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAccountSettings(!isAccountSettings);
  };

  const menuItems: any = [
    {
      label: "Navigation",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
    },
    {
      id: "leads",
      label: "Leads",
      icon: "ri-user-search-line",
      link: "#",
      click: toggleLeads,
      stateVariables: isLeads,
      subItems: [
        {
          id: "leads-list",
          label: "Lead Directory",
          link: "/leads/list",
        },
      ],
    },
    {
      id: "clients",
      label: "Clients",
      icon: "ri-building-2-line",
      link: "#",
      click: toggleClients,
      stateVariables: isClients,
      subItems: [
        {
          id: "clients-list",
          label: "Client Directory",
          link: "/clients/list",
        },
        {
          id: "client-rental-config",
          label: "Client Rental Configuration",
          link: "/clients/rental-config",
        },
        {
          id: "client-sites",
          label: "Client Sites",
          link: "/clients/sites",
        },
        {
          id: "client-contacts",
          label: "Client Contacts",
          link: "/clients/contacts",
        },
        {
          id: "meetings",
          label: "Meetings & Appointments",
          link: "/clients/meetings",
        },
      ],
    },
    {
      id: "account-settings",
      label: "Account Settings",
      icon: "ri-settings-4-line",
      link: "#",
      click: toggleAccountSettings,
      stateVariables: isAccountSettings,
      subItems: [
        {
          id: "tenant-rental-config",
          label: "Tenant Rental Configuration",
          link: "/settings/tenant-rental-config",
        },
        {
          id: "departments",
          label: "Departments",
          link: "/account/departments",
        },
        {
          id: "tenant-roles",
          label: "Tenant Roles",
          link: "/account/tenant-roles",
        },
        {
          id: "profiles",
          label: "Profiles",
          link: "/account/profiles",
        },
        {
          id: "tenant-locations-list",
          label: "Tenant Locations",
          link: "/tenant-locations/list",
        },
      ],
    },
  ];
  
  return menuItems;
};

export default Navdata;