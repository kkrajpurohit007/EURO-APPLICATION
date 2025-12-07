import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import DeleteModal from "../../../Components/Common/DeleteModal";
import { useFlash } from "../../../hooks/useFlash";

interface StaffUser {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: string;
}

const StaffUsersList = () => {
  const navigate = useNavigate();
  const { showSuccess } = useFlash();
  document.title = "Staff Users | Velzon - React Admin & Dashboard Template";

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([
    {
      id: 1,
      employeeId: "EMP001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@company.com",
      phone: "+1234567890",
      position: "Admin",
      department: "Administration",
      status: "Active",
    },
    {
      id: 2,
      employeeId: "EMP002",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@company.com",
      phone: "+1234567891",
      position: "Field Worker",
      department: "Operations",
      status: "Active",
    },
    {
      id: 3,
      employeeId: "EMP003",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.b@company.com",
      phone: "+1234567892",
      position: "Supervisor",
      department: "Operations",
      status: "Active",
    },
  ]);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);

  const onClickDelete = (user: StaffUser) => {
    setStaffUser(user);
    setDeleteModal(true);
  };

  const handleDeleteStaffUser = () => {
    if (staffUser) {
      setStaffUsers(staffUsers.filter((u) => u.id !== staffUser.id));
      setDeleteModal(false);
      showSuccess("Staff user deleted successfully");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableColumnFilter: false,
        size: 80,
        minSize: 80,
        maxSize: 100,
        cell: (cell: any) => {
          return <span className="fw-medium">{cell.getValue()}</span>;
        },
      },
      {
        header: "Employee ID",
        accessorKey: "employeeId",
        enableColumnFilter: false,
        minSize: 120,
        maxSize: 180,
        cell: (cell: any) => {
          return <span className="badge bg-info">{cell.getValue()}</span>;
        },
      },
      {
        header: "Name",
        accessorKey: "firstName",
        enableColumnFilter: false,
        minSize: 150,
        maxSize: 250,
        cell: (cell: any) => {
          return (
            <div>
              <strong>
                {cell.getValue()} {cell.row.original.lastName}
              </strong>
              <p className="text-muted mb-0 small">{cell.row.original.email}</p>
            </div>
          );
        },
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableColumnFilter: false,
        minSize: 120,
        maxSize: 180,
      },
      {
        header: "Position",
        accessorKey: "position",
        enableColumnFilter: false,
        minSize: 150,
        maxSize: 200,
      },
      {
        header: "Department",
        accessorKey: "department",
        enableColumnFilter: false,
        minSize: 150,
        maxSize: 200,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        size: 100,
        minSize: 100,
        maxSize: 120,
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
        size: 150,
        minSize: 150,
        maxSize: 150,
        cell: (cellProps: any) => {
          return (
            <div className="d-inline-flex gap-1 justify-content-end">
              <Button
                size="sm"
                color="soft-secondary"
                onClick={() =>
                  navigate(`/staff/users/edit/${cellProps.row.original.id}`)
                }
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => {
                  const userData = cellProps.row.original;
                  onClickDelete(userData);
                }}
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
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Staff Users" pageTitle="Staff Management" />
          <Row>
            <Col lg={12}>
              <Card id="staffUsersList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <Col sm={3}>
                      <div>
                        <h5 className="card-title mb-0">Staff Users List</h5>
                      </div>
                    </Col>
                    <Col sm={9}>
                      <div className="text-end">
                        <Link
                          to="/staff/users/create"
                          className="btn btn-success"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          User
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="p-4">
                  <div>
                    <TableContainer
                      columns={columns}
                      data={staffUsers || []}
                      isGlobalFilter={true}
                      customPageSize={10}
                      divClass="table-responsive mb-3"
                      tableClass="align-middle table-nowrap mb-0"
                      SearchPlaceholder="Search for staff users..."
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
        onDeleteClick={handleDeleteStaffUser}
        onCloseClick={() => setDeleteModal(false)}
      />
    </React.Fragment>
  );
};

export default StaffUsersList;
