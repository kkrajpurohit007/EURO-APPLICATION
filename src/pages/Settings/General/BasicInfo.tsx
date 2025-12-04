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

interface BasicInfoData {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyCountry: string;
  companyZipCode: string;
  companyWebsite: string;
  companyRegistration: string;
  taxId: string;
  industry: string;
  foundedYear: string;
  employeeCount: string;
}

const BasicInfo: React.FC = () => {
  document.title = PAGE_TITLES.SETTINGS_BASIC_INFO;

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    companyName: "Euro Scaffolds",
    companyEmail: "info@euroscaffolds.com",
    companyPhone: "+44 20 1234 5678",
    companyAddress: "123 Construction Lane",
    companyCity: "London",
    companyState: "Greater London",
    companyCountry: "United Kingdom",
    companyZipCode: "SW1A 1AA",
    companyWebsite: "https://euroscaffolds.com",
    companyRegistration: "12345678",
    taxId: "GB123456789",
    industry: "Construction",
    foundedYear: "2010",
    employeeCount: "50-100",
  });

  const [formData, setFormData] = useState<BasicInfoData>(basicInfo);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(basicInfo);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(basicInfo);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBasicInfo(formData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Basic Information" pageTitle="Settings" />

        {showSuccess && (
          <Alert color="success" className="alert-dismissible fade show">
            <i className="ri-check-line me-2"></i>
            Basic information updated successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Company Information</h5>
                  {!isEditing ? (
                    <Button color="primary" onClick={handleEdit}>
                      <i className="ri-edit-line align-bottom me-1"></i> Edit
                      Information
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
                        <Label for="companyName">Company Name *</Label>
                        <Input
                          type="text"
                          name="companyName"
                          id="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="companyEmail">Company Email *</Label>
                        <Input
                          type="email"
                          name="companyEmail"
                          id="companyEmail"
                          value={formData.companyEmail}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="companyPhone">Company Phone *</Label>
                        <Input
                          type="text"
                          name="companyPhone"
                          id="companyPhone"
                          value={formData.companyPhone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="companyWebsite">Company Website</Label>
                        <Input
                          type="text"
                          name="companyWebsite"
                          id="companyWebsite"
                          value={formData.companyWebsite}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label for="companyAddress">Company Address *</Label>
                    <Input
                      type="text"
                      name="companyAddress"
                      id="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </FormGroup>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="companyCity">City *</Label>
                        <Input
                          type="text"
                          name="companyCity"
                          id="companyCity"
                          value={formData.companyCity}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="companyState">State/Province *</Label>
                        <Input
                          type="text"
                          name="companyState"
                          id="companyState"
                          value={formData.companyState}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="companyCountry">Country *</Label>
                        <Input
                          type="text"
                          name="companyCountry"
                          id="companyCountry"
                          value={formData.companyCountry}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="companyZipCode">Zip/Postal Code *</Label>
                        <Input
                          type="text"
                          name="companyZipCode"
                          id="companyZipCode"
                          value={formData.companyZipCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
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
                  <h5 className="card-title mb-0">Business Details</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="companyRegistration">
                          Registration Number
                        </Label>
                        <Input
                          type="text"
                          name="companyRegistration"
                          id="companyRegistration"
                          value={formData.companyRegistration}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="taxId">Tax ID</Label>
                        <Input
                          type="text"
                          name="taxId"
                          id="taxId"
                          value={formData.taxId}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="industry">Industry</Label>
                        <Input
                          type="select"
                          name="industry"
                          id="industry"
                          value={formData.industry}
                          onChange={handleInputChange as any}
                          disabled={!isEditing}
                        >
                          <option value="Technology">Technology</option>
                          <option value="Finance">Finance</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Retail">Retail</option>
                          <option value="Services">Services</option>
                          <option value="Other">Other</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="foundedYear">Founded Year</Label>
                        <Input
                          type="text"
                          name="foundedYear"
                          id="foundedYear"
                          value={formData.foundedYear}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="YYYY"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="employeeCount">Employee Count</Label>
                        <Input
                          type="select"
                          name="employeeCount"
                          id="employeeCount"
                          value={formData.employeeCount}
                          onChange={handleInputChange as any}
                          disabled={!isEditing}
                        >
                          <option value="1-10">1-10</option>
                          <option value="11-50">11-50</option>
                          <option value="50-100">50-100</option>
                          <option value="101-500">101-500</option>
                          <option value="500+">500+</option>
                        </Input>
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

export default BasicInfo;
