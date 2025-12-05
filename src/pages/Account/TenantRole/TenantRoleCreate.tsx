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
import { addNewTenantRole } from "../../../slices/tenantRoles/tenantRole.slice";
import { fetchProfiles } from "../../../slices/userProfiles/profile.slice";
import { useFlash } from "../../../hooks/useFlash";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import { createSelector } from "reselect";
import Select from "react-select";
import { PAGE_TITLES } from "../../../common/branding";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

const TenantRoleCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { showSuccess, showError } = useFlash();
  const { userProfile } = useProfile();

  const selectLayoutState = (state: any) => state.TenantRoles;
  const selectTenantRoleProperties = createSelector(
    selectLayoutState,
    (state) => ({
      isTenantRoleCreated: state.isTenantRoleCreated,
      error: state.error,
    })
  );

  const selectProfileState = (state: any) => state.UserProfiles;
  const selectProfileProperties = createSelector(
    selectProfileState,
    (state) => ({
      profiles: state.items || [],
    })
  );

  const { isTenantRoleCreated, error } = useSelector(selectTenantRoleProperties);
  const { profiles } = useSelector(selectProfileProperties);

  useEffect(() => {
    if (profiles && profiles.length === 0) {
      dispatch(fetchProfiles({ pageNumber: 1, pageSize: 50 }));
    }
  }, [dispatch, profiles]);

  useEffect(() => {
    if (isTenantRoleCreated) {
      showSuccess("Tenant role created successfully");
      navigate("/account/tenant-roles");
    }
  }, [isTenantRoleCreated, navigate, showSuccess]);

  useEffect(() => {
    if (error) {
      showError("Failed to create tenant role");
    }
  }, [error, showError]);

  const profileOptions = [
    {
      options: profiles
        .filter((profile: any) => !profile.isDeleted)
        .map((profile: any) => ({
          label: profile.name,
          value: profile.id,
        })),
    },
  ];

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
      profileId: "",
      isSensitive: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter role name"),
      description: Yup.string().required("Please enter description"),
      profileId: Yup.string().required("Please select profile"),
      isSensitive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        tenantId: userProfile?.tenantId || "00000000-0000-0000-0000-000000000010",
      };
      dispatch(addNewTenantRole(payload));
      validation.resetForm();
    },
  });

  const handleCancel = () => {
    navigate("/account/tenant-roles");
  };

  document.title = PAGE_TITLES.TENANT_ROLE_CREATE || "Create Tenant Role | ESRM";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Create Tenant Role"
            pageTitle="Tenant Roles"
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
                    <h5 className="card-title mb-0">Add New Tenant Role</h5>
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
                          <Label className="form-label" htmlFor="profileId">
                            Profile <span className="text-danger">*</span>
                          </Label>
                          <Select
                            value={
                              profileOptions[0]?.options.find(
                                (option: any) =>
                                  option.value === validation.values.profileId
                              ) || null
                            }
                            onChange={(selectedOption: any) => {
                              validation.setFieldValue(
                                "profileId",
                                selectedOption?.value || ""
                              );
                            }}
                            options={profileOptions}
                            name="profileId"
                            placeholder="Select profile"
                            classNamePrefix="select2-selection form-select"
                          />
                          {validation.errors.profileId &&
                            validation.touched.profileId ? (
                            <div className="invalid-feedback d-block">
                              {validation.errors.profileId}
                            </div>
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
                        <i className="ri-save-line align-middle me-1"></i>
                        Create Role
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

export default TenantRoleCreate;

