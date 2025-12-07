import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  selectClientSiteList,
  selectClientSiteLoading,
  selectClientSiteError,
  deleteClientSite,
  fetchClientSites,
} from "../../../slices/clientSites/clientSite.slice";
import { ClientSiteItem } from "../../../slices/clientSites/clientSite.fakeData";

import { PAGE_TITLES } from "../../../common/branding";

const SitesList: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_SITES_LIST;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const sites: ClientSiteItem[] = useSelector(selectClientSiteList);
  const loading = useSelector(selectClientSiteLoading);
  const error = useSelector(selectClientSiteError);

  const [deleteModal, setDeleteModal] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);

  // NO useEffect - data loaded by AppInitService

  const filteredSites = useMemo(() => {
    if (!sites) return [];
    return sites.filter((s) => !s.isDeleted);
  }, [sites]);

  const onDelete = (id: string) => {
    setSiteToDelete(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (siteToDelete !== null) {
      const result = await dispatch(deleteClientSite(siteToDelete));
      if (result.meta.requestStatus === "fulfilled") {
        // Refresh sites list after successful deletion
        dispatch(fetchClientSites({ pageNumber: 1, pageSize: 50 }));
      }
    }
    setDeleteModal(false);
    setSiteToDelete(null);
  };

  const columns = useMemo(
    () => [
      {
        header: "Site Name",
        accessorKey: "siteName",
        enableColumnFilter: false,
        minSize: 150,
        maxSize: 250,
        cell: (cell: any) => {
          const site = cell.row.original;
          return (
            <div>
              <strong>{cell.getValue()}</strong>
              <p className="text-muted mb-0 small">{site.clientName || "-"}</p>
            </div>
          );
        },
      },
      {
        header: "Address",
        accessorKey: "address1",
        enableColumnFilter: false,
        minSize: 200,
        maxSize: 350,
        cell: (cell: any) => {
          const site = cell.row.original;
          const fullAddress = [site.address1, site.address2, site.zipcode]
            .filter(Boolean)
            .join(", ");
          return fullAddress || "-";
        },
      },
      {
        header: "Country",
        accessorKey: "countryName",
        enableColumnFilter: false,
        minSize: 120,
        maxSize: 180,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Geofencing",
        accessorKey: "requireGeofencing",
        enableColumnFilter: false,
        size: 120,
        minSize: 120,
        maxSize: 140,
        cell: (cell: any) => {
          const required = cell.getValue();
          return (
            <span
              className={`badge ${
                required
                  ? "bg-success-subtle text-success"
                  : "bg-secondary-subtle text-secondary"
              }`}
            >
              {required ? "Enabled" : "Disabled"}
            </span>
          );
        },
      },
      {
        header: "Radius (m)",
        accessorKey: "siteRadiusMeters",
        enableColumnFilter: false,
        size: 100,
        minSize: 100,
        maxSize: 120,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Action",
        size: 150,
        minSize: 150,
        maxSize: 150,
        cell: (cellProps: any) => {
          const site = cellProps.row.original;
          return (
            <div className="d-inline-flex gap-1 justify-content-end">
              <Button
                size="sm"
                color="soft-primary"
                onClick={() => navigate(`/clients/sites/view/${site.id}`)}
              >
                <i className="ri-eye-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-secondary"
                onClick={() => navigate(`/clients/sites/edit/${site.id}`)}
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => onDelete(site.id)}
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
    [navigate]
  );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Client Sites" pageTitle="Client Management" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row className="g-3 align-items-center">
                  <Col sm={4}>
                    <h5 className="card-title mb-0">Sites List</h5>
                  </Col>
                  <Col sm={8}>
                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      <Button
                        color="success"
                        onClick={() => navigate("/clients/sites/create")}
                      >
                        <i className="ri-add-line align-bottom me-1"></i>
                        Add Site
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
                    <p className="mt-2">Loading sites...</p>
                  </div>
                ) : (
                  <div>
                    <TableContainer
                      columns={columns}
                      data={filteredSites || []}
                      isGlobalFilter={true}
                      customPageSize={10}
                      divClass="table-responsive mb-3"
                      tableClass="align-middle table-nowrap mb-0"
                      SearchPlaceholder="Search sites..."
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

export default SitesList;
