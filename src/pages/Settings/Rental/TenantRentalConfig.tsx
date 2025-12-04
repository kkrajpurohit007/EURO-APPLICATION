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

const TenantRentalConfig: React.FC = () => {
  document.title = "Tenant Rental Configuration | ESRM";

  const dispatch = useDispatch<any>();
  const { userProfile } = useProfile();
  const config = useSelector(selectRentalConfig);
  const loading = useSelector(selectRentalConfigLoading);
  const error = useSelector(selectRentalConfigError);
  const { showSuccess } = useFlash();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    isGracePeriodEnabled: false,
    defaultGracePeriodDays: 0,
    isMinimumHireEnabled: false,
    defaultMinimumHireWeeks: 0,
    defaultInvoiceFrequency: 1,
    defaultInvoiceDay: 1,
    includeWeekends: false,
    excludePublicHolidays: false,
    notifyOnOverdueRentals: false,
    offHireReminderDays: 0,
    notifyOnDraftInvoiceGeneration: false,
    defaultInvoiceNotes: "",
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
        isGracePeriodEnabled: config.isGracePeriodEnabled,
        defaultGracePeriodDays: config.defaultGracePeriodDays,
        isMinimumHireEnabled: config.isMinimumHireEnabled,
        defaultMinimumHireWeeks: config.defaultMinimumHireWeeks,
        defaultInvoiceFrequency: config.defaultInvoiceFrequency,
        defaultInvoiceDay: config.defaultInvoiceDay,
        includeWeekends: config.includeWeekends,
        excludePublicHolidays: config.excludePublicHolidays,
        notifyOnOverdueRentals: config.notifyOnOverdueRentals,
        offHireReminderDays: config.offHireReminderDays,
        notifyOnDraftInvoiceGeneration: config.notifyOnDraftInvoiceGeneration,
        defaultInvoiceNotes: config.defaultInvoiceNotes || "",
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
        isGracePeriodEnabled: config.isGracePeriodEnabled,
        defaultGracePeriodDays: config.defaultGracePeriodDays,
        isMinimumHireEnabled: config.isMinimumHireEnabled,
        defaultMinimumHireWeeks: config.defaultMinimumHireWeeks,
        defaultInvoiceFrequency: config.defaultInvoiceFrequency,
        defaultInvoiceDay: config.defaultInvoiceDay,
        includeWeekends: config.includeWeekends,
        excludePublicHolidays: config.excludePublicHolidays,
        notifyOnOverdueRentals: config.notifyOnOverdueRentals,
        offHireReminderDays: config.offHireReminderDays,
        notifyOnDraftInvoiceGeneration: config.notifyOnDraftInvoiceGeneration,
        defaultInvoiceNotes: config.defaultInvoiceNotes || "",
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
    return <Loader />;
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Tenant Rental Configuration"
            pageTitle="Settings"
          />
          <Alert color="danger">
            Failed to load rental configuration: {error}
          </Alert>
        </Container>
      </div>
    );
  }

  // Handle case when no rental config data is found
  if (!config) {
    return (
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Tenant Rental Configuration"
            pageTitle="Settings"
          />
          <Row className="justify-content-center">
            <Col xl={6} lg={8} md={10}>
              <Card>
                <CardBody className="text-center">
                  <div className="py-5">
                    <i className="ri-settings-3-line ri-2x text-muted mb-3"></i>
                    <h5>Tenant Rental Configuration Not Found</h5>
                    <p className="text-muted">
                      No rental configuration has been set up for your tenant yet.
                    </p>
                    <div className="bg-soft-warning text-warning p-3 rounded mt-4">
                      <i className="ri-error-warning-line ri-lg me-2"></i>
                      Please contact your system administrator to set up the tenant rental configuration.
                    </div>
                    <p className="text-muted mt-4 mb-0">
                      Once configured, you'll be able to manage all rental settings here.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Tenant Rental Configuration" pageTitle="Settings" />

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Grace Period Settings</h5>
                  {!isEditing ? (
                    <Button color="primary" onClick={handleEdit}>
                      <i className="ri-edit-line align-bottom me-1"></i> Edit
                      Configuration
                    </Button>
                  ) : (
                    <div>
                      <Button
                        color="light"
                        onClick={handleCancel}
                        className="me-2"
                      >
                        Cancel
                      </Button>
                      <Button color="success" type="submit">
                        <i className="ri-save-line align-bottom me-1"></i> Save
                        Changes
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="isGracePeriodEnabled"
                          id="isGracePeriodEnabled"
                          checked={formData.isGracePeriodEnabled}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="isGracePeriodEnabled" check>
                          Enable Grace Period
                        </Label>
                        <p className="text-muted small mb-0">
                          Allow a grace period before charges apply
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="defaultGracePeriodDays">Grace Period Days</Label>
                        <Input
                          type="number"
                          name="defaultGracePeriodDays"
                          id="defaultGracePeriodDays"
                          value={formData.defaultGracePeriodDays}
                          onChange={handleInputChange}
                          disabled={
                            !isEditing ? true : !formData.isGracePeriodEnabled
                          }
                          min="0"
                          max="30"
                        />
                        <p className="text-muted small mb-0">
                          Number of days for grace period
                        </p>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Minimum Hire Settings</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="isMinimumHireEnabled"
                          id="isMinimumHireEnabled"
                          checked={formData.isMinimumHireEnabled}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="isMinimumHireEnabled" check>
                          Enable Minimum Hire Period
                        </Label>
                        <p className="text-muted small mb-0">
                          Set a minimum rental duration requirement
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="defaultMinimumHireWeeks">Minimum Hire Weeks</Label>
                        <Input
                          type="number"
                          name="defaultMinimumHireWeeks"
                          id="defaultMinimumHireWeeks"
                          value={formData.defaultMinimumHireWeeks}
                          onChange={handleInputChange}
                          disabled={
                            !isEditing ? true : !formData.isMinimumHireEnabled
                          }
                          min="0"
                          max="52"
                        />
                        <p className="text-muted small mb-0">
                          Minimum number of weeks for rental
                        </p>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Calendar Settings</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="includeWeekends"
                          id="includeWeekends"
                          checked={formData.includeWeekends}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="includeWeekends" check>
                          Include Weekends in Rental Period
                        </Label>
                        <p className="text-muted small mb-0">
                          Count weekends in rental calculations
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="excludePublicHolidays"
                          id="excludePublicHolidays"
                          checked={formData.excludePublicHolidays}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="excludePublicHolidays" check>
                          Exclude Public Holidays from Billing
                        </Label>
                        <p className="text-muted small mb-0">
                          Do not charge for public holidays
                        </p>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Invoice Settings</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="defaultInvoiceFrequency">Invoice Frequency</Label>
                        <Input
                          type="select"
                          name="defaultInvoiceFrequency"
                          id="defaultInvoiceFrequency"
                          value={formData.defaultInvoiceFrequency}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        >
                          <option value={1}>Weekly</option>
                          <option value={2}>Fortnightly</option>
                          <option value={3}>Monthly</option>
                        </Input>
                        <p className="text-muted small mb-0">
                          How often invoices are generated
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="defaultInvoiceDay">Invoice Day</Label>
                        <Input
                          type="select"
                          name="defaultInvoiceDay"
                          id="defaultInvoiceDay"
                          value={formData.defaultInvoiceDay}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        >
                          <option value={1}>Monday</option>
                          <option value={2}>Tuesday</option>
                          <option value={3}>Wednesday</option>
                          <option value={4}>Thursday</option>
                          <option value={5}>Friday</option>
                          <option value={6}>Saturday</option>
                          <option value={7}>Sunday</option>
                        </Input>
                        <p className="text-muted small mb-0">
                          Day of the week for invoice generation
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="defaultInvoiceNotes">Default Invoice Notes</Label>
                        <Input
                          type="textarea"
                          name="defaultInvoiceNotes"
                          id="defaultInvoiceNotes"
                          value={formData.defaultInvoiceNotes}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows={3}
                          placeholder="Enter default notes to appear on invoices..."
                        />
                        <p className="text-muted small mb-0">
                          These notes will appear on all generated invoices
                        </p>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Notification Settings</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="notifyOnOverdueRentals"
                          id="notifyOnOverdueRentals"
                          checked={formData.notifyOnOverdueRentals}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="notifyOnOverdueRentals" check>
                          Send Notifications for Overdue Rentals
                        </Label>
                        <p className="text-muted small mb-0">
                          Automatically notify when rentals are overdue
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="notifyOnDraftInvoiceGeneration"
                          id="notifyOnDraftInvoiceGeneration"
                          checked={formData.notifyOnDraftInvoiceGeneration}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="notifyOnDraftInvoiceGeneration" check>
                          Notify on Draft Invoice Generation
                        </Label>
                        <p className="text-muted small mb-0">
                          Send notifications when draft invoices are created
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="offHireReminderDays">
                          Off-Hire Reminder Days
                        </Label>
                        <Input
                          type="number"
                          name="offHireReminderDays"
                          id="offHireReminderDays"
                          value={formData.offHireReminderDays}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          min="0"
                          max="30"
                        />
                        <p className="text-muted small mb-0">
                          Days before off-hire to send reminder
                        </p>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Configuration Notes</h5>
                </CardHeader>
                <CardBody>
                  <FormGroup>
                    <Label for="configurationNotes">Notes</Label>
                    <Input
                      type="textarea"
                      name="configurationNotes"
                      id="configurationNotes"
                      value={formData.configurationNotes}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Enter any additional configuration notes or instructions..."
                    />
                    <p className="text-muted small mb-0">
                      Internal notes about this rental configuration
                    </p>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default TenantRentalConfig;
