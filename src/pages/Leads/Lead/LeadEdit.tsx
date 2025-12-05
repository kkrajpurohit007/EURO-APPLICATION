import React, { useMemo, useEffect } from "react";
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
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { updateLead, fetchLeads, selectLeadById, selectLeadError } from "../../../slices/leads/lead.slice";
import { LeadStatus, LeadStatusLabels } from "../../../slices/leads/lead.fakeData";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchTenantLocations,
  selectTenantLocationList,
} from "../../../slices/tenantLocations/tenantLocation.slice";
import { TenantLocationItem } from "../../../services/tenantLocationService";

import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";
import LeadAttachmentManager from "../../../Components/Common/LeadAttachmentManager";

const LeadEdit: React.FC = () => {
  document.title = PAGE_TITLES.LEAD_EDIT;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useFlash();
  const lead = useSelector((state: any) => selectLeadById(state, id || ""));
  const error = useSelector(selectLeadError);
  const tenantLocations = useSelector(selectTenantLocationList);

  // Fetch tenant locations on component mount
  useEffect(() => {
    dispatch(fetchTenantLocations({ pageNumber: 1, pageSize: 200 }));
  }, [dispatch]);

  const initialValues = useMemo(
    () => ({
      title: lead?.title || "",
      contactPerson: lead?.contactPerson || "",
      contactEmail: lead?.contactEmail || "",
      description: lead?.description || "",
      leadStatus: lead?.leadStatus ?? LeadStatus.New,
      tentativeWorkDays: lead?.tentativeWorkDays || 0,
      notes: lead?.notes || "",
      phoneNumber: lead?.phoneNumber || "",
      siteAddress: lead?.siteAddress || "",
      tenantLocationId: lead?.tenantLocationId || "",
      tentativeProjectStartDate: lead?.tentativeProjectStartDate
        ? new Date(lead.tentativeProjectStartDate).toISOString().slice(0, 16)
        : "",
    }),
    [lead]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required("Lead name is required"),
      contactPerson: Yup.string().required("Contact person is required"),
      contactEmail: Yup.string()
        .email("Enter a valid email")
        .required("Contact email is required"),
      description: Yup.string().required("Description is required"),
      phoneNumber: Yup.string().nullable(),
      siteAddress: Yup.string().nullable(),
      tenantLocationId: Yup.string().nullable(),
      tentativeProjectStartDate: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      const payload = {
        id: id as string,
        data: {
          title: values.title,
          contactPerson: values.contactPerson,
          contactEmail: values.contactEmail,
          description: values.description,
          leadStatus: values.leadStatus,
          tentativeWorkDays: values.tentativeWorkDays || 0,
          notes: values.notes || "",
          phoneNumber: values.phoneNumber || null,
          siteAddress: values.siteAddress || null,
          tenantLocationId: values.tenantLocationId || null,
          tentativeProjectStartDate: values.tentativeProjectStartDate
            ? new Date(values.tentativeProjectStartDate).toISOString()
            : null,
        },
      };
      const result = await dispatch(updateLead(payload));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Lead updated successfully");
        // Refresh leads list after successful update
        dispatch(fetchLeads({ pageNumber: 1, pageSize: 500 }));
        // Delay navigation to show notification
        setTimeout(() => {
          navigate("/leads/list");
        }, 500);
      } else {
        showError("Failed to update lead");
      }
    },
  });

  if (!lead) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Lead not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Edit Lead" pageTitle="Leads" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Edit Scaffolding Lead</h5>
                <div className="d-flex gap-2">
                  <Button
                    color="light"
                    onClick={() => navigate("/leads/list")}
                    disabled={validation.isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => validation.handleSubmit()}
                    disabled={validation.isSubmitting}
                  >
                    {validation.isSubmitting ? (
                      <>
                        <Spinner size="sm" /> Saving...
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line align-bottom me-1"></i> Save
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {error && (
                  <Alert color="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                <Form onSubmit={(e) => e.preventDefault()}>
                  {/* Section A: Lead Basic Info */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Lead Basic Info</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">Lead Title *</Label>
                        <Input
                          name="title"
                          value={validation.values.title}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(validation.touched.title && validation.errors.title)
                          }
                          placeholder="Enter lead title"
                        />
                        {validation.touched.title && validation.errors.title && (
                          <FormFeedback type="invalid">
                            {String(validation.errors.title)}
                          </FormFeedback>
                        )}
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Lead Status</Label>
                        <Input
                          type="select"
                          name="leadStatus"
                          value={validation.values.leadStatus}
                          onChange={validation.handleChange}
                        >
                          {Object.entries(LeadStatusLabels).map(
                            ([key, label]) => (
                              <option key={key} value={parseInt(key)}>
                                {label}
                              </option>
                            )
                          )}
                        </Input>
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
                          placeholder="Enter description"
                        />
                        {validation.touched.description &&
                          validation.errors.description && (
                            <FormFeedback type="invalid">
                              {String(validation.errors.description)}
                            </FormFeedback>
                          )}
                      </Col>
                    </Row>
                  </div>

                  {/* Section B: Contact Details */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Contact Details</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">Contact Person *</Label>
                        <Input
                          name="contactPerson"
                          value={validation.values.contactPerson}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.contactPerson &&
                              validation.errors.contactPerson
                            )
                          }
                          placeholder="Enter contact person name"
                        />
                        {validation.touched.contactPerson &&
                          validation.errors.contactPerson && (
                            <FormFeedback type="invalid">
                              {String(validation.errors.contactPerson)}
                            </FormFeedback>
                          )}
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Contact Email *</Label>
                        <Input
                          type="email"
                          name="contactEmail"
                          value={validation.values.contactEmail}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.contactEmail &&
                              validation.errors.contactEmail
                            )
                          }
                          placeholder="Enter contact email"
                        />
                        {validation.touched.contactEmail &&
                          validation.errors.contactEmail && (
                            <FormFeedback type="invalid">
                              {String(validation.errors.contactEmail)}
                            </FormFeedback>
                          )}
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Phone Number</Label>
                        <Input
                          type="tel"
                          name="phoneNumber"
                          value={validation.values.phoneNumber}
                          onChange={validation.handleChange}
                          placeholder="Enter phone number"
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Section C: Work Related Info */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Work Related Info</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">Tentative Work Days</Label>
                        <Input
                          type="number"
                          name="tentativeWorkDays"
                          value={validation.values.tentativeWorkDays}
                          onChange={validation.handleChange}
                          min="0"
                          placeholder="Enter work days"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Tentative Project Start Date</Label>
                        <Input
                          type="datetime-local"
                          name="tentativeProjectStartDate"
                          value={validation.values.tentativeProjectStartDate}
                          onChange={validation.handleChange}
                        />
                      </Col>
                      <Col md={12}>
                        <Label className="form-label">Site Address</Label>
                        <Input
                          type="textarea"
                          rows={2}
                          name="siteAddress"
                          value={validation.values.siteAddress}
                          onChange={validation.handleChange}
                          placeholder="Enter site address"
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Section D: Additional Details */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Additional Details</h5>
                    <Row className="g-3">
                      <Col md={12}>
                        <Label className="form-label">Notes</Label>
                        <Input
                          type="textarea"
                          rows={3}
                          name="notes"
                          value={validation.values.notes}
                          onChange={validation.handleChange}
                          placeholder="Enter notes"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Tenant Location</Label>
                        <Input
                          type="select"
                          name="tenantLocationId"
                          value={validation.values.tenantLocationId}
                          onChange={validation.handleChange}
                        >
                          <option value="">Select Location</option>
                          {tenantLocations && tenantLocations.length > 0
                            ? tenantLocations
                                .filter((loc: TenantLocationItem) => !loc.isDeleted)
                                .map((location: TenantLocationItem) => (
                                  <option key={location.id} value={location.id}>
                                    {location.name}
                                  </option>
                                ))
                            : null}
                        </Input>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <LeadAttachmentManager leadId={id || ""} readOnly={false} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LeadEdit;