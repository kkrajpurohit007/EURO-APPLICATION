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

const TenantRentalConfig: React.FC = () => {
  document.title = "Tenant Rental Configuration | ESRM";

  const dispatch = useDispatch<any>();
  const { userProfile } = useProfile();
  const config = useSelector(selectRentalConfig);
  const loading = useSelector(selectRentalConfigLoading);
  const error = useSelector(selectRentalConfigError);

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    gracePeriodEnabled: false,
    gracePeriodDays: 0,
    minimumHireEnabled: false,
    minimumHireWeeks: 0,
    includeWeekends: false,
    excludePublicHolidays: false,
    notifyOnOverdue: false,
    offHireReminderDays: 0,
  });

  useEffect(() => {
    // Fetch config using tenantId from authenticated user
    const tenantId = userProfile?.tenantId || "tenant-1";
    dispatch(fetchRentalConfig(tenantId));
  }, [dispatch, userProfile?.tenantId]);

  useEffect(() => {
    if (config) {
      setFormData({
        gracePeriodEnabled: config.gracePeriodEnabled,
        gracePeriodDays: config.gracePeriodDays,
        minimumHireEnabled: config.minimumHireEnabled,
        minimumHireWeeks: config.minimumHireWeeks,
        includeWeekends: config.includeWeekends,
        excludePublicHolidays: config.excludePublicHolidays,
        notifyOnOverdue: config.notifyOnOverdue,
        offHireReminderDays: config.offHireReminderDays,
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
        gracePeriodEnabled: config.gracePeriodEnabled,
        gracePeriodDays: config.gracePeriodDays,
        minimumHireEnabled: config.minimumHireEnabled,
        minimumHireWeeks: config.minimumHireWeeks,
        includeWeekends: config.includeWeekends,
        excludePublicHolidays: config.excludePublicHolidays,
        notifyOnOverdue: config.notifyOnOverdue,
        offHireReminderDays: config.offHireReminderDays,
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
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
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

        {showSuccess && (
          <Alert color="success" className="alert-dismissible fade show">
            <i className="ri-check-line me-2"></i>
            Rental configuration updated successfully!
          </Alert>
        )}

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
                          name="gracePeriodEnabled"
                          id="gracePeriodEnabled"
                          checked={formData.gracePeriodEnabled}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="gracePeriodEnabled" check>
                          Enable Grace Period
                        </Label>
                        <p className="text-muted small mb-0">
                          Allow a grace period before charges apply
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="gracePeriodDays">Grace Period Days</Label>
                        <Input
                          type="number"
                          name="gracePeriodDays"
                          id="gracePeriodDays"
                          value={formData.gracePeriodDays}
                          onChange={handleInputChange}
                          disabled={
                            !isEditing ? true : !formData.gracePeriodEnabled
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
                          name="minimumHireEnabled"
                          id="minimumHireEnabled"
                          checked={formData.minimumHireEnabled}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="minimumHireEnabled" check>
                          Enable Minimum Hire Period
                        </Label>
                        <p className="text-muted small mb-0">
                          Set a minimum rental duration requirement
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="minimumHireWeeks">Minimum Hire Weeks</Label>
                        <Input
                          type="number"
                          name="minimumHireWeeks"
                          id="minimumHireWeeks"
                          value={formData.minimumHireWeeks}
                          onChange={handleInputChange}
                          disabled={
                            !isEditing ? true : !formData.minimumHireEnabled
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
                  <h5 className="card-title mb-0">Notification Settings</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="notifyOnOverdue"
                          id="notifyOnOverdue"
                          checked={formData.notifyOnOverdue}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="notifyOnOverdue" check>
                          Send Notifications for Overdue Rentals
                        </Label>
                        <p className="text-muted small mb-0">
                          Automatically notify when rentals are overdue
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
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
        </Form>
      </Container>
    </div>
  );
};

export default TenantRentalConfig;
