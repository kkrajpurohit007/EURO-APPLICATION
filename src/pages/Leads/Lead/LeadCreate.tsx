import React, { useEffect, useState, useRef } from "react";
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
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { createLead, selectLeadLoading, selectLeadError } from "../../../slices/leads/lead.slice";
import { LeadStatus } from "../../../slices/leads/lead.fakeData";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchTenantLocations,
  selectTenantLocationList,
} from "../../../slices/tenantLocations/tenantLocation.slice";
import { TenantLocationItem } from "../../../services/tenantLocationService";
import { getLoggedinUser } from "../../../helpers/api_helper";

import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";
import { formatFileSize } from "../../../common/attachmentUtils";

const LeadCreate: React.FC = () => {
  document.title = PAGE_TITLES.LEAD_CREATE;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useFlash();
  const loading = useSelector(selectLeadLoading);
  const error = useSelector(selectLeadError);
  const tenantLocations = useSelector(selectTenantLocationList);
  const authUser = getLoggedinUser();

  // State for file attachments
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Fetch tenant locations on component mount
  useEffect(() => {
    dispatch(fetchTenantLocations({ pageNumber: 1, pageSize: 200 }));
  }, [dispatch]);

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      contactPerson: "",
      contactEmail: "",
      description: "",
      leadStatus: LeadStatus.New,
      tentativeWorkDays: 0,
      notes: "",
      phoneNumber: "",
      siteAddress: "",
      tenantLocationId: "",
      tentativeProjectStartDate: "",
    },
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
      const payload: any = {
        tenantId: authUser?.tenantId || "",
        userId: authUser?.userId || "",
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
      };

      // Include attachments if any files are selected
      if (selectedFiles.length > 0) {
        payload.attachments = selectedFiles;
      }

      const result = await dispatch(createLead(payload));
      if (result.meta.requestStatus === "fulfilled") {
        // Use API success message if available, otherwise default message
        const successMessage = result.payload?.message || "Lead created successfully";
        showSuccess(successMessage);
        // Clear selected files after successful creation
        setSelectedFiles([]);
        // Delay navigation to show notification
        setTimeout(() => {
          navigate("/leads/list");
        }, 500);
      } else {
        const errorMessage = result.error?.message || "Failed to create lead";
        showError(errorMessage);
      }
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Add Lead" pageTitle="Leads" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Create Scaffolding Lead</h5>
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
                    disabled={validation.isSubmitting || loading}
                  >
                    {validation.isSubmitting || loading ? (
                      <>
                        <Spinner size="sm" /> Creating...
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line align-bottom me-1"></i> Create
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
                        <option value={LeadStatus.New}>New</option>
                        <option value={LeadStatus.Open}>Open</option>
                        <option value={LeadStatus.Approved}>Approved</option>
                        <option value={LeadStatus.Converted}>Converted</option>
                        <option value={LeadStatus.Cancelled}>Cancelled</option>
                        <option value={LeadStatus.Churned}>Churned</option>
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
                    <Col md={6}>
                      <Label className="form-label">Global Location</Label>
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
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Attachments Section - Matching LeadView/LeadEdit style */}
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <h5 className="card-title mb-3">Attachments</h5>
                
                <div
                  ref={dropZoneRef}
                  className={`border-2 border-dashed rounded p-4 mb-3 text-center ${
                    isDragging ? "border-primary bg-primary bg-opacity-10" : "border-secondary"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="mb-2">
                    <i className="ri-upload-cloud-2-line fs-1 text-primary"></i>
                  </div>
                  <h5 className="mb-1">
                    {isDragging ? "Drop files here" : "Drag & drop files here"}
                  </h5>
                  <p className="text-muted mb-2">or</p>
                  <Button
                    color="primary"
                    outline
                    size="sm"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    disabled={validation.isSubmitting || loading}
                  >
                    <i className="ri-folder-line align-bottom me-1"></i>
                    Browse Files
                  </Button>
                  <p className="text-muted mt-2 mb-0 small">
                    Supports multiple files • Max file size: 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    disabled={validation.isSubmitting || loading}
                    className="d-none"
                    accept="*/*"
                  />
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mb-3">
                    <Label className="form-label">Selected Files ({selectedFiles.length})</Label>
                    <ListGroup>
                      {selectedFiles.map((file, index) => (
                        <ListGroupItem
                          key={index}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex align-items-center">
                            <i className="ri-file-line fs-5 text-primary me-2"></i>
                            <div>
                              <div className="fw-medium">{file.name}</div>
                              <small className="text-muted">
                                {formatFileSize(file.size)}
                              </small>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            color="soft-danger"
                            type="button"
                            onClick={() => removeFile(index)}
                            disabled={validation.isSubmitting || loading}
                          >
                            <i className="ri-close-line"></i>
                          </Button>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LeadCreate;