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
  getClientRentalConfigByClientId,
  updateClientRentalConfig,
} from "../../../slices/clientRentalConfig/thunk";

import { createSelector } from "reselect";
import Loader from "../../../Components/Common/Loader";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

const ClientRentalConfigForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { clientId } = useParams();

  const selectLayoutState = (state: any) => state.ClientRentalConfig;
  const selectConfigProperties = createSelector(selectLayoutState, (state) => ({
    config: state.config,
  }));

  const { config } = useSelector(selectConfigProperties);

  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (clientId) {
      dispatch(getClientRentalConfigByClientId(Number(clientId)));
    }
  }, [dispatch, clientId]);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      overrideGracePeriod: config?.overrideGracePeriod || false,
      gracePeriodDays: config?.gracePeriodDays || 0,
      overrideMinimumHire: config?.overrideMinimumHire || false,
      minimumHireWeeks: config?.minimumHireWeeks || 0,
      overrideIncludeWeekends: config?.overrideIncludeWeekends || false,
      includeWeekends: config?.includeWeekends || false,
      overrideExcludePublicHolidays:
        config?.overrideExcludePublicHolidays || false,
      excludePublicHolidays: config?.excludePublicHolidays || false,
    },
    validationSchema: Yup.object({
      gracePeriodDays: Yup.number().when("overrideGracePeriod", {
        is: true,
        then: (schema) =>
          schema
            .required("Please enter grace period days")
            .min(1, "Must be at least 1 day"),
      }),
      minimumHireWeeks: Yup.number().when("overrideMinimumHire", {
        is: true,
        then: (schema) =>
          schema
            .required("Please enter minimum hire weeks")
            .min(1, "Must be at least 1 week"),
      }),
    }),
    onSubmit: (values) => {
      if (clientId) {
        const updatedData = {
          ...config,
          ...values,
          clientId: Number(clientId),
        };
        dispatch(updateClientRentalConfig(updatedData));
        setIsUpdated(true);
      }
    },
  });

  useEffect(() => {
    if (isUpdated) {
      setTimeout(() => {
        navigate(`/clients/view/${clientId}`);
      }, 1000);
    }
  }, [isUpdated, navigate, clientId]);

  const handleCancel = () => {
    navigate(`/clients/view/${clientId}`);
  };

  const handleClose = () => {
    navigate(`/clients/view/${clientId}`);
  };

  document.title =
    "Client Rental Configuration | Velzon - React Admin & Dashboard Template";

  if (!config) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Client Rental Configuration Override"
            pageTitle={config.clientName}
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
                    <div className="d-flex align-items-center">
                      <h5 className="card-title mb-0 flex-grow-1">
                        Override Rental Settings for {config.clientName}
                      </h5>
                      <div className="flex-shrink-0">
                        <Button
                          color="light"
                          size="sm"
                          onClick={handleClose}
                          className="me-1"
                        >
                          <i className="ri-close-line align-middle me-1"></i>
                          Close
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="alert alert-info">
                      <i className="ri-information-line me-2"></i>
                      Configure client-specific rental settings. Only enabled
                      overrides will apply to this client.
                    </div>

                    <Row>
                      <Col md={12}>
                        <h6 className="mb-3 text-primary">
                          Grace Period Override
                        </h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="overrideGracePeriod"
                              name="overrideGracePeriod"
                              checked={validation.values.overrideGracePeriod}
                              onChange={validation.handleChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="overrideGracePeriod"
                            >
                              Override Grace Period
                            </Label>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="gracePeriodDays"
                          >
                            Grace Period Days
                            {validation.values.overrideGracePeriod && (
                              <span className="text-danger">*</span>
                            )}
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="gracePeriodDays"
                            placeholder="Enter grace period days"
                            name="gracePeriodDays"
                            disabled={!validation.values.overrideGracePeriod}
                            value={validation.values.gracePeriodDays || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.gracePeriodDays &&
                                validation.touched.gracePeriodDays
                                ? true
                                : false
                            }
                          />
                          {validation.errors.gracePeriodDays &&
                            validation.touched.gracePeriodDays ? (
                            <FormFeedback type="invalid">
                              {validation.errors.gracePeriodDays}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <h6 className="mb-3 text-primary">
                          Minimum Hire Override
                        </h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="overrideMinimumHire"
                              name="overrideMinimumHire"
                              checked={validation.values.overrideMinimumHire}
                              onChange={validation.handleChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="overrideMinimumHire"
                            >
                              Override Minimum Hire Period
                            </Label>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="minimumHireWeeks"
                          >
                            Minimum Hire Weeks
                            {validation.values.overrideMinimumHire && (
                              <span className="text-danger">*</span>
                            )}
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="minimumHireWeeks"
                            placeholder="Enter minimum hire weeks"
                            name="minimumHireWeeks"
                            disabled={!validation.values.overrideMinimumHire}
                            value={validation.values.minimumHireWeeks || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            invalid={
                              validation.errors.minimumHireWeeks &&
                                validation.touched.minimumHireWeeks
                                ? true
                                : false
                            }
                          />
                          {validation.errors.minimumHireWeeks &&
                            validation.touched.minimumHireWeeks ? (
                            <FormFeedback type="invalid">
                              {validation.errors.minimumHireWeeks}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <h6 className="mb-3 text-primary">Weekend Override</h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="overrideIncludeWeekends"
                              name="overrideIncludeWeekends"
                              checked={
                                validation.values.overrideIncludeWeekends
                              }
                              onChange={validation.handleChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="overrideIncludeWeekends"
                            >
                              Override Weekend Settings
                            </Label>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="includeWeekends"
                              name="includeWeekends"
                              disabled={
                                !validation.values.overrideIncludeWeekends
                              }
                              checked={validation.values.includeWeekends}
                              onChange={validation.handleChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="includeWeekends"
                            >
                              Include Weekends in Rental Period
                            </Label>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <h6 className="mb-3 text-primary">
                          Public Holidays Override
                        </h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="overrideExcludePublicHolidays"
                              name="overrideExcludePublicHolidays"
                              checked={
                                validation.values.overrideExcludePublicHolidays
                              }
                              onChange={validation.handleChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="overrideExcludePublicHolidays"
                            >
                              Override Public Holiday Settings
                            </Label>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="excludePublicHolidays"
                              name="excludePublicHolidays"
                              disabled={
                                !validation.values.overrideExcludePublicHolidays
                              }
                              checked={validation.values.excludePublicHolidays}
                              onChange={validation.handleChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="excludePublicHolidays"
                            >
                              Exclude Public Holidays from Billing
                            </Label>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="text-end">
                      <Button type="submit" color="success" className="me-2">
                        <i className="ri-save-line align-middle me-1"></i>
                        Update Configuration
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

export default ClientRentalConfigForm;
