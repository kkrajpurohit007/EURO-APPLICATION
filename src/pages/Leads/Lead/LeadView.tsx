import React from "react";
import { useSelector } from "react-redux";
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
  Alert,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { selectLeadById } from "../../../slices/leads/lead.slice";
import { LeadStatusLabels, LeadStatus } from "../../../slices/leads/lead.fakeData";

import { PAGE_TITLES } from "../../../common/branding";
import { formatDate } from "../../../common/utils";
import LeadAttachmentManager from "../../../Components/Common/LeadAttachmentManager";

const LeadView: React.FC = () => {
  document.title = PAGE_TITLES.LEAD_VIEW;
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = useSelector((state: any) => selectLeadById(state, id || ""));

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
        <BreadCrumb title="View Lead" pageTitle="Leads" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">View Scaffolding Lead</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/leads/list")}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate(`/leads/edit/${id}`)}
                  >
                    <i className="ri-pencil-line align-bottom me-1"></i>
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  {/* Section A: Lead Basic Info */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Lead Basic Info</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">Lead Title</Label>
                        <Input
                          name="title"
                          value={lead.title || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Lead Status</Label>
                        <Input
                          name="leadStatus"
                          value={LeadStatusLabels[lead.leadStatus as LeadStatus] || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={12}>
                        <Label className="form-label">Description</Label>
                        <Input
                          type="textarea"
                          rows={3}
                          name="description"
                          value={lead.description || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Section B: Contact Details */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Contact Details</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">Contact Person</Label>
                        <Input
                          name="contactPerson"
                          value={lead.contactPerson || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Contact Email</Label>
                        <Input
                          type="email"
                          name="contactEmail"
                          value={lead.contactEmail || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Phone Number</Label>
                        <Input
                          type="tel"
                          name="phoneNumber"
                          value={lead.phoneNumber || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
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
                          type="text"
                          name="tentativeWorkDays"
                          value={lead.tentativeWorkDays || "0"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Tentative Project Start Date</Label>
                        <Input
                          name="tentativeProjectStartDate"
                          value={formatDate(lead.tentativeProjectStartDate)}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={12}>
                        <Label className="form-label">Site Address</Label>
                        <Input
                          type="textarea"
                          rows={2}
                          name="siteAddress"
                          value={lead.siteAddress || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
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
                          value={lead.notes || "No notes available"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Location</Label>
                        <Input
                          name="tenantLocationName"
                          value={lead.tenantLocationName || "-"}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
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
            <LeadAttachmentManager leadId={id || ""} readOnly={true} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LeadView;