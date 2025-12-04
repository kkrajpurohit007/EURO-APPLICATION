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
  Input,
  Badge,
  Spinner,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  selectLeadList,
  selectLead,
  fetchLeads,
  deleteLead,
  selectLeadLoading,
  selectLeadError,
} from "../../../slices/leads/lead.slice";
import {
  LeadItem,
  LeadStatus,
  LeadStatusLabels,
} from "../../../slices/leads/lead.fakeData";
import { useNavigate } from "react-router-dom";
import { PAGE_TITLES } from "../../../common/branding";

const statusOptions: LeadStatus[] = [0, 1, 2, 3, 4, 5];

const LeadList: React.FC = () => {
  document.title = PAGE_TITLES.LEADS_LIST;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const leads: LeadItem[] = useSelector(selectLeadList);
  const loading = useSelector(selectLeadLoading);
  const error = useSelector(selectLeadError);

  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const onDelete = (id: string) => {
    setLeadToDelete(id);
    setDeleteModal(true);
  };

  const handleDeleteLead = async () => {
    if (leadToDelete) {
      await dispatch(deleteLead(leadToDelete));
      setDeleteModal(false);
      setLeadToDelete(null);
    }
  };

  // Filter leads based on status filter
  const filtered = useMemo(() => {
    if (statusFilter === "") return leads;
    return leads.filter((lead) => lead.leadStatus === statusFilter);
  }, [leads, statusFilter]);

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        enableColumnFilter: false,
      },
      {
        header: "Contact Person",
        accessorKey: "contactPerson",
        enableColumnFilter: false,
      },
      {
        header: "Contact Email",
        accessorKey: "contactEmail",
        enableColumnFilter: false,
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
        accessorKey: "leadStatus",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const status: LeadStatus = cell.getValue();
          const statusLabel = LeadStatusLabels[status];
          const colorMap: Record<LeadStatus, string> = {
            0: "info",
            1: "secondary",
            2: "secondary",
            3: "primary",
            4: "warning",
            5: "success",
          };
          return (
            <Badge
              color={colorMap[status] || "secondary"}
              className="badge-label"
            >
              <i className="mdi mdi-circle-medium"></i> {statusLabel}
            </Badge>
          );
        },
      },
      {
        header: "Tentative Week",
        accessorKey: "tentativeHours",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "0",
      },
      {
        header: "Action",
        cell: (cellProps: any) => {
          const lead = cellProps.row.original;
          return (
            <div className="d-inline-flex gap-1">
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
      },
    ],
    [dispatch, navigate]
  );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Leads" pageTitle="Client Management" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row className="g-3 align-items-center">
                  <Col sm={4}>
                    <h5 className="card-title mb-0">Scaffolding Leads</h5>
                  </Col>
                  <Col sm={8}>
                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      <div style={{ minWidth: "200px" }}>
                        <Input
                          type="select"
                          value={statusFilter}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStatusFilter(
                              val === "" ? "" : (parseInt(val) as LeadStatus)
                            );
                          }}
                        >
                          <option value="">All Statuses</option>
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {LeadStatusLabels[s]}
                            </option>
                          ))}
                        </Input>
                      </div>
                      <Button
                        color="success"
                        onClick={() => navigate("/leads/create")}
                      >
                        <i className="ri-add-line align-bottom me-1"></i>
                        Create Lead
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
                    <p className="mt-2">Loading leads...</p>
                  </div>
                ) : (
                  <div>
                    <TableContainer
                      columns={columns}
                      data={filtered || []}
                      isGlobalFilter={true}
                      customPageSize={10}
                      divClass="table-responsive mb-1"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light text-muted"
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteLead}
          onCloseClick={() => setDeleteModal(false)}
        />
      </Container>
    </div>
  );
};

export default LeadList;