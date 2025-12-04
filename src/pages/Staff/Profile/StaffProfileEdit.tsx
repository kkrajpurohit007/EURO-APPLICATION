import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useFlash } from "../../../hooks/useFlash";
import { createSelector } from "reselect";
import Select from "react-select";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

const StaffProfileEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { showSuccess } = useFlash();

  const [isUpdated, setIsUpdated] = useState(false);

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

  const statusOptions = [
    {
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "On Leave", value: "On Leave" },
      ],
    },
  ];

  const employmentTypeOptions = [
    {
      options: [
        { label: "Full-time", value: "Full-time" },
        { label: "Part-time", value: "Part-time" },
        { label: "Contract", value: "Contract" },
        { label: "Internship", value: "Internship" },
      ],
    },
  ];

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      employeeId: staffProfile?.employeeId || "",
      firstName: staffProfile?.firstName || "",
      lastName: staffProfile?.lastName || "",
      email: staffProfile?.email || "",
      phone: staffProfile?.phone || "",
      position: staffProfile?.position || "",
      department: staffProfile?.department || "",
      joinDate: staffProfile?.joinDate || "",
      dateOfBirth: staffProfile?.dateOfBirth || "",
      address: staffProfile?.address || "",
      emergencyContact: staffProfile?.emergencyContact || "",
      emergencyContactName: staffProfile?.emergencyContactName || "",
      status: staffProfile?.status || "Active",
      reportingManager: staffProfile?.reportingManager || "",
      employmentType: staffProfile?.employmentType || "Full-time",
      workLocation: staffProfile?.workLocation || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please enter first name"),
      lastName: Yup.string().required("Please enter last name"),
      email: Yup.string()
        .email("Please enter valid email")
        .required("Please enter email"),
      phone: Yup.string().required("Please enter phone number"),
      position: Yup.string().required("Please enter position"),
      department: Yup.string().required("Please enter department"),
      dateOfBirth: Yup.string().required("Please enter date of birth"),
      address: Yup.string().required("Please enter address"),
      emergencyContactName: Yup.string().required(
        "Please enter emergency contact name"
      ),
      emergencyContact: Yup.string().required(
        "Please enter emergency contact number"
      ),
      employmentType: Yup.string().required("Please select employment type"),
      status: Yup.string().required("Please select status"),
    }),
    onSubmit: (values) => {
      // Replace with actual update action when Redux is integrated
      console.log("Updated values:", values);
      showSuccess("Profile updated successfully");
      setIsUpdated(true);
    },
  });

  useEffect(() => {
    if (isUpdated) {
      setTimeout(() => {
        navigate("/staff/profile");
      }, 1000);
    }
  }, [isUpdated, navigate]);

  const handleCancel = () => {
    navigate("/staff/profile");
  };

  const handleClose = () => {
    navigate("/staff/profile");
  };

  document.title =
    "Edit Staff Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Edit Staff Profile" pageTitle="Staff Management" />
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
                  <CardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      Update Profile Information
                    </h5>
                    <Button
                      type="button"
                      color="secondary"
                      outline
                      onClick={handleClose}
                    >
                      <i className="ri-close-line align-middle me-1"></i>
                      Close
                    </Button>
                  </CardHeader>
                  <CardBody>
                    {/* Personal Information Section */}
                    <div className="mb-4">
                      <h6 className="text-primary mb-3">
                        Personal Information
                      </h6>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="employeeId">
                              Employee ID
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="employeeId"
                              name="employeeId"
                              value={validation.values.employeeId || ""}
                              disabled
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="dateOfBirth">
                              Date of Birth{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="date"
                              className="form-control"
                              id="dateOfBirth"
                              name="dateOfBirth"
                              value={validation.values.dateOfBirth || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.dateOfBirth &&
                                  validation.touched.dateOfBirth
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.dateOfBirth &&
                              validation.touched.dateOfBirth ? (
                              <FormFeedback type="invalid">
                                {validation.errors.dateOfBirth}
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
                      </Row>

                      <Row>
                        <Col md={12}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="address">
                              Address <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="textarea"
                              className="form-control"
                              id="address"
                              placeholder="Enter address"
                              name="address"
                              rows={3}
                              value={validation.values.address || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.address &&
                                  validation.touched.address
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.address &&
                              validation.touched.address ? (
                              <FormFeedback type="invalid">
                                {validation.errors.address}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Employment Details Section */}
                    <div className="mb-4">
                      <h6 className="text-success mb-3">Employment Details</h6>
                      <Row>
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
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="department">
                              Department <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="department"
                              placeholder="Enter department"
                              name="department"
                              value={validation.values.department || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.department &&
                                  validation.touched.department
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.department &&
                              validation.touched.department ? (
                              <FormFeedback type="invalid">
                                {validation.errors.department}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="joinDate">
                              Join Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control"
                              id="joinDate"
                              name="joinDate"
                              value={validation.values.joinDate || ""}
                              disabled
                            />
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="employmentType"
                            >
                              Employment Type{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Select
                              value={employmentTypeOptions[0].options.find(
                                (option: any) =>
                                  option.value ===
                                  validation.values.employmentType
                              )}
                              onChange={(selectedOption: any) => {
                                validation.setFieldValue(
                                  "employmentType",
                                  selectedOption.value
                                );
                              }}
                              options={employmentTypeOptions}
                              name="employmentType"
                              classNamePrefix="select2-selection form-select"
                            />
                            {validation.errors.employmentType &&
                              validation.touched.employmentType ? (
                              <div className="invalid-feedback d-block">
                                {validation.errors.employmentType}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={4}>
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

                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="workLocation"
                            >
                              Work Location
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="workLocation"
                              placeholder="Enter work location"
                              name="workLocation"
                              value={validation.values.workLocation || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="reportingManager"
                            >
                              Reporting Manager
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="reportingManager"
                              placeholder="Enter reporting manager"
                              name="reportingManager"
                              value={validation.values.reportingManager || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="mb-4">
                      <h6 className="text-warning mb-3">Emergency Contact</h6>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="emergencyContactName"
                            >
                              Contact Name{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="emergencyContactName"
                              placeholder="Enter emergency contact name"
                              name="emergencyContactName"
                              value={
                                validation.values.emergencyContactName || ""
                              }
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.emergencyContactName &&
                                  validation.touched.emergencyContactName
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.emergencyContactName &&
                              validation.touched.emergencyContactName ? (
                              <FormFeedback type="invalid">
                                {validation.errors.emergencyContactName}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="emergencyContact"
                            >
                              Contact Number{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="emergencyContact"
                              placeholder="Enter emergency contact number"
                              name="emergencyContact"
                              value={validation.values.emergencyContact || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.emergencyContact &&
                                  validation.touched.emergencyContact
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.emergencyContact &&
                              validation.touched.emergencyContact ? (
                              <FormFeedback type="invalid">
                                {validation.errors.emergencyContact}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Form Actions */}
                    <div className="text-end">
                      <Button type="submit" color="success" className="me-2">
                        <i className="ri-save-line align-middle me-1"></i>
                        Update Profile
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

export default StaffProfileEdit;
