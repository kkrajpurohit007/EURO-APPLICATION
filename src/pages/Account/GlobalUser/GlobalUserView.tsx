import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
  Badge,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { selectGlobalUserById } from "../../../slices/globalUsers/globalUser.slice";
import { PAGE_TITLES } from "../../../common/branding";

const GlobalUserView: React.FC = () => {
  document.title = PAGE_TITLES.GLOBAL_USER_VIEW;
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: any) =>
    selectGlobalUserById(state, id || "")
  );

  if (!user) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Global User not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="View Global User" pageTitle="Global Users" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">View Global User Details</h5>
                <div className="d-flex gap-2">
                  <Button
                    color="light"
                    onClick={() => navigate("/account/global-users")}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate(`/account/global-users/edit/${id}`)}
                  >
                    <i className="ri-pencil-line align-bottom me-1"></i>
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  {/* Section A: Personal Info */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Personal Info</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">First Name</Label>
                        <Input
                          name="firstName"
                          value={user.firstName || ""}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Last Name</Label>
                        <Input
                          name="lastName"
                          value={user.lastName || ""}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Username</Label>
                        <Input
                          name="username"
                          value={user.username || ""}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Email</Label>
                        <Input
                          type="email"
                          name="email"
                          value={user.email || ""}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Mobile Number</Label>
                        <Input
                          name="mobileNumber"
                          value={user.mobileNumber || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Date of Birth</Label>
                        <Input
                          name="dateOfBirth"
                          value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Section B: Access & Role Info */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Access & Role Info</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">Profile Name</Label>
                        <Input
                          name="profileName"
                          value={user.profileName || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Role Name</Label>
                        <Input
                          name="roleName"
                          value={user.roleName || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Department</Label>
                        <Input
                          name="departmentName"
                          value={user.departmentName || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Access Scope</Label>
                        <Input
                          name="accessScope"
                          value={user.accessScope || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Section C: Status Flags */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Status Flags</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">Email Verified</Label>
                        <div className="mt-2">
                          {user.emailVerified ? (
                            <Badge color="success" className="badge-label">
                              <i className="mdi mdi-circle-medium"></i> Verified
                            </Badge>
                          ) : (
                            <Badge color="secondary" className="badge-label">
                              <i className="mdi mdi-circle-medium"></i> Not Verified
                            </Badge>
                          )}
                        </div>
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Initial Setup Done</Label>
                        <div className="mt-2">
                          {user.initialSetupDone ? (
                            <Badge color="success" className="badge-label">
                              <i className="mdi mdi-circle-medium"></i> Done
                            </Badge>
                          ) : (
                            <Badge color="warning" className="badge-label">
                              <i className="mdi mdi-circle-medium"></i> Pending
                            </Badge>
                          )}
                        </div>
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Status</Label>
                        <div className="mt-2">
                          {user.disabled ? (
                            <Badge color="danger" className="badge-label">
                              <i className="mdi mdi-circle-medium"></i> Disabled
                            </Badge>
                          ) : (
                            <Badge color="success" className="badge-label">
                              <i className="mdi mdi-circle-medium"></i> Active
                            </Badge>
                          )}
                        </div>
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">App User Code</Label>
                        <Input
                          name="appUserCode"
                          value={user.appUserCode || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default GlobalUserView;

