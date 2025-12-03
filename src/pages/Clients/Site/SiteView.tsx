import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Button,
  Alert,
  Form,
  Label,
  Input,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  selectClientSiteById,
  deleteClientSite,
  fetchClientSites,
} from "../../../slices/clientSites/clientSite.slice";

import { PAGE_TITLES } from "../../../common/branding";

const SiteView: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_SITE_VIEW;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { id } = useParams();

  const site = useSelector((state: any) => selectClientSiteById(state, id || ""));
  const [deleteModal, setDeleteModal] = React.useState(false);

  const handleDeleteSite = async () => {
    if (id) {
      const result = await dispatch(deleteClientSite(id));
      if (result.meta.requestStatus === "fulfilled") {
        // Refresh and navigate back
        dispatch(fetchClientSites({ pageNumber: 1, pageSize: 50 }));
        navigate("/clients/sites");
      }
    }
    setDeleteModal(false);
  };

  if (!site) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Site not found</Alert>
          <Button color="primary" onClick={() => navigate("/clients/sites")}>
            Back to Sites
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="View Site" pageTitle="Sites" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">View Client Site</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/clients/sites")}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate(`/clients/sites/edit/${site.id}`)}
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
                      <Label className="form-label">Client</Label>
                      <Input
                        name="clientName"
                        value={site.clientName || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Site Name</Label>
                      <Input
                        name="siteName"
                        value={site.siteName}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Address Line 1</Label>
                      <Input
                        name="address1"
                        value={site.address1 || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Address Line 2</Label>
                      <Input
                        name="address2"
                        value={site.address2 || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={4}>
                      <Label className="form-label">Country</Label>
                      <Input
                        name="countryName"
                        value={site.countryName || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={4}>
                      <Label className="form-label">Zipcode</Label>
                      <Input
                        name="zipcode"
                        value={site.zipcode || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={4}>
                      <Label className="form-label">Site Radius (meters)</Label>
                      <Input
                        name="siteRadiusMeters"
                        value={site.siteRadiusMeters?.toString() || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={4}>
                      <Label className="form-label">Latitude</Label>
                      <Input
                        name="latitude"
                        value={site.latitude?.toString() || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={4}>
                      <Label className="form-label">Longitude</Label>
                      <Input
                        name="longitude"
                        value={site.longitude?.toString() || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={4}>
                      <Label className="form-label">Geofencing</Label>
                      <Input
                        name="requireGeofencing"
                        value={site.requireGeofencing ? "Enabled" : "Disabled"}
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

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteSite}
        onCloseClick={() => setDeleteModal(false)}
      />
    </div>
  );
};

export default SiteView;
