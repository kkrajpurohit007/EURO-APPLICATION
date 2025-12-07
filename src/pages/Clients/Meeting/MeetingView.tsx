import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Alert,
  Label,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Loader from "../../../Components/Common/Loader";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  fetchClientMeetingById,
  deleteClientMeeting,
  selectClientMeetingById,
  selectClientMeetingDetailLoading,
  selectClientMeetingError,
} from "../../../slices/clientMeetings/clientMeeting.slice";
import {
  ClientMeeting,
  MEETING_TYPE_MAP,
  MEETING_STATUS_MAP,
} from "../../../slices/clientMeetings/clientMeeting.fakeData";
import { PAGE_TITLES } from "../../../common/branding";
import {
  formatTime,
  formatMeetingDate,
  getStatusColor,
  getTypeColor,
  parseExternalAttendees,
} from "./utils/meetingUtils";

const MeetingView: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const meeting: ClientMeeting | null = useSelector((state: any) =>
    selectClientMeetingById(state, id || "")
  );
  const loading = useSelector(selectClientMeetingDetailLoading);
  const error = useSelector(selectClientMeetingError);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      // Only fetch if not already in store
      if (!meeting) {
        dispatch(fetchClientMeetingById(id));
      }
    }
  }, [dispatch, id, meeting]);

  const handleDelete = () => {
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (id) {
      const result = await dispatch(deleteClientMeeting(id));
      if (result.meta.requestStatus === "fulfilled") {
      setTimeout(() => {
          navigate("/clients/meetings");
      }, 1000);
      }
    }
    setDeleteModal(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !meeting) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">
            {error || "Meeting not found"}
          </Alert>
        </Container>
      </div>
    );
  }

  document.title = `${meeting.meetingTitle || "Meeting"} | ${PAGE_TITLES.MEETING_VIEW}`;

  const getExternalAttendees = (): string[] => {
    return parseExternalAttendees(meeting.externalAttendees);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Meeting Details" pageTitle="Meetings" />

        <Row>
          <Col lg={8}>
            {/* Section A - Basic Info */}
            <Card className="mb-3">
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-file-text-line align-middle me-2"></i>
                  Basic Information
                </h5>
              </CardHeader>
              <CardBody>
                <Row className="g-3">
                  <Col md={12}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">Meeting Title</Label>
                      <p className="mb-0 fw-semibold">{meeting.meetingTitle || "-"}</p>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">Description</Label>
                      <p className="mb-0">
                        {meeting.meetingDescription || (
                          <span className="text-muted fst-italic">No description provided</span>
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">
                        <i className="ri-building-line align-middle me-1"></i>
                        Client Name
                      </Label>
                      <p className="mb-0">{meeting.clientName || "-"}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">
                        <i className="ri-building-2-line align-middle me-1"></i>
                        Tenant Name
                      </Label>
                      <p className="mb-0">{meeting.tenantName || "-"}</p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* Section B - Schedule */}
            <Card className="mb-3">
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-calendar-line align-middle me-2"></i>
                  Schedule
                </h5>
              </CardHeader>
              <CardBody>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">
                        <i className="ri-calendar-line align-middle me-1"></i>
                        Meeting Date
                      </Label>
                      <p className="mb-0 fw-semibold">{formatMeetingDate(meeting.meetingDate)}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">
                        <i className="ri-time-line align-middle me-1"></i>
                        Time
                      </Label>
                      <p className="mb-0 fw-semibold">
                        {formatTime(meeting.meetingStartTime)} – {formatTime(meeting.meetingEndTime)}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">
                        <i className="ri-map-pin-line align-middle me-1"></i>
                        Location
                      </Label>
                      <p className="mb-0">{meeting.meetingLocation || (
                        <span className="text-muted fst-italic">Not specified</span>
                      )}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">
                        <i className="ri-calendar-event-line align-middle me-1"></i>
                        Meeting Type
                      </Label>
                      <div>
                        <Badge color={getTypeColor(meeting.meetingType)} className="fs-12">
                          {MEETING_TYPE_MAP[meeting.meetingType] || "Unknown"}
                    </Badge>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* Section C - Organizer & Status */}
            <Card className="mb-3">
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-user-line align-middle me-2"></i>
                  Organizer & Status
                </h5>
              </CardHeader>
              <CardBody>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">
                        <i className="ri-user-line align-middle me-1"></i>
                        Organizer Name
                      </Label>
                      <p className="mb-0">{meeting.organizerUserName || "-"}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">
                        <i className="ri-checkbox-circle-line align-middle me-1"></i>
                        Meeting Status
                      </Label>
                      <div>
                        <Badge color={getStatusColor(meeting.meetingStatus)} className="fs-12">
                          {MEETING_STATUS_MAP[meeting.meetingStatus] || "Unknown"}
                    </Badge>
                  </div>
                </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-1">
                        <i className="ri-time-line align-middle me-1"></i>
                        Created
                      </Label>
                      <p className="mb-0">{formatMeetingDate(meeting.created)}</p>
                    </div>
                  </Col>
                  {meeting.modified && (
                    <Col md={6}>
                      <div className="mb-3">
                        <Label className="form-label text-muted mb-1">
                          <i className="ri-edit-line align-middle me-1"></i>
                          Last Modified
                        </Label>
                        <p className="mb-0">{formatMeetingDate(meeting.modified)}</p>
                      </div>
                    </Col>
                  )}
                </Row>
              </CardBody>
            </Card>

            {/* Section D - Attendees */}
            <Card className="mb-3">
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-group-line align-middle me-2"></i>
                  Attendees
                  {(meeting.attendees && meeting.attendees.length > 0) ||
                  getExternalAttendees().length > 0 ? (
                    <span className="ms-2 text-muted fs-14">
                      (
                      {(meeting.attendees?.length || 0) +
                        getExternalAttendees().length}
                      )
                    </span>
                  ) : null}
                </h5>
              </CardHeader>
              <CardBody>
                {/* Internal Users */}
                {meeting.attendees &&
                  meeting.attendees.filter((a) => a.userName).length > 0 && (
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-2">
                        <i className="ri-user-3-line align-middle me-1"></i>
                        Internal Users
                      </Label>
                      <div>
                        {meeting.attendees
                          .filter((a) => a.userName)
                          .map((attendee, index) => (
                            <Badge
                              key={`user-${index}`}
                              color="primary"
                              className="fs-13 px-3 py-2 me-2 mb-2"
                            >
                              <i className="ri-user-3-line align-middle me-1"></i>
                              {attendee.userName}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Client Contacts */}
                {meeting.attendees &&
                  meeting.attendees.filter((a) => a.clientContactName).length >
                    0 && (
                    <div className="mb-3">
                      <Label className="form-label text-muted mb-2">
                        <i className="ri-contacts-line align-middle me-1"></i>
                        Client Contacts
                      </Label>
                      <div>
                        {meeting.attendees
                          .filter((a) => a.clientContactName)
                          .map((attendee, index) => (
                          <Badge
                              key={`contact-${index}`}
                              color="success"
                              className="fs-13 px-3 py-2 me-2 mb-2"
                            >
                              <i className="ri-contacts-line align-middle me-1"></i>
                              {attendee.clientContactName}
                          </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                {/* External Attendees */}
                {getExternalAttendees().length > 0 && (
                  <div className="mb-3">
                    <Label className="form-label text-muted mb-2">
                      <i className="ri-mail-line align-middle me-1"></i>
                      External Attendees
                    </Label>
                    <div>
                      {getExternalAttendees().map((email, index) => (
                        <Badge
                          key={`external-${index}`}
                          color="info"
                          className="fs-13 px-3 py-2 me-2 mb-2"
                        >
                          <i className="ri-mail-line align-middle me-1"></i>
                          {email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(!meeting.attendees || meeting.attendees.length === 0) &&
                  getExternalAttendees().length === 0 && (
                    <p className="text-muted mb-0 fst-italic">
                      No attendees listed
                    </p>
                  )}
              </CardBody>
            </Card>

                <div className="d-flex gap-2 mt-4">
              <Button color="light" onClick={() => navigate("/clients/meetings")}>
                    <i className="ri-arrow-left-line align-bottom me-1"></i>
                Back to Meetings
                  </Button>
              {meeting.meetingStatus !== 3 && meeting.meetingStatus !== 4 && (
                      <>
                        <Button
                          color="primary"
                    onClick={() => navigate(`/meetings/edit/${meeting.id}`)}
                        >
                          <i className="ri-pencil-line align-bottom me-1"></i>
                          Edit
                        </Button>
                  <Button color="warning" onClick={() => navigate(`/meetings/reschedule/${meeting.id}`)}>
                    <i className="ri-calendar-event-line align-bottom me-1"></i>
                    Reschedule
                        </Button>
                        <Button color="danger" outline onClick={handleDelete}>
                          <i className="ri-delete-bin-line align-bottom me-1"></i>
                          Delete
                        </Button>
                      </>
                    )}
                </div>
          </Col>

          <Col lg={4}>
            <Card>
              <CardHeader>
                <h6 className="card-title mb-0">Meeting Details</h6>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <p className="text-muted mb-1 fs-13">Status</p>
                  <Badge
                    color={getStatusColor(meeting.meetingStatus)}
                    className="fs-12"
                  >
                    {MEETING_STATUS_MAP[meeting.meetingStatus] || "Unknown"}
                  </Badge>
                </div>

                <div className="mb-3">
                  <p className="text-muted mb-1 fs-13">Meeting Type</p>
                  <Badge color={getTypeColor(meeting.meetingType)} className="fs-12">
                    {MEETING_TYPE_MAP[meeting.meetingType] || "Unknown"}
                  </Badge>
                </div>

                {meeting.created && (
                  <div className="mb-3">
                    <p className="text-muted mb-1 fs-13">Created</p>
                    <p className="mb-0 fs-13">{formatMeetingDate(meeting.created)}</p>
                  </div>
                )}

                {meeting.modified && (
                  <div className="mb-3">
                    <p className="text-muted mb-1 fs-13">Last Updated</p>
                    <p className="mb-0 fs-13">{formatMeetingDate(meeting.modified)}</p>
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

export default MeetingView;
