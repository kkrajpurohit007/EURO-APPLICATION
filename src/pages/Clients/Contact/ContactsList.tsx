import React, { useMemo, useState, useEffect } from "react";
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
  Input,
  InputGroup,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import ContactCard from "./ContactCard";
import {
  selectClientContactList,
  selectClientContact,
  fetchClientContacts,
  deleteClientContact,
  selectClientContactLoading,
  selectClientContactError,
} from "../../../slices/clientContacts/clientContact.slice";
import { selectClientList } from "../../../slices/clients/client.slice";
import { fetchClients } from "../../../slices/clients/client.slice";
import { ClientContactItem } from "../../../slices/clientContacts/clientContact.fakeData";
import { useNavigate } from "react-router-dom";
import { PAGE_TITLES } from "../../../common/branding";
import {
  filterContactsBySearch,
  filterContactsByStatus,
  filterContactsByClient,
} from "./utils/contactUtils";

const ContactsList: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_CONTACTS_LIST;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const clientContacts: ClientContactItem[] = useSelector(
    selectClientContactList
  );
  const loading = useSelector(selectClientContactLoading);
  const error = useSelector(selectClientContactError);
  const clients = useSelector(selectClientList);

  const [deleteModal, setDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [clientFilter, setClientFilter] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12); // 12 cards per page for card view

  // Fetch clients if not loaded
  useEffect(() => {
    if (!clients || clients.length === 0) {
      dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
    }
  }, [dispatch, clients]);

  // Fetch contacts on mount
  useEffect(() => {
    dispatch(fetchClientContacts({ pageNumber: 1, pageSize: 50 }));
  }, [dispatch]);

  // Filter contacts based on search, status, and client filters
  const filtered = useMemo(() => {
    if (!clientContacts) return [];
    
    let result = clientContacts.filter((c) => !c.isDeleted);
    
    // Apply search filter
    if (searchQuery.trim()) {
      result = filterContactsBySearch(result, searchQuery);
    }
    
    // Apply status filter
    result = filterContactsByStatus(result, statusFilter);
    
    // Apply client filter
    result = filterContactsByClient(result, clientFilter);
    
    return result;
  }, [clientContacts, searchQuery, statusFilter, clientFilter]);

  // Paginate filtered contacts for card view
  const paginatedContacts = useMemo(() => {
    if (viewMode === "table") return filtered;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, pageSize, viewMode]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, clientFilter]);

  // Client options for filter dropdown
  const clientOptions = useMemo(() => {
    return [
      { value: undefined, label: "All Clients" },
      ...clients
        .filter((c: any) => !c.isDeleted)
        .map((client: any) => ({
          value: client.id,
          label: client.name,
        })),
    ];
  }, [clients]);

  // Status filter options
  const statusOptions = useMemo(() => {
    return [
      { value: "all", label: "All Statuses" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ];
  }, []);

  const onDelete = (id: string) => {
    setContactToDelete(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (contactToDelete !== null) {
      const result = await dispatch(deleteClientContact(contactToDelete));
      if (result.meta.requestStatus === "fulfilled") {
        // Refresh client contacts list after successful deletion
        dispatch(fetchClientContacts({ pageNumber: 1, pageSize: 50 }));
      }
    }
    setDeleteModal(false);
    setContactToDelete(null);
  };

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "First Name",
        accessorKey: "contactFirstName",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Last Name",
        accessorKey: "contactLastName",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Mobile",
        accessorKey: "mobile",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Work Phone",
        accessorKey: "workPhone",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Client",
        accessorKey: "clientName",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Portal Access",
        accessorKey: "isAllowPortalAccess",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const hasAccess = cell.getValue();
          return hasAccess ? (
            <Badge color="success" className="badge-label">
              <i className="mdi mdi-circle-medium"></i> Yes
            </Badge>
          ) : (
            <Badge color="secondary" className="badge-label">
              <i className="mdi mdi-circle-medium"></i> No
            </Badge>
          );
        },
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          const contact = cellProps.row.original;
          return (
            <div className="d-inline-flex gap-1">
              <Button
                size="sm"
                color="soft-primary"
                onClick={() => {
                  dispatch(selectClientContact(contact.id));
                  navigate(`/clients/contacts/view/${contact.id}`);
                }}
              >
                <i className="ri-eye-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-secondary"
                onClick={() => {
                  dispatch(selectClientContact(contact.id));
                  navigate(`/clients/contacts/edit/${contact.id}`);
                }}
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => onDelete(contact.id)}
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
        <BreadCrumb title="Client Contacts" pageTitle="Client Management" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row className="g-3 align-items-center">
                  <Col sm={6}>
                    <h5 className="card-title mb-0">
                      Client Contact List
                      {filtered.length > 0 && (
                        <span className="text-muted ms-2 fs-14">
                          ({filtered.length} {filtered.length === 1 ? "contact" : "contacts"})
                        </span>
                      )}
                    </h5>
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
                          <i className={viewMode === "table" ? "ri-table-line" : "ri-layout-grid-line"}></i>
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
                        onClick={() => navigate("/clients/contacts/create")}
                      >
                        <i className="ri-add-line align-bottom me-1"></i>
                        Create Contact
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

                {/* Search and Filter Bar (shown for both views) */}
                {(viewMode === "card" || searchQuery || statusFilter !== "all" || clientFilter) && (
                  <Row className="mb-3 g-2">
                    <Col md={4}>
                      <InputGroup>
                        <Input
                          type="text"
                          placeholder="Search contacts..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button color="light" disabled>
                          <i className="ri-search-line"></i>
                        </Button>
                      </InputGroup>
                    </Col>
                    <Col md={3}>
                      <Select
                        value={statusOptions.find((opt) => opt.value === statusFilter)}
                        onChange={(selectedOption: any) => {
                          setStatusFilter(selectedOption?.value || "all");
                        }}
                        options={statusOptions}
                        placeholder="Filter by Status"
                        classNamePrefix="select2-selection"
                        isClearable={false}
                      />
                    </Col>
                    <Col md={3}>
                      <Select
                        value={clientOptions.find((opt) => opt.value === clientFilter)}
                        onChange={(selectedOption: any) => {
                          setClientFilter(selectedOption?.value);
                        }}
                        options={clientOptions}
                        placeholder="Filter by Client"
                        classNamePrefix="select2-selection"
                        isClearable
                      />
                    </Col>
                    {(searchQuery || statusFilter !== "all" || clientFilter) && (
                      <Col md={2}>
                        <Button
                          color="light"
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setClientFilter(undefined);
                          }}
                          className="w-100"
                        >
                          <i className="ri-close-line me-1"></i>
                          Clear
                        </Button>
                      </Col>
                    )}
                  </Row>
                )}

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                    <p className="mt-2">Loading client contacts...</p>
                  </div>
                ) : (
                  <div>
                    {viewMode === "table" ? (
                      <>
                        {filtered.length === 0 ? (
                          <div className="text-center py-5">
                            <i className="ri-contacts-line display-4 text-muted"></i>
                            <h5 className="mt-3">No contacts found</h5>
                            <p className="text-muted">
                              {searchQuery || statusFilter !== "all" || clientFilter
                                ? "Try adjusting your filters"
                                : "Create your first contact"}
                            </p>
                            {!searchQuery && statusFilter === "all" && !clientFilter && (
                              <Button
                                color="primary"
                                onClick={() => navigate("/clients/contacts/create")}
                              >
                                <i className="ri-add-line align-bottom me-1"></i>
                                Create Contact
                              </Button>
                            )}
                          </div>
                        ) : (
                          <TableContainer
                            columns={columns}
                            data={filtered || []}
                            isGlobalFilter={!searchQuery && statusFilter === "all" && !clientFilter}
                            customPageSize={10}
                            divClass="table-responsive table-card mb-3"
                            tableClass="align-middle table-nowrap mb-0"
                            SearchPlaceholder="Search contacts..."
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {paginatedContacts.length === 0 ? (
                          <div className="text-center py-5">
                            <i className="ri-contacts-line display-4 text-muted"></i>
                            <h5 className="mt-3">No contacts found</h5>
                            <p className="text-muted">
                              {searchQuery || statusFilter !== "all" || clientFilter
                                ? "Try adjusting your filters"
                                : "Create your first contact"}
                            </p>
                            {!searchQuery && statusFilter === "all" && !clientFilter && (
                              <Button
                                color="primary"
                                onClick={() => navigate("/clients/contacts/create")}
                              >
                                <i className="ri-add-line align-bottom me-1"></i>
                                Create Contact
                              </Button>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="row row-cols-xxl-4 row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-4">
                              {paginatedContacts.map((contact) => (
                                <div className="col" key={contact.id}>
                                  <ContactCard contact={contact} onDelete={onDelete} />
                                </div>
                              ))}
                            </div>

                            {/* Pagination for Card View */}
                            {totalPages > 1 && (
                              <div className="d-flex justify-content-between align-items-center mt-4">
                                <div className="text-muted">
                                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                                  {Math.min(currentPage * pageSize, filtered.length)} of{" "}
                                  {filtered.length} contacts
                                </div>
                                <Pagination className="pagination pagination-rounded">
                                  <PaginationItem disabled={currentPage === 1}>
                                    <PaginationLink
                                      previous
                                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    />
                                  </PaginationItem>
                                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((page) => {
                                      // Show first, last, current, and pages around current
                                      return (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                      );
                                    })
                                    .map((page, index, array) => {
                                      // Add ellipsis if needed
                                      const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                                      return (
                                        <React.Fragment key={page}>
                                          {showEllipsisBefore && (
                                            <PaginationItem disabled>
                                              <PaginationLink>...</PaginationLink>
                                            </PaginationItem>
                                          )}
                                          <PaginationItem active={currentPage === page}>
                                            <PaginationLink
                                              onClick={() => setCurrentPage(page)}
                                            >
                                              {page}
                                            </PaginationLink>
                                          </PaginationItem>
                                        </React.Fragment>
                                      );
                                    })}
                                  <PaginationItem disabled={currentPage === totalPages}>
                                    <PaginationLink
                                      next
                                      onClick={() =>
                                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                                      }
                                    />
                                  </PaginationItem>
                                </Pagination>
                              </div>
                            )}
                          </>
                        )}
                      </>
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

export default ContactsList;
