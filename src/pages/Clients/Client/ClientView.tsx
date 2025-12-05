import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  Label,
  Input,
  Alert,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { selectClientById } from "../../../slices/clients/client.slice";

import { PAGE_TITLES } from "../../../common/branding";

const ClientView: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_VIEW;
  const { id } = useParams();
  const navigate = useNavigate();
  const client = useSelector((state: any) => selectClientById(state, id || ""));
  
  const [activeTab, setActiveTab] = useState("1");

  if (!client) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Client not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="View Client" pageTitle="Clients" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">View Client Details</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/clients/list")}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate(`/clients/edit/${id}`)}
                  >
                    <i className="ri-pencil-line align-bottom me-1"></i>
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <Nav tabs className="nav-tabs-custom rounded">
                    <NavItem>
                      <NavLink
                        className={activeTab === "1" ? "active" : ""}
                        onClick={() => setActiveTab("1")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ri-information-line me-2"></i>
                        Client Info
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "2" ? "active" : ""}
                        onClick={() => setActiveTab("2")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ri-contacts-line me-2"></i>
                        Client Contacts
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "3" ? "active" : ""}
                        onClick={() => setActiveTab("3")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ri-settings-3-line me-2"></i>
                        Client Rental Configuration
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>

                <TabContent activeTab={activeTab} className="p-3 text-muted">
                  <TabPane tabId="1">
                    <Form>
                      {/* Section A: Client Info */}
                      <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                        <h5 className="mb-3">Client Info</h5>
                        <Row className="g-3">
                          <Col md={6}>
                            <Label className="form-label">Client Name</Label>
                            <Input
                              name="name"
                              value={client.name || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">Registered Number</Label>
                            <Input
                              name="registeredNumber"
                              value={client.registeredNumber || client.ein || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">GST Number</Label>
                            <Input
                              name="gstNumber"
                              value={client.gstNumber || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">Priority Customer</Label>
                            <Input
                              name="isPriority"
                              value={client.isPriority ? "Yes" : "No"}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          {client.isPriority && (
                            <Col md={12}>
                              <Label className="form-label">Priority Reason</Label>
                              <Input
                                name="priorityReason"
                                value={client.priorityReason || ""}
                                readOnly
                                plaintext
                                className="form-control-plaintext bg-light px-3 py-2 rounded"
                              />
                            </Col>
                          )}
                        </Row>
                      </div>

                      {/* Section B: Address */}
                      <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                        <h5 className="mb-3">Address</h5>
                        <Row className="g-3">
                          <Col md={12}>
                            <Label className="form-label">Address Line 1</Label>
                            <Input
                              name="address1"
                              value={client.address1 || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={12}>
                            <Label className="form-label">Address Line 2</Label>
                            <Input
                              name="address2"
                              value={client.address2 || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">Country</Label>
                            <Input
                              name="countryName"
                              value={client.countryName || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">Zip Code</Label>
                            <Input
                              name="zipcode"
                              value={client.zipcode || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                        </Row>
                      </div>

                      {/* Section C: Manager Details */}
                      <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                        <h5 className="mb-3">Manager Details</h5>
                        <Row className="g-3">
                          <Col md={6}>
                            <Label className="form-label">First Name</Label>
                            <Input
                              name="managerFirstName"
                              value={client.managerFirstName || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">Last Name</Label>
                            <Input
                              name="managerLastName"
                              value={client.managerLastName || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={12}>
                            <Label className="form-label">Email</Label>
                            <Input
                              type="email"
                              name="managerEmailId"
                              value={client.managerEmailId || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  </TabPane>
                  
                  <TabPane tabId="2">
                    <div className="text-center py-5">
                      <i className="ri-contacts-line ri-2x text-muted mb-3"></i>
                      <h5 className="text-muted">Client Contacts</h5>
                      <p className="text-muted mb-4">
                        Manage client contacts and communication preferences.
                      </p>
                      <Link to={`/clients/contacts?clientId=${id}`} className="btn btn-primary">
                        <i className="ri-arrow-right-line align-bottom me-1"></i>
                        View Client Contacts
                      </Link>
                    </div>
                  </TabPane>
                  
                  <TabPane tabId="3">
                    <div className="text-center py-5">
                      <i className="ri-settings-3-line ri-2x text-muted mb-3"></i>
                      <h5 className="text-muted">Client Rental Configuration</h5>
                      <p className="text-muted mb-4">
                        Configure client-specific rental settings and overrides.
                      </p>
                      <Link to={`/clients/${id}/rental-config`} className="btn btn-primary">
                        <i className="ri-arrow-right-line align-bottom me-1"></i>
                        Configure Rental Settings
                      </Link>
                    </div>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ClientView;