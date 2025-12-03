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
import { selectClientById } from "../../../slices/clients/client.slice";

import { PAGE_TITLES } from "../../../common/branding";

const ClientView: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_VIEW;
  const { id } = useParams();
  const navigate = useNavigate();
  const client = useSelector((state: any) => selectClientById(state, id || ""));

  if (!client) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Client not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="View Client" pageTitle="Clients" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">View Client Details</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/clients/list")}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate(`/clients/edit/${id}`)}
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
                      <Label className="form-label">Name</Label>
                      <Input
                        name="name"
                        value={client.name || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Register No.</Label>
                      <Input
                        name="ein"
                        value={client.ein || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">GST Number</Label>
                      <Input
                        name="gstNumber"
                        value={client.gstNumber || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Country</Label>
                      <Input
                        name="countryName"
                        value={client.countryName || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={12}>
                      <Label className="form-label">Address Line 1</Label>
                      <Input
                        name="address1"
                        value={client.address1 || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={12}>
                      <Label className="form-label">Address Line 2</Label>
                      <Input
                        name="address2"
                        value={client.address2 || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Zipcode</Label>
                      <Input
                        name="zipcode"
                        value={client.zipcode || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Manager First Name</Label>
                      <Input
                        name="managerFirstName"
                        value={client.managerFirstName || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Manager Last Name</Label>
                      <Input
                        name="managerLastName"
                        value={client.managerLastName || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Manager Email</Label>
                      <Input
                        type="email"
                        name="managerEmailId"
                        value={client.managerEmailId || ""}
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

export default ClientView;
