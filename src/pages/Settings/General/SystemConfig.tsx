import React, { useState } from "react";
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
import { PAGE_TITLES } from "../../../common/branding";

interface SystemConfigData {
  appName: string;
  appVersion: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  backupFrequency: string;
  dataRetentionDays: number;
  apiRateLimit: number;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
}

const SystemConfig: React.FC = () => {
  document.title = PAGE_TITLES.SETTINGS_SYSTEM_CONFIG;

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [config, setConfig] = useState<SystemConfigData>({
    appName: "Euro Scaffolds",
    appVersion: "1.0.0",
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    backupFrequency: "Daily",
    dataRetentionDays: 365,
    apiRateLimit: 1000,
    allowRegistration: true,
    requireEmailVerification: true,
  });

  const [formData, setFormData] = useState<SystemConfigData>(config);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(config);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(config);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(formData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseInt(value)
            : value,
    });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="System Configuration" pageTitle="Settings" />

        {showSuccess && (
          <Alert color="success" className="alert-dismissible fade show">
            <i className="ri-check-line me-2"></i>
            System configuration updated successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">General Settings</h5>
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
                      <FormGroup>
                        <Label for="appName">Application Name</Label>
                        <Input
                          type="text"
                          name="appName"
                          id="appName"
                          value={formData.appName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="appVersion">Application Version</Label>
                        <Input
                          type="text"
                          name="appVersion"
                          id="appVersion"
                          value={formData.appVersion}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="maxLoginAttempts">Max Login Attempts</Label>
                        <Input
                          type="number"
                          name="maxLoginAttempts"
                          id="maxLoginAttempts"
                          value={formData.maxLoginAttempts}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          min="1"
                          max="10"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="sessionTimeout">
                          Session Timeout (minutes)
                        </Label>
                        <Input
                          type="number"
                          name="sessionTimeout"
                          id="sessionTimeout"
                          value={formData.sessionTimeout}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          min="5"
                          max="120"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="backupFrequency">Backup Frequency</Label>
                        <Input
                          type="select"
                          name="backupFrequency"
                          id="backupFrequency"
                          value={formData.backupFrequency}
                          onChange={handleInputChange as any}
                          disabled={!isEditing}
                        >
                          <option value="Hourly">Hourly</option>
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="dataRetentionDays">
                          Data Retention (days)
                        </Label>
                        <Input
                          type="number"
                          name="dataRetentionDays"
                          id="dataRetentionDays"
                          value={formData.dataRetentionDays}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          min="30"
                          max="3650"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="apiRateLimit">
                          API Rate Limit (requests/hour)
                        </Label>
                        <Input
                          type="number"
                          name="apiRateLimit"
                          id="apiRateLimit"
                          value={formData.apiRateLimit}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          min="100"
                          max="10000"
                        />
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
                  <h5 className="card-title mb-0">Feature Toggles</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="maintenanceMode"
                          id="maintenanceMode"
                          checked={formData.maintenanceMode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="maintenanceMode" check>
                          Maintenance Mode
                        </Label>
                        <p className="text-muted small mb-0">
                          Enable to put the application in maintenance mode
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="emailNotifications"
                          id="emailNotifications"
                          checked={formData.emailNotifications}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="emailNotifications" check>
                          Email Notifications
                        </Label>
                        <p className="text-muted small mb-0">
                          Enable email notifications for users
                        </p>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="smsNotifications"
                          id="smsNotifications"
                          checked={formData.smsNotifications}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="smsNotifications" check>
                          SMS Notifications
                        </Label>
                        <p className="text-muted small mb-0">
                          Enable SMS notifications for users
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="allowRegistration"
                          id="allowRegistration"
                          checked={formData.allowRegistration}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="allowRegistration" check>
                          Allow User Registration
                        </Label>
                        <p className="text-muted small mb-0">
                          Allow new users to register
                        </p>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup check className="mb-3">
                        <Input
                          type="checkbox"
                          name="requireEmailVerification"
                          id="requireEmailVerification"
                          checked={formData.requireEmailVerification}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <Label for="requireEmailVerification" check>
                          Require Email Verification
                        </Label>
                        <p className="text-muted small mb-0">
                          Require users to verify email before login
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

export default SystemConfig;
