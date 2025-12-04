import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Alert,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  selectClientSiteById,
  updateClientSite,
  fetchClientSites,
  selectClientSiteError,
} from "../../../slices/clientSites/clientSite.slice";
import { selectClientList } from "../../../slices/clients/client.slice";
import { selectCountryList } from "../../../slices/countries/country.slice";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";

import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";

const SiteEdit: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_SITE_EDIT;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useFlash();
  const site = useSelector((state: any) => selectClientSiteById(state, id || ""));
  const error = useSelector(selectClientSiteError);
  const clients = useSelector(selectClientList);
  const countries = useSelector(selectCountryList);

  const clientOptions = useMemo(() => {
    return clients.map((c: any) => ({ label: c.name, value: c.id }));
  }, [clients]);

  const countryOptions = useMemo(() => {
    return countries.map((c: any) => ({ label: c.name, value: c.id }));
  }, [countries]);

  const initialValues = useMemo(
    () => ({
      clientId: site?.clientId || "",
      siteName: site?.siteName || "",
      address1: site?.address1 || "",
      address2: site?.address2 || "",
      countryId: site?.countryId || "",
      zipcode: site?.zipcode || "",
      latitude: site?.latitude || 0,
      longitude: site?.longitude || 0,
      siteRadiusMeters: site?.siteRadiusMeters || 200,
      requireGeofencing: site?.requireGeofencing ?? false,
    }),
    [site]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      clientId: Yup.string().required("Please select client"),
      siteName: Yup.string().required("Please enter site name"),
      address1: Yup.string().required("Please enter address"),
      countryId: Yup.string().required("Please select country"),
      zipcode: Yup.string().required("Please enter zipcode"),
      latitude: Yup.number().required("Please enter latitude"),
      longitude: Yup.number().required("Please enter longitude"),
      siteRadiusMeters: Yup.number().required("Please enter site radius"),
    }),
    onSubmit: async (values) => {
      const payload = { id: id as string, data: values };
      const result = await dispatch(updateClientSite(payload));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Site updated successfully");
        // Refresh sites list after successful update
        dispatch(fetchClientSites({ pageNumber: 1, pageSize: 50 }));
        // Delay navigation to show notification
        setTimeout(() => {
          navigate("/clients/sites");
        }, 500);
      } else {
        showError("Failed to update site");
      }
    },
  });

  if (!site) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Site not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Edit Site" pageTitle="Sites" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Edit Site</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/clients/sites")}>
                    Close
                  </Button>
                  <Button color="secondary" onClick={() => navigate("/clients/sites")}>
                    Cancel
                  </Button>
                  <Button color="primary" onClick={() => validation.handleSubmit()}>
                    Update
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
                      <Label className="form-label">Client *</Label>
                      <Select
                        value={clientOptions.find((o: any) => o.value === validation.values.clientId)}
                        onChange={(option: any) => validation.setFieldValue("clientId", option?.value || "")}
                        options={clientOptions}
                        placeholder="Select client"
                        classNamePrefix="select2-selection"
                      />
                      {validation.touched.clientId && validation.errors.clientId && (
                        <div className="invalid-feedback d-block">{String(validation.errors.clientId)}</div>
                      )}
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Site Name *</Label>
                      <Input
                        name="siteName"
                        value={validation.values.siteName}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={!!(validation.touched.siteName && validation.errors.siteName)}
                        placeholder="e.g., Main Office"
                      />
                      {validation.touched.siteName && validation.errors.siteName && (
                        <FormFeedback type="invalid">{String(validation.errors.siteName)}</FormFeedback>
                      )}
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Address Line 1 *</Label>
                      <Input
                        name="address1"
                        value={validation.values.address1}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={!!(validation.touched.address1 && validation.errors.address1)}
                      />
                      {validation.touched.address1 && validation.errors.address1 && (
                        <FormFeedback type="invalid">{String(validation.errors.address1)}</FormFeedback>
                      )}
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Address Line 2</Label>
                      <Input
                        name="address2"
                        value={validation.values.address2}
                        onChange={validation.handleChange}
                      />
                    </Col>

                    <Col md={4}>
                      <Label className="form-label">Country *</Label>
                      <Select
                        value={countryOptions.find((o: any) => o.value === validation.values.countryId)}
                        onChange={(option: any) => validation.setFieldValue("countryId", option?.value || "")}
                        options={countryOptions}
                        placeholder="Select country"
                        classNamePrefix="select2-selection"
                      />
                      {validation.touched.countryId && validation.errors.countryId && (
                        <div className="invalid-feedback d-block">{String(validation.errors.countryId)}</div>
                      )}
                    </Col>
                    <Col md={4}>
                      <Label className="form-label">Zipcode *</Label>
                      <Input
                        name="zipcode"
                        value={validation.values.zipcode}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={!!(validation.touched.zipcode && validation.errors.zipcode)}
                      />
                      {validation.touched.zipcode && validation.errors.zipcode && (
                        <FormFeedback type="invalid">{String(validation.errors.zipcode)}</FormFeedback>
                      )}
                    </Col>
                    <Col md={4}>
                      <Label className="form-label">Site Radius (meters) *</Label>
                      <Input
                        type="number"
                        name="siteRadiusMeters"
                        value={validation.values.siteRadiusMeters}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={!!(validation.touched.siteRadiusMeters && validation.errors.siteRadiusMeters)}
                      />
                      {validation.touched.siteRadiusMeters && validation.errors.siteRadiusMeters && (
                        <FormFeedback type="invalid">{String(validation.errors.siteRadiusMeters)}</FormFeedback>
                      )}
                    </Col>

                    <Col md={4}>
                      <Label className="form-label">Latitude *</Label>
                      <Input
                        type="number"
                        step="any"
                        name="latitude"
                        value={validation.values.latitude}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={!!(validation.touched.latitude && validation.errors.latitude)}
                      />
                      {validation.touched.latitude && validation.errors.latitude && (
                        <FormFeedback type="invalid">{String(validation.errors.latitude)}</FormFeedback>
                      )}
                    </Col>
                    <Col md={4}>
                      <Label className="form-label">Longitude *</Label>
                      <Input
                        type="number"
                        step="any"
                        name="longitude"
                        value={validation.values.longitude}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={!!(validation.touched.longitude && validation.errors.longitude)}
                      />
                      {validation.touched.longitude && validation.errors.longitude && (
                        <FormFeedback type="invalid">{String(validation.errors.longitude)}</FormFeedback>
                      )}
                    </Col>
                    <Col md={4}>
                      <Label className="form-label">Geofencing</Label>
                      <div className="form-check form-switch form-switch-lg mt-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          name="requireGeofencing"
                          checked={validation.values.requireGeofencing}
                          onChange={validation.handleChange}
                        />
                        <Label className="form-check-label">
                          {validation.values.requireGeofencing ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
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

export default SiteEdit;
