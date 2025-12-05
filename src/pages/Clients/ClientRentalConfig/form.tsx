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
import { getClientRentalConfigs, getClientRentalConfigByClientId, updateClientRentalConfig } from "../../../slices/clientRentalConfig/thunk";

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
    loading: state.loading,
    error: state.error,
  }));

  const { config, loading, error } = useSelector(selectConfigProperties);

  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (clientId) {
      dispatch(getClientRentalConfigByClientId(Number(clientId)));
    }
  }, [dispatch, clientId]);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      overrideGracePeriodDays: config?.overrideGracePeriodDays ?? null,
      overrideMinimumHireWeeks: config?.overrideMinimumHireWeeks ?? null,
      overrideInvoiceFrequency: config?.overrideInvoiceFrequency ?? null,
      overrideInvoiceDay: config?.overrideInvoiceDay ?? null,
      overrideIncludeWeekends: config?.overrideIncludeWeekends ?? false,
      overrideExcludePublicHolidays: config?.overrideExcludePublicHolidays ?? false,
      reason: config?.reason || "",
      effectiveFrom: config?.effectiveFrom || "",
      effectiveTo: config?.effectiveTo || "",
      approvedByUserId: config?.approvedByUserId || "",
      approvedDate: config?.approvedDate || "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Reason is required"),
      effectiveFrom: Yup.date().required("Effective from date is required"),
      approvedByUserId: Yup.string().required("Approved by user is required"),
    }),
    onSubmit: (values) => {
      if (clientId) {
        const updatedData = {
          ...values,
          clientId: Number(clientId),
          tenantId: config?.tenantId || 0,
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
    "Client Rental Configuration | ESRM";

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="alert alert-danger mb-0" role="alert">
            Error loading client rental configuration: {error}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Client Rental Configuration Override"
            pageTitle={config?.clientName || "Client"}
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
                        Override Rental Settings for {config?.clientName || "Client"}
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

                    {/* Rental Override Section */}
                    <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                      <h5 className="mb-3 text-primary">Rental Override</h5>
                      
                      <Row className="g-3 mb-3">
                        <Col md={6}>
                          <div className="form-check form-switch form-switch-lg">
                            <Input
                              type="switch"
                              className="form-check-input"
                              id="overrideGracePeriodDays_toggle"
                              name="overrideGracePeriodDays"
                              checked={validation.values.overrideGracePeriodDays !== null}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  validation.setFieldValue("overrideGracePeriodDays", 0);
                                } else {
                                  validation.setFieldValue("overrideGracePeriodDays", null);
                                }
                              }}
                            />
                            <Label className="form-check-label" htmlFor="overrideGracePeriodDays_toggle">
                              Override Grace Period
                            </Label>
                          </div>
                        </Col>
                        <Col md={6}>
                          <Label className="form-label">
                            Grace Period Days
                          </Label>
                          <Input
                            type="number"
                            name="overrideGracePeriodDays"
                            value={validation.values.overrideGracePeriodDays ?? ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={!!(validation.touched.overrideGracePeriodDays && validation.errors.overrideGracePeriodDays)}
                            disabled={validation.values.overrideGracePeriodDays === null}
                            placeholder="Enter grace period days"
                          />
                          {validation.touched.overrideGracePeriodDays && validation.errors.overrideGracePeriodDays && (
                            <FormFeedback type="invalid">{String(validation.errors.overrideGracePeriodDays)}</FormFeedback>
                          )}
                        </Col>
                      </Row>
                      
                      <Row className="g-3 mb-3">
                        <Col md={6}>
                          <div className="form-check form-switch form-switch-lg">
                            <Input
                              type="switch"
                              className="form-check-input"
                              id="overrideMinimumHireWeeks_toggle"
                              name="overrideMinimumHireWeeks"
                              checked={validation.values.overrideMinimumHireWeeks !== null}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  validation.setFieldValue("overrideMinimumHireWeeks", 0);
                                } else {
                                  validation.setFieldValue("overrideMinimumHireWeeks", null);
                                }
                              }}
                            />
                            <Label className="form-check-label" htmlFor="overrideMinimumHireWeeks_toggle">
                              Override Minimum Hire
                            </Label>
                          </div>
                        </Col>
                        <Col md={6}>
                          <Label className="form-label">
                            Minimum Hire Weeks
                          </Label>
                          <Input
                            type="number"
                            name="overrideMinimumHireWeeks"
                            value={validation.values.overrideMinimumHireWeeks ?? ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={!!(validation.touched.overrideMinimumHireWeeks && validation.errors.overrideMinimumHireWeeks)}
                            disabled={validation.values.overrideMinimumHireWeeks === null}
                            placeholder="Enter minimum hire weeks"
                          />
                          {validation.touched.overrideMinimumHireWeeks && validation.errors.overrideMinimumHireWeeks && (
                            <FormFeedback type="invalid">{String(validation.errors.overrideMinimumHireWeeks)}</FormFeedback>
                          )}
                        </Col>
                      </Row>
                      
                      <Row className="g-3 mb-3">
                        <Col md={6}>
                          <div className="form-check form-switch form-switch-lg">
                            <Input
                              type="switch"
                              className="form-check-input"
                              id="overrideInvoiceFrequency_toggle"
                              name="overrideInvoiceFrequency"
                              checked={validation.values.overrideInvoiceFrequency !== null}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  validation.setFieldValue("overrideInvoiceFrequency", 0);
                                } else {
                                  validation.setFieldValue("overrideInvoiceFrequency", null);
                                }
                              }}
                            />
                            <Label className="form-check-label" htmlFor="overrideInvoiceFrequency_toggle">
                              Override Invoice Frequency
                            </Label>
                          </div>
                        </Col>
                        <Col md={6}>
                          <Label className="form-label">
                            Invoice Frequency
                          </Label>
                          <Input
                            type="number"
                            name="overrideInvoiceFrequency"
                            value={validation.values.overrideInvoiceFrequency ?? ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={!!(validation.touched.overrideInvoiceFrequency && validation.errors.overrideInvoiceFrequency)}
                            disabled={validation.values.overrideInvoiceFrequency === null}
                            placeholder="Enter invoice frequency"
                          />
                          {validation.touched.overrideInvoiceFrequency && validation.errors.overrideInvoiceFrequency && (
                            <FormFeedback type="invalid">{String(validation.errors.overrideInvoiceFrequency)}</FormFeedback>
                          )}
                        </Col>
                      </Row>
                      
                      <Row className="g-3">
                        <Col md={6}>
                          <div className="form-check form-switch form-switch-lg">
                            <Input
                              type="switch"
                              className="form-check-input"
                              id="overrideInvoiceDay_toggle"
                              name="overrideInvoiceDay"
                              checked={validation.values.overrideInvoiceDay !== null}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  validation.setFieldValue("overrideInvoiceDay", 0);
                                } else {
                                  validation.setFieldValue("overrideInvoiceDay", null);
                                }
                              }}
                            />
                            <Label className="form-check-label" htmlFor="overrideInvoiceDay_toggle">
                              Override Invoice Day
                            </Label>
                          </div>
                        </Col>
                        <Col md={6}>
                          <Label className="form-label">
                            Invoice Day
                          </Label>
                          <Input
                            type="number"
                            name="overrideInvoiceDay"
                            value={validation.values.overrideInvoiceDay ?? ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={!!(validation.touched.overrideInvoiceDay && validation.errors.overrideInvoiceDay)}
                            disabled={validation.values.overrideInvoiceDay === null}
                            placeholder="Enter invoice day"
                          />
                          {validation.touched.overrideInvoiceDay && validation.errors.overrideInvoiceDay && (
                            <FormFeedback type="invalid">{String(validation.errors.overrideInvoiceDay)}</FormFeedback>
                          )}
                        </Col>
                      </Row>
                    </div>

                    {/* Rental Rules Section */}
                    <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                      <h5 className="mb-3 text-primary">Rental Rules</h5>
                      <Row className="g-3">
                        <Col md={6}>
                          <div className="form-check form-switch form-switch-lg">
                            <Input
                              type="switch"
                              className="form-check-input"
                              id="overrideIncludeWeekends"
                              name="overrideIncludeWeekends"
                              checked={validation.values.overrideIncludeWeekends}
                              onChange={validation.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="overrideIncludeWeekends">
                              Include Weekends
                            </Label>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="form-check form-switch form-switch-lg">
                            <Input
                              type="switch"
                              className="form-check-input"
                              id="overrideExcludePublicHolidays"
                              name="overrideExcludePublicHolidays"
                              checked={validation.values.overrideExcludePublicHolidays}
                              onChange={validation.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="overrideExcludePublicHolidays">
                              Exclude Public Holidays
                            </Label>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Validity Period Section */}
                    <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                      <h5 className="mb-3 text-primary">Validity Period</h5>
                      <Row className="g-3">
                        <Col md={6}>
                          <Label className="form-label">
                            Effective From <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            name="effectiveFrom"
                            value={validation.values.effectiveFrom}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={!!(validation.touched.effectiveFrom && validation.errors.effectiveFrom)}
                          />
                          {validation.touched.effectiveFrom && validation.errors.effectiveFrom && (
                            <FormFeedback type="invalid">{String(validation.errors.effectiveFrom)}</FormFeedback>
                          )}
                        </Col>
                        <Col md={6}>
                          <Label className="form-label">
                            Effective To
                          </Label>
                          <Input
                            type="date"
                            name="effectiveTo"
                            value={validation.values.effectiveTo}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={!!(validation.touched.effectiveTo && validation.errors.effectiveTo)}
                          />
                          {validation.touched.effectiveTo && validation.errors.effectiveTo && (
                            <FormFeedback type="invalid">{String(validation.errors.effectiveTo)}</FormFeedback>
                          )}
                        </Col>
                      </Row>
                    </div>

                    {/* Approval Details Section */}
                    <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                      <h5 className="mb-3 text-primary">Approval Details</h5>
                      <Row className="g-3">
                        <Col md={6}>
                          <Label className="form-label">
                            Approved By User ID <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="approvedByUserId"
                            value={validation.values.approvedByUserId}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={!!(validation.touched.approvedByUserId && validation.errors.approvedByUserId)}
                            placeholder="Enter approved by user ID"
                          />
                          {validation.touched.approvedByUserId && validation.errors.approvedByUserId && (
                            <FormFeedback type="invalid">{String(validation.errors.approvedByUserId)}</FormFeedback>
                          )}
                        </Col>
                        <Col md={6}>
                          <Label className="form-label">
                            Approved Date
                          </Label>
                          <Input
                            type="date"
                            name="approvedDate"
                            value={validation.values.approvedDate}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={!!(validation.touched.approvedDate && validation.errors.approvedDate)}
                          />
                          {validation.touched.approvedDate && validation.errors.approvedDate && (
                            <FormFeedback type="invalid">{String(validation.errors.approvedDate)}</FormFeedback>
                          )}
                        </Col>
                        <Col md={12}>
                          <Label className="form-label">
                            Reason <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="textarea"
                            name="reason"
                            rows={3}
                            value={validation.values.reason}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={!!(validation.touched.reason && validation.errors.reason)}
                            placeholder="Enter reason for rental configuration"
                          />
                          {validation.touched.reason && validation.errors.reason && (
                            <FormFeedback type="invalid">{String(validation.errors.reason)}</FormFeedback>
                          )}
                        </Col>
                      </Row>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <Button type="button" color="light" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit" color="primary">
                        {config ? "Update" : "Create"} Rental Configuration
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