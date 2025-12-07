import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  createGlobalUser,
  fetchGlobalUsers,
  selectGlobalUserLoading,
  selectGlobalUserError,
} from "../../../slices/globalUsers/globalUser.slice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getLoggedinUser } from "../../../helpers/api_helper";
import { selectTenantRoleList, getTenantRoles } from "../../../slices/tenantRoles/tenantRole.slice";
import { selectDepartmentList } from "../../../slices/departments/department.slice";
import { fetchDepartments } from "../../../slices/departments/department.slice";
import Select from "react-select";
import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";

const GlobalUserCreate: React.FC = () => {
  document.title = PAGE_TITLES.GLOBAL_USER_CREATE;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useFlash();
  const loading = useSelector(selectGlobalUserLoading);
  const error = useSelector(selectGlobalUserError);
  const tenantRolesList = useSelector(selectTenantRoleList);
  const departments = useSelector(selectDepartmentList);

  const authUser = getLoggedinUser();

  // Memoize tenantRoles to prevent unnecessary re-renders
  const tenantRoles = useMemo(() => tenantRolesList || [], [tenantRolesList]);

  // Fetch dropdown data if not already loaded
  useEffect(() => {
    if (!tenantRoles || tenantRoles.length === 0) {
      dispatch(getTenantRoles({ pageNumber: 1, pageSize: 50 }));
    }
    if (!departments || departments.length === 0) {
      dispatch(fetchDepartments({ pageNumber: 1, pageSize: 50 }));
    }
  }, [dispatch, tenantRoles, departments]);

  const roleOptions = tenantRoles
    .filter((r: any) => !r.isDeleted)
    .map((role: any) => ({
      value: role.id,
      label: role.name,
    }));

  const departmentOptions = departments
    .filter((d: any) => !d.isDeleted)
    .map((dept: any) => ({
      value: dept.id,
      label: dept.name,
    }));

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      dateOfBirth: "",
      roleId: "",
      departmentId: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      roleId: Yup.string().required("Role is required"),
      departmentId: Yup.string().required("Department is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        tenantId: authUser?.tenantId || "",
        ...values,
        username: values.email, // Username must equal email
      };
      const result = await dispatch(createGlobalUser(payload));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("User created successfully");
        // Refresh global users list
        dispatch(fetchGlobalUsers({ pageNumber: 1, pageSize: 20 }));
        // Delay navigation to show notification
        setTimeout(() => {
          navigate("/account/global-users");
        }, 500);
      } else {
        showError("Failed to create user");
      }
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Add User" pageTitle="User Management" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">New User</h5>
                <div className="d-flex gap-2">
                  <Button
                    color="light"
                    onClick={() => navigate("/account/global-users")}
                  >
                    Close
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => navigate("/account/global-users")}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => validation.handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Save"}
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {error && (
                  <Alert color="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                  }}
                >
                  {/* Section A: Personal Details */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Personal Details</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">First Name *</Label>
                        <Input
                          name="firstName"
                          value={validation.values.firstName}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.firstName &&
                              validation.errors.firstName
                            )
                          }
                        />
                        {validation.touched.firstName &&
                          validation.errors.firstName && (
                            <FormFeedback type="invalid">
                              {String(validation.errors.firstName)}
                            </FormFeedback>
                          )}
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Last Name *</Label>
                        <Input
                          name="lastName"
                          value={validation.values.lastName}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.lastName &&
                              validation.errors.lastName
                            )
                          }
                        />
                        {validation.touched.lastName &&
                          validation.errors.lastName && (
                            <FormFeedback type="invalid">
                              {String(validation.errors.lastName)}
                            </FormFeedback>
                          )}
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Email *</Label>
                        <Input
                          type="email"
                          name="email"
                          value={validation.values.email}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.email && validation.errors.email
                            )
                          }
                        />
                        {validation.touched.email && validation.errors.email && (
                          <FormFeedback type="invalid">
                            {String(validation.errors.email)}
                          </FormFeedback>
                        )}
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Mobile Number</Label>
                        <Input
                          name="mobileNumber"
                          value={validation.values.mobileNumber}
                          onChange={validation.handleChange}
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Date of Birth</Label>
                        <Input
                          type="date"
                          name="dateOfBirth"
                          value={validation.values.dateOfBirth}
                          onChange={validation.handleChange}
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Section B: Permission/Role */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Permission/Role</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">Role *</Label>
                        <Select
                          value={roleOptions.find(
                            (option: any) =>
                              option.value === validation.values.roleId
                          )}
                          onChange={(selectedOption: any) => {
                            validation.setFieldValue(
                              "roleId",
                              selectedOption?.value || ""
                            );
                          }}
                          options={roleOptions}
                          placeholder="Select role"
                          classNamePrefix="select2-selection"
                        />
                        {validation.touched.roleId &&
                          validation.errors.roleId && (
                            <div className="invalid-feedback d-block">
                              {String(validation.errors.roleId)}
                            </div>
                          )}
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Department *</Label>
                        <Select
                          value={departmentOptions.find(
                            (option: any) =>
                              option.value === validation.values.departmentId
                          )}
                          onChange={(selectedOption: any) => {
                            validation.setFieldValue(
                              "departmentId",
                              selectedOption?.value || ""
                            );
                          }}
                          options={departmentOptions}
                          placeholder="Select department"
                          classNamePrefix="select2-selection"
                        />
                        {validation.touched.departmentId &&
                          validation.errors.departmentId && (
                            <div className="invalid-feedback d-block">
                              {String(validation.errors.departmentId)}
                            </div>
                          )}
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

export default GlobalUserCreate;

