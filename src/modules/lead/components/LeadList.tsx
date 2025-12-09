import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Input,
  Spinner,
  Alert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { BreadCrumb, TableContainer, DeleteModal, Card, CardBodyShared, CardHeaderShared, Button, Badge } from "../../../shared/components";
import {
  selectLeadList,
  selectLead,
  deleteLead,
  selectLeadLoading,
  selectLeadError,
  fetchLeads,
  LeadItem,
  LeadStatus,
  LeadStatusLabels,
} from "../index";
import { PAGE_TITLES } from "../../../shared/constants";
import { useFlash } from "../../../shared/hooks";

const statusOptions: LeadStatus[] = [0, 1, 2, 3, 4, 5];

const LeadList: React.FC = () => {
  document.title = PAGE_TITLES.LEADS_LIST;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useFlash();
  const leads: LeadItem[] = useSelector(selectLeadList);
  const loading = useSelector(selectLeadLoading);
  const error = useSelector(selectLeadError);
  const hasFetchedRef = useRef(false);

  // Lazy load data when component mounts
  useEffect(() => {
    if (!loading && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(fetchLeads({ pageNumber: 1, pageSize: 500 }));
    }
  }, [dispatch, loading]);

  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const onDelete = (id: string) => {
    setLeadToDelete(id);
    setDeleteModal(true);
  };

  const handleDeleteLead = async () => {
    if (leadToDelete) {
      try {
        await dispatch(deleteLead(leadToDelete));
        showSuccess("Lead deleted successfully");
        setDeleteModal(false);
        setLeadToDelete(null);
        if (!loading) {
          dispatch(fetchLeads({ pageNumber: 1, pageSize: 500 }));
        }
      } catch (error) {
        showError("Failed to delete lead");
      }
    }
  };

  const filtered = useMemo(() => {
    const validLeads = leads.filter((lead) => lead != null && lead !== undefined);
    if (statusFilter === "") return validLeads;
    return validLeads.filter((lead) => lead.leadStatus === statusFilter);
  }, [leads, statusFilter]);

  const getStatusBadgeColor = (status: LeadStatus): string => {
    switch (status) {
      case LeadStatus.New:
        return "info";
      case LeadStatus.Open:
        return "primary";
      case LeadStatus.Approved:
        return "success";
      case LeadStatus.Converted:
        return "success";
      case LeadStatus.Cancelled:
        return "danger";
      case LeadStatus.Churned:
        return "secondary";
      default:
        return "secondary";
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Lead Name",
        accessorKey: "title",
        enableColumnFilter: false,
        minSize: 150,
        maxSize: 250,
        cell: (cell: any) => {
          const value = cell.getValue();
          return value || "-";
        },
      },
      {
        header: "Contact Person",
        accessorKey: "contactPerson",
        enableColumnFilter: false,
        minSize: 150,
        maxSize: 200,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Contact Email",
        accessorKey: "contactEmail",
        enableColumnFilter: false,
        minSize: 200,
        maxSize: 300,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Status",
        accessorKey: "leadStatus",
        enableColumnFilter: false,
        size: 120,
        minSize: 100,
        maxSize: 150,
        cell: (cell: any) => {
          const status = cell.getValue() as LeadStatus;
          return (
            <Badge color={getStatusBadgeColor(status)}>
              {LeadStatusLabels[status] || "Unknown"}
            </Badge>
          );
        },
      },
      {
        header: "Work Days",
        accessorKey: "tentativeWorkDays",
        enableColumnFilter: false,
        size: 100,
        minSize: 100,
        maxSize: 120,
        cell: (cell: any) => cell.getValue() || "-",
      },
      {
        header: "Action",
        size: 150,
        minSize: 150,
        maxSize: 150,
        cell: (cellProps: any) => {
          const lead = cellProps.row.original;
          return (
            <div className="d-inline-flex gap-1 justify-content-end">
              <Button
                size="sm"
                color="soft-primary"
                onClick={() => {
                  dispatch(selectLead(lead.id));
                  navigate(`/leads/view/${lead.id}`);
                }}
              >
                <i className="ri-eye-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-secondary"
                onClick={() => {
                  dispatch(selectLead(lead.id));
                  navigate(`/leads/edit/${lead.id}`);
                }}
              >
                <i className="ri-pencil-line"></i>
              </Button>
              <Button
                size="sm"
                color="soft-danger"
                onClick={() => onDelete(lead.id)}
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
        <BreadCrumb title="Leads" pageTitle="Lead Management" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeaderShared>
                <Row className="g-3 align-items-center">
                  <Col sm={6}>
                    <h5 className="card-title mb-0">Lead List</h5>
                  </Col>
                  <Col sm={6}>
                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      <Input
                        type="select"
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(
                            e.target.value === "" ? "" : (Number(e.target.value) as LeadStatus)
                          )
                        }
                        style={{ width: "auto", minWidth: "150px" }}
                      >
                        <option value="">All Status</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {LeadStatusLabels[status]}
                          </option>
                        ))}
                      </Input>
                      <Button
                        color="success"
                        onClick={() => navigate("/leads/create")}
                      >
                        <i className="ri-add-line align-bottom me-1"></i>
                        Add Lead
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
                    <p className="mt-2">Loading leads...</p>
                  </div>
                ) : (
                  <TableContainer
                    columns={columns}
                    data={filtered || []}
                    isGlobalFilter={true}
                    customPageSize={10}
                    divClass="table-responsive mb-3"
                    tableClass="align-middle table-nowrap mb-0"
                    SearchPlaceholder="Search leads..."
                  />
                )}
              </CardBodyShared>
            </Card>
          </Col>
        </Row>
      </Container>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteLead}
        onCloseClick={() => setDeleteModal(false)}
      />
    </div>
  );
};

export default LeadList;

