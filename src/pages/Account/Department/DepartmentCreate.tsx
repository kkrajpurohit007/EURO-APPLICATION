import React from "react";
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
  createDepartment,
  fetchDepartments,
  selectDepartmentLoading,
  selectDepartmentError,
} from "../../../slices/departments/department.slice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getLoggedinUser } from "../../../helpers/api_helper";

import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";

const DepartmentCreate: React.FC = () => {
  document.title = PAGE_TITLES.DEPARTMENT_CREATE;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useFlash();
  const loading = useSelector(selectDepartmentLoading);
  const error = useSelector(selectDepartmentError);

  const authUser = getLoggedinUser();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
      isActive: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Department name is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        tenantId: authUser?.tenantId || "",
        ...values,
      };
      const result = await dispatch(createDepartment(payload));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Department created successfully");
        // Refresh departments list
        dispatch(fetchDepartments({ pageNumber: 1, pageSize: 500 }));
        // Delay navigation to show notification
        setTimeout(() => {
          navigate("/account/departments");
        }, 500);
      } else {
        showError("Failed to create department");
      }
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Add Department" pageTitle="Departments" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">New Department</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/account/departments")}>
                    Close
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => navigate("/account/departments")}
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
                  <Row className="g-3">
                    <Col md={6}>
                      <Label className="form-label">Department Name *</Label>
                      <Input
                        name="name"
                        value={validation.values.name}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.name && validation.errors.name
                          )
                        }
                        placeholder="e.g., Human Resources"
                      />
                      {validation.touched.name && validation.errors.name && (
                        <FormFeedback type="invalid">
                          {String(validation.errors.name)}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Status</Label>
                      <div className="form-check form-switch form-switch-lg mt-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          name="isActive"
                          checked={validation.values.isActive}
                          onChange={validation.handleChange}
                        />
                        <Label className="form-check-label">
                          {validation.values.isActive ? "Active" : "Inactive"}
                        </Label>
                      </div>
                    </Col>

                    <Col md={12}>
                      <Label className="form-label">Description *</Label>
                      <Input
                        type="textarea"
                        rows={3}
                        name="description"
                        value={validation.values.description}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.description &&
                            validation.errors.description
                          )
                        }
                      />
                      {validation.touched.description &&
                        validation.errors.description && (
                          <FormFeedback type="invalid">
                            {String(validation.errors.description)}
                          </FormFeedback>
                        )}
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DepartmentCreate;
