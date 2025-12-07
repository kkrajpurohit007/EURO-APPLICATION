import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  Badge,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { selectClientContactById } from "../../../slices/clientContacts/clientContact.slice";
import { PAGE_TITLES } from "../../../common/branding";

const ClientContactView: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_CONTACT_VIEW;
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contact = useSelector((state: any) =>
    selectClientContactById(state, id || "")
  );

  // Get clientId from URL params or from contact object
  const clientIdFromUrl = searchParams.get("clientId") || "";
  const clientId = clientIdFromUrl || contact?.clientId || "";

  if (!contact) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Client Contact not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="View Contact" pageTitle="Client Contacts" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">View Client Contact Details</h5>
                <div className="d-flex gap-2">
                  <Button
                    color="light"
                    onClick={() => {
                      if (clientId) {
                        navigate(`/clients/view/${clientId}`);
                      } else {
                        navigate("/clients/contacts");
                      }
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      // Pass clientId as query param when navigating to edit
                      if (clientId) {
                        navigate(`/clients/contacts/edit/${id}?clientId=${clientId}`);
                      } else {
                        navigate(`/clients/contacts/edit/${id}`);
                      }
                    }}
                  >
                    <i className="ri-pencil-line align-bottom me-1"></i>
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row className="g-3">
                    <Col md={6}>
                      <Label className="form-label">Title</Label>
                      <Input
                        name="title"
                        value={contact.title || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Client</Label>
                      <Input
                        name="clientName"
                        value={contact.clientName || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">First Name</Label>
                      <Input
                        name="contactFirstName"
                        value={contact.contactFirstName || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Last Name</Label>
                      <Input
                        name="contactLastName"
                        value={contact.contactLastName || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        value={contact.email || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Mobile</Label>
                      <Input
                        name="mobile"
                        value={contact.mobile || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Work Phone</Label>
                      <Input
                        name="workPhone"
                        value={contact.workPhone || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Portal Access</Label>
                      <div className="mt-2">
                        {contact.isAllowPortalAccess ? (
                          <Badge color="success" className="badge-label">
                            <i className="mdi mdi-circle-medium"></i> Allowed
                          </Badge>
                        ) : (
                          <Badge color="secondary" className="badge-label">
                            <i className="mdi mdi-circle-medium"></i> Not
                            Allowed
                          </Badge>
                        )}
                      </div>
                    </Col>

                    <Col md={12}>
                      <Label className="form-label">Notes</Label>
                      <Input
                        type="textarea"
                        rows={3}
                        name="notes"
                        value={contact.notes || "No notes available"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
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

export default ClientContactView;
