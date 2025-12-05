import React, { useEffect } from "react";
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
  Alert,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  selectTenantLocationById,
  fetchTenantLocations,
} from "../../slices/tenantLocations/tenantLocation.slice";

import { PAGE_TITLES } from "../../common/branding";

const TenantLocationView: React.FC = () => {
  document.title = PAGE_TITLES.TENANT_LOCATION_VIEW;
  const dispatch = useDispatch<any>();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useSelector((state: any) => selectTenantLocationById(state, id || ""));

  useEffect(() => {
    if (!location && id) {
      dispatch(fetchTenantLocations({ pageNumber: 1, pageSize: 100 }));
    }
  }, [dispatch, id, location]);

  if (!location) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Tenant location not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="View Tenant Location" pageTitle="Tenant Locations" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">View Tenant Location Details</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/tenant-locations/list")}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate(`/tenant-locations/edit/${id}`)}
                  >
                    <i className="ri-pencil-line align-bottom me-1"></i>
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row className="g-3">
                    <Col md={12}>
                      <Label className="form-label">Name</Label>
                      <Input
                        name="name"
                        value={location.name || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={12}>
                      <Label className="form-label">Description</Label>
                      <Input
                        type="textarea"
                        name="description"
                        rows={5}
                        value={location.description || ""}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Created</Label>
                      <Input
                        name="created"
                        value={
                          location.created
                            ? new Date(location.created).toLocaleString()
                            : "-"
                        }
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    {location.modified && (
                      <Col md={6}>
                        <Label className="form-label">Modified</Label>
                        <Input
                          name="modified"
                          value={new Date(location.modified).toLocaleString()}
                          readOnly
                          plaintext
                          className="form-control-plaintext bg-light px-3 py-2 rounded"
                        />
                      </Col>
                    )}
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

export default TenantLocationView;

