import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  getTenantRoleById,
  updateTenantRole,
} from "../../../slices/tenantRoles/tenantRole.slice";
import { useFlash } from "../../../hooks/useFlash";
import { createSelector } from "reselect";
import Loader from "../../../Components/Common/Loader";
import { PAGE_TITLES } from "../../../common/branding";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

const TenantRoleEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { id } = useParams();
  const { showSuccess, showError } = useFlash();

  const selectLayoutState = (state: any) => state.TenantRoles;
  const selectTenantRoleProperties = createSelector(
    selectLayoutState,
    (state) => ({
      tenantRole: state.tenantRole,
      error: state.error,
      loading: state.loading,
    })
  );

  const { tenantRole, error, loading } = useSelector(selectTenantRoleProperties);

  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getTenantRoleById(id));
    }
  }, [dispatch, id]);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: tenantRole?.name || "",
      description: tenantRole?.description || "",
      isSensitive: tenantRole?.isSensitive || false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter role name"),
      description: Yup.string().required("Please enter description"),
      isSensitive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      if (id) {
        dispatch(updateTenantRole({ id, data: values }));
        setIsUpdated(true);
      }
    },
  });

  useEffect(() => {
    if (isUpdated && !error) {
      showSuccess("User role updated successfully");
      setTimeout(() => {
        navigate("/account/tenant-roles");
      }, 1000);
    }
  }, [isUpdated, navigate, showSuccess, error]);

  useEffect(() => {
    if (error) {
      showError("Failed to update user role");
    }
  }, [error, showError]);

  const handleCancel = () => {
    navigate("/account/tenant-roles");
  };

  if (loading && !tenantRole) {
    return <Loader error={error} />;
  }

  document.title = PAGE_TITLES.TENANT_ROLE_EDIT || "Edit User Role | ESRM";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Edit User Role" pageTitle="User Roles" />
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
                    <h5 className="card-title mb-0">Edit User Role</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="name">
                            Role Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter role name"
                            name="name"
                            value={validation.values.name || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.name &&
                                validation.touched.name
                                ? true
                                : false
                            }
                          />
                          {validation.errors.name &&
                            validation.touched.name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.name}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="profileName">
                            Profile
                          </Label>
                          <Input
                            type="text"
                            id="profileName"
                            value={tenantRole?.profileName || "-"}
                            readOnly
                            plaintext
                            className="form-control-plaintext bg-light px-3 py-2 rounded"
                          />
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
                            placeholder="Enter role description"
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
                      <Col md={12}>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="isSensitive"
                              name="isSensitive"
                              checked={validation.values.isSensitive}
                              onChange={validation.handleChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="isSensitive"
                            >
                              Sensitive Role
                            </Label>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="text-end">
                      <Button type="submit" color="success" className="me-2">
                        <i className="ri-refresh-line align-middle me-1"></i>
                        Update Role
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

export default TenantRoleEdit;

