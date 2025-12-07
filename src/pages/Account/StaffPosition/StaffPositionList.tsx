import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import {
  getStaffPositions as onGetStaffPositions,
  deleteStaffPosition as onDeleteStaffPosition,
} from "../../../slices/staffPositions/thunk";
import { createSelector } from "reselect";
import Loader from "../../../Components/Common/Loader";

const StaffPositionList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  // const { showSuccess, showError } = useFlash(); // Ready for future use

  const selectLayoutState = (state: any) => state.StaffPositions;
  const selectStaffPositionProperties = createSelector(
    selectLayoutState,
    (state) => ({
      staffPositions: state.staffPositions,
      error: state.error,
    })
  );

  const { staffPositions, error } = useSelector(selectStaffPositionProperties);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [staffPosition, setStaffPosition] = useState<any>(null);

  useEffect(() => {
    if (staffPositions && !staffPositions.length) {
      dispatch(onGetStaffPositions());
    }
  }, [dispatch, staffPositions]);

  const onClickDelete = (position: any) => {
    setStaffPosition(position);
    setDeleteModal(true);
  };

  const handleDeleteStaffPosition = () => {
    if (staffPosition) {
      dispatch(onDeleteStaffPosition(staffPosition.id));
      setDeleteModal(false);
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
        header: "Position Name",
        accessorKey: "positionName",
        enableColumnFilter: false,
        minSize: 150,
        maxSize: 250,
        cell: (cell: any) => {
          return (
            <div>
              <strong>{cell.getValue()}</strong>
              <p className="text-muted mb-0 small">
                {cell.row.original.description}
              </p>
            </div>
          );
        },
      },
      {
        header: "Code",
        accessorKey: "code",
        enableColumnFilter: false,
        minSize: 100,
        maxSize: 150,
        cell: (cell: any) => {
          return <span className="badge bg-info">{cell.getValue()}</span>;
        },
      },
      {
        header: "Level",
        accessorKey: "level",
        enableColumnFilter: false,
        minSize: 100,
        maxSize: 150,
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
            status === "Published"
              ? "bg-success-subtle text-success"
              : status === "Draft"
                ? "bg-warning-subtle text-warning"
                : status === "Scheduled"
                  ? "bg-info-subtle text-info"
                  : "bg-secondary-subtle text-secondary";

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
                  navigate(
                    `/account/staff-positions/edit/${cellProps.row.original.id}`
                  )
                }
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => {
                  const positionData = cellProps.row.original;
                  onClickDelete(positionData);
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

  document.title =
    "Staff Positions | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Staff Positions" pageTitle="Account" />
          <Row>
            <Col lg={12}>
              <Card id="staffPositionsList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <Col sm={3}>
                      <div>
                        <h5 className="card-title mb-0">Staff Position List</h5>
                      </div>
                    </Col>
                    <Col sm={9}>
                      <div className="text-end">
                        <Link
                          to="/account/staff-positions/create"
                          className="btn btn-success"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Position
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="p-4">
                  <div>
                    {staffPositions && staffPositions.length > 0 ? (
                      <TableContainer
                        columns={columns}
                        data={staffPositions || []}
                        isGlobalFilter={true}
                        customPageSize={10}
                        divClass="table-responsive mb-3"
                        tableClass="align-middle table-nowrap mb-0"
                        SearchPlaceholder="Search for staff positions..."
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteStaffPosition}
        onCloseClick={() => setDeleteModal(false)}
      />
    </React.Fragment>
  );
};

export default StaffPositionList;
