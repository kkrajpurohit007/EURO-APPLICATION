import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Button,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  getTenantRoles,
} from "../../../slices/tenantRoles/tenantRole.slice";
import { createSelector } from "reselect";
import Loader from "../../../Components/Common/Loader";
import { PAGE_TITLES } from "../../../common/branding";

const TenantRoleList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const selectLayoutState = (state: any) => state.TenantRoles;
  const selectTenantRoleProperties = createSelector(
    selectLayoutState,
    (state) => ({
      tenantRoles: state.tenantRoles,
      error: state.error,
      loading: state.loading,
    })
  );

  const { tenantRoles, error, loading } = useSelector(selectTenantRoleProperties);

  useEffect(() => {
    if (!tenantRoles || tenantRoles.length === 0) {
      dispatch(getTenantRoles({ pageNumber: 1, pageSize: 20 }));
    }
  }, [dispatch, tenantRoles]);

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        minSize: 150,
        maxSize: 250,
        cell: (cell: any) => {
          return (
            <div>
              <strong>{cell.getValue()}</strong>
              <p className="text-muted mb-0 small">
                {cell.row.original.description}
              </p>
            </div>
          );
        },
      },
      {
        header: "Profile",
        accessorKey: "profileName",
        enableColumnFilter: false,
        minSize: 120,
        maxSize: 180,
        cell: (cell: any) => {
          return <span className="badge bg-info">{cell.getValue() || "-"}</span>;
        },
      },
      {
        header: "Sensitive",
        accessorKey: "isSensitive",
        enableColumnFilter: false,
        size: 100,
        minSize: 100,
        maxSize: 120,
        cell: (cell: any) => {
          const isSensitive = cell.getValue();
          return isSensitive ? (
            <span className="badge bg-warning">Yes</span>
          ) : (
            <span className="badge bg-secondary">No</span>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "isDeleted",
        enableColumnFilter: false,
        size: 100,
        minSize: 100,
        maxSize: 120,
        cell: (cell: any) => {
          const isDeleted = cell.getValue();
          return isDeleted ? (
            <span className="badge bg-danger">Deleted</span>
          ) : (
            <span className="badge bg-success">Active</span>
          );
        },
      },
      {
        header: "Action",
        size: 150,
        minSize: 150,
        maxSize: 150,
        cell: (cellProps: any) => {
          return (
            <div className="d-inline-flex gap-1 justify-content-end">
              <Button
                size="sm"
                color="soft-primary"
                onClick={() =>
                  navigate(
                    `/account/tenant-roles/view/${cellProps.row.original.id}`
                  )
                }
              >
                <i className="ri-eye-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-secondary"
                onClick={() =>
                  navigate(
                    `/account/tenant-roles/edit/${cellProps.row.original.id}`
                  )
                }
              >
                <i className="ri-pencil-line"></i>
              </Button>
            </div>
          );
        },
        meta: {
          className: "text-end",
        },
      },
    ],
    [navigate]
  );

  document.title = PAGE_TITLES.TENANT_ROLES_LIST || "User Roles | ESRM";

  // Filter out deleted roles
  const filtered = useMemo(() => {
    if (!tenantRoles) return [];
    return tenantRoles.filter((r: any) => !r.isDeleted);
  }, [tenantRoles]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="User Roles" pageTitle="Account" />
          <Row>
            <Col lg={12}>
              <Card id="tenantRolesList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <Col sm={3}>
                      <div>
                        <h5 className="card-title mb-0">User Role List</h5>
                      </div>
                    </Col>
                    <Col sm={9}>
                      <div className="text-end">
                        <Link
                          to="/account/tenant-roles/create"
                          className="btn btn-success"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Role
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="p-4">
                  <div>
                    {loading && (!tenantRoles || tenantRoles.length === 0) ? (
                      <Loader error={error} />
                    ) : (
                      <TableContainer
                        columns={columns}
                        data={filtered || []}
                        isGlobalFilter={true}
                        customPageSize={10}
                        divClass="table-responsive mb-3"
                        tableClass="align-middle table-nowrap mb-0"
                        SearchPlaceholder="Search for user roles..."
                      />
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TenantRoleList;

