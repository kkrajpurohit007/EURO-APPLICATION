import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Badge,
  Label,
  Input,
  Form,
  FormFeedback,
} from "reactstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import BootstrapTheme from "@fullcalendar/bootstrap5";
import { useFormik } from "formik";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import SimpleBar from "simplebar-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Loader from "../../../Components/Common/Loader";
import {
  getMeetings,
  addNewMeeting as onAddNewMeeting,
  updateMeeting as onUpdateMeeting,
  deleteMeeting as onDeleteMeeting,
} from "../../../slices/thunks";
import { Meeting } from "../../../slices/meetings/reducer";
import { PAGE_TITLES } from "../../../common/branding";

// Categories for meeting types
const categories = [
  { id: 1, title: "Client Meeting", type: "bg-info-subtle text-info" },
  { id: 2, title: "Site Inspection", type: "bg-warning-subtle text-warning" },
  { id: 3, title: "Internal Meeting", type: "bg-success-subtle text-success" },
  { id: 4, title: "Training", type: "bg-primary-subtle text-primary" },
];

const MeetingCalendar: React.FC = () => {
  document.title = PAGE_TITLES.MEETING_CALENDAR;

  const dispatch: any = useDispatch();

  const { meetings } = useSelector((state: any) => state.Meetings);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [event, setEvent] = useState<any>({});
  const [selectedDay, setSelectedDay] = useState<any>(0);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(getMeetings());
    setTimeout(() => setLoading(false), 500);
  }, [dispatch]);

  // Initialize draggable external events
  useEffect(() => {
    const draggableEl = document.getElementById("external-events");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".external-event",
        eventData: function (eventEl) {
          return {
            title: eventEl.innerText,
            className: eventEl.getAttribute("data-type"),
          };
        },
      });
    }
  }, []);

  // Convert meetings to FullCalendar events
  const calendarEvents = meetings.map((meeting: Meeting) => ({
    id: meeting.id,
    title: meeting.title,
    start: `${meeting.meetingDate}T${meeting.meetingTime}`,
    end: meeting.endTime
      ? `${meeting.meetingDate}T${meeting.endTime}`
      : undefined,
    className: getStatusClassName(meeting.status),
    extendedProps: {
      clientName: meeting.clientName,
      location: meeting.location,
      locationType: meeting.locationType,
      meetingLink: meeting.meetingLink,
      attendees: meeting.attendees,
      organizer: meeting.organizer,
      agenda: meeting.agenda,
      notes: meeting.notes,
      status: meeting.status,
      meetingType: meeting.meetingType,
      priority: meeting.priority,
      duration: meeting.duration,
    },
  }));

  // Get status class name for calendar events
  function getStatusClassName(status: string) {
    switch (status) {
      case "Scheduled":
        return "bg-info-subtle text-info";
      case "In Progress":
        return "bg-warning-subtle text-warning";
      case "Completed":
        return "bg-success-subtle text-success";
      case "Cancelled":
        return "bg-danger-subtle text-danger";
      default:
        return "bg-info-subtle text-info";
    }
  }

  // Handle date click - create new meeting
  const handleDateClick = (arg: any) => {
    const date = arg.date;
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currectDate = new Date();
    const currentHour = currectDate.getHours();
    const currentMin = currectDate.getMinutes();
    const currentSec = currectDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );

    setSelectedDay(modifiedDate);
    setIsEdit(false);
    setModal(true);
  };

  // Handle event click - view/edit meeting
  const handleEventClick = (arg: any) => {
    const clickedEvent = arg.event;
    const meeting = meetings.find(
      (m: Meeting) => String(m.id) === String(clickedEvent.id)
    );

    if (meeting) {
      setEvent({
        id: meeting.id,
        title: meeting.title,
        start: new Date(`${meeting.meetingDate}T${meeting.meetingTime}`),
        end: meeting.endTime
          ? new Date(`${meeting.meetingDate}T${meeting.endTime}`)
          : "",
        clientName: meeting.clientName,
        location: meeting.location,
        locationType: meeting.locationType,
        meetingLink: meeting.meetingLink,
        attendees: meeting.attendees,
        organizer: meeting.organizer,
        agenda: meeting.agenda,
        notes: meeting.notes,
        status: meeting.status,
        meetingType: meeting.meetingType,
        priority: meeting.priority,
        className: getStatusClassName(meeting.status),
      });
      setIsEdit(true);
      setModal(true);
    }
  };

  // Handle event drop - reschedule meeting
  const handleEventDrop = (arg: any) => {
    const droppedEvent = arg.event;
    const meeting = meetings.find((m: Meeting) => m.id === droppedEvent.id);

    if (meeting) {
      const newDate = droppedEvent.start.toISOString().split("T")[0];
      const newTime = droppedEvent.start
        .toTimeString()
        .split(" ")[0]
        .substring(0, 5);

      const updatedMeeting = {
        ...meeting,
        meetingDate: newDate,
        meetingTime: newTime,
      };

      dispatch(onUpdateMeeting(updatedMeeting));
    }
  };

  // Toggle modal
  const toggle = () => {
    if (modal) {
      setModal(false);
      setEvent({});
      setIsEdit(false);
    } else {
      setModal(true);
    }
  };

  // Toggle delete modal
  const toggleDelete = () => {
    setDeleteModal(!deleteModal);
  };

  // Formik validation schema
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: (event && event.title) || "",
      start: (event && event.start) || selectedDay,
      end: (event && event.end) || "",
      clientName: (event && event.clientName) || "",
      location: (event && event.location) || "",
      locationType: (event && event.locationType) || "On-site",
      meetingLink: (event && event.meetingLink) || "",
      organizer: (event && event.organizer) || "",
      agenda: (event && event.agenda) || "",
      notes: (event && event.notes) || "",
      status: (event && event.status) || "Scheduled",
      meetingType: (event && event.meetingType) || "Regular",
      priority: (event && event.priority) || "Medium",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please enter meeting title"),
      clientName: Yup.string().required("Please enter client name"),
      location: Yup.string().required("Please enter location"),
      locationType: Yup.string().required("Please select location type"),
      organizer: Yup.string().required("Please enter organizer name"),
    }),
    onSubmit: (values: any) => {
      if (isEdit) {
        // Update existing meeting
        const startDate = new Date(values.start);
        const endDate = values.end ? new Date(values.end) : null;

        const updatedMeeting = {
          id: event.id,
          title: values.title,
          clientId: "client-001", // Default for now
          clientName: values.clientName,
          meetingDate: startDate.toISOString().split("T")[0],
          meetingTime: startDate.toTimeString().split(" ")[0].substring(0, 5),
          endTime: endDate
            ? endDate.toTimeString().split(" ")[0].substring(0, 5)
            : "",
          duration: calculateDuration(values.start, values.end),
          location: values.location,
          locationType: values.locationType,
          meetingLink: values.meetingLink,
          attendees: event.attendees || [],
          organizer: values.organizer,
          agenda: values.agenda,
          notes: values.notes,
          status: values.status,
          meetingType: values.meetingType,
          priority: values.priority,
          reminders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        dispatch(onUpdateMeeting(updatedMeeting));
      } else {
        // Create new meeting
        const startDate = new Date(values.start);
        const endDate = values.end ? new Date(values.end) : null;

        const newMeeting = {
          id: String(Date.now()),
          title: values.title,
          clientId: "client-001", // Default for now
          clientName: values.clientName,
          meetingDate: startDate.toISOString().split("T")[0],
          meetingTime: startDate.toTimeString().split(" ")[0].substring(0, 5),
          endTime: endDate
            ? endDate.toTimeString().split(" ")[0].substring(0, 5)
            : "",
          duration: calculateDuration(values.start, values.end),
          location: values.location,
          locationType: values.locationType,
          meetingLink: values.meetingLink,
          attendees: [],
          organizer: values.organizer,
          agenda: values.agenda,
          notes: values.notes,
          status: values.status,
          meetingType: values.meetingType,
          priority: values.priority,
          reminders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        dispatch(onAddNewMeeting(newMeeting));
      }

      toggle();
      validation.resetForm();
    },
  });

  // Calculate duration between start and end time
  const calculateDuration = (start: any, end: any) => {
    if (!end) return "1 hour";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} min${minutes > 1 ? "s" : ""
        }`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return `${minutes} min${minutes > 1 ? "s" : ""}`;
    }
  };

  // Handle delete meeting
  const handleDeleteEvent = () => {
    dispatch(onDeleteMeeting(event.id));
    setDeleteModal(false);
    toggle();
  };

  // Get upcoming meetings
  const getUpcomingMeetings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return meetings
      .filter((meeting: Meeting) => {
        const meetingDate = new Date(meeting.meetingDate);
        return meetingDate >= today && meeting.status !== "Cancelled";
      })
      .sort((a: Meeting, b: Meeting) => {
        const dateA = new Date(`${a.meetingDate}T${a.meetingTime}`);
        const dateB = new Date(`${b.meetingDate}T${b.meetingTime}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 10);
  };

  // Format time for display
  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Meeting Calendar" pageTitle="Meetings" />
          <Row>
            <Col xs={12}>
              <Row>
                <Col xl={3}>
                  <Card className="card-h-100">
                    <CardBody>
                      <Button
                        color="primary"
                        className="w-100"
                        onClick={() => {
                          setIsEdit(false);
                          setSelectedDay(new Date());
                          toggle();
                        }}
                      >
                        <i className="mdi mdi-calendar-clock"></i> Schedule
                        Meeting
                      </Button>

                      <div id="external-events" className="mt-3">
                        <p className="text-muted">
                          Drag and drop your meeting type to the calendar
                        </p>
                        {categories.map((category) => (
                          <div
                            className={`external-event fc-event ${category.type} mb-2`}
                            key={category.id}
                            data-type={category.type}
                          >
                            <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2" />
                            {category.title}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <h5 className="mb-3">Upcoming Meetings</h5>
                        <SimpleBar style={{ maxHeight: "420px" }}>
                          <div className="d-flex flex-column gap-3">
                            {getUpcomingMeetings().map((m: Meeting) => {
                              const d = new Date(
                                `${m.meetingDate}T${m.meetingTime || "09:00"}`
                              );
                              const month = d
                                .toLocaleString("default", { month: "short" })
                                .toUpperCase();
                              const day = d.getDate();
                              const weekday = d.toLocaleString("default", {
                                weekday: "short",
                              });
                              const online =
                                m.locationType === "Virtual" ||
                                m.locationType === "Hybrid";
                              const duration = m.duration || "60 mins";
                              return (
                                <div
                                  key={m.id}
                                  className="card shadow-sm border-0"
                                >
                                  <div className="card-body p-3">
                                    <div className="d-flex align-items-stretch">
                                      <div
                                        className="d-flex flex-column align-items-center justify-content-center rounded-2 bg-light text-center"
                                        style={{ width: 96 }}
                                      >
                                        <div
                                          className="text-primary fw-semibold"
                                          style={{ letterSpacing: 1 }}
                                        >
                                          {month}
                                        </div>
                                        <div className="display-6 fw-bold lh-1">
                                          {day}
                                        </div>
                                        <div className="text-muted">
                                          {weekday}
                                        </div>
                                      </div>
                                      <div className="flex-grow-1 ps-3">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                          <Badge
                                            color=""
                                            className={`text-uppercase ${getStatusClassName(
                                              m.status
                                            )} px-2 py-1`}
                                          >
                                            {m.status}
                                          </Badge>
                                          {online && (
                                            <span className="text-muted d-inline-flex align-items-center">
                                              <i className="mdi mdi-wifi me-1" />{" "}
                                              Online
                                            </span>
                                          )}
                                        </div>
                                        <h6 className="mb-1">{m.title}</h6>
                                        <div className="text-muted mb-2 d-flex align-items-center">
                                          <i className="mdi mdi-account me-1" />{" "}
                                          {m.clientName}
                                        </div>
                                        {m.meetingLink && (
                                          <div className="mb-2">
                                            <i className="mdi mdi-link-variant me-1" />
                                            <a
                                              href={m.meetingLink}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-decoration-underline"
                                            >
                                              {m.meetingLink}
                                            </a>
                                          </div>
                                        )}
                                        <div className="text-muted mb-2 d-flex align-items-center">
                                          <i className="mdi mdi-clock-outline me-1" />{" "}
                                          {formatTime(m.meetingTime)} (
                                          {duration})
                                        </div>
                                        {m.agenda && (
                                          <div className="bg-light rounded p-2 fst-italic text-muted">
                                            {m.agenda}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </SimpleBar>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col xl={9}>
                  <Card className="card-h-100">
                    <CardBody>
                      <FullCalendar
                        plugins={[
                          BootstrapTheme,
                          dayGridPlugin,
                          interactionPlugin,
                          listPlugin,
                        ]}
                        slotDuration={"00:15:00"}
                        handleWindowResize={true}
                        themeSystem="bootstrap5"
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                        }}
                        events={calendarEvents}
                        editable={true}
                        droppable={true}
                        selectable={true}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        eventDrop={handleEventDrop}
                        initialView="dayGridMonth"
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Event Modal */}
              <Modal isOpen={modal} toggle={toggle} centered>
                <ModalHeader toggle={toggle}>
                  {isEdit ? "Edit Meeting" : "Add New Meeting"}
                </ModalHeader>
                <ModalBody>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row className="g-3">
                      <Col xs={12}>
                        <Label className="form-label">Meeting Title</Label>
                        <Input
                          name="title"
                          type="text"
                          placeholder="Enter meeting title"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.title || ""}
                          invalid={
                            validation.touched.title && validation.errors.title
                              ? true
                              : false
                          }
                        />
                        {validation.touched.title && validation.errors.title ? (
                          <FormFeedback type="invalid">
                            {String(validation.errors.title)}
                          </FormFeedback>
                        ) : null}
                      </Col>

                      <Col xs={12}>
                        <Label className="form-label">Client Name</Label>
                        <Input
                          name="clientName"
                          type="text"
                          placeholder="Enter client name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.clientName || ""}
                          invalid={
                            validation.touched.clientName &&
                              validation.errors.clientName
                              ? true
                              : false
                          }
                        />
                        {validation.touched.clientName &&
                          validation.errors.clientName ? (
                          <FormFeedback type="invalid">
                            {String(validation.errors.clientName)}
                          </FormFeedback>
                        ) : null}
                      </Col>

                      <Col xs={12}>
                        <Label className="form-label">Start Date & Time</Label>
                        <Flatpickr
                          className="form-control"
                          name="start"
                          placeholder="Select date and time"
                          value={validation.values.start || ""}
                          onChange={(date: any) => {
                            validation.setFieldValue("start", date[0]);
                          }}
                          options={{
                            enableTime: true,
                            dateFormat: "Y-m-d H:i",
                          }}
                        />
                      </Col>

                      <Col xs={12}>
                        <Label className="form-label">
                          End Time (Optional)
                        </Label>
                        <Flatpickr
                          className="form-control"
                          name="end"
                          placeholder="Select end time"
                          value={validation.values.end || ""}
                          onChange={(date: any) => {
                            validation.setFieldValue("end", date[0]);
                          }}
                          options={{
                            enableTime: true,
                            dateFormat: "Y-m-d H:i",
                            noCalendar: false,
                          }}
                        />
                      </Col>

                      <Col xs={12}>
                        <Label className="form-label">Location Type</Label>
                        <Input
                          name="locationType"
                          type="select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.locationType || ""}
                        >
                          <option value="On-site">On-site</option>
                          <option value="Virtual">Virtual</option>
                          <option value="Hybrid">Hybrid</option>
                        </Input>
                      </Col>

                      <Col xs={12}>
                        <Label className="form-label">Location</Label>
                        <Input
                          name="location"
                          type="text"
                          placeholder="Enter location"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.location || ""}
                          invalid={
                            validation.touched.location &&
                              validation.errors.location
                              ? true
                              : false
                          }
                        />
                        {validation.touched.location &&
                          validation.errors.location ? (
                          <FormFeedback type="invalid">
                            {String(validation.errors.location)}
                          </FormFeedback>
                        ) : null}
                      </Col>

                      {(validation.values.locationType === "Virtual" ||
                        validation.values.locationType === "Hybrid") && (
                          <Col xs={12}>
                            <Label className="form-label">Meeting Link</Label>
                            <Input
                              name="meetingLink"
                              type="url"
                              placeholder="Enter meeting link"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.meetingLink || ""}
                            />
                          </Col>
                        )}

                      <Col xs={12}>
                        <Label className="form-label">Organizer</Label>
                        <Input
                          name="organizer"
                          type="text"
                          placeholder="Enter organizer name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.organizer || ""}
                          invalid={
                            validation.touched.organizer &&
                              validation.errors.organizer
                              ? true
                              : false
                          }
                        />
                        {validation.touched.organizer &&
                          validation.errors.organizer ? (
                          <FormFeedback type="invalid">
                            {String(validation.errors.organizer)}
                          </FormFeedback>
                        ) : null}
                      </Col>

                      {isEdit && (
                        <Col xs={12}>
                          <Label className="form-label">Status</Label>
                          <Input
                            name="status"
                            type="select"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.status || ""}
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </Input>
                        </Col>
                      )}

                      <Col xs={12}>
                        <Label className="form-label">Agenda (Optional)</Label>
                        <Input
                          name="agenda"
                          type="textarea"
                          rows={3}
                          placeholder="Enter meeting agenda"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.agenda || ""}
                        />
                      </Col>

                      <Col xs={12}>
                        <Label className="form-label">Notes (Optional)</Label>
                        <Input
                          name="notes"
                          type="textarea"
                          rows={2}
                          placeholder="Add any notes"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.notes || ""}
                        />
                      </Col>
                    </Row>

                    <div className="mt-4 hstack gap-2 justify-content-end">
                      {isEdit && (
                        <Button
                          color="danger"
                          onClick={() => {
                            toggle();
                            setDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                      <Button color="light" onClick={toggle}>
                        Close
                      </Button>
                      <Button color="primary" type="submit">
                        {isEdit ? "Update Meeting" : "Create Meeting"}
                      </Button>
                    </div>
                  </Form>
                </ModalBody>
              </Modal>

              {/* Delete Modal */}
              <Modal isOpen={deleteModal} toggle={toggleDelete} centered>
                <ModalHeader toggle={toggleDelete}>Delete Meeting</ModalHeader>
                <ModalBody>
                  <div className="mt-2 text-center">
                    <div className="fs-1 text-warning mb-4">
                      <i className="mdi mdi-alert-circle-outline"></i>
                    </div>
                    <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                      <h4>Are you sure?</h4>
                      <p className="text-muted mx-4 mb-0">
                        Are you sure you want to remove this meeting?
                      </p>
                    </div>
                  </div>
                  <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                    <button
                      type="button"
                      className="btn w-sm btn-light"
                      onClick={toggleDelete}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn w-sm btn-danger"
                      onClick={handleDeleteEvent}
                    >
                      Yes, Delete It!
                    </button>
                  </div>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MeetingCalendar;
