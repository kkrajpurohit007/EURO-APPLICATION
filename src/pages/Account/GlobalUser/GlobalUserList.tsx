import React, { useEffect, useMemo, useState, useRef } from "react";
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
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  selectGlobalUserList,
  selectGlobalUser,
  fetchGlobalUsers,
  deleteGlobalUser,
  selectGlobalUserLoading,
  selectGlobalUserError,
} from "../../../slices/globalUsers/globalUser.slice";
import { GlobalUserItem } from "../../../slices/globalUsers/globalUser.fakeData";
import { useNavigate } from "react-router-dom";
import { PAGE_TITLES } from "../../../common/branding";

const GlobalUserList: React.FC = () => {
  document.title = PAGE_TITLES.GLOBAL_USERS_LIST;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const globalUsers: GlobalUserItem[] = useSelector(selectGlobalUserList);
  const loading = useSelector(selectGlobalUserLoading);
  const error = useSelector(selectGlobalUserError);
  const hasFetchedRef = useRef(false);

  // Fetch global users on component mount - only once and if not already loading
  useEffect(() => {
    if (!loading && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(fetchGlobalUsers({ pageNumber: 1, pageSize: 20 }));
    }
  }, [dispatch, loading]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!globalUsers) return [];
    return globalUsers.filter((u) => !u.isDeleted);
  }, [globalUsers]);

  const onDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete !== null) {
      const result = await dispatch(deleteGlobalUser(userToDelete));
      if (result.meta.requestStatus === "fulfilled") {
        // Refresh global users list after successful deletion
        dispatch(fetchGlobalUsers({ pageNumber: 1, pageSize: 20 }));
      }
    }
    setDeleteModal(false);
    setUserToDelete(null);
  };

  const columns = useMemo(
    () => [
      {
        header: "First Name",
        accessorKey: "firstName",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
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
        header: "Role Name",
        accessorKey: "roleName",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Department Name",
        accessorKey: "departmentName",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Status",
        accessorKey: "disabled",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const isDisabled = cell.getValue();
          return isDisabled ? (
            <Badge color="danger" className="badge-label">
              <i className="mdi mdi-circle-medium"></i> Disabled
            </Badge>
          ) : (
            <Badge color="success" className="badge-label">
              <i className="mdi mdi-circle-medium"></i> Active
            </Badge>
          );
        },
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          const user = cellProps.row.original;
          return (
            <div className="d-inline-flex gap-1">
              <Button
                size="sm"
                color="soft-primary"
                onClick={() => {
                  dispatch(selectGlobalUser(user.id));
                  navigate(`/account/global-users/view/${user.id}`);
                }}
              >
                <i className="ri-eye-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-secondary"
                onClick={() => {
                  dispatch(selectGlobalUser(user.id));
                  navigate(`/account/global-users/edit/${user.id}`);
                }}
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => onDelete(user.id)}
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
        <BreadCrumb title="User Management" pageTitle="Account Settings" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row className="g-3 align-items-center">
                  <Col sm={6}>
                    <h5 className="card-title mb-0">User Management List</h5>
                  </Col>
                  <Col sm={6}>
                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      <Button
                        color="success"
                        onClick={() => navigate("/account/global-users/create")}
                      >
                        <i className="ri-add-line align-bottom me-1"></i>
                        Add User
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
                    <p className="mt-2">Loading users...</p>
                  </div>
                ) : (
                  <div>
                    <TableContainer
                      columns={columns}
                      data={filtered || []}
                      isGlobalFilter={true}
                      customPageSize={10}
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap mb-0"
                      SearchPlaceholder="Search users..."
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

export default GlobalUserList;

