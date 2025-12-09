import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Label,
  Spinner,
  Input,
  InputGroup,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Loader from "../../../Components/Common/Loader";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { useFlash } from "../../../hooks/useFlash";
import {
  selectClientMeetingsList,
  selectClientMeetingPagination,
  fetchClientMeetings,
  deleteClientMeeting,
  selectClientMeetingLoading,
} from "../../../slices/clientMeetings/clientMeeting.slice";
import { selectClientList, selectClientLoading, fetchClients } from "../../../slices/clients/client.slice";
import {
  ClientMeeting,
} from "../../../slices/clientMeetings/clientMeeting.fakeData";
import MeetingCard from "../../../modules/client/meeting/components/MeetingCard";
import { PAGE_TITLES } from "../../../common/branding";
import { getMeetingStatusOptions } from "./utils/meetingUtils";

const Meetings: React.FC = () => {
  document.title = PAGE_TITLES.MEETINGS_SCHEDULE;

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useFlash();
  const meetings: ClientMeeting[] = useSelector(selectClientMeetingsList);
  const pagination = useSelector(selectClientMeetingPagination);
  const loading = useSelector(selectClientMeetingLoading);
  const clients = useSelector(selectClientList);
  const clientsLoading = useSelector(selectClientLoading);

  // Load selected client from localStorage on mount, but validate it exists in loaded clients
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  
  // Validate and set selectedClientId from localStorage only after clients are loaded
  useEffect(() => {
    if (!clientsLoading && clients && clients.length > 0) {
      const saved = localStorage.getItem("meetingSelectedClientId");
      if (saved) {
        // Validate that the saved clientId exists in the loaded clients
        const clientExists = clients.some((c: any) => c.id === saved && !c.isDeleted);
        if (clientExists) {
          setSelectedClientId(saved);
        } else {
          // Clear invalid saved clientId
          localStorage.removeItem("meetingSelectedClientId");
        }
      }
    }
  }, [clientsLoading, clients]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<number | "">("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef(true);

  // Fetch clients if not loaded
  useEffect(() => {
    if (!clients || clients.length === 0) {
      dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
    }
  }, [dispatch, clients]);

  // Fetch meetings when selected client changes - reset to page 1
  // Only fetch if a client is selected (mandatory)
  useEffect(() => {
    if (selectedClientId) {
      hasMoreRef.current = true;
      dispatch(
        fetchClientMeetings({
          clientId: selectedClientId,
          pageNumber: 1,
          pageSize: 20,
        })
      );
    }
  }, [dispatch, selectedClientId]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loading && !isLoadingMore) {
          const hasMore = pagination.pageNumber < pagination.totalPages;
          if (hasMore) {
            setIsLoadingMore(true);
            dispatch(
              fetchClientMeetings({
                clientId: selectedClientId,
                pageNumber: pagination.pageNumber + 1,
                pageSize: 20,
              })
            ).finally(() => {
              setIsLoadingMore(false);
            });
          } else {
            hasMoreRef.current = false;
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [dispatch, selectedClientId, pagination.pageNumber, pagination.totalPages, loading, isLoadingMore]);

  // Update hasMoreRef when pagination changes
  useEffect(() => {
    hasMoreRef.current = pagination.pageNumber < pagination.totalPages;
  }, [pagination.pageNumber, pagination.totalPages]);

  // Only show client options when clients are loaded (not fake/initial data)
  const clientOptions = useMemo(() => {
    // Don't show options if clients are loading or if clients array is empty/initial
    if (clientsLoading || !clients || clients.length === 0) {
      return [];
    }
    return clients
      .filter((c: any) => !c.isDeleted)
      .map((client: any) => ({
        value: client.id,
        label: client.name,
      }));
  }, [clients, clientsLoading]);

  // Status filter options
  const statusOptions = useMemo(() => getMeetingStatusOptions(), []);

  // Filter meetings by selected client, search query, status, and sort by date (newest first)
  const filteredMeetings = useMemo(() => {
    if (!meetings) return [];
    let filtered = meetings.filter((m) => !m.isDeleted);
    
    // Filter by client
    if (selectedClientId) {
      filtered = filtered.filter((m) => m.clientId === selectedClientId);
    }
    
    // Filter by status
    if (statusFilter !== "") {
      filtered = filtered.filter((m) => m.meetingStatus === statusFilter);
    }
    
    // Filter by search query (search in title, description, location, client name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((m) => {
        const title = (m.meetingTitle || "").toLowerCase();
        const description = (m.meetingDescription || "").toLowerCase();
        const location = (m.meetingLocation || "").toLowerCase();
        const clientName = (m.clientName || "").toLowerCase();
        const organizerName = (m.organizerUserName || "").toLowerCase();
        
        return (
          title.includes(query) ||
          description.includes(query) ||
          location.includes(query) ||
          clientName.includes(query) ||
          organizerName.includes(query)
        );
      });
    }
    
    // Sort by meeting date (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.meetingDate).getTime();
      const dateB = new Date(b.meetingDate).getTime();
      return dateB - dateA;
    });
  }, [meetings, selectedClientId, statusFilter, searchQuery]);

  const upcomingMeetings = useMemo(() => {
    return filteredMeetings.filter(
      (m: ClientMeeting) => m.meetingStatus === 1 || m.meetingStatus === 2 // Scheduled or In Progress
    );
  }, [filteredMeetings]);

  const completedMeetings = useMemo(() => {
    return filteredMeetings.filter(
      (m: ClientMeeting) => m.meetingStatus === 3 // Completed
    );
  }, [filteredMeetings]);

  // Handle delete meeting
  const onDelete = (id: string) => {
    setMeetingToDelete(id);
    setDeleteModal(true);
  };

  // Confirm delete meeting
  const confirmDelete = async () => {
    if (meetingToDelete !== null) {
      const result = await dispatch(deleteClientMeeting(meetingToDelete));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Meeting deleted successfully");
        // Refresh meetings list after deletion
        dispatch(
          fetchClientMeetings({
            clientId: selectedClientId,
            pageNumber: 1,
            pageSize: 20,
          })
        );
      } else {
        const errorMessage = result.payload?.message || "Failed to delete meeting";
        showError(errorMessage);
      }
    }
    setDeleteModal(false);
    setMeetingToDelete(null);
  };

  // Show loader only on initial load, not when loading more
  if (loading && meetings.length === 0) {
    return <Loader />;
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Meetings & Schedule" pageTitle="Client Management" />

        <Row className="mb-3">
          <Col md={4}>
            <Label className="form-label">
              Filter by Client <span className="text-danger">*</span>
            </Label>
            <Select
              value={clientOptions.find(
                (opt: any) => opt.value === selectedClientId
              )}
              onChange={(selectedOption: any) => {
                const clientId = selectedOption?.value || undefined;
                setSelectedClientId(clientId);
                // Save to localStorage
                if (clientId) {
                  localStorage.setItem("meetingSelectedClientId", clientId);
                } else {
                  localStorage.removeItem("meetingSelectedClientId");
                }
              }}
              options={clientOptions}
              placeholder={clientsLoading ? "Loading clients..." : "Select Client (Required)"}
              classNamePrefix="select2-selection"
              isClearable={false}
              isLoading={clientsLoading}
              isDisabled={clientsLoading || clientOptions.length === 0}
            />
            {!selectedClientId && (
              <small className="text-danger d-block mt-1">
                <i className="ri-error-warning-line align-middle me-1"></i>
                Please select a client to view meetings
              </small>
            )}
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg={12}>
            <Card className="bg-primary">
              <CardBody>
                <Row className="align-items-center">
                  <Col lg={8}>
                    <h4 className="text-white mb-1">
                      Manage client consultations and site visits
                    </h4>
                    <p className="text-white-50 mb-0">
                      Schedule, track, and organize all your meetings in one
                      place
                    </p>
                  </Col>
                  <Col lg={4} className="text-end">
                    <Button
                      color="light"
                      className="me-2"
                      onClick={() => navigate("/meetings/calendar")}
                    >
                      <i className="ri-calendar-line align-bottom me-1"></i>
                      Calendar View
                    </Button>
                    <Button
                      color="success"
                      onClick={() => navigate("/meetings/create")}
                      disabled={!selectedClientId}
                      title={!selectedClientId ? "Please select a client first" : ""}
                    >
                      <i className="ri-add-line align-bottom me-1"></i>
                      Schedule Meeting
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xl={3} md={6}>
            <Card className="card-animate">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-uppercase fw-medium text-muted mb-1">
                      Total Meetings
                    </p>
                    <h4 className="mb-0">{filteredMeetings.length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar-sm">
                      <span className="avatar-title bg-primary-subtle text-primary rounded fs-3">
                        <i className="ri-calendar-line"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl={3} md={6}>
            <Card className="card-animate">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-uppercase fw-medium text-muted mb-1">
                      Upcoming
                    </p>
                    <h4 className="mb-0">{upcomingMeetings.length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar-sm">
                      <span className="avatar-title bg-info-subtle text-info rounded fs-3">
                        <i className="ri-time-line"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl={3} md={6}>
            <Card className="card-animate">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-uppercase fw-medium text-muted mb-1">
                      Completed
                    </p>
                    <h4 className="mb-0">{completedMeetings.length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar-sm">
                      <span className="avatar-title bg-success-subtle text-success rounded fs-3">
                        <i className="ri-check-double-line"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl={3} md={6}>
            <Card
              className="card-animate"
              onClick={() => navigate("/meetings/calendar")}
              style={{ cursor: "pointer" }}
            >
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <p className="text-uppercase fw-medium text-muted mb-1">
                      Calendar View
                    </p>
                    <h6 className="mb-0 text-primary">Open Calendar</h6>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar-sm">
                      <span className="avatar-title bg-warning-subtle text-warning rounded fs-3">
                        <i className="ri-calendar-2-line"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <h5 className="card-title mb-0">
                    All Meetings
                    {filteredMeetings.length > 0 && (
                      <span className="text-muted ms-2 fs-14">
                        ({filteredMeetings.length} {filteredMeetings.length === 1 ? "meeting" : "meetings"})
                      </span>
                    )}
                  </h5>
                  <div className="d-flex gap-2 flex-wrap" style={{ minWidth: "300px" }}>
                    {/* Search Bar */}
                    <InputGroup style={{ width: "250px" }}>
                      <Input
                        type="text"
                        placeholder="Search meetings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control"
                      />
                      <Button color="light" disabled>
                        <i className="ri-search-line"></i>
                      </Button>
                    </InputGroup>
                    
                    {/* Status Filter */}
                    <div style={{ width: "200px" }}>
                      <Select
                        value={statusOptions.find(
                          (opt: any) => opt.value === statusFilter
                        )}
                        onChange={(selectedOption: any) => {
                          setStatusFilter(selectedOption?.value || "");
                        }}
                        options={statusOptions}
                        placeholder="Filter by Status"
                        classNamePrefix="select2-selection"
                        isClearable
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                {!selectedClientId ? (
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <i className="ri-user-search-line display-4 text-primary"></i>
                    </div>
                    <h4 className="mb-2">Select a Client to Continue</h4>
                    <p className="text-muted mb-4">
                      Please select a client from the dropdown above to view their meetings and schedule new ones.
                      <br />
                      <small className="text-muted">
                        <i className="ri-information-line align-middle me-1"></i>
                        Client selection is required to access meeting management features.
                      </small>
                    </p>
                  </div>
                ) : filteredMeetings.length === 0 && !loading ? (
                  <div className="text-center py-5">
                    <i className="ri-calendar-line display-4 text-muted"></i>
                    <h5 className="mt-3">No meetings found</h5>
                    <p className="text-muted">
                      No meetings scheduled for this client yet.
                    </p>
                    <Button
                      color="primary"
                      onClick={() => navigate("/meetings/create")}
                    >
                      <i className="ri-add-line align-bottom me-1"></i>
                      Schedule Meeting
                    </Button>
                  </div>
                ) : (
                  <>
                    <Row className="g-3">
                      {filteredMeetings.map((meeting: ClientMeeting) => (
                        <Col key={meeting.id} xl={3} lg={3} md={6} sm={12}>
                          <MeetingCard
                            meeting={meeting}
                            onView={() => navigate(`/meetings/view/${meeting.id}`)}
                            onEdit={() => navigate(`/meetings/edit/${meeting.id}`)}
                            onReschedule={() => navigate(`/meetings/reschedule/${meeting.id}`)}
                            onDelete={() => onDelete(meeting.id)}
                          />
                        </Col>
                      ))}
                    </Row>
                    
                    {/* Infinite scroll trigger */}
                    <div ref={observerTarget} className="text-center py-3">
                      {isLoadingMore && (
                        <div>
                          <Spinner color="primary" className="me-2" />
                          <span className="text-muted">Loading more meetings...</span>
                        </div>
                      )}
                      {!hasMoreRef.current && filteredMeetings.length > 0 && (
                        <p className="text-muted mb-0">
                          <i className="ri-check-line align-middle me-1"></i>
                          All meetings loaded
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Delete Modal */}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={confirmDelete}
        onCloseClick={() => {
          setDeleteModal(false);
          setMeetingToDelete(null);
        }}
      />
    </div>
  );
};

export default Meetings;
