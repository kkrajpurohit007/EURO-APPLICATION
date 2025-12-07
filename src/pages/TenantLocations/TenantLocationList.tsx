import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";
import {
  selectTenantLocationList,
  selectTenantLocation,
  fetchTenantLocations,
  deleteTenantLocation,
  selectTenantLocationLoading,
  selectTenantLocationError,
} from "../../slices/tenantLocations/tenantLocation.slice";
import { TenantLocationItem } from "../../services/tenantLocationService";
import { useNavigate } from "react-router-dom";

import { PAGE_TITLES } from "../../common/branding";

const TenantLocationList: React.FC = () => {
  document.title = PAGE_TITLES.TENANT_LOCATIONS_LIST;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const tenantLocations: TenantLocationItem[] = useSelector(selectTenantLocationList);
  const loading = useSelector(selectTenantLocationLoading);
  const error = useSelector(selectTenantLocationError);

  const [deleteModal, setDeleteModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTenantLocations({ pageNumber: 1, pageSize: 20 }));
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!tenantLocations) return [];
    return tenantLocations.filter((tl) => !tl.isDeleted);
  }, [tenantLocations]);

  const onDelete = (id: string) => {
    setLocationToDelete(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (locationToDelete !== null) {
      const result = await dispatch(deleteTenantLocation(locationToDelete));
      if (result.meta.requestStatus === "fulfilled") {
        // Refresh global locations list after successful deletion
        dispatch(fetchTenantLocations({ pageNumber: 1, pageSize: 20 }));
      }
    }
    setDeleteModal(false);
    setLocationToDelete(null);
  };

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        minSize: 150,
        maxSize: 250,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Description",
        accessorKey: "description",
        enableColumnFilter: false,
        minSize: 200,
        maxSize: 400,
        cell: (cell: any) => {
          const desc = cell.getValue();
          return desc ? (desc.length > 50 ? desc.substring(0, 50) + "..." : desc) : "-";
        },
      },
      {
        header: "Created",
        accessorKey: "created",
        enableColumnFilter: false,
        size: 120,
        minSize: 120,
        maxSize: 140,
        cell: (cell: any) => {
          const date = cell.getValue();
          return date ? new Date(date).toLocaleDateString() : "-";
        },
      },
      {
        header: "Action",
        size: 150,
        minSize: 150,
        maxSize: 150,
        cell: (cellProps: any) => {
          const location = cellProps.row.original;
          return (
            <div className="d-inline-flex gap-1 justify-content-end">
              <Button
                size="sm"
                color="soft-primary"
                onClick={() => {
                  dispatch(selectTenantLocation(location.id));
                  navigate(`/tenant-locations/view/${location.id}`);
                }}
              >
                <i className="ri-eye-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-secondary"
                onClick={() => {
                  dispatch(selectTenantLocation(location.id));
                  navigate(`/tenant-locations/edit/${location.id}`);
                }}
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => onDelete(location.id)}
              >
                <i className="ri-delete-bin-line"></i>
              </Button>
            </div>
          );
        },
        meta: {
          className: "text-end",
        },
      },
    ],
    [dispatch, navigate]
  );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Global Locations" pageTitle="Settings" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row className="g-3 align-items-center">
                  <Col sm={6}>
                    <h5 className="card-title mb-0">Global Location List</h5>
                  </Col>
                  <Col sm={6}>
                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      <Button
                        color="success"
                        onClick={() => navigate("/tenant-locations/create")}
                      >
                        <i className="ri-add-line align-bottom me-1"></i>
                        Add Global Location
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="p-4">
                {error && (
                  <Alert color="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                    <p className="mt-2">Loading global locations...</p>
                  </div>
                ) : (
                  <div>
                    <TableContainer
                      columns={columns}
                      data={filtered || []}
                      isGlobalFilter={true}
                      customPageSize={10}
                      divClass="table-responsive mb-3"
                      tableClass="align-middle table-nowrap mb-0"
                      SearchPlaceholder="Search global locations..."
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={confirmDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
    </div>
  );
};

export default TenantLocationList;


