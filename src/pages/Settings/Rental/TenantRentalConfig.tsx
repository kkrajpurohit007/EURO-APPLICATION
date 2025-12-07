import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Table,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  selectRentalConfig,
  selectRentalConfigLoading,
  selectRentalConfigError,
  updateRentalConfig,
  fetchRentalConfig,
} from "../../../slices/tenantRentalConfig/tenantRentalConfig.slice";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import Loader from "../../../Components/Common/Loader";
import { useFlash } from "../../../hooks/useFlash";
import { PAGE_TITLES } from "../../../common/branding";

const TenantRentalConfig = () => {
  document.title = PAGE_TITLES.SETTINGS_TENANT_RENTAL;

  const dispatch = useDispatch<any>();
  const { userProfile } = useProfile();
  const config = useSelector(selectRentalConfig);
  const loading = useSelector(selectRentalConfigLoading);
  const error = useSelector(selectRentalConfigError);
  const { showSuccess } = useFlash();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    defaultGracePeriodDays: 0,
    defaultMinimumHireWeeks: 0,
    defaultInvoiceFrequency: 0,
    defaultInvoiceDay: 7,
    includeWeekends: false,
    excludePublicHolidays: false,
    notifyOnOverdueRentals: false,
    offHireReminderDays: 0,
    notifyOnDraftInvoiceGeneration: false,
    configurationNotes: "",
  });

  useEffect(() => {
    // Fetch config using tenantId from authenticated user
    const tenantId = userProfile?.tenantId || "tenant-1";
    dispatch(fetchRentalConfig(tenantId));
  }, [dispatch, userProfile?.tenantId]);

  useEffect(() => {
    if (config) {
      setFormData({
        defaultGracePeriodDays: config.defaultGracePeriodDays,
        defaultMinimumHireWeeks: config.defaultMinimumHireWeeks,
        defaultInvoiceFrequency: config.defaultInvoiceFrequency,
        defaultInvoiceDay: config.defaultInvoiceDay,
        includeWeekends: config.includeWeekends,
        excludePublicHolidays: config.excludePublicHolidays,
        notifyOnOverdueRentals: config.notifyOnOverdueRentals,
        offHireReminderDays: config.offHireReminderDays,
        notifyOnDraftInvoiceGeneration: config.notifyOnDraftInvoiceGeneration,
        configurationNotes: config.configurationNotes || "",
      });
    }
  }, [config]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (config) {
      setFormData({
        defaultGracePeriodDays: config.defaultGracePeriodDays,
        defaultMinimumHireWeeks: config.defaultMinimumHireWeeks,
        defaultInvoiceFrequency: config.defaultInvoiceFrequency,
        defaultInvoiceDay: config.defaultInvoiceDay,
        includeWeekends: config.includeWeekends,
        excludePublicHolidays: config.excludePublicHolidays,
        notifyOnOverdueRentals: config.notifyOnOverdueRentals,
        offHireReminderDays: config.offHireReminderDays,
        notifyOnDraftInvoiceGeneration: config.notifyOnDraftInvoiceGeneration,
        configurationNotes: config.configurationNotes || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config?.id) return;

    const payload = {
      id: config.id,
      data: formData,
    };

    const result = await dispatch(updateRentalConfig(payload));
    if (result.meta.requestStatus === "fulfilled") {
      setIsEditing(false);
      showSuccess("Rental configuration updated successfully!");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseInt(value) || 0
            : value,
    });
  };

  if (loading) {
    return React.createElement(Loader);
  }

  if (error) {
    return React.createElement("div", { className: "page-content" },
      React.createElement(Container, { fluid: true },
        React.createElement(BreadCrumb, {
          title: "Global Rental Configuration",
          pageTitle: "Settings"
        }),
        React.createElement(Alert, { color: "danger" },
          "Failed to load rental configuration: ", error
        )
      )
    );
  }

  // Handle case when no rental config data is found
  if (!config) {
    return React.createElement("div", { className: "page-content" },
      React.createElement(Container, { fluid: true },
        React.createElement(BreadCrumb, {
          title: "Global Rental Configuration",
          pageTitle: "Settings"
        }),
        React.createElement(Row, { className: "justify-content-center" },
          React.createElement(Col, { xl: 6, lg: 8, md: 10 },
            React.createElement(Card, null,
              React.createElement(CardBody, { className: "text-center" },
                React.createElement("div", { className: "py-5" },
                  React.createElement("i", { className: "ri-settings-3-line ri-2x text-muted mb-3" }),
                  React.createElement("h5", null, "Global Rental Configuration Not Found"),
                  React.createElement("p", { className: "text-muted" },
                    "No rental configuration has been set up yet."
                  ),
                  React.createElement("div", { className: "bg-soft-warning text-warning p-3 rounded mt-4" },
                    React.createElement("i", { className: "ri-error-warning-line ri-lg me-2" }),
                    "Please contact your system administrator to set up the rental configuration."
                  ),
                  React.createElement("p", { className: "text-muted mt-4 mb-0" },
                    "Once configured, you'll be able to manage all rental settings here."
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  return React.createElement("div", { className: "page-content" },
    React.createElement(Container, { fluid: true },
      React.createElement(BreadCrumb, {
        title: "Rental Configuration",
        pageTitle: "Settings"
      }),
      React.createElement(Form, { onSubmit: handleSubmit },
        React.createElement(Row, null,
          React.createElement(Col, { lg: 12 },
            React.createElement(Card, null,
              React.createElement(CardHeader, { className: "d-flex justify-content-between align-items-center" },
                React.createElement("h5", { className: "card-title mb-0" }, "Global Rental Configuration"),
                !isEditing && React.createElement(Button, { color: "primary", onClick: handleEdit },
                  React.createElement("i", { className: "ri-pencil-line align-bottom me-1" }),
                  "Edit Configuration"
                )
              ),
              React.createElement(CardBody, null,
                isEditing ? 
                  // Editing form
                  React.createElement("div", { className: "live-preview" },
                    React.createElement(Row, null,
                      React.createElement(Col, { md: 6 },
                        React.createElement(FormGroup, null,
                          React.createElement(Label, { for: "defaultGracePeriodDays" },
                            "Default Grace Period (Days)"
                          ),
                          React.createElement(Input, {
                            type: "number",
                            className: "form-control",
                            id: "defaultGracePeriodDays",
                            name: "defaultGracePeriodDays",
                            value: formData.defaultGracePeriodDays,
                            onChange: handleInputChange,
                            min: "0"
                          })
                        )
                      ),
                      React.createElement(Col, { md: 6 },
                        React.createElement(FormGroup, null,
                          React.createElement(Label, { for: "defaultMinimumHireWeeks" },
                            "Default Minimum Hire (Weeks)"
                          ),
                          React.createElement(Input, {
                            type: "number",
                            className: "form-control",
                            id: "defaultMinimumHireWeeks",
                            name: "defaultMinimumHireWeeks",
                            value: formData.defaultMinimumHireWeeks,
                            onChange: handleInputChange,
                            min: "0"
                          })
                        )
                      )
                    ),
                    React.createElement(Row, null,
                      React.createElement(Col, { md: 6 },
                        React.createElement(FormGroup, null,
                          React.createElement(Label, { for: "defaultInvoiceFrequency" },
                            "Default Invoice Frequency"
                          ),
                          React.createElement(Input, {
                            type: "select",
                            className: "form-control",
                            id: "defaultInvoiceFrequency",
                            name: "defaultInvoiceFrequency",
                            value: formData.defaultInvoiceFrequency,
                            onChange: handleInputChange
                          },
                            React.createElement("option", { value: "0" }, "Weekly"),
                            React.createElement("option", { value: "1" }, "Fortnightly"),
                            React.createElement("option", { value: "2" }, "Monthly")
                          )
                        )
                      ),
                      React.createElement(Col, { md: 6 },
                        React.createElement(FormGroup, null,
                          React.createElement(Label, { for: "defaultInvoiceDay" },
                            "Default Invoice Day"
                          ),
                          React.createElement(Input, {
                            type: "select",
                            className: "form-control",
                            id: "defaultInvoiceDay",
                            name: "defaultInvoiceDay",
                            value: formData.defaultInvoiceDay,
                            onChange: handleInputChange
                          },
                            React.createElement("option", { value: "1" }, "Monday"),
                            React.createElement("option", { value: "2" }, "Tuesday"),
                            React.createElement("option", { value: "3" }, "Wednesday"),
                            React.createElement("option", { value: "4" }, "Thursday"),
                            React.createElement("option", { value: "5" }, "Friday"),
                            React.createElement("option", { value: "6" }, "Saturday"),
                            React.createElement("option", { value: "7" }, "Sunday")
                          )
                        )
                      )
                    ),
                    React.createElement(Row, null,
                      React.createElement(Col, { md: 6 },
                        React.createElement(FormGroup, null,
                          React.createElement("div", { className: "form-check mb-3" },
                            React.createElement(Input, {
                              className: "form-check-input",
                              type: "checkbox",
                              id: "includeWeekends",
                              name: "includeWeekends",
                              checked: formData.includeWeekends,
                              onChange: handleInputChange
                            }),
                            React.createElement(Label, {
                              className: "form-check-label",
                              for: "includeWeekends"
                            }, "Include Weekends in Calculations")
                          )
                        )
                      ),
                      React.createElement(Col, { md: 6 },
                        React.createElement(FormGroup, null,
                          React.createElement("div", { className: "form-check mb-3" },
                            React.createElement(Input, {
                              className: "form-check-input",
                              type: "checkbox",
                              id: "excludePublicHolidays",
                              name: "excludePublicHolidays",
                              checked: formData.excludePublicHolidays,
                              onChange: handleInputChange
                            }),
                            React.createElement(Label, {
                              className: "form-check-label",
                              for: "excludePublicHolidays"
                            }, "Exclude Public Holidays")
                          )
                        )
                      )
                    ),
                    React.createElement(Row, null,
                      React.createElement(Col, { md: 6 },
                        React.createElement(FormGroup, null,
                          React.createElement("div", { className: "form-check mb-3" },
                            React.createElement(Input, {
                              className: "form-check-input",
                              type: "checkbox",
                              id: "notifyOnOverdueRentals",
                              name: "notifyOnOverdueRentals",
                              checked: formData.notifyOnOverdueRentals,
                              onChange: handleInputChange
                            }),
                            React.createElement(Label, {
                              className: "form-check-label",
                              for: "notifyOnOverdueRentals"
                            }, "Notify on Overdue Rentals")
                          )
                        )
                      ),
                      React.createElement(Col, { md: 6 },
                        React.createElement(FormGroup, null,
                          React.createElement(Label, { for: "offHireReminderDays" },
                            "Off-Hire Reminder (Days)"
                          ),
                          React.createElement(Input, {
                            type: "number",
                            className: "form-control",
                            id: "offHireReminderDays",
                            name: "offHireReminderDays",
                            value: formData.offHireReminderDays,
                            onChange: handleInputChange,
                            min: "0"
                          })
                        )
                      )
                    ),
                    React.createElement(Row, null,
                      React.createElement(Col, { md: 6 },
                        React.createElement(FormGroup, null,
                          React.createElement("div", { className: "form-check mb-3" },
                            React.createElement(Input, {
                              className: "form-check-input",
                              type: "checkbox",
                              id: "notifyOnDraftInvoiceGeneration",
                              name: "notifyOnDraftInvoiceGeneration",
                              checked: formData.notifyOnDraftInvoiceGeneration,
                              onChange: handleInputChange
                            }),
                            React.createElement(Label, {
                              className: "form-check-label",
                              for: "notifyOnDraftInvoiceGeneration"
                            }, "Notify on Draft Invoice Generation")
                          )
                        )
                      )
                    ),
                    React.createElement(Row, null,
                      React.createElement(Col, { md: 12 },
                        React.createElement(FormGroup, null,
                          React.createElement(Label, { for: "configurationNotes" },
                            "Configuration Notes"
                          ),
                          React.createElement(Input, {
                            type: "textarea",
                            className: "form-control",
                            id: "configurationNotes",
                            name: "configurationNotes",
                            value: formData.configurationNotes,
                            onChange: handleInputChange,
                            rows: "3"
                          })
                        )
                      )
                    ),
                    React.createElement("div", { className: "hstack gap-2 justify-content-end" },
                      React.createElement(Button, { type: "button", color: "light", onClick: handleCancel },
                        "Cancel"
                      ),
                      React.createElement(Button, { type: "submit", color: "primary" },
                        "Save Changes"
                      )
                    )
                  ) :
                  // View mode - display current configuration
                  React.createElement("div", { className: "table-responsive" },
                    React.createElement(Table, { className: "table table-bordered table-striped mb-0" },
                      React.createElement("tbody", null,
                        React.createElement("tr", null,
                          React.createElement("td", { className: "fw-bold" }, "Default Grace Period (Days)"),
                          React.createElement("td", null, config.defaultGracePeriodDays)
                        ),
                        React.createElement("tr", null,
                          React.createElement("td", { className: "fw-bold" }, "Default Minimum Hire (Weeks)"),
                          React.createElement("td", null, config.defaultMinimumHireWeeks)
                        ),
                        React.createElement("tr", null,
                          React.createElement("td", { className: "fw-bold" }, "Default Invoice Frequency"),
                          React.createElement("td", null,
                            config.defaultInvoiceFrequency === 0 ? "Weekly" :
                            config.defaultInvoiceFrequency === 1 ? "Fortnightly" : "Monthly"
                          )
                        ),
                        React.createElement("tr", null,
                          React.createElement("td", { className: "fw-bold" }, "Default Invoice Day"),
                          React.createElement("td", null,
                            config.defaultInvoiceDay === 1 ? "Monday" :
                            config.defaultInvoiceDay === 2 ? "Tuesday" :
                            config.defaultInvoiceDay === 3 ? "Wednesday" :
                            config.defaultInvoiceDay === 4 ? "Thursday" :
                            config.defaultInvoiceDay === 5 ? "Friday" :
                            config.defaultInvoiceDay === 6 ? "Saturday" : "Sunday"
                          )
                        ),
                        React.createElement("tr", null,
                          React.createElement("td", { className: "fw-bold" }, "Include Weekends"),
                          React.createElement("td", null,
                            config.includeWeekends ? 
                              React.createElement("span", { className: "badge bg-success" }, "Yes") :
                              React.createElement("span", { className: "badge bg-secondary" }, "No")
                          )
                        ),
                        React.createElement("tr", null,
                          React.createElement("td", { className: "fw-bold" }, "Exclude Public Holidays"),
                          React.createElement("td", null,
                            config.excludePublicHolidays ? 
                              React.createElement("span", { className: "badge bg-success" }, "Yes") :
                              React.createElement("span", { className: "badge bg-secondary" }, "No")
                          )
                        ),
                        React.createElement("tr", null,
                          React.createElement("td", { className: "fw-bold" }, "Notify on Overdue Rentals"),
                          React.createElement("td", null,
                            config.notifyOnOverdueRentals ? 
                              React.createElement("span", { className: "badge bg-success" }, "Yes") :
                              React.createElement("span", { className: "badge bg-secondary" }, "No")
                          )
                        ),
                        React.createElement("tr", null,
                          React.createElement("td", { className: "fw-bold" }, "Off-Hire Reminder (Days)"),
                          React.createElement("td", null, config.offHireReminderDays)
                        ),
                        React.createElement("tr", null,
                          React.createElement("td", { className: "fw-bold" }, "Notify on Draft Invoice Generation"),
                          React.createElement("td", null,
                            config.notifyOnDraftInvoiceGeneration ? 
                              React.createElement("span", { className: "badge bg-success" }, "Yes") :
                              React.createElement("span", { className: "badge bg-secondary" }, "No")
                          )
                        )
                      )
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

export default TenantRentalConfig;