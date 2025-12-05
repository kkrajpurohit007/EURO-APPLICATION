import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  selectProfileList,
  selectProfileLoading,
  selectProfileError,
  fetchProfiles,
} from "../../../slices/userProfiles/profile.slice";
import { ProfileItem } from "../../../slices/userProfiles/profile.fakeData";
import { PAGE_TITLES } from "../../../common/branding";

const ProfileList: React.FC = () => {
  document.title = PAGE_TITLES.PROFILES_LIST || "Profiles | ESRM";
  const dispatch = useDispatch<any>();
  const profiles: ProfileItem[] = useSelector(selectProfileList);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  useEffect(() => {
    if (!profiles || profiles.length === 0) {
      dispatch(fetchProfiles({ pageNumber: 1, pageSize: 50 }));
    }
  }, [dispatch, profiles]);

  // Filter out deleted profiles
  const filtered = useMemo(() => {
    if (!profiles) return [];
    return profiles.filter((p) => !p.isDeleted);
  }, [profiles]);

  // Helper function to get user group label
  const getUserGroupLabel = (userGroup: number | null | undefined): string => {
    if (userGroup === null || userGroup === undefined) return "System";
    switch (userGroup) {
      case 3:
        return "Tenant User";
      case 4:
        return "Client User";
      default:
        return `Group ${userGroup}`;
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const name = cell.getValue();
          return (
            <span className="fw-medium">{name || "-"}</span>
          );
        },
      },
      {
        header: "Description",
        accessorKey: "description",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const desc = cell.getValue() || "-";
          return desc.length > 100 ? (
            <span title={desc}>{desc.substring(0, 100) + "..."}</span>
          ) : (
            desc
          );
        },
      },
      {
        header: "User Group",
        accessorKey: "applicableUserGroup",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const userGroup = cell.getValue();
          return (
            <span className="badge bg-info">
              {getUserGroupLabel(userGroup)}
            </span>
          );
        },
      },
      {
        header: "Self Register",
        accessorKey: "isAllowToSelfRegister",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const allow = cell.getValue();
          return allow ? (
            <span className="badge bg-success">Yes</span>
          ) : (
            <span className="badge bg-secondary">No</span>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "isDeleted",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const isDeleted = cell.getValue();
          return isDeleted ? (
            <span className="badge bg-danger">Deleted</span>
          ) : (
            <span className="badge bg-success">Active</span>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Profiles" pageTitle="Account Settings" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row className="g-3 align-items-center">
                  <Col sm={6}>
                    <h5 className="card-title mb-0">Profiles</h5>
                    <p className="text-muted mb-0">
                      View all available system profiles
                    </p>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {error && (
                  <Alert color="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                {loading && (!profiles || profiles.length === 0) ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                    <p className="mt-2">Loading profiles...</p>
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
                      SearchPlaceholder="Search profiles..."
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileList;

