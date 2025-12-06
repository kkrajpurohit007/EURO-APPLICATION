import React, { useState, useEffect } from "react";
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
  FormFeedback,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import MapComponent from "../../../Components/Common/MapComponent";
import {
  selectClientSiteById,
  deleteClientSite,
  fetchClientSites,
  updateClientSite,
} from "../../../slices/clientSites/clientSite.slice";
import { useFlash } from "../../../hooks/useFlash";
import { PAGE_TITLES } from "../../../common/branding";

const SiteView: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_SITE_VIEW;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useFlash();

  const site = useSelector((state: any) => selectClientSiteById(state, id || ""));
  const [deleteModal, setDeleteModal] = React.useState(false);
  
  // State for editable coordinates
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<{ latitude?: string; longitude?: string }>({});

  // Initialize coordinates from site data
  useEffect(() => {
    if (site) {
      const lat = site.latitude || 0;
      const lng = site.longitude || 0;
      setLatitude(lat);
      setLongitude(lng);
      setHasChanges(false);
    }
  }, [site]);

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

  // Validate coordinates
  const validateCoordinates = (lat: number, lng: number): boolean => {
    const newErrors: { latitude?: string; longitude?: string } = {};
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }
    
    if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle marker drag end
  const handleMarkerDragEnd = (lat: number, lng: number) => {
    if (validateCoordinates(lat, lng)) {
      setLatitude(lat);
      setLongitude(lng);
      setHasChanges(true);
    }
  };

  // Handle manual coordinate input change
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
    if (!isNaN(value)) {
      setLatitude(value);
      setHasChanges(true);
      validateCoordinates(value, longitude);
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
    if (!isNaN(value)) {
      setLongitude(value);
      setHasChanges(true);
      validateCoordinates(latitude, value);
    }
  };

  // Handle save coordinates
  const handleSaveCoordinates = async () => {
    if (!id || !site) return;
    
    if (!validateCoordinates(latitude, longitude)) {
      showError("Please fix validation errors before saving");
      return;
    }

    // Check if coordinates actually changed
    if (site.latitude === latitude && site.longitude === longitude) {
      showError("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      const result = await dispatch(
        updateClientSite({
          id,
          data: {
            ...site,
            latitude,
            longitude,
          },
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Site coordinates updated successfully");
        setHasChanges(false);
        // Refresh sites list to get updated data
        dispatch(fetchClientSites({ pageNumber: 1, pageSize: 50 }));
      } else {
        showError("Failed to update site coordinates");
      }
    } catch (error) {
      showError("An error occurred while updating coordinates");
    } finally {
      setIsSaving(false);
    }
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

        {/* Map + Coordinates Section */}
        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Map & Coordinates</h5>
                {hasChanges && (
                  <Button
                    color="primary"
                    onClick={handleSaveCoordinates}
                    disabled={isSaving || Object.keys(errors).length > 0}
                  >
                    <i className="ri-save-line align-bottom me-1"></i>
                    {isSaving ? "Saving..." : "Save Coordinates"}
                  </Button>
                )}
              </CardHeader>
              <CardBody>
                <Row className="g-3">
                  {/* Map */}
                  <Col lg={12}>
                    <Label className="form-label mb-2">Location Map</Label>
                    <MapComponent
                      latitude={latitude}
                      longitude={longitude}
                      onMarkerDragEnd={handleMarkerDragEnd}
                      draggable={true}
                      height="400px"
                      zoom={13}
                    />
                  </Col>

                  {/* Coordinate Fields */}
                  <Col md={6}>
                    <Label className="form-label">Latitude *</Label>
                    <Input
                      type="number"
                      step="any"
                      name="latitude"
                      value={latitude}
                      onChange={handleLatitudeChange}
                      invalid={!!errors.latitude}
                      placeholder="Enter latitude (-90 to 90)"
                    />
                    {errors.latitude && (
                      <FormFeedback type="invalid">{errors.latitude}</FormFeedback>
                    )}
                  </Col>
                  <Col md={6}>
                    <Label className="form-label">Longitude *</Label>
                    <Input
                      type="number"
                      step="any"
                      name="longitude"
                      value={longitude}
                      onChange={handleLongitudeChange}
                      invalid={!!errors.longitude}
                      placeholder="Enter longitude (-180 to 180)"
                    />
                    {errors.longitude && (
                      <FormFeedback type="invalid">{errors.longitude}</FormFeedback>
                    )}
                  </Col>
                </Row>
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
