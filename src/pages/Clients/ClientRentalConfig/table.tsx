import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
  Input,
  Button,
  Badge,
} from "reactstrap";

// Import actions
import { fetchClientRentalConfigs } from "../../../slices/clientRentalConfig/clientRentalConfig.slice";

// Import utilities
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { formatDate } from "../../../common/utils";

const ClientRentalConfigList = () => {
  const dispatch = useDispatch<any>();

  // Selector for client rental configs
  const selectLayoutState = (state: any) => state.ClientRentalConfig;
  const selectClientRentalConfigProperties = createSelector(
    selectLayoutState,
    (state) => ({
      configs: state.configs,
      loading: state.loading,
      error: state.error,
    })
  );

  const { configs, loading, error } = useSelector(selectClientRentalConfigProperties);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch client rental configs on component mount
  useEffect(() => {
    dispatch(fetchClientRentalConfigs({ pageNumber: 1, pageSize: 50 }));
  }, [dispatch]);

  // Filter configs based on search term
  const filteredConfigs = useMemo(() => {
    if (!configs || configs.length === 0) return [];
    
    return configs.filter((config: any) =>
      config.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [configs, searchTerm]);

  // Get user name by ID (mock implementation)
  const getUserNameById = (userId: string) => {
    // In a real app, this would come from a user service
    const users: Record<string, string> = {
      "user-1": "John Smith",
      "user-2": "Jane Doe",
      "user-3": "Robert Johnson"
    };
    return users[userId] || userId;
  };

  document.title = "Client Rental Configuration | ESRM";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Client Rental Configuration" pageTitle="Clients" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="border-0">
                <div className="d-flex align-items-center">
                  <h5 className="card-title mb-0 flex-grow-1">Client Rental Configurations</h5>
                  <div className="flex-shrink-0">
                    <div className="d-flex flex-wrap align-items-start gap-2">
                      <div className="search-box ms-2">
                        <Input
                          type="text"
                          placeholder="Search by client name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                {loading ? (
                  <div className="py-4 text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="py-4 text-center">
                    <div className="alert alert-danger mb-0" role="alert">
                      Error loading client rental configurations: {error}
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table className="table-striped table-nowrap align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Client Name</th>
                          <th scope="col">Override Min Hire Weeks</th>
                          <th scope="col">Override Grace Period (Days)</th>
                          <th scope="col">Invoice Frequency</th>
                          <th scope="col">Invoice Day</th>
                          <th scope="col">Include Weekends</th>
                          <th scope="col">Exclude Holidays</th>
                          <th scope="col">Effective From</th>
                          <th scope="col">Effective To</th>
                          <th scope="col">Approved By</th>
                          <th scope="col">Approved Date</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredConfigs && filteredConfigs.length > 0 ? (
                          filteredConfigs.map((config: any) => (
                            <tr key={config.id}>
                              <td>{config.clientName}</td>
                              <td>
                                {config.overrideMinimumHireWeeks !== null 
                                  ? config.overrideMinimumHireWeeks 
                                  : "-"}
                              </td>
                              <td>
                                {config.overrideGracePeriodDays !== null 
                                  ? config.overrideGracePeriodDays 
                                  : "-"}
                              </td>
                              <td>
                                {config.overrideInvoiceFrequency !== null 
                                  ? config.overrideInvoiceFrequency 
                                  : "-"}
                              </td>
                              <td>
                                {config.overrideInvoiceDay !== null 
                                  ? config.overrideInvoiceDay 
                                  : "-"}
                              </td>
                              <td>
                                <Badge 
                                  className={`badge-soft-${config.overrideIncludeWeekends ? 'success' : 'secondary'}`}
                                >
                                  {config.overrideIncludeWeekends ? 'Yes' : 'No'}
                                </Badge>
                              </td>
                              <td>
                                <Badge 
                                  className={`badge-soft-${config.overrideExcludePublicHolidays ? 'success' : 'secondary'}`}
                                >
                                  {config.overrideExcludePublicHolidays ? 'Yes' : 'No'}
                                </Badge>
                              </td>
                              <td>{formatDate(config.effectiveFrom)}</td>
                              <td>{formatDate(config.effectiveTo)}</td>
                              <td>{getUserNameById(config.approvedByUserId)}</td>
                              <td>{formatDate(config.approvedDate)}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Link
                                    to={`/clients/${config.clientId}/rental-config`}
                                    className="btn btn-sm btn-soft-info edit-item-btn"
                                  >
                                    <i className="ri-pencil-line align-bottom"></i> Edit
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={12} className="text-center py-4">
                              <i className="ri-file-list-3-line ri-2x text-muted mb-3"></i>
                              <h6 className="text-muted">No client rental configurations found</h6>
                              <p className="text-muted mb-0">
                                {searchTerm 
                                  ? "No configurations match your search criteria" 
                                  : "No client rental configurations have been created yet"}
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
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

export default ClientRentalConfigList;