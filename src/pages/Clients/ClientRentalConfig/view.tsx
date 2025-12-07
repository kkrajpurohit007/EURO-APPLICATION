import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Label,
  Input,
  FormFeedback,
  Button,
  Alert,
  Spinner,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getClientRentalConfigByClientId,
  updateClientRentalConfig,
} from "../../../slices/clientRentalConfig/thunk";

interface ClientRentalConfigSectionProps {
  clientId: string;
  mode: "view" | "edit";
  onSave?: () => void;
}

const ClientRentalConfigSection: React.FC<ClientRentalConfigSectionProps> = ({
  clientId,
  mode,
  onSave,
}) => {
  const dispatch = useDispatch<any>();
  
  const selectLayoutState = (state: any) => state.ClientRentalConfig;
  const selectConfigProperties = createSelector(selectLayoutState, (state) => ({
    config: state.config,
    loading: state.loading,
    error: state.error,
  }));

  const { config, loading, error } = useSelector(selectConfigProperties);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (clientId) {
      dispatch(getClientRentalConfigByClientId(Number(clientId)));
    }
  }, [dispatch, clientId]);

  const validationSchema = Yup.object({
    reason: Yup.string().required("Reason is required"),
    effectiveFrom: Yup.date().required("Effective from date is required"),
    approvedByUserId: Yup.string().required("Approved by user is required"),
  });

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      overrideGracePeriodDays: null,
      overrideMinimumHireWeeks: null,
      overrideInvoiceFrequency: null,
      overrideInvoiceDay: null,
      overrideIncludeWeekends: false,
      overrideExcludePublicHolidays: false,
      reason: "",
      effectiveFrom: "",
      effectiveTo: "",
      approvedByUserId: "",
      approvedDate: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const submitData = {
        ...values,
        clientId: Number(clientId),
        tenantId: 0,
      };
      
      dispatch(updateClientRentalConfig(submitData));
      setIsEditing(false);
      if (onSave) onSave();
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    validation.resetForm();
  };

  const renderReadOnlyField = (label: string, value: any) => (
    <div className="mb-3">
      <Label className="form-label fw-medium">{label}</Label>
      <Input
        type="text"
        readOnly
        value={String(value || "-")}
        className="form-control-plaintext bg-light px-3 py-2 rounded"
      />
    </div>
  );

  const renderEditableField = (
    name: string,
    label: string,
    type: "text" | "email" | "number" | "date" | "textarea" = "text",
    required: boolean = false
  ) => {
    const value = (validation.values as any)[name];
    const error = (validation.errors as any)[name];
    const touched = (validation.touched as any)[name];
    
    return (
      <div className="mb-3">
        <Label className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </Label>
        <Input
          type={type}
          name={name}
          value={String(value ?? "")}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          invalid={!!(touched && error)}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        {touched && error && (
          <FormFeedback type="invalid">{String(error)}</FormFeedback>
        )}
      </div>
    );
  };

  const renderOverrideToggle = (
    fieldName: string,
    label: string,
    inputLabel: string,
    required: boolean = false
  ) => {
    const fieldValue = (validation.values as any)[fieldName];
    const error = (validation.errors as any)[fieldName];
    const touched = (validation.touched as any)[fieldName];
    
    return (
      <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
        <Row className="g-3">
          <Col md={6}>
            <div className="form-check form-switch form-switch-lg">
              <Input
                type="switch"
                className="form-check-input"
                id={`${fieldName}_toggle`}
                name={fieldName}
                checked={fieldValue !== null}
                onChange={(e) => {
                  if (e.target.checked) {
                    validation.setFieldValue(fieldName, 0);
                  } else {
                    validation.setFieldValue(fieldName, null);
                  }
                }}
                disabled={mode === "view" && !isEditing}
              />
              <Label className="form-check-label" htmlFor={`${fieldName}_toggle`}>
                {label}
              </Label>
            </div>
          </Col>
          <Col md={6}>
            <Label className="form-label">
              {inputLabel} {required && <span className="text-danger">*</span>}
            </Label>
            <Input
              type="number"
              name={fieldName}
              value={String(fieldValue ?? "")}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              invalid={!!(touched && error)}
              disabled={(mode === "view" && !isEditing) || fieldValue === null}
              placeholder={`Enter ${inputLabel.toLowerCase()}`}
            />
            {touched && error && (
              <FormFeedback type="invalid">{String(error)}</FormFeedback>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  const renderYesNoToggle = (
    fieldName: string,
    label: string
  ) => {
    const fieldValue = (validation.values as any)[fieldName];
    
    return (
      <div className="form-check form-switch form-switch-lg">
        <Input
          type="switch"
          className="form-check-input"
          id={fieldName}
          name={fieldName}
          checked={fieldValue}
          onChange={validation.handleChange}
          disabled={mode === "view" && !isEditing}
        />
        <Label className="form-check-label" htmlFor={fieldName}>
          {fieldValue ? "Yes" : "No"}
        </Label>
      </div>
    );
  };

  // Determine if we're in view mode or edit mode
  const isViewMode = mode === "view";
  const showEditControls = isViewMode && !isEditing;

  if (loading && !config) {
    return (
      <Card>
        <CardHeader>
          <h5 className="card-title mb-0">Rental Configuration</h5>
        </CardHeader>
        <CardBody>
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-2">Loading rental configuration...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error && !config) {
    return (
      <Card>
        <CardHeader>
          <h5 className="card-title mb-0">Rental Configuration</h5>
        </CardHeader>
        <CardBody>
          <Alert color="danger">
            <i className="ri-error-warning-line me-2"></i>
            Error loading rental configuration
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Rental Configuration</h5>
        {showEditControls && config && (
          <Button color="primary" size="sm" onClick={handleEdit}>
            <i className="ri-pencil-line align-bottom me-1"></i>
            Edit
          </Button>
        )}
        {showEditControls && !config && (
          <Button color="success" size="sm" onClick={handleEdit}>
            <i className="ri-add-line align-bottom me-1"></i>
            Create
          </Button>
        )}
      </CardHeader>
      <CardBody>
        {(!config && !isEditing) ? (
          <div className="text-center py-5">
            <i className="ri-file-list-3-line ri-2x text-muted mb-3"></i>
            <h6 className="text-muted">No rental configuration found</h6>
            <p className="text-muted mb-0">
              No rental configuration has been set up for this client yet.
            </p>
            {mode === "view" && (
              <Button color="primary" className="mt-3" onClick={handleEdit}>
                <i className="ri-add-line align-bottom me-1"></i>
                Create Rental Configuration
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
          }}>
            {/* Rental Override Section */}
            <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
              <h5 className="mb-3 text-primary">Rental Override</h5>
              
              {renderOverrideToggle(
                "overrideGracePeriodDays",
                "Override Grace Period",
                "Grace Period Days"
              )}
              
              {renderOverrideToggle(
                "overrideMinimumHireWeeks",
                "Override Minimum Hire",
                "Minimum Hire Weeks"
              )}
              
              {renderOverrideToggle(
                "overrideInvoiceFrequency",
                "Override Invoice Frequency",
                "Invoice Frequency"
              )}
              
              {renderOverrideToggle(
                "overrideInvoiceDay",
                "Override Invoice Day",
                "Invoice Day"
              )}
            </div>

            {/* Rental Rules Section */}
            <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
              <h5 className="mb-3 text-primary">Rental Rules</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Label className="form-label">Include Weekends</Label>
                  {isViewMode && !isEditing ? (
                    <Input
                      type="text"
                      readOnly
                      value={validation.values.overrideIncludeWeekends ? "Yes" : "No"}
                      className="form-control-plaintext bg-light px-3 py-2 rounded"
                    />
                  ) : (
                    renderYesNoToggle("overrideIncludeWeekends", "Include Weekends")
                  )}
                </Col>
                <Col md={6}>
                  <Label className="form-label">Exclude Public Holidays</Label>
                  {isViewMode && !isEditing ? (
                    <Input
                      type="text"
                      readOnly
                      value={validation.values.overrideExcludePublicHolidays ? "Yes" : "No"}
                      className="form-control-plaintext bg-light px-3 py-2 rounded"
                    />
                  ) : (
                    renderYesNoToggle("overrideExcludePublicHolidays", "Exclude Public Holidays")
                  )}
                </Col>
              </Row>
            </div>

            {/* Validity Period Section */}
            <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
              <h5 className="mb-3 text-primary">Validity Period</h5>
              <Row className="g-3">
                <Col md={6}>
                  {isViewMode && !isEditing ? (
                    renderReadOnlyField("Effective From", validation.values.effectiveFrom)
                  ) : (
                    renderEditableField("effectiveFrom", "Effective From", "date", true)
                  )}
                </Col>
                <Col md={6}>
                  {isViewMode && !isEditing ? (
                    renderReadOnlyField("Effective To", validation.values.effectiveTo)
                  ) : (
                    renderEditableField("effectiveTo", "Effective To", "date")
                  )}
                </Col>
              </Row>
            </div>

            {/* Approval Details Section */}
            <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
              <h5 className="mb-3 text-primary">Approval Details</h5>
              <Row className="g-3">
                <Col md={6}>
                  {isViewMode && !isEditing ? (
                    renderReadOnlyField("Approved By User ID", validation.values.approvedByUserId)
                  ) : (
                    renderEditableField("approvedByUserId", "Approved By User ID", "text", true)
                  )}
                </Col>
                <Col md={6}>
                  {isViewMode && !isEditing ? (
                    renderReadOnlyField("Approved Date", validation.values.approvedDate)
                  ) : (
                    renderEditableField("approvedDate", "Approved Date", "date")
                  )}
                </Col>
                <Col md={12}>
                  {isViewMode && !isEditing ? (
                    <div className="mb-3">
                      <Label className="form-label fw-medium">Reason</Label>
                      <Input
                        type="textarea"
                        readOnly
                        rows={3}
                        value={validation.values.reason || "-"}
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </div>
                  ) : (
                    <div className="mb-3">
                      <Label className="form-label">
                        Reason <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="textarea"
                        name="reason"
                        rows={3}
                        value={validation.values.reason}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={!!(validation.touched.reason && validation.errors.reason)}
                        placeholder="Enter reason for rental configuration"
                      />
                      {validation.touched.reason && validation.errors.reason && (
                        <FormFeedback type="invalid">{String(validation.errors.reason)}</FormFeedback>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
            </div>

            {/* Action Buttons for Edit Mode */}
            {(isEditing || mode === "edit") && (
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button type="button" color="light" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  {config ? "Update" : "Create"} Rental Configuration
                </Button>
              </div>
            )}
          </form>
        )}
      </CardBody>
    </Card>
  );
};

export default ClientRentalConfigSection;