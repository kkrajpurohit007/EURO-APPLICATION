import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { BreadCrumb, TableContainer, DeleteModal, Card, CardBodyShared, CardHeaderShared, Button, Badge } from "../../../../shared/components";
import {
  selectDepartmentList,
  selectDepartment,
  fetchDepartments,
  deleteDepartment,
  selectDepartmentLoading,
  selectDepartmentError,
  DepartmentItem,
} from "../slice/department.slice";
import { PAGE_TITLES } from "../../../../shared/constants";

const DepartmentList: React.FC = () => {
  document.title = PAGE_TITLES.DEPARTMENTS_LIST;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const departments: DepartmentItem[] = useSelector(selectDepartmentList);
  const loading = useSelector(selectDepartmentLoading);
  const error = useSelector(selectDepartmentError);

  const [deleteModal, setDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);

  // Lazy load data when component mounts
  useEffect(() => {
    dispatch(fetchDepartments({ pageNumber: 1, pageSize: 500 }));
  }, [dispatch]);

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
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Status",
        accessorKey: "isActive",
        enableColumnFilter: false,
        size: 100,
        minSize: 100,
        maxSize: 120,
        cell: (cell: any) => {
          const isActive = cell.getValue();
          return isActive ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          );
        },
      },
      {
        header: "Action",
        size: 150,
        minSize: 150,
        maxSize: 150,
        cell: (cellProps: any) => {
          const department = cellProps.row.original;
          return (
            <div className="d-inline-flex gap-1 justify-content-end">
              <Button
                size="sm"
                variant="secondary"
                color="soft-secondary"
                icon={<i className="ri-pencil-line"></i>}
                onClick={() => {
                  dispatch(selectDepartment(department.id));
                  navigate(`/account/departments/edit/${department.id}`);
                }}
              />
              <Button
                size="sm"
                variant="danger"
                color="soft-danger"
                icon={<i className="ri-delete-bin-line"></i>}
                onClick={() => onDelete(department.id)}
              />
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
        <BreadCrumb title="Departments" pageTitle="Account Management" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeaderShared>
                <Row className="g-3 align-items-center">
                  <Col sm={6}>
                    <h5 className="card-title mb-0">Department List</h5>
                  </Col>
                  <Col sm={6}>
                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      <Button
                        variant="success"
                        icon={<i className="ri-add-line align-bottom"></i>}
                        iconPosition="left"
                        onClick={() => navigate("/account/departments/create")}
                      >
                        Add Department
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
                    <p className="mt-2">Loading departments...</p>
                  </div>
                ) : (
                  <TableContainer
                    columns={columns}
                    data={filtered || []}
                    isGlobalFilter={true}
                    customPageSize={10}
                    divClass="table-responsive mb-3"
                    tableClass="align-middle table-nowrap mb-0"
                    SearchPlaceholder="Search departments..."
                  />
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

export default DepartmentList;

