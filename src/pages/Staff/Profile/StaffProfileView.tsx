import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Button,
  Table,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import { createSelector } from "reselect";

const StaffProfileView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  // Mock staff profile data - replace with actual Redux state when available
  const staffProfile = {
    id: 1,
    employeeId: "EMP001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1234567890",
    position: "Senior Developer",
    department: "IT",
    joinDate: "2024-01-15",
    dateOfBirth: "1990-05-20",
    address: "123 Main Street, City, State 12345",
    emergencyContact: "+1234567899",
    emergencyContactName: "Jane Doe",
    status: "Active",
    reportingManager: "Michael Smith",
    employmentType: "Full-time",
    workLocation: "Head Office",
  };

  const handleEdit = () => {
    navigate("/staff/profile/edit");
  };

  document.title = "Staff Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Staff Profile" pageTitle="Staff Management" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Profile Information</h5>
                  <Button color="primary" onClick={handleEdit}>
                    <i className="ri-pencil-fill align-middle me-1"></i>
                    Edit Profile
                  </Button>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={6}>
                      <Card className="border">
                        <CardHeader className="bg-soft-primary">
                          <h6 className="mb-0">Personal Information</h6>
                        </CardHeader>
                        <CardBody>
                          <Table className="table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td
                                  className="fw-medium"
                                  style={{ width: "40%" }}
                                >
                                  Employee ID:
                                </td>
                                <td>{staffProfile.employeeId}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Full Name:</td>
                                <td>
                                  {staffProfile.firstName}{" "}
                                  {staffProfile.lastName}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Date of Birth:</td>
                                <td>{staffProfile.dateOfBirth}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Email:</td>
                                <td>{staffProfile.email}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Phone:</td>
                                <td>{staffProfile.phone}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Address:</td>
                                <td>{staffProfile.address}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col lg={6}>
                      <Card className="border">
                        <CardHeader className="bg-soft-success">
                          <h6 className="mb-0">Employment Details</h6>
                        </CardHeader>
                        <CardBody>
                          <Table className="table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td
                                  className="fw-medium"
                                  style={{ width: "40%" }}
                                >
                                  Position:
                                </td>
                                <td>{staffProfile.position}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Department:</td>
                                <td>{staffProfile.department}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Join Date:</td>
                                <td>{staffProfile.joinDate}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Employment Type:</td>
                                <td>{staffProfile.employmentType}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Work Location:</td>
                                <td>{staffProfile.workLocation}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">
                                  Reporting Manager:
                                </td>
                                <td>{staffProfile.reportingManager}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Status:</td>
                                <td>
                                  <span
                                    className={`badge ${staffProfile.status === "Active"
                                        ? "bg-success-subtle text-success"
                                        : "bg-danger-subtle text-danger"
                                      }`}
                                  >
                                    {staffProfile.status}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={12}>
                      <Card className="border">
                        <CardHeader className="bg-soft-warning">
                          <h6 className="mb-0">Emergency Contact</h6>
                        </CardHeader>
                        <CardBody>
                          <Table className="table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td
                                  className="fw-medium"
                                  style={{ width: "20%" }}
                                >
                                  Contact Name:
                                </td>
                                <td>{staffProfile.emergencyContactName}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Contact Number:</td>
                                <td>{staffProfile.emergencyContact}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default StaffProfileView;
