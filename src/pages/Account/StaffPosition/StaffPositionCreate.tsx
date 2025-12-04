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
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { addNewStaffPosition } from "../../../slices/staffPositions/thunk";
import { fetchDepartments } from "../../../slices/departments/department.slice";
import { useFlash } from "../../../hooks/useFlash";
import { createSelector } from "reselect";
import Select from "react-select";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

const StaffPositionCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { showSuccess, showError } = useFlash();

  const selectLayoutState = (state: any) => state.StaffPositions;
  const selectStaffPositionProperties = createSelector(
    selectLayoutState,
    (state) => ({
      isStaffPositionCreated: state.isStaffPositionCreated,
      error: state.error,
    })
  );

  const selectDepartmentState = (state: any) => state.Departments;
  const selectDepartmentProperties = createSelector(
    selectDepartmentState,
    (state) => ({
      departments: state.departments,
    })
  );

  const { isStaffPositionCreated, error } = useSelector(selectStaffPositionProperties);
  const { departments } = useSelector(selectDepartmentProperties);

  const statusOptions = [
    {
      options: [
        { label: "Published", value: "Published" },
        { label: "Draft", value: "Draft" },
        { label: "Scheduled", value: "Scheduled" },
      ],
    },
  ];

  const levelOptions = [
    {
      options: [
        { label: "Junior", value: "Junior" },
        { label: "Mid-Level", value: "Mid-Level" },
        { label: "Senior", value: "Senior" },
        { label: "Executive", value: "Executive" },
      ],
    },
  ];

  useEffect(() => {
    if (departments && !departments.length) {
      dispatch(fetchDepartments({ pageNumber: 1, pageSize: 500 }));
    }
  }, [dispatch, departments]);

  useEffect(() => {
    if (isStaffPositionCreated) {
      showSuccess("Staff position created successfully");
      navigate("/account/staff-positions");
    }
  }, [isStaffPositionCreated, navigate, showSuccess]);

  useEffect(() => {
    if (error) {
      showError("Failed to create staff position");
    }
  }, [error, showError]);

  const departmentOptions = [
    {
      options: departments
        .filter((dept: any) => dept.status === "Published")
        .map((dept: any) => ({
          label: dept.name,
          value: dept.name,
        })),
    },
  ];

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      positionName: "",
      code: "",
      description: "",
      level: "Junior",
      department: "",
      status: "Published",
    },
    validationSchema: Yup.object({
      positionName: Yup.string().required("Please enter position name"),
      code: Yup.string()
        .required("Please enter position code")
        .min(2, "Code must be at least 2 characters")
        .max(15, "Code must not exceed 15 characters"),
      description: Yup.string().required("Please enter description"),
      level: Yup.string().required("Please select level"),
      department: Yup.string().required("Please enter department"),
      status: Yup.string().required("Please select status"),
    }),
    onSubmit: (values) => {
      dispatch(addNewStaffPosition(values));
      validation.resetForm();
    },
  });

  const handleCancel = () => {
    navigate("/account/staff-positions");
  };

  document.title =
    "Create Staff Position | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Create Staff Position"
            pageTitle="Staff Positions"
          />
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
                    <h5 className="card-title mb-0">Add New Staff Position</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="positionName">
                            Position Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="positionName"
                            placeholder="Enter position name"
                            name="positionName"
                            value={validation.values.positionName || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.positionName &&
                                validation.touched.positionName
                                ? true
                                : false
                            }
                          />
                          {validation.errors.positionName &&
                            validation.touched.positionName ? (
                            <FormFeedback type="invalid">
                              {validation.errors.positionName}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="code">
                            Position Code <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="code"
                            placeholder="Enter position code (e.g., SFM-001)"
                            name="code"
                            value={validation.values.code || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.code && validation.touched.code
                                ? true
                                : false
                            }
                          />
                          {validation.errors.code && validation.touched.code ? (
                            <FormFeedback type="invalid">
                              {validation.errors.code}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="description">
                            Description <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="textarea"
                            className="form-control"
                            id="description"
                            placeholder="Enter position description"
                            name="description"
                            rows={3}
                            value={validation.values.description || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.description &&
                                validation.touched.description
                                ? true
                                : false
                            }
                          />
                          {validation.errors.description &&
                            validation.touched.description ? (
                            <FormFeedback type="invalid">
                              {validation.errors.description}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="level">
                            Level <span className="text-danger">*</span>
                          </Label>
                          <Select
                            value={levelOptions[0].options.find(
                              (option) =>
                                option.value === validation.values.level
                            )}
                            onChange={(selectedOption: any) => {
                              validation.setFieldValue(
                                "level",
                                selectedOption.value
                              );
                            }}
                            options={levelOptions}
                            name="level"
                            classNamePrefix="select2-selection form-select"
                          />
                          {validation.errors.level &&
                            validation.touched.level ? (
                            <div className="invalid-feedback d-block">
                              {validation.errors.level}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={4}>
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
                      <Col md={4}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="status">
                            Status <span className="text-danger">*</span>
                          </Label>
                          <Select
                            value={statusOptions[0].options.find(
                              (option) =>
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
                        Create Position
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

export default StaffPositionCreate;
