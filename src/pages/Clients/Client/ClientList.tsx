import React, { useMemo, useState } from "react";
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
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import ClientCard from "./ClientCard";
import {
  selectClientList,
  selectClient,
  fetchClients,
  deleteClient,
  selectClientLoading,
  selectClientError,
} from "../../../slices/clients/client.slice";
import { ClientItem } from "../../../slices/clients/client.fakeData";
import { useNavigate } from "react-router-dom";

import { PAGE_TITLES } from "../../../common/branding";

const ClientList: React.FC = () => {
  document.title = PAGE_TITLES.CLIENTS_LIST;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const clients: ClientItem[] = useSelector(selectClientList);
  const loading = useSelector(selectClientLoading);
  const error = useSelector(selectClientError);

  const [deleteModal, setDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!clients) return [];
    return clients.filter((c) => !c.isDeleted);
  }, [clients]);

  const onDelete = (id: string) => {
    setClientToDelete(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete !== null) {
      const result = await dispatch(deleteClient(clientToDelete));
      if (result.meta.requestStatus === "fulfilled") {
        // Refresh clients list after successful deletion
        dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
      }
    }
    setDeleteModal(false);
    setClientToDelete(null);
  };

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Registration",
        accessorKey: "registeredNumber",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "GST",
        accessorKey: "gstNumber",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Manager Name",
        accessorKey: "managerFirstName",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          const client = cellProps.row.original;
          return `${client.managerFirstName} ${client.managerLastName}` || "-";
        },
      },
      {
        header: "Manager Email",
        accessorKey: "managerEmailId",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Status",
        accessorKey: "isPriority",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const isPriority = cell.getValue();
          return isPriority ? (
            <Badge color="warning">Priority</Badge>
          ) : (
            <Badge color="secondary">Standard</Badge>
          );
        },
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          const client = cellProps.row.original;
          return (
            <div className="d-inline-flex gap-1">
              <Button
                size="sm"
                color="soft-primary"
                onClick={() => {
                  dispatch(selectClient(client.id));
                  navigate(`/clients/view/${client.id}`);
                }}
              >
                <i className="ri-eye-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-secondary"
                onClick={() => {
                  dispatch(selectClient(client.id));
                  navigate(`/clients/edit/${client.id}`);
                }}
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-info"
                onClick={() => navigate(`/clients/${client.id}/rental-config`)}
              >
                <i className="ri-settings-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => onDelete(client.id)}
              >
                <i className="ri-delete-bin-line"></i>
              </Button>
            </div>
          );
        },
      },
    ],
    [dispatch, navigate]
  );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Clients" pageTitle="Client Management" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row className="g-3 align-items-center">
                  <Col sm={6}>
                    <h5 className="card-title mb-0">Client List</h5>
                  </Col>
                  <Col sm={6}>
                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      <Dropdown
                        isOpen={dropdownOpen}
                        toggle={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <DropdownToggle
                          color="light"
                          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                        >
                          <i className="ri-list-unordered"></i>
                        </DropdownToggle>
                        <DropdownMenu end>
                          <DropdownItem
                            active={viewMode === "table"}
                            onClick={() => setViewMode("table")}
                          >
                            <i className="ri-table-line align-bottom me-2"></i>
                            Table View
                          </DropdownItem>
                          <DropdownItem
                            active={viewMode === "card"}
                            onClick={() => setViewMode("card")}
                          >
                            <i className="ri-layout-grid-line align-bottom me-2"></i>
                            Card View
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                      <Button
                        color="success"
                        onClick={() => navigate("/clients/create")}
                      >
                        <i className="ri-add-line align-bottom me-1"></i>
                        Create Client
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {error && (
                  <Alert color="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                    <p className="mt-2">Loading clients...</p>
                  </div>
                ) : (
                  <div>
                    {viewMode === "table" ? (
                      <TableContainer
                        columns={columns}
                        data={filtered || []}
                        isGlobalFilter={true}
                        customPageSize={10}
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap mb-0"
                        SearchPlaceholder="Search clients..."
                      />
                    ) : (
                      <div className="row row-cols-xxl-4 row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-4">
                        {filtered && filtered.length > 0 ? (
                          filtered.map((client) => (
                            <div className="col" key={client.id}>
                              <ClientCard client={client} onDelete={onDelete} />
                            </div>
                          ))
                        ) : (
                          <div className="col-12">
                            <div className="text-center py-5">
                              <p>No clients found</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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

export default ClientList;