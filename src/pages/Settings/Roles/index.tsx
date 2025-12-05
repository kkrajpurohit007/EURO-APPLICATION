import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Spinner,
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  fetchRoles,
  selectRoleList,
  selectRoleLoading,
  selectRoleError,
} from "../../../slices/roles/role.slice";
import RoleForm from "./RoleForm";

const RolesManagement = () => {
  const dispatch = useDispatch();
  const roles = useSelector(selectRoleList);
  const loading = useSelector(selectRoleLoading);
  const error = useSelector(selectRoleError);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles({ pageNumber: 1, pageSize: 20 }) as any);
  }, [dispatch]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setSelectedRole(null);
  };

  const handleEdit = (role: any) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    setModalOpen(false);
    setSelectedRole(null);
    // Refresh the roles list
    dispatch(fetchRoles({ pageNumber: 1, pageSize: 20 }) as any);
  };

  return React.createElement("div", { className: "page-content" },
    React.createElement(BreadCrumb, { title: "Roles Management", pageTitle: "Settings" }),
    React.createElement(Container, { fluid: true },
      React.createElement(Row, null,
        React.createElement(Col, { lg: 12 },
          React.createElement(Card, null,
            React.createElement(CardHeader, { className: "border-0" },
              React.createElement("div", { className: "d-flex align-items-center" },
                React.createElement("h5", { className: "card-title mb-0 flex-grow-1" }, "Roles Management"),
                React.createElement(Button, {
                  color: "primary",
                  onClick: handleCreate
                }, React.createElement("i", { className: "ri-add-line align-bottom me-1" }), "Add Role")
              )
            ),
            React.createElement(CardBody, { className: "pt-0" },
              error ? React.createElement(Alert, { color: "danger", className: "mb-3" }, error) : null,
              loading && (!roles || roles.length === 0) ? React.createElement("div", { className: "text-center py-3" },
                React.createElement(Spinner, { color: "primary" }),
                React.createElement("p", { className: "mt-2 text-muted" }, "Loading roles...")
              ) : React.createElement("div", { className: "table-responsive" },
                React.createElement(Table, { className: "table-striped table-nowrap align-middle mb-0" },
                  React.createElement("thead", null,
                    React.createElement("tr", null,
                      React.createElement("th", { scope: "col" }, "Name"),
                      React.createElement("th", { scope: "col" }, "Profile"),
                      React.createElement("th", { scope: "col" }, "Description"),
                      React.createElement("th", { scope: "col" }, "Sensitive"),
                      React.createElement("th", { scope: "col" }, "Status"),
                      React.createElement("th", { scope: "col" }, "Actions")
                    )
                  ),
                  React.createElement("tbody", null,
                    roles && roles.length > 0 ? 
                      roles.map((role: any) => 
                        React.createElement("tr", { key: role.id },
                          React.createElement("td", null, role.name),
                          React.createElement("td", null, role.profileName),
                          React.createElement("td", null, role.description),
                          React.createElement("td", null, 
                            role.isSensitive ? 
                              React.createElement("span", { className: "badge bg-warning" }, "Yes") :
                              React.createElement("span", { className: "badge bg-secondary" }, "No")
                          ),
                          React.createElement("td", null,
                            role.isDeleted ? 
                              React.createElement("span", { className: "badge bg-danger" }, "Deleted") :
                              React.createElement("span", { className: "badge bg-success" }, "Active")
                          ),
                          React.createElement("td", null,
                            React.createElement(Button, {
                              size: "sm",
                              color: "soft-primary",
                              onClick: () => handleEdit(role)
                            }, React.createElement("i", { className: "ri-pencil-line" }))
                          )
                        )
                      ) : 
                      React.createElement("tr", null,
                        React.createElement("td", { colSpan: 6, className: "text-center" }, "No roles found")
                      )
                  )
                )
              )
            )
          )
        )
      )
    ),
    React.createElement(Modal, {
      isOpen: modalOpen,
      toggle: toggleModal,
      size: "lg",
      backdrop: "static"
    },
      React.createElement(ModalHeader, { toggle: toggleModal },
        selectedRole ? "Edit Role" : "Create Role"
      ),
      React.createElement(ModalBody, null,
        React.createElement(RoleForm, {
          role: selectedRole,
          onCancel: toggleModal,
          onSave: handleSave
        })
      )
    )
  );
};

export default RolesManagement;