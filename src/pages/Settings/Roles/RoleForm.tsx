import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  createRole,
  updateRole,
  selectRoleLoading,
  selectRoleError,
} from "../../../slices/roles/role.slice";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import { useFlash } from "../../../hooks/useFlash";

const RoleForm = ({ role, onCancel, onSave }: any) => {
  const dispatch = useDispatch();
  const { userProfile } = useProfile();
  const loading = useSelector(selectRoleLoading);
  const error = useSelector(selectRoleError);
  const { showSuccess, showError } = useFlash();

  const [formData, setFormData] = useState({
    tenantId: userProfile?.tenantId || "",
    profileId: "",
    profileName: "",
    name: "",
    description: "",
    isSensitive: false,
  });

  useEffect(() => {
    if (role) {
      setFormData({
        tenantId: role.tenantId || userProfile?.tenantId || "",
        profileId: role.profileId || "",
        profileName: role.profileName || "",
        name: role.name || "",
        description: role.description || "",
        isSensitive: role.isSensitive || false,
      });
    }
  }, [role, userProfile]);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      let result;
      if (role && role.id) {
        // Update existing role
        result = await dispatch(updateRole({ id: role.id, data: formData }) as any);
      } else {
        // Create new role
        result = await dispatch(createRole(formData) as any);
      }
      
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess(role ? "Role updated successfully!" : "Role created successfully!");
        if (onSave) onSave();
      } else {
        showError("Failed to save role");
      }
    } catch (err) {
      showError("An error occurred while saving the role");
    }
  };

  return React.createElement("div", { className: "page-content" },
    React.createElement(BreadCrumb, { 
      title: role ? "Edit Role" : "Create Role", 
      pageTitle: "Settings" 
    }),
    React.createElement(Container, { fluid: true },
      React.createElement(Row, null,
        React.createElement(Col, { lg: 12 },
          React.createElement(Card, null,
            React.createElement(CardHeader, null,
              React.createElement("h5", { className: "card-title mb-0" }, 
                role ? "Edit Role" : "Create New Role"
              )
            ),
            React.createElement(CardBody, null,
              error ? React.createElement(Alert, { color: "danger" }, error) : null,
              React.createElement(Form, { onSubmit: handleSubmit },
                React.createElement(Row, null,
                  React.createElement(Col, { md: 6 },
                    React.createElement(FormGroup, null,
                      React.createElement(Label, { for: "name" }, "Role Name *"),
                      React.createElement(Input, {
                        type: "text",
                        id: "name",
                        name: "name",
                        value: formData.name,
                        onChange: handleInputChange,
                        required: true,
                        placeholder: "Enter role name"
                      })
                    )
                  ),
                  React.createElement(Col, { md: 6 },
                    React.createElement(FormGroup, null,
                      React.createElement(Label, { for: "profileName" }, "Profile Name *"),
                      React.createElement(Input, {
                        type: "text",
                        id: "profileName",
                        name: "profileName",
                        value: formData.profileName,
                        onChange: handleInputChange,
                        required: true,
                        placeholder: "Enter profile name"
                      })
                    )
                  )
                ),
                React.createElement(Row, null,
                  React.createElement(Col, { md: 6 },
                    React.createElement(FormGroup, null,
                      React.createElement(Label, { for: "profileId" }, "Profile ID"),
                      React.createElement(Input, {
                        type: "text",
                        id: "profileId",
                        name: "profileId",
                        value: formData.profileId,
                        onChange: handleInputChange,
                        placeholder: "Enter profile ID"
                      })
                    )
                  ),
                  React.createElement(Col, { md: 6 },
                    React.createElement(FormGroup, null,
                      React.createElement(Label, null, "Sensitive Role"),
                      React.createElement("div", { className: "form-check form-switch" },
                        React.createElement(Input, {
                          type: "switch",
                          id: "isSensitive",
                          name: "isSensitive",
                          checked: formData.isSensitive,
                          onChange: handleInputChange,
                          className: "form-check-input"
                        }),
                        React.createElement(Label, { 
                          for: "isSensitive", 
                          className: "form-check-label" 
                        }, "Mark as sensitive")
                      )
                    )
                  )
                ),
                React.createElement(Row, null,
                  React.createElement(Col, { md: 12 },
                    React.createElement(FormGroup, null,
                      React.createElement(Label, { for: "description" }, "Description"),
                      React.createElement(Input, {
                        type: "textarea",
                        id: "description",
                        name: "description",
                        value: formData.description,
                        onChange: handleInputChange,
                        rows: 3,
                        placeholder: "Enter role description"
                      })
                    )
                  )
                ),
                React.createElement("div", { className: "d-flex justify-content-end gap-2 mt-4" },
                  React.createElement(Button, {
                    type: "button",
                    color: "light",
                    onClick: onCancel
                  }, "Cancel"),
                  React.createElement(Button, {
                    type: "submit",
                    color: "primary",
                    disabled: loading
                  }, 
                    loading ? "Saving..." : (role ? "Update Role" : "Create Role")
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};

export default RoleForm;