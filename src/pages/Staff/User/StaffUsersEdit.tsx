import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
  Spinner,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useFlash } from "../../../hooks/useFlash";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";

const StaffUsersEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess } = useFlash();
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, fetch from API
  const mockStaffUsers = [
    {
      id: 1,
      employeeId: "EMP001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@company.com",
      phone: "+1234567890",
      position: "Admin",
      department: "Administration",
      status: "Active",
    },
    {
      id: 2,
      employeeId: "EMP002",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@company.com",
      phone: "+1234567891",
      position: "Field Worker",
      department: "Operations",
      status: "Active",
    },
  ];

  const staffUser = mockStaffUsers.find((u) => u.id === Number(id));

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);

  const statusOptions = [
    {
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "On Leave", value: "On Leave" },
      ],
    },
  ];

  const departmentOptions = [
    {
      options: [
        { label: "Administration", value: "Administration" },
        { label: "Operations", value: "Operations" },
        { label: "Sales & Marketing", value: "Sales & Marketing" },
        { label: "IT", value: "IT" },
        { label: "HR", value: "HR" },
      ],
    },
  ];

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (staffUser && staffUser.id) || "",
      employeeId: (staffUser && staffUser.employeeId) || "",
      firstName: (staffUser && staffUser.firstName) || "",
      lastName: (staffUser && staffUser.lastName) || "",
      email: (staffUser && staffUser.email) || "",
      phone: (staffUser && staffUser.phone) || "",
      position: (staffUser && staffUser.position) || "",
      department: (staffUser && staffUser.department) || "",
      status: (staffUser && staffUser.status) || "Active",
    },
    validationSchema: Yup.object({
      employeeId: Yup.string().required("Please enter employee ID"),
      firstName: Yup.string().required("Please enter first name"),
      lastName: Yup.string().required("Please enter last name"),
      email: Yup.string()
        .email("Please enter valid email")
        .required("Please enter email"),
      phone: Yup.string().required("Please enter phone number"),
      position: Yup.string().required("Please enter position"),
      department: Yup.string().required("Please select department"),
      status: Yup.string().required("Please select status"),
    }),
    onSubmit: (values) => {
      console.log("Staff User Updated:", values);
      showSuccess("Staff user updated successfully");
      setTimeout(() => {
        navigate("/staff/users");
      }, 1000);
    },
  });

  const handleCancel = () => {
    navigate("/staff/users");
  };

  document.title =
    "Edit Staff User | Velzon - React Admin & Dashboard Template";

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="py-4 text-center">
            <Spinner color="primary" />
            <div className="mt-2">Loading staff user...</div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Edit Staff User" pageTitle="Staff Users" />
          <Row>
            <Col lg={12}>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">Edit Staff User</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="employeeId">
                            Employee ID <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="employeeId"
                            placeholder="Enter employee ID"
                            name="employeeId"
                            value={validation.values.employeeId || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.employeeId &&
                                validation.touched.employeeId
                                ? true
                                : false
                            }
                          />
                          {validation.errors.employeeId &&
                            validation.touched.employeeId ? (
                            <FormFeedback type="invalid">
                              {validation.errors.employeeId}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="email">
                            Email <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            name="email"
                            value={validation.values.email || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.email &&
                                validation.touched.email
                                ? true
                                : false
                            }
                          />
                          {validation.errors.email &&
                            validation.touched.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="firstName">
                            First Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="Enter first name"
                            name="firstName"
                            value={validation.values.firstName || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.firstName &&
                                validation.touched.firstName
                                ? true
                                : false
                            }
                          />
                          {validation.errors.firstName &&
                            validation.touched.firstName ? (
                            <FormFeedback type="invalid">
                              {validation.errors.firstName}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="lastName">
                            Last Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Enter last name"
                            name="lastName"
                            value={validation.values.lastName || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.lastName &&
                                validation.touched.lastName
                                ? true
                                : false
                            }
                          />
                          {validation.errors.lastName &&
                            validation.touched.lastName ? (
                            <FormFeedback type="invalid">
                              {validation.errors.lastName}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="phone">
                            Phone <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="phone"
                            placeholder="Enter phone number"
                            name="phone"
                            value={validation.values.phone || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.phone &&
                                validation.touched.phone
                                ? true
                                : false
                            }
                          />
                          {validation.errors.phone &&
                            validation.touched.phone ? (
                            <FormFeedback type="invalid">
                              {validation.errors.phone}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="position">
                            Position <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="position"
                            placeholder="Enter position"
                            name="position"
                            value={validation.values.position || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.position &&
                                validation.touched.position
                                ? true
                                : false
                            }
                          />
                          {validation.errors.position &&
                            validation.touched.position ? (
                            <FormFeedback type="invalid">
                              {validation.errors.position}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="department">
                            Department <span className="text-danger">*</span>
                          </Label>
                          <Select
                            value={
                              departmentOptions[0]?.options.find(
                                (option: any) =>
                                  option.value === validation.values.department
                              ) || null
                            }
                            onChange={(selectedOption: any) => {
                              validation.setFieldValue(
                                "department",
                                selectedOption?.value || ""
                              );
                            }}
                            options={departmentOptions}
                            name="department"
                            placeholder="Select department"
                            classNamePrefix="select2-selection form-select"
                          />
                          {validation.errors.department &&
                            validation.touched.department ? (
                            <div className="invalid-feedback d-block">
                              {validation.errors.department}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="status">
                            Status <span className="text-danger">*</span>
                          </Label>
                          <Select
                            value={statusOptions[0].options.find(
                              (option: any) =>
                                option.value === validation.values.status
                            )}
                            onChange={(selectedOption: any) => {
                              validation.setFieldValue(
                                "status",
                                selectedOption.value
                              );
                            }}
                            options={statusOptions}
                            name="status"
                            classNamePrefix="select2-selection form-select"
                          />
                          {validation.errors.status &&
                            validation.touched.status ? (
                            <div className="invalid-feedback d-block">
                              {validation.errors.status}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <div className="text-end">
                      <Button type="submit" color="success" className="me-2">
                        <i className="ri-save-line align-middle me-1"></i>
                        Update User
                      </Button>
                      <Button
                        type="button"
                        color="danger"
                        onClick={handleCancel}
                      >
                        <i className="ri-close-line align-middle me-1"></i>
                        Cancel
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default StaffUsersEdit;
