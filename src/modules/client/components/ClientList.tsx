import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { BreadCrumb, TableContainer, DeleteModal, Card, CardBodyShared, CardHeaderShared, Button, Badge } from "../../../shared/components";
import {
  selectClientList,
  selectClient,
  fetchClients,
  deleteClient,
  selectClientLoading,
  selectClientError,
  ClientItem,
} from "../index";
import { PAGE_TITLES } from "../../../shared/constants";
import ClientCard from "./ClientCard";

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

  // Lazy load data when component mounts
  useEffect(() => {
    dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
  }, [dispatch]);

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
        minSize: 150,
        maxSize: 250,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Registration",
        accessorKey: "registeredNumber",
        enableColumnFilter: false,
        minSize: 120,
        maxSize: 200,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "GST",
        accessorKey: "gstNumber",
        enableColumnFilter: false,
        minSize: 120,
        maxSize: 180,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Manager Name",
        accessorKey: "managerFirstName",
        enableColumnFilter: false,
        minSize: 150,
        maxSize: 200,
        cell: (cellProps: any) => {
          const client = cellProps.row.original;
          return `${client.managerFirstName} ${client.managerLastName}` || "-";
        },
      },
      {
        header: "Manager Email",
        accessorKey: "managerEmailId",
        enableColumnFilter: false,
        minSize: 200,
        maxSize: 300,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Status",
        accessorKey: "isPriority",
        enableColumnFilter: false,
        size: 100,
        minSize: 100,
        maxSize: 120,
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
        size: 150,
        minSize: 150,
        maxSize: 150,
        cell: (cellProps: any) => {
          const client = cellProps.row.original;
          return (
            <div className="d-inline-flex gap-1 justify-content-end">
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
                color="soft-danger"
                onClick={() => onDelete(client.id)}
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
        <BreadCrumb title="Clients" pageTitle="Client Management" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeaderShared>
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
                        Add Client
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardHeaderShared>
              <CardBodyShared padding="lg">
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
                        divClass="table-responsive mb-3"
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
              </CardBodyShared>
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

