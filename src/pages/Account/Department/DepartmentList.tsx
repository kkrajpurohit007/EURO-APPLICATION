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
  Badge,
  Spinner,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  selectDepartmentList,
  selectDepartment,
  fetchDepartments,
  deleteDepartment,
  selectDepartmentLoading,
  selectDepartmentError,
} from "../../../slices/departments/department.slice";
import { DepartmentItem } from "../../../slices/departments/department.fakeData";
import { useNavigate } from "react-router-dom";

import { PAGE_TITLES } from "../../../common/branding";

const DepartmentList: React.FC = () => {
  document.title = PAGE_TITLES.DEPARTMENTS_LIST;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const departments: DepartmentItem[] = useSelector(selectDepartmentList);
  const loading = useSelector(selectDepartmentLoading);
  const error = useSelector(selectDepartmentError);

  const [deleteModal, setDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);

  // NO useEffect - data loaded by AppInitService

  const filtered = useMemo(() => {
    if (!departments) return [];
    return departments.filter((d) => !d.isDeleted);
  }, [departments]);

  const onDelete = (id: string) => {
    setDepartmentToDelete(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (departmentToDelete !== null) {
      const result = await dispatch(deleteDepartment(departmentToDelete));
      if (result.meta.requestStatus === "fulfilled") {
        // Refresh departments list after successful deletion
        dispatch(fetchDepartments({ pageNumber: 1, pageSize: 500 }));
      }
    }
    setDeleteModal(false);
    setDepartmentToDelete(null);
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
        header: "Description",
        accessorKey: "description",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const desc = cell.getValue() || "-";
          return desc.length > 50 ? desc.substring(0, 50) + "..." : desc;
        },
      },
      {
        header: "Status",
        accessorKey: "isActive",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const isActive = cell.getValue();
          return (
            <Badge
              color={isActive ? "success" : "danger"}
              className="badge-label"
            >
              <i className="mdi mdi-circle-medium"></i>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          const dept = cellProps.row.original;
          return (
            <div className="d-inline-flex gap-1">
              <Button
                size="sm"
                color="soft-secondary"
                onClick={() => {
                  dispatch(selectDepartment(dept.id));
                  navigate(`/account/departments/edit/${dept.id}`);
                }}
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => onDelete(dept.id)}
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
        <BreadCrumb title="Departments" pageTitle="Account" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row className="g-3 align-items-center">
                  <Col sm={4}>
                    <h5 className="card-title mb-0">Department List</h5>
                  </Col>
                  <Col sm={8}>
                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      <Button
                        color="success"
                        onClick={() => navigate("/account/departments/create")}
                      >
                        <i className="ri-add-line align-bottom me-1"></i>
                        Create Department
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
                    <p className="mt-2">Loading departments...</p>
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
                      SearchPlaceholder="Search departments..."
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

export default DepartmentList;
