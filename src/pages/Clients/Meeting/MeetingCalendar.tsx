import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import Select from "react-select";
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
  selectClientMeetingsList,
  fetchClientMeetings,
  updateClientMeeting,
  deleteClientMeeting,
  selectClientMeetingLoading,
} from "../../../slices/clientMeetings/clientMeeting.slice";
import { selectClientList } from "../../../slices/clients/client.slice";
import { fetchClients } from "../../../slices/clients/client.slice";
import {
  ClientMeeting,
  MEETING_TYPE_MAP,
  MEETING_STATUS_MAP,
} from "../../../slices/clientMeetings/clientMeeting.fakeData";
import { PAGE_TITLES } from "../../../common/branding";

const MeetingCalendar: React.FC = () => {
  document.title = PAGE_TITLES.MEETING_CALENDAR;

  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const meetings: ClientMeeting[] = useSelector(selectClientMeetingsList);
  const loading = useSelector(selectClientMeetingLoading);
  const clients = useSelector(selectClientList);

  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [event, setEvent] = useState<any>({});
  const [selectedDay, setSelectedDay] = useState<any>(0);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  const [dayMeetingsModal, setDayMeetingsModal] = useState(false);
  const [selectedDayMeetings, setSelectedDayMeetings] = useState<ClientMeeting[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fetch clients if not loaded
  useEffect(() => {
    if (!clients || clients.length === 0) {
      dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
    }
  }, [dispatch, clients]);

  // Fetch meetings when selected client changes
  useEffect(() => {
    dispatch(
      fetchClientMeetings({
        clientId: selectedClientId,
        pageNumber: 1,
        pageSize: 100, // Get more meetings for calendar view
      })
    );
  }, [dispatch, selectedClientId]);

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

  // Filter meetings by selected client
  const filteredMeetings = useMemo(() => {
    if (!meetings) return [];
    let filtered = meetings.filter((m) => !m.isDeleted);
    if (selectedClientId) {
      filtered = filtered.filter((m) => m.clientId === selectedClientId);
    }
    return filtered;
  }, [meetings, selectedClientId]);

  // Group meetings by date
  const meetingsByDate = useMemo(() => {
    const grouped: Record<string, ClientMeeting[]> = {};
    filteredMeetings.forEach((meeting: ClientMeeting) => {
      const dateKey = meeting.meetingDate.split("T")[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(meeting);
    });
    return grouped;
  }, [filteredMeetings]);

  // Convert meetings to FullCalendar events
  const calendarEvents = useMemo(() => {
    const events: any[] = [];
    
    Object.keys(meetingsByDate).forEach((dateKey) => {
      const dayMeetings = meetingsByDate[dateKey];
      
      if (dayMeetings.length <= 2) {
        // Show individual events if 2 or fewer meetings
        dayMeetings.forEach((meeting: ClientMeeting) => {
          const startDateTime = `${dateKey}T${meeting.meetingStartTime}`;
          const endDateTime = meeting.meetingEndTime ? `${dateKey}T${meeting.meetingEndTime}` : undefined;

          events.push({
            id: meeting.id,
            title: meeting.meetingTitle || "Untitled Meeting",
            start: startDateTime,
            end: endDateTime,
            className: getStatusClassName(meeting.meetingStatus),
            extendedProps: {
              clientName: meeting.clientName,
              location: meeting.meetingLocation,
              meetingType: MEETING_TYPE_MAP[meeting.meetingType] || "Unknown",
              organizer: meeting.organizerUserName,
              status: MEETING_STATUS_MAP[meeting.meetingStatus] || "Unknown",
              description: meeting.meetingDescription,
              meeting: meeting,
            },
          });
        });
      } else {
        // Show a single "more" event if more than 2 meetings
        events.push({
          id: `more-${dateKey}`,
          title: `${dayMeetings.length} Meetings`,
          start: dateKey,
          allDay: true,
          className: "bg-primary-subtle text-primary fw-semibold",
          extendedProps: {
            isMoreEvent: true,
            date: dateKey,
            meetings: dayMeetings,
          },
        });
      }
    });
    
    return events;
  }, [meetingsByDate]);

  // Get status class name for calendar events
  function getStatusClassName(status: number) {
    switch (status) {
      case 1: // Scheduled
        return "bg-info-subtle text-info";
      case 2: // In Progress
        return "bg-warning-subtle text-warning";
      case 3: // Completed
        return "bg-success-subtle text-success";
      case 4: // Cancelled
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

  // Handle event click - view/edit meeting or show day meetings
  const handleEventClick = (arg: any) => {
    const clickedEvent = arg.event;
    const extendedProps = clickedEvent.extendedProps || {};
    
    // If it's a "more" event, show all meetings for that day
    if (extendedProps.isMoreEvent && extendedProps.meetings) {
      setSelectedDayMeetings(extendedProps.meetings);
      setSelectedDate(extendedProps.date);
      setDayMeetingsModal(true);
      return;
    }
    
    // Otherwise, handle individual meeting click
    const meeting = extendedProps.meeting || filteredMeetings.find(
      (m: ClientMeeting) => String(m.id) === String(clickedEvent.id)
    );

    if (meeting) {
      const startDateTime = meeting.meetingDate
        ? `${meeting.meetingDate.split("T")[0]}T${meeting.meetingStartTime}`
        : "";
      const endDateTime = meeting.meetingEndTime
        ? `${meeting.meetingDate.split("T")[0]}T${meeting.meetingEndTime}`
        : "";

      setEvent({
        id: meeting.id,
        title: meeting.meetingTitle || "Untitled Meeting",
        start: startDateTime ? new Date(startDateTime) : new Date(),
        end: endDateTime ? new Date(endDateTime) : "",
        clientName: meeting.clientName,
        location: meeting.meetingLocation,
        meetingType: MEETING_TYPE_MAP[meeting.meetingType] || "Unknown",
        organizer: meeting.organizerUserName,
        description: meeting.meetingDescription,
        status: MEETING_STATUS_MAP[meeting.meetingStatus] || "Unknown",
        className: getStatusClassName(meeting.meetingStatus),
      });
      setIsEdit(true);
      setModal(true);
    }
  };

  // Handle event mouse enter - show count on hover for days with multiple meetings
  const handleEventMouseEnter = (arg: any) => {
    const extendedProps = arg.event.extendedProps || {};
    if (extendedProps.isMoreEvent && extendedProps.meetings) {
      // Remove any existing tooltip first
      const existingTooltip = document.querySelector(".fc-event-tooltip");
      if (existingTooltip && document.body.contains(existingTooltip)) {
        try {
          document.body.removeChild(existingTooltip);
        } catch (e) {
          // Tooltip already removed, ignore
        }
      }
      
      const tooltip = document.createElement("div");
      tooltip.className = "fc-event-tooltip";
      tooltip.innerHTML = `${extendedProps.meetings.length} meetings on this day. Click to view all.`;
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        pointer-events: none;
        white-space: nowrap;
      `;
      document.body.appendChild(tooltip);
      
      let isRemoved = false;
      
      const updateTooltipPosition = (e: MouseEvent) => {
        if (!isRemoved && tooltip.parentNode && document.body.contains(tooltip)) {
          tooltip.style.left = `${e.pageX + 10}px`;
          tooltip.style.top = `${e.pageY - 10}px`;
        }
      };
      
      const removeTooltip = () => {
        if (isRemoved) return;
        
        if (tooltip && document.body.contains(tooltip)) {
          try {
            document.body.removeChild(tooltip);
            isRemoved = true;
          } catch (e) {
            // Tooltip already removed, ignore
            isRemoved = true;
          }
        } else {
          isRemoved = true;
        }
        
        document.removeEventListener("mousemove", updateTooltipPosition);
        document.removeEventListener("mouseleave", removeTooltip);
      };
      
      const handleMouseLeave = () => {
        removeTooltip();
      };
      
      document.addEventListener("mousemove", updateTooltipPosition);
      document.addEventListener("mouseleave", removeTooltip);
      arg.el.addEventListener("mouseleave", handleMouseLeave);
      
      // Store cleanup function on the element
      (arg.el as any).__tooltipCleanup = handleMouseLeave;
    }
  };

  // Handle event drop - reschedule meeting
  const handleEventDrop = (arg: any) => {
    const droppedEvent = arg.event;
    const meeting = filteredMeetings.find((m: ClientMeeting) => m.id === droppedEvent.id);

    if (meeting) {
      const newDate = droppedEvent.start.toISOString();
      const newStartTime = droppedEvent.start.toTimeString().split(" ")[0];
      const newEndTime = droppedEvent.end
        ? droppedEvent.end.toTimeString().split(" ")[0]
        : meeting.meetingEndTime || newStartTime;

      dispatch(
        updateClientMeeting({
          id: meeting.id,
          data: {
            meetingDate: newDate.split("T")[0],
            meetingStartTime: newStartTime,
            meetingEndTime: newEndTime,
          },
        })
      );
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

        dispatch(
          updateClientMeeting({
            id: event.id,
            data: {
              meetingTitle: values.title,
              meetingDescription: values.agenda,
              meetingDate: startDate.toISOString(),
              meetingStartTime: startDate.toTimeString().split(" ")[0],
              meetingEndTime: endDate
                ? endDate.toTimeString().split(" ")[0]
                : startDate.toTimeString().split(" ")[0],
              meetingLocation: values.location,
              meetingType: values.meetingType === "Virtual" ? 2 : values.meetingType === "Phone" ? 3 : values.meetingType === "Hybrid" ? 4 : 1,
            },
          })
        );
      } else {
        // Navigate to create meeting page for new meetings
        // Calendar drag-and-drop create should use the dedicated form
        toggle();
        navigate("/meetings/create");
        return;
      }

      toggle();
      validation.resetForm();
    },
  });


  // Handle delete meeting
  const handleDeleteEvent = () => {
    if (event.id) {
      dispatch(deleteClientMeeting(event.id));
    }
    setDeleteModal(false);
    toggle();
  };

  // Get upcoming meetings
  const getUpcomingMeetings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return filteredMeetings
      .filter((meeting: ClientMeeting) => {
        const meetingDate = new Date(meeting.meetingDate);
        return meetingDate >= today && meeting.meetingStatus !== 4; // 4 = Cancelled
      })
      .sort((a: ClientMeeting, b: ClientMeeting) => {
        const dateA = new Date(`${a.meetingDate.split("T")[0]}T${a.meetingStartTime}`);
        const dateB = new Date(`${b.meetingDate.split("T")[0]}T${b.meetingStartTime}`);
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
                        {[
                          { id: 1, title: "In Person", type: "bg-info-subtle text-info" },
                          { id: 2, title: "Virtual", type: "bg-warning-subtle text-warning" },
                          { id: 3, title: "Phone", type: "bg-success-subtle text-success" },
                          { id: 4, title: "Hybrid", type: "bg-primary-subtle text-primary" },
                        ].map((category: any) => (
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
                            {getUpcomingMeetings().map((m: ClientMeeting) => {
                              const startDateTime = `${m.meetingDate.split("T")[0]}T${m.meetingStartTime || "09:00:00"}`;
                              const d = new Date(startDateTime);
                              const month = d
                                .toLocaleString("default", { month: "short" })
                                .toUpperCase();
                              const day = d.getDate();
                              const weekday = d.toLocaleString("default", {
                                weekday: "short",
                              });
                              const online = m.meetingType === 2 || m.meetingType === 4; // Virtual or Hybrid
                              const startTime = m.meetingStartTime?.substring(0, 5) || "09:00";
                              const endTime = m.meetingEndTime?.substring(0, 5) || "10:00";
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
                                              m.meetingStatus
                                            )} px-2 py-1`}
                                          >
                                            {MEETING_STATUS_MAP[m.meetingStatus] || "Unknown"}
                                          </Badge>
                                          {online && (
                                            <span className="text-muted d-inline-flex align-items-center">
                                              <i className="mdi mdi-wifi me-1" />{" "}
                                              Online
                                            </span>
                                          )}
                                        </div>
                                        <h6 className="mb-1">{m.meetingTitle || "Untitled Meeting"}</h6>
                                        <div className="text-muted mb-2 d-flex align-items-center">
                                          <i className="mdi mdi-account me-1" />{" "}
                                          {m.clientName || "-"}
                                        </div>
                                        {m.organizerUserName && (
                                          <div className="text-muted mb-2 d-flex align-items-center">
                                            <i className="mdi mdi-account-circle me-1" />{" "}
                                            Organizer: {m.organizerUserName}
                                          </div>
                                        )}
                                        <div className="text-muted mb-2 d-flex align-items-center">
                                          <i className="mdi mdi-clock-outline me-1" />{" "}
                                          {formatTime(startTime)} - {formatTime(endTime)}
                                        </div>
                                        {m.meetingLocation && (
                                          <div className="text-muted mb-2 d-flex align-items-center">
                                            <i className="mdi mdi-map-marker me-1" />{" "}
                                            {m.meetingLocation}
                                          </div>
                                        )}
                                        {m.meetingDescription && (
                                          <div className="bg-light rounded p-2 fst-italic text-muted">
                                            {m.meetingDescription}
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
                        eventMouseEnter={handleEventMouseEnter}
                        eventMouseLeave={() => {
                          // Cleanup tooltip when mouse leaves any event
                          const existingTooltip = document.querySelector(".fc-event-tooltip");
                          if (existingTooltip && document.body.contains(existingTooltip)) {
                            try {
                              document.body.removeChild(existingTooltip);
                            } catch (e) {
                              // Tooltip already removed, ignore
                            }
                          }
                        }}
                        eventDrop={handleEventDrop}
                        initialView="dayGridMonth"
                        eventContent={(arg) => {
                          const extendedProps = arg.event.extendedProps || {};
                          if (extendedProps.isMoreEvent) {
                            return {
                              html: `<div class="d-flex align-items-center justify-content-center gap-1">
                                <i class="ri-calendar-event-line"></i>
                                <span class="fw-semibold">${extendedProps.meetings?.length || 0} Meetings</span>
                              </div>`,
                            };
                          }
                          return null; // Use default rendering
                        }}
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

              {/* Day Meetings Modal - Shows all meetings for a day */}
              <Modal isOpen={dayMeetingsModal} toggle={() => setDayMeetingsModal(false)} size="lg" centered>
                <ModalHeader toggle={() => setDayMeetingsModal(false)}>
                  Meetings on {selectedDate ? new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : ""}
                </ModalHeader>
                <ModalBody>
                  <div className="d-flex flex-column gap-3">
                    {selectedDayMeetings.length === 0 ? (
                      <p className="text-muted text-center py-4">No meetings found</p>
                    ) : (
                      selectedDayMeetings
                        .sort((a, b) => {
                          const timeA = a.meetingStartTime || "00:00:00";
                          const timeB = b.meetingStartTime || "00:00:00";
                          return timeA.localeCompare(timeB);
                        })
                        .map((meeting: ClientMeeting) => {
                          const startTime = meeting.meetingStartTime?.substring(0, 5) || "";
                          const endTime = meeting.meetingEndTime?.substring(0, 5) || "";
                          return (
                            <Card
                              key={meeting.id}
                              className="border shadow-sm"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setDayMeetingsModal(false);
                                const startDateTime = `${meeting.meetingDate.split("T")[0]}T${meeting.meetingStartTime}`;
                                const endDateTime = meeting.meetingEndTime
                                  ? `${meeting.meetingDate.split("T")[0]}T${meeting.meetingEndTime}`
                                  : "";
                                setEvent({
                                  id: meeting.id,
                                  title: meeting.meetingTitle || "Untitled Meeting",
                                  start: startDateTime ? new Date(startDateTime) : new Date(),
                                  end: endDateTime ? new Date(endDateTime) : "",
                                  clientName: meeting.clientName,
                                  location: meeting.meetingLocation,
                                  meetingType: MEETING_TYPE_MAP[meeting.meetingType] || "Unknown",
                                  organizer: meeting.organizerUserName,
                                  description: meeting.meetingDescription,
                                  status: MEETING_STATUS_MAP[meeting.meetingStatus] || "Unknown",
                                  className: getStatusClassName(meeting.meetingStatus),
                                });
                                setIsEdit(true);
                                setModal(true);
                              }}
                            >
                              <CardBody className="p-3">
                                <div className="d-flex align-items-start justify-content-between">
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                      <Badge
                                        color=""
                                        className={`text-uppercase ${getStatusClassName(
                                          meeting.meetingStatus
                                        )} px-2 py-1`}
                                      >
                                        {MEETING_STATUS_MAP[meeting.meetingStatus] || "Unknown"}
                                      </Badge>
                                      <span className="text-muted fs-13">
                                        {MEETING_TYPE_MAP[meeting.meetingType] || "Unknown"}
                                      </span>
                                    </div>
                                    <h6 className="mb-1">{meeting.meetingTitle || "Untitled Meeting"}</h6>
                                    <div className="text-muted mb-1 d-flex align-items-center">
                                      <i className="ri-time-line me-1"></i>
                                      {formatTime(startTime)} - {formatTime(endTime)}
                                    </div>
                                    {meeting.meetingLocation && (
                                      <div className="text-muted mb-1 d-flex align-items-center">
                                        <i className="ri-map-pin-line me-1"></i>
                                        {meeting.meetingLocation}
                                      </div>
                                    )}
                                    {meeting.clientName && (
                                      <div className="text-muted mb-1 d-flex align-items-center">
                                        <i className="ri-building-line me-1"></i>
                                        {meeting.clientName}
                                      </div>
                                    )}
                                    {meeting.organizerUserName && (
                                      <div className="text-muted mb-1 d-flex align-items-center">
                                        <i className="ri-user-line me-1"></i>
                                        Organizer: {meeting.organizerUserName}
                                      </div>
                                    )}
                                    {meeting.meetingDescription && (
                                      <p className="text-muted mb-0 mt-2 fs-13">
                                        {meeting.meetingDescription.length > 100
                                          ? `${meeting.meetingDescription.substring(0, 100)}...`
                                          : meeting.meetingDescription}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    color="light"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/meetings/view/${meeting.id}`;
                                    }}
                                  >
                                    <i className="ri-eye-line"></i>
                                  </Button>
                                </div>
                              </CardBody>
                            </Card>
                          );
                        })
                    )}
                  </div>
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
