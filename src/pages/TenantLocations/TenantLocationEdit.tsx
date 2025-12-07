import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  updateTenantLocation,
  fetchTenantLocations,
  selectTenantLocationById,
  selectTenantLocationError,
  selectTenantLocationLoading,
} from "../../slices/tenantLocations/tenantLocation.slice";
import { useFormik } from "formik";
import * as Yup from "yup";

import { PAGE_TITLES } from "../../common/branding";
import { useFlash } from "../../hooks/useFlash";

const TenantLocationEdit: React.FC = () => {
  document.title = PAGE_TITLES.TENANT_LOCATION_EDIT;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useFlash();
  const location = useSelector((state: any) => selectTenantLocationById(state, id || ""));
  const error = useSelector(selectTenantLocationError);
  const loading = useSelector(selectTenantLocationLoading);

  useEffect(() => {
    if (!location && id) {
      dispatch(fetchTenantLocations({ pageNumber: 1, pageSize: 100 }));
    }
  }, [dispatch, id, location]);

  const initialValues = useMemo(
    () => ({
      name: location?.name || "",
      description: location?.description || "",
    }),
    [location]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Location name is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      const payload = { id: id as string, data: values };
      const result = await dispatch(updateTenantLocation(payload));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Global location updated successfully");
        // Refresh global locations list after successful update
        dispatch(fetchTenantLocations({ pageNumber: 1, pageSize: 20 }));
        // Delay navigation to show notification
        setTimeout(() => {
          navigate("/tenant-locations/list");
        }, 500);
      } else {
        showError("Failed to update global location");
      }
    },
  });

  if (!location) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Global location not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Edit Global Location" pageTitle="Global Locations" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Edit Global Location</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/tenant-locations/list")}>
                    Close
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => navigate("/tenant-locations/list")}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => validation.handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Update"}
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
                    <Col md={12}>
                      <Label className="form-label">Name *</Label>
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
                        placeholder="Enter location name"
                      />
                      {validation.touched.name && validation.errors.name && (
                        <FormFeedback type="invalid">
                          {String(validation.errors.name)}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col md={12}>
                      <Label className="form-label">Description *</Label>
                      <Input
                        type="textarea"
                        name="description"
                        rows={5}
                        value={validation.values.description}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.description && validation.errors.description
                          )
                        }
                        placeholder="Enter location description"
                      />
                      {validation.touched.description && validation.errors.description && (
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

export default TenantLocationEdit;

