import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
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
import {
  selectClientMeetingsList,
  selectClientMeetingPagination,
  fetchClientMeetings,
  deleteClientMeeting,
  selectClientMeetingLoading,
} from "../../../slices/clientMeetings/clientMeeting.slice";
import { selectClientList } from "../../../slices/clients/client.slice";
import { fetchClients } from "../../../slices/clients/client.slice";
import {
  ClientMeeting,
  MEETING_STATUS_MAP,
} from "../../../slices/clientMeetings/clientMeeting.fakeData";
import MeetingCard from "./MeetingCard";
import { PAGE_TITLES } from "../../../common/branding";
import { getMeetingStatusOptions } from "./utils/meetingUtils";

const Meetings: React.FC = () => {
  document.title = PAGE_TITLES.MEETINGS_SCHEDULE;

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const meetings: ClientMeeting[] = useSelector(selectClientMeetingsList);
  const pagination = useSelector(selectClientMeetingPagination);
  const loading = useSelector(selectClientMeetingLoading);
  const clients = useSelector(selectClientList);

  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<number | "">("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef(true);

  // Fetch clients if not loaded
  useEffect(() => {
    if (!clients || clients.length === 0) {
      dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
    }
  }, [dispatch, clients]);

  // Fetch meetings when selected client changes - reset to page 1
  useEffect(() => {
    hasMoreRef.current = true;
    dispatch(
      fetchClientMeetings({
        clientId: selectedClientId,
        pageNumber: 1,
        pageSize: 20,
      })
    );
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

  const clientOptions = useMemo(() => {
    return [
      { value: "", label: "All Clients" },
      ...clients
        .filter((c: any) => !c.isDeleted)
        .map((client: any) => ({
          value: client.id,
          label: client.name,
        })),
    ];
  }, [clients]);

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
            <Label className="form-label">Filter by Client</Label>
            <Select
              value={clientOptions.find(
                (opt: any) => opt.value === selectedClientId
              )}
              onChange={(selectedOption: any) => {
                setSelectedClientId(selectedOption?.value || undefined);
              }}
              options={clientOptions}
              placeholder="Select Client"
              classNamePrefix="select2-selection"
              isClearable
            />
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
                {filteredMeetings.length === 0 && !loading ? (
                  <div className="text-center py-5">
                    <i className="ri-calendar-line display-4 text-muted"></i>
                    <h5 className="mt-3">No meetings found</h5>
                    <p className="text-muted">
                      {selectedClientId ? "No meetings for this client" : "Schedule your first meeting"}
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
                            onDelete={() => {
                              if (window.confirm("Are you sure you want to delete this meeting?")) {
                                dispatch(deleteClientMeeting(meeting.id)).then(() => {
                                  // Refresh meetings list after deletion
                                  dispatch(
                                    fetchClientMeetings({
                                      clientId: selectedClientId,
                                      pageNumber: 1,
                                      pageSize: 20,
                                    })
                                  );
                                });
                              }
                            }}
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
    </div>
  );
};

export default Meetings;
