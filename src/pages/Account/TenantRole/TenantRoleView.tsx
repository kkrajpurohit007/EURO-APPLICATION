import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { getTenantRoleById } from "../../../slices/tenantRoles/tenantRole.slice";
import { createSelector } from "reselect";
import Loader from "../../../Components/Common/Loader";
import { PAGE_TITLES } from "../../../common/branding";

const TenantRoleView: React.FC = () => {
  document.title = PAGE_TITLES.TENANT_ROLE_VIEW || "View Tenant Role | ESRM";
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const selectLayoutState = (state: any) => state.TenantRoles;
  const selectTenantRoleProperties = createSelector(
    selectLayoutState,
    (state) => ({
      tenantRole: state.tenantRole,
      error: state.error,
      loading: state.loading,
    })
  );

  const { tenantRole, error, loading } = useSelector(selectTenantRoleProperties);

  useEffect(() => {
    if (id) {
      dispatch(getTenantRoleById(id));
    }
  }, [dispatch, id]);

  if (loading && !tenantRole) {
    return <Loader error={error} />;
  }

  if (!tenantRole && !loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Tenant role not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="View Tenant Role" pageTitle="Tenant Roles" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">View Tenant Role Details</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/account/tenant-roles")}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate(`/account/tenant-roles/edit/${id}`)}
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
                      <Label className="form-label">Role Name</Label>
                      <Input
                        name="name"
                        value={tenantRole?.name || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Profile</Label>
                      <Input
                        name="profileName"
                        value={tenantRole?.profileName || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Tenant</Label>
                      <Input
                        name="tenantName"
                        value={tenantRole?.tenantName || "-"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Sensitive Role</Label>
                      <Input
                        name="isSensitive"
                        value={tenantRole?.isSensitive ? "Yes" : "No"}
                        readOnly
                        plaintext
                        className="form-control-plaintext bg-light px-3 py-2 rounded"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Status</Label>
                      <Input
                        name="isDeleted"
                        value={tenantRole?.isDeleted ? "Deleted" : "Active"}
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
                        value={tenantRole?.description || "No description available"}
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

export default TenantRoleView;

