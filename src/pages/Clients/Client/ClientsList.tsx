import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Input,
  Label,
  Button,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { useFlash } from "../../../hooks/useFlash";
import Select from "react-select";

interface Client {
  id: number;
  name: string;
  companyNumber: string;
  email: string;
  phone: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  paymentTerms?: number;
  complianceCheckFee?: number;
  logoUrl?: string;
  status: string;
}

const ClientsList = () => {
  const navigate = useNavigate();
  const { showSuccess } = useFlash();
  document.title = "Clients | Velzon - React Admin & Dashboard Template";

  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "ABC Corporation",
      companyNumber: "CN001",
      email: "contact@abc.com",
      phone: "+1234567890",
      addressLine1: "123 Business St",
      city: "New York",
      postcode: "10001",
      country: "USA",
      paymentTerms: 30,
      complianceCheckFee: 150.0,
      status: "Active",
    },
    {
      id: 2,
      name: "XYZ Industries",
      companyNumber: "CN002",
      email: "info@xyz.com",
      phone: "+1234567891",
      addressLine1: "456 Industrial Ave",
      city: "London",
      postcode: "SW1A 1AA",
      country: "UK",
      paymentTerms: 45,
      complianceCheckFee: 200.0,
      status: "Active",
    },
    {
      id: 3,
      name: "Tech Solutions",
      companyNumber: "CN003",
      email: "contact@techsol.com",
      phone: "+1234567892",
      addressLine1: "789 Tech Park",
      city: "San Francisco",
      postcode: "94102",
      country: "USA",
      paymentTerms: 30,
      complianceCheckFee: 175.0,
      status: "Inactive",
    },
  ]);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [client, setClient] = useState<Client | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [companyNumberFilter, setCompanyNumberFilter] = useState<string>("");

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Pending", value: "Pending" },
  ];

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesStatus = !statusFilter || client.status === statusFilter;
      const matchesName =
        !nameFilter ||
        client.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchesCompanyNumber =
        !companyNumberFilter ||
        client.companyNumber
          .toLowerCase()
          .includes(companyNumberFilter.toLowerCase());
      return matchesStatus && matchesName && matchesCompanyNumber;
    });
  }, [clients, statusFilter, nameFilter, companyNumberFilter]);

  const onClickDelete = (clientData: Client) => {
    setClient(clientData);
    setDeleteModal(true);
  };

  const handleDeleteClient = () => {
    if (client) {
      setClients(clients.filter((c) => c.id !== client.id));
      setDeleteModal(false);
      showSuccess("Client deleted successfully");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <span className="fw-medium">{cell.getValue()}</span>;
        },
      },
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Company Number",
        accessorKey: "companyNumber",
        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const status = cell.getValue();
          const badgeClass =
            status === "Active"
              ? "bg-success-subtle text-success"
              : status === "Inactive"
                ? "bg-danger-subtle text-danger"
                : "bg-warning-subtle text-warning";

          return <span className={`badge ${badgeClass}`}>{status}</span>;
        },
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          return (
            <div className="d-inline-flex gap-1">
              <Button
                size="sm"
                color="soft-primary"
                onClick={() =>
                  navigate(`/clients/view/${cellProps.row.original.id}`)
                }
              >
                <i className="ri-eye-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-secondary"
                onClick={() =>
                  navigate(`/clients/edit/${cellProps.row.original.id}`)
                }
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => {
                  const clientData = cellProps.row.original;
                  onClickDelete(clientData);
                }}
              >
                <i className="ri-delete-bin-line"></i>
              </Button>
            </div>
          );
        },
      },
    ],
    [navigate]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Clients" pageTitle="Client Management" />
          <Row>
            <Col lg={12}>
              <Card id="clientsList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <Col sm={3}>
                      <div>
                        <h5 className="card-title mb-0">Clients List</h5>
                      </div>
                    </Col>
                    <Col sm={9}>
                      <div className="text-end">
                        <Link to="/clients/create" className="btn btn-success">
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Client
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="pt-0">
                  {/* Filters */}
                  <Row className="mb-3">
                    <Col md={3}>
                      <Label className="form-label">Filter by Status</Label>
                      <Select
                        value={statusOptions.find(
                          (option) => option.value === statusFilter
                        )}
                        onChange={(selectedOption: any) => {
                          setStatusFilter(selectedOption?.value || "");
                        }}
                        options={statusOptions}
                        placeholder="All Status"
                        isClearable
                        classNamePrefix="select2-selection"
                      />
                    </Col>
                    <Col md={3}>
                      <Label className="form-label">Filter by Name</Label>
                      <Input
                        type="text"
                        placeholder="Search by name..."
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                      />
                    </Col>
                    <Col md={3}>
                      <Label className="form-label">
                        Filter by Company Number
                      </Label>
                      <Input
                        type="text"
                        placeholder="Search by company number..."
                        value={companyNumberFilter}
                        onChange={(e) => setCompanyNumberFilter(e.target.value)}
                      />
                    </Col>
                  </Row>

                  <div>
                    <TableContainer
                      columns={columns}
                      data={filteredClients || []}
                      isGlobalFilter={false}
                      customPageSize={10}
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap mb-0"
                      SearchPlaceholder="Search for clients..."
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteClient}
        onCloseClick={() => setDeleteModal(false)}
      />
    </React.Fragment>
  );
};

export default ClientsList;
