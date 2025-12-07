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
  FormGroup,
  Alert,
} from "reactstrap";
import Select from "react-select";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import BootstrapTheme from "@fullcalendar/bootstrap5";
import { useFormik } from "formik";
import SimpleBar from "simplebar-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Loader from "../../../Components/Common/Loader";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  selectClientMeetingsList,
  fetchClientMeetings,
  updateClientMeetingForEdit,
  createClientMeeting,
  rescheduleClientMeeting,
  deleteClientMeeting,
  selectClientMeetingLoading,
  fetchClientMeetingForEdit,
  selectClientMeetingById,
  selectClientMeetingDetailLoading,
  selectClientMeetingSaving,
  selectClientMeetingError,
} from "../../../slices/clientMeetings/clientMeeting.slice";
import { selectClientContactList } from "../../../slices/clientContacts/clientContact.slice";
import { selectGlobalUserList } from "../../../slices/globalUsers/globalUser.slice";
import { fetchClientContacts } from "../../../slices/clientContacts/clientContact.slice";
import { fetchGlobalUsers } from "../../../slices/globalUsers/globalUser.slice";
import { getLoggedinUser } from "../../../helpers/api_helper";
import { selectClientList, selectClientLoading, fetchClients } from "../../../slices/clients/client.slice";
import {
  ClientMeeting,
  MEETING_TYPE_MAP,
  MEETING_STATUS_MAP,
} from "../../../slices/clientMeetings/clientMeeting.fakeData";
import { PAGE_TITLES } from "../../../common/branding";
import {
  formatDateForInput,
  formatTimeForInput,
  formatDateToISO,
  formatTimeWithSeconds,
  getMeetingTypeOptions,
} from "./utils/meetingUtils";
import { createMeetingSchema, editMeetingSchema } from "./utils/validationSchemas";
import { useFlash } from "../../../hooks/useFlash";

const MeetingCalendar: React.FC = () => {
  document.title = PAGE_TITLES.MEETING_CALENDAR;

  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const meetings: ClientMeeting[] = useSelector(selectClientMeetingsList);
  const loading = useSelector(selectClientMeetingLoading);
  const clients = useSelector(selectClientList);
  const clientsLoading = useSelector(selectClientLoading);
  const clientContacts = useSelector(selectClientContactList);
  const globalUsers = useSelector(selectGlobalUserList);
  const authUser = getLoggedinUser();
  const { showSuccess, showError } = useFlash();

  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(0);
  const [isEdit, setIsEdit] = useState(false);
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
  const [dayMeetingsModal, setDayMeetingsModal] = useState(false);
  const [selectedDayMeetings, setSelectedDayMeetings] = useState<ClientMeeting[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);

  // Get meeting detail when editing
  const meetingDetail = useSelector((state: any) =>
    editingMeetingId ? selectClientMeetingById(state, editingMeetingId) : null
  );
  const detailLoading = useSelector(selectClientMeetingDetailLoading);
  const saving = useSelector(selectClientMeetingSaving);
  const error = useSelector(selectClientMeetingError);

  // Get clientId for editing meeting - REQUIRED for ForEdit endpoint
  const editingClientId = React.useMemo(() => {
    if (!editingMeetingId) return "";
    // Priority: meetingDetail > meetings list
    if (meetingDetail?.clientId) return meetingDetail.clientId;
    const meetingFromList = meetings.find((m: any) => m.id === editingMeetingId);
    return meetingFromList?.clientId || "";
  }, [editingMeetingId, meetingDetail, meetings]);

  // Fetch meeting detail when editing - use ForEdit endpoint (REQUIRES clientId)
  // ALWAYS fetch fresh data from API when editing a meeting
  useEffect(() => {
    if (editingMeetingId && editingClientId) {
      // Always fetch when we have both id and clientId (even if meetingDetail exists)
      dispatch(fetchClientMeetingForEdit({ id: editingMeetingId, clientId: editingClientId }));
    }
    // If clientId is not available yet, wait for meetings list to load
    // The effect will re-run when meetings list updates
  }, [dispatch, editingMeetingId, editingClientId]);

  // Fetch dropdown data if not already loaded
  useEffect(() => {
    if (!clientContacts || clientContacts.length === 0) {
      dispatch(fetchClientContacts({ pageNumber: 1, pageSize: 50 }));
    }
    if (!globalUsers || globalUsers.length === 0) {
      dispatch(fetchGlobalUsers({ pageNumber: 1, pageSize: 50 }));
    }
  }, [dispatch, clientContacts, globalUsers]);

  // Fetch clients if not loaded
  useEffect(() => {
    if (!clients || clients.length === 0) {
      dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
    }
  }, [dispatch, clients]);

  // Fetch meetings when selected client changes
  // Only fetch if a client is selected (mandatory)
  useEffect(() => {
    if (selectedClientId) {
      dispatch(
        fetchClientMeetings({
          clientId: selectedClientId,
          pageNumber: 1,
          pageSize: 100, // Get more meetings for calendar view
        })
      );
    }
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

  // Filter meetings by selected client
  const filteredMeetings = useMemo(() => {
    if (!meetings) return [];
    // Filter out deleted meetings and meetings without valid meetingDate
    let filtered = meetings.filter((m) => !m.isDeleted && m.meetingDate);
    if (selectedClientId) {
      filtered = filtered.filter((m) => m.clientId === selectedClientId);
    }
    return filtered;
  }, [meetings, selectedClientId]);

  // Group meetings by date
  const meetingsByDate = useMemo(() => {
    const grouped: Record<string, ClientMeeting[]> = {};
    filteredMeetings.forEach((meeting: ClientMeeting) => {
      // Skip meetings without valid meetingDate
      if (!meeting.meetingDate) return;
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
          // Skip meetings without valid start time
          if (!meeting.meetingStartTime) return;
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
    setEditingMeetingId(null); // Reset editing meeting ID for create mode
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
      setEditingMeetingId(meeting.id);
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
        rescheduleClientMeeting({
          id: meeting.id,
          newDate: formatDateToISO(newDate.split("T")[0]),
          newStartTime: formatTimeWithSeconds(newStartTime),
          newEndTime: formatTimeWithSeconds(newEndTime),
        })
      );
    }
  };

  // Toggle modal
  const toggle = () => {
    if (modal) {
      setModal(false);
      setIsEdit(false);
      setEditingMeetingId(null);
    } else {
      setModal(true);
    }
  };

  // Get meeting type options
  const meetingTypeOptions = useMemo(() => getMeetingTypeOptions(), []);

  // Get global user options for dropdowns
  const globalUserOptions = useMemo(() => {
    return globalUsers
      .filter((u: any) => !u.isDeleted && !u.isDisabled)
      .map((user: any) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName} (${user.email})`,
      }));
  }, [globalUsers]);

  // Get current clientId for filtering contacts (same pattern as MeetingEdit)
  const currentClientId = useMemo(() => {
    return isEdit ? editingClientId : selectedClientId;
  }, [isEdit, editingClientId, selectedClientId]);

  // Initial values for form - matching MeetingEdit exactly
  const initialValues = useMemo(() => {
    if (isEdit && meetingDetail) {
      return {
        meetingTitle: meetingDetail.meetingTitle || "",
        meetingDescription: meetingDetail.meetingDescription || "",
        meetingDate: formatDateForInput(meetingDetail.meetingDate || ""),
        meetingStartTime: formatTimeForInput(meetingDetail.meetingStartTime || ""),
        meetingEndTime: formatTimeForInput(meetingDetail.meetingEndTime || ""),
        meetingLocation: meetingDetail.meetingLocation || "",
        meetingType: meetingDetail.meetingType || 1,
        organizerUserId: meetingDetail.organizerUserId || authUser?.userId || "",
        tenantUserIds: meetingDetail.tenantUserIds || [],
        clientContactIds: meetingDetail.clientContactIds || [],
        externalAttendees: meetingDetail.externalAttendees || "",
      };
    }
    // For new meetings, use selected day or current date
    const defaultDate = selectedDay || new Date();
    return {
      clientId: selectedClientId || "",
      meetingTitle: "",
      meetingDescription: "",
      meetingDate: formatDateForInput(defaultDate.toISOString()),
      meetingStartTime: formatTimeForInput(defaultDate.toTimeString().split(" ")[0]),
      meetingEndTime: "",
      meetingLocation: "",
      meetingType: 1,
      organizerUserId: authUser?.userId || "",
      tenantUserIds: [],
      clientContactIds: [],
      externalAttendees: "",
    };
  }, [isEdit, meetingDetail, selectedDay, authUser, selectedClientId]);

  // Formik validation schema - use editMeetingSchema for edit mode, createMeetingSchema for create mode
  const validation = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: isEdit ? editMeetingSchema : createMeetingSchema,
    onSubmit: async (values) => {
      if (isEdit && editingMeetingId && editingClientId) {
        if (!meetingDetail?.tenantId) {
          showError("ID is required");
          return;
        }

        const payload = {
          tenantId: meetingDetail.tenantId,
          clientId: editingClientId,
          meetingTitle: values.meetingTitle,
          meetingDescription: values.meetingDescription,
          meetingDate: formatDateToISO(values.meetingDate),
          meetingStartTime: formatTimeWithSeconds(values.meetingStartTime),
          meetingEndTime: formatTimeWithSeconds(values.meetingEndTime),
          meetingLocation: values.meetingLocation,
          meetingType: values.meetingType,
          organizerUserId: values.organizerUserId || meetingDetail?.organizerUserId || authUser?.userId || "",
          tenantUserIds: values.tenantUserIds || [],
          clientContactIds: values.clientContactIds && values.clientContactIds.length > 0 ? values.clientContactIds : null,
          externalAttendees: values.externalAttendees || "",
        };

        const result = await dispatch(updateClientMeetingForEdit({ id: editingMeetingId, clientId: editingClientId, data: payload }));
        if (result.meta.requestStatus === "fulfilled") {
          showSuccess("Meeting updated successfully");
          toggle();
          // Refresh meetings list
          dispatch(
            fetchClientMeetings({
              clientId: selectedClientId,
              pageNumber: 1,
              pageSize: 100,
            })
          );
        } else {
          const errorMessage = result.payload?.message || "Failed to update meeting";
          showError(errorMessage);
        }
      } else {
        // Create new meeting
        if (!selectedClientId) {
          showError("Please select a client first");
          return;
        }
        if (!authUser?.tenantId) {
          showError("Organization ID is required");
          return;
        }

        const payload = {
          tenantId: authUser.tenantId,
          clientId: selectedClientId,
          meetingTitle: values.meetingTitle,
          meetingDescription: values.meetingDescription,
          meetingDate: formatDateToISO(values.meetingDate),
          meetingStartTime: formatTimeWithSeconds(values.meetingStartTime),
          meetingEndTime: formatTimeWithSeconds(values.meetingEndTime),
          meetingLocation: values.meetingLocation,
          meetingType: values.meetingType,
          organizerUserId: values.organizerUserId || authUser?.userId || "",
          tenantUserIds: values.tenantUserIds || [],
          clientContactIds: values.clientContactIds && values.clientContactIds.length > 0 ? values.clientContactIds : null,
          externalAttendees: values.externalAttendees || "",
        };

        const result = await dispatch(createClientMeeting(payload));
        if (result.meta.requestStatus === "fulfilled") {
          showSuccess("Meeting created successfully");
          toggle();
          // Reset form state
          setIsEdit(false);
          setEditingMeetingId(null);
          // Refresh meetings list
          dispatch(
            fetchClientMeetings({
              clientId: selectedClientId,
              pageNumber: 1,
              pageSize: 100,
            })
          );
        } else {
          const errorMessage = result.payload?.message || "Failed to create meeting";
          showError(errorMessage);
        }
      }
    },
  });


  // Handle delete meeting confirmation
  const confirmDelete = async () => {
    if (editingMeetingId) {
      const result = await dispatch(deleteClientMeeting(editingMeetingId));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Meeting deleted successfully");
        // Refresh meetings list
        dispatch(
          fetchClientMeetings({
            clientId: selectedClientId,
            pageNumber: 1,
            pageSize: 100,
          })
        );
      } else {
        const errorMessage = result.payload?.message || "Failed to delete meeting";
        showError(errorMessage);
      }
    }
    setDeleteModal(false);
    toggle(); // Close edit modal after delete
  };

  // Get upcoming meetings
  const getUpcomingMeetings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return filteredMeetings
      .filter((meeting: ClientMeeting) => {
        if (!meeting.meetingDate) return false;
        const meetingDate = new Date(meeting.meetingDate);
        return meetingDate >= today && meeting.meetingStatus !== 4; // 4 = Cancelled
      })
      .sort((a: ClientMeeting, b: ClientMeeting) => {
        // Skip meetings without valid date/time
        if (!a.meetingDate || !a.meetingStartTime) return 1;
        if (!b.meetingDate || !b.meetingStartTime) return -1;
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
                  Please select a client to view meetings calendar
                </small>
              )}
            </Col>
            <Col md={8} className="d-flex align-items-end justify-content-end">
              <Button 
                color="light" 
                onClick={() => navigate("/clients/meetings")}
                className="d-flex align-items-center"
              >
                <i className="ri-arrow-left-line align-bottom me-1"></i>
                Back to Card View
              </Button>
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
                        disabled={!selectedClientId}
                        title={!selectedClientId ? "Please select a client first" : ""}
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
                              // Skip if meetingDate is missing (defensive check)
                              if (!m.meetingDate) return null;
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
                        eventDisplay="block"
                        eventMaxStack={3}
                        eventTextColor="#000"
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
                          // Custom rendering for individual events - show only title, strikethrough for canceled meetings
                          const meeting = extendedProps.meeting;
                          const status = meeting?.meetingStatus || 1;
                          const fullTitle = arg.event.title || "Untitled Meeting";
                          // Truncate title to max 20 characters for calendar display
                          const shortTitle = fullTitle.length > 20 ? fullTitle.substring(0, 17) + "..." : fullTitle;
                          
                          // Add strikethrough for canceled meetings (status 4)
                          const isCanceled = status === 4;
                          const titleStyle = isCanceled 
                            ? "font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; text-decoration: line-through; opacity: 0.7;"
                            : "font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0;";
                          
                          return {
                            html: `<div class="d-flex align-items-center" style="padding: 2px 4px; overflow: hidden; width: 100%; box-sizing: border-box;">
                              <span class="fw-semibold" style="${titleStyle}" title="${fullTitle}">${shortTitle}</span>
                            </div>`,
                          };
                        }}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Event Modal */}
              <Modal isOpen={modal} toggle={toggle} centered size="lg">
                <ModalHeader toggle={toggle}>
                  {isEdit ? "Edit Meeting Details" : "Add New Meeting"}
                </ModalHeader>
                <ModalBody>
                  {detailLoading && isEdit ? (
                    <div className="text-center py-4">
                      <Loader />
                    </div>
                  ) : (
                    <>
                      {error && (
                        <Alert color="danger" className="mb-3">
                          {error}
                        </Alert>
                      )}
                      {!isEdit && !selectedClientId && (
                        <Alert color="warning" className="mb-3">
                          <i className="ri-alert-line align-middle me-1"></i>
                          Please select a client from the dropdown above before creating a meeting.
                        </Alert>
                      )}
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Check if client is selected for create mode
                          if (!isEdit && !selectedClientId) {
                            showError("Please select a client from the dropdown above before creating a meeting");
                            return;
                          }
                          validation.handleSubmit();
                        }}
                      >
                        {/* Group 1 - Meeting Details */}
                        <div className="mb-4">
                          <h6 className="text-muted mb-3">
                            <i className="ri-file-text-line align-middle me-1"></i>
                            Meeting Details
                          </h6>
                          <Row className="g-3">
                            <Col md={12}>
                              <FormGroup>
                                <Label className="form-label">
                                  Meeting Title{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  name="meetingTitle"
                                  value={validation.values.meetingTitle}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    !!(
                                      validation.touched.meetingTitle &&
                                      validation.errors.meetingTitle
                                    )
                                  }
                                  maxLength={200}
                                  placeholder="Enter meeting title"
                                />
                                {validation.touched.meetingTitle &&
                                  validation.errors.meetingTitle && (
                                    <div className="invalid-feedback d-block">
                                      {String(validation.errors.meetingTitle)}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>

                            <Col md={12}>
                              <FormGroup>
                                <Label className="form-label">Description</Label>
                                <Input
                                  type="textarea"
                                  name="meetingDescription"
                                  rows={4}
                                  value={validation.values.meetingDescription}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    !!(
                                      validation.touched.meetingDescription &&
                                      validation.errors.meetingDescription
                                    )
                                  }
                                  maxLength={1000}
                                  placeholder="Enter meeting description (optional)"
                                />
                                {validation.touched.meetingDescription &&
                                  validation.errors.meetingDescription && (
                                    <div className="invalid-feedback d-block">
                                      {String(validation.errors.meetingDescription)}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>

                            <Col md={6}>
                              <FormGroup>
                                <Label className="form-label">
                                  Meeting Type{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Select
                                  value={meetingTypeOptions.find(
                                    (opt) => opt.value === validation.values.meetingType
                                  )}
                                  onChange={(selectedOption: any) => {
                                    validation.setFieldValue(
                                      "meetingType",
                                      selectedOption?.value || 1
                                    );
                                  }}
                                  options={meetingTypeOptions}
                                  placeholder="Select Meeting Type"
                                  classNamePrefix="select2-selection"
                                  isSearchable={false}
                                />
                                {validation.touched.meetingType &&
                                  validation.errors.meetingType && (
                                    <div className="invalid-feedback d-block">
                                      {String(validation.errors.meetingType)}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>

                        {/* Group 2 - Schedule */}
                        <div className="mb-4">
                          <h6 className="text-muted mb-3">
                            <i className="ri-calendar-line align-middle me-1"></i>
                            Schedule
                          </h6>
                          <Row className="g-3">
                            <Col md={4}>
                              <FormGroup>
                                <Label className="form-label">
                                  Meeting Date{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="date"
                                  name="meetingDate"
                                  value={validation.values.meetingDate}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    !!(
                                      validation.touched.meetingDate &&
                                      validation.errors.meetingDate
                                    )
                                  }
                                  min={new Date().toISOString().split("T")[0]}
                                />
                                {validation.touched.meetingDate &&
                                  validation.errors.meetingDate && (
                                    <div className="invalid-feedback d-block">
                                      {String(validation.errors.meetingDate)}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>

                            <Col md={4}>
                              <FormGroup>
                                <Label className="form-label">
                                  Start Time{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="time"
                                  name="meetingStartTime"
                                  value={validation.values.meetingStartTime}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    !!(
                                      validation.touched.meetingStartTime &&
                                      validation.errors.meetingStartTime
                                    )
                                  }
                                />
                                {validation.touched.meetingStartTime &&
                                  validation.errors.meetingStartTime && (
                                    <div className="invalid-feedback d-block">
                                      {String(validation.errors.meetingStartTime)}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>

                            <Col md={4}>
                              <FormGroup>
                                <Label className="form-label">
                                  End Time{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="time"
                                  name="meetingEndTime"
                                  value={validation.values.meetingEndTime}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    !!(
                                      validation.touched.meetingEndTime &&
                                      validation.errors.meetingEndTime
                                    )
                                  }
                                />
                                {validation.touched.meetingEndTime &&
                                  validation.errors.meetingEndTime && (
                                    <div className="invalid-feedback d-block">
                                      {String(validation.errors.meetingEndTime)}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>

                            <Col md={12}>
                              <FormGroup>
                                <Label className="form-label">Location</Label>
                                <Input
                                  type="text"
                                  name="meetingLocation"
                                  value={validation.values.meetingLocation}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    !!(
                                      validation.touched.meetingLocation &&
                                      validation.errors.meetingLocation
                                    )
                                  }
                                  maxLength={500}
                                  placeholder="Office address, Zoom link, Teams link, etc."
                                />
                                {validation.touched.meetingLocation &&
                                  validation.errors.meetingLocation && (
                                    <div className="invalid-feedback d-block">
                                      {String(validation.errors.meetingLocation)}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>

                        {/* Group 3 - Participants */}
                        <div className="mb-4">
                          <h6 className="text-muted mb-3">
                            <i className="ri-group-line align-middle me-1"></i>
                            Participants
                          </h6>
                          <Row className="g-3">
                            <Col md={6}>
                              <FormGroup>
                                <Label className="form-label">
                                  Organizer{" "}
                                  <span className="text-danger">*</span>
                                </Label>
                                <Select
                                  value={globalUserOptions.find(
                                    (opt: any) =>
                                      opt.value === validation.values.organizerUserId
                                  )}
                                  onChange={(selectedOption: any) => {
                                    validation.setFieldValue(
                                      "organizerUserId",
                                      selectedOption?.value || ""
                                    );
                                  }}
                                  options={globalUserOptions}
                                  placeholder="Select Organizer"
                                  classNamePrefix="select2-selection"
                                />
                                {validation.touched.organizerUserId &&
                                  validation.errors.organizerUserId && (
                                    <div className="invalid-feedback d-block">
                                      {String(validation.errors.organizerUserId)}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>

                            <Col md={6}>
                              <FormGroup>
                                <Label className="form-label">
                                  Internal Users
                                </Label>
                                <Select
                                  isMulti
                                  value={globalUserOptions.filter((opt: any) =>
                                    validation.values.tenantUserIds.includes(opt.value)
                                  )}
                                  onChange={(selectedOptions: any) => {
                                    validation.setFieldValue(
                                      "tenantUserIds",
                                      selectedOptions
                                        ? selectedOptions.map((opt: any) => opt.value)
                                        : []
                                    );
                                  }}
                                  options={globalUserOptions}
                                  placeholder="Select internal users"
                                  classNamePrefix="select2-selection"
                                  styles={{
                                    multiValue: (base: any) => ({
                                      ...base,
                                      backgroundColor: '#e7f3ff',
                                      border: '1px solid #0d6efd',
                                    }),
                                    multiValueLabel: (base: any) => ({
                                      ...base,
                                      color: '#0d6efd',
                                      fontWeight: 500,
                                    }),
                                    multiValueRemove: (base: any) => ({
                                      ...base,
                                      color: '#0d6efd',
                                      ':hover': {
                                        backgroundColor: '#0d6efd',
                                        color: '#fff',
                                      },
                                    }),
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            <Col md={6}>
                              <FormGroup>
                                <Label className="form-label">Client Contacts</Label>
                                <Select
                                  isMulti
                                  value={clientContacts
                                    .filter(
                                      (c: any) =>
                                        !c.isDeleted &&
                                        c.clientId === currentClientId &&
                                        validation.values.clientContactIds.includes(c.id)
                                    )
                                    .map((contact: any) => ({
                                      value: contact.id,
                                      label: `${contact.contactFirstName} ${contact.contactLastName} (${contact.email})`,
                                    }))}
                                  onChange={(selectedOptions: any) => {
                                    validation.setFieldValue(
                                      "clientContactIds",
                                      selectedOptions
                                        ? selectedOptions.map((opt: any) => opt.value)
                                        : []
                                    );
                                  }}
                                  options={clientContacts
                                    .filter(
                                      (c: any) =>
                                        !c.isDeleted &&
                                        c.clientId === currentClientId
                                    )
                                    .map((contact: any) => ({
                                      value: contact.id,
                                      label: `${contact.contactFirstName} ${contact.contactLastName} (${contact.email})`,
                                    }))}
                                  placeholder={
                                    currentClientId
                                      ? "Select client contacts"
                                      : isEdit ? "Client ID required" : "Please select a client first"
                                  }
                                  isDisabled={!currentClientId}
                                  classNamePrefix="select2-selection"
                                  styles={{
                                    multiValue: (base: any) => ({
                                      ...base,
                                      backgroundColor: '#d1e7dd',
                                      border: '1px solid #198754',
                                    }),
                                    multiValueLabel: (base: any) => ({
                                      ...base,
                                      color: '#198754',
                                      fontWeight: 500,
                                    }),
                                    multiValueRemove: (base: any) => ({
                                      ...base,
                                      color: '#198754',
                                      ':hover': {
                                        backgroundColor: '#198754',
                                        color: '#fff',
                                      },
                                    }),
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            <Col md={6}>
                              <FormGroup>
                                <Label className="form-label">
                                  External Attendees (Emails)
                                </Label>
                                <Input
                                  type="textarea"
                                  name="externalAttendees"
                                  rows={3}
                                  value={validation.values.externalAttendees}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    !!(
                                      validation.touched.externalAttendees &&
                                      validation.errors.externalAttendees
                                    )
                                  }
                                  placeholder="email1@example.com; email2@example.com"
                                />
                                <small className="text-muted">
                                  Separate multiple emails with semicolons (;)
                                </small>
                                {validation.touched.externalAttendees &&
                                  validation.errors.externalAttendees && (
                                    <div className="invalid-feedback d-block">
                                      {String(validation.errors.externalAttendees)}
                                    </div>
                                  )}
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>

                        <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
                          {isEdit && (
                            <Button
                              color="danger"
                              onClick={() => {
                                setDeleteModal(true);
                              }}
                              disabled={saving}
                            >
                              <i className="ri-delete-bin-line align-bottom me-1"></i>
                              Delete
                            </Button>
                          )}
                          <Button color="light" onClick={toggle} disabled={saving}>
                            <i className="ri-close-line align-bottom me-1"></i>
                            Cancel
                          </Button>
                          <Button 
                            color="primary" 
                            type="submit" 
                            disabled={saving || (!isEdit && !selectedClientId)}
                            title={!isEdit && !selectedClientId ? "Please select a client first" : ""}
                          >
                            {saving ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                {isEdit ? "Updating..." : "Creating..."}
                              </>
                            ) : (
                              <>
                                <i className="ri-save-line align-bottom me-1"></i>
                                {isEdit ? "Update Meeting" : "Create Meeting"}
                              </>
                            )}
                          </Button>
                        </div>
                      </Form>
                    </>
                  )}
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
                                setEditingMeetingId(meeting.id);
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
            </Col>
          </Row>
        </Container>
      </div>
      {/* Delete Modal */}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={confirmDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
    </React.Fragment>
  );
};

export default MeetingCalendar;
