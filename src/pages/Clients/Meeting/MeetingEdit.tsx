import React, { useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Loader from "../../../Components/Common/Loader";
import {
  fetchClientMeetings,
  fetchClientMeetingForEdit,
  updateClientMeetingForEdit,
  selectClientMeetingById,
  selectClientMeetingDetailLoading,
  selectClientMeetingSaving,
  selectClientMeetingError,
  selectClientMeetingsList,
} from "../../../slices/clientMeetings/clientMeeting.slice";
import { selectClientList } from "../../../slices/clients/client.slice";
import { selectClientContactList } from "../../../slices/clientContacts/clientContact.slice";
import { selectGlobalUserList } from "../../../slices/globalUsers/globalUser.slice";
import { fetchClients } from "../../../slices/clients/client.slice";
import { fetchClientContacts } from "../../../slices/clientContacts/clientContact.slice";
import { fetchGlobalUsers } from "../../../slices/globalUsers/globalUser.slice";
import { getLoggedinUser } from "../../../helpers/api_helper";
import { editMeetingSchema } from "./utils/validationSchemas";
import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";
import {
  formatDateForInput,
  formatTimeForInput,
  formatDateToISO,
  formatTimeWithSeconds,
  getMeetingTypeOptions,
} from "./utils/meetingUtils";

const MeetingEdit: React.FC = () => {
  document.title = PAGE_TITLES.MEETING_EDIT;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useFlash();

  const meeting = useSelector((state: any) =>
    selectClientMeetingById(state, id || "")
  );
  const meetingsList = useSelector(selectClientMeetingsList);
  const loading = useSelector(selectClientMeetingDetailLoading);
  const saving = useSelector(selectClientMeetingSaving);
  const error = useSelector(selectClientMeetingError);
  const clients = useSelector(selectClientList);
  const clientContacts = useSelector(selectClientContactList);
  const globalUsers = useSelector(selectGlobalUserList);
  const authUser = getLoggedinUser();

  // Get clientId from meeting or list store - REQUIRED for ForEdit endpoint
  const clientId = useMemo(() => {
    // Priority: 1) Current meeting detail, 2) Meetings list
    if (meeting?.clientId) return meeting.clientId;
    const meetingFromList = meetingsList.find((m: any) => m.id === id);
    return meetingFromList?.clientId || "";
  }, [meeting, meetingsList, id]);

  // Fetch meetings list if empty (to get clientId)
  useEffect(() => {
    if (id && meetingsList.length === 0) {
      // Fetch meetings list to get clientId for the meeting
      dispatch(fetchClientMeetings({ pageNumber: 1, pageSize: 100 }));
    }
  }, [dispatch, id, meetingsList.length]);

  // ALWAYS fetch fresh data from API when component mounts or id/clientId changes
  useEffect(() => {
    if (id && clientId) {
      // Always fetch fresh data using ForEdit endpoint with id and clientId
      dispatch(fetchClientMeetingForEdit({ id, clientId }));
    }
  }, [dispatch, id, clientId]);

  // Fetch dropdown data if not already loaded
  useEffect(() => {
    if (!clients || clients.length === 0) {
      dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
    }
    if (!clientContacts || clientContacts.length === 0) {
      dispatch(fetchClientContacts({ pageNumber: 1, pageSize: 50 }));
    }
    if (!globalUsers || globalUsers.length === 0) {
      dispatch(fetchGlobalUsers({ pageNumber: 1, pageSize: 50 }));
    }
  }, [dispatch, clients, clientContacts, globalUsers]);

  const meetingTypeOptions = useMemo(() => getMeetingTypeOptions(), []);

  const globalUserOptions = globalUsers
    .filter((u: any) => !u.isDeleted)
    .map((user: any) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName} (${user.email})`,
    }));

  // Get selected internal users from API response (tenantUserIds array)
  const selectedTenantUserIds = useMemo(() => {
    if (!meeting || !meeting.tenantUserIds) return [];
    return Array.isArray(meeting.tenantUserIds) ? meeting.tenantUserIds : [];
  }, [meeting]);

  // Get selected client contacts from API response (clientContactIds array or null)
  const selectedClientContactIds = useMemo(() => {
    if (!meeting || !meeting.clientContactIds) return [];
    return Array.isArray(meeting.clientContactIds) ? meeting.clientContactIds : [];
  }, [meeting]);

  const initialValues = useMemo(
    () => ({
      meetingTitle: meeting?.meetingTitle || "",
      meetingDescription: meeting?.meetingDescription || "",
      meetingDate: formatDateForInput(meeting?.meetingDate || ""),
      meetingStartTime: formatTimeForInput(meeting?.meetingStartTime || ""),
      meetingEndTime: formatTimeForInput(meeting?.meetingEndTime || ""),
      meetingLocation: meeting?.meetingLocation || "",
      meetingType: meeting?.meetingType || 1,
      organizerUserId: meeting?.organizerUserId || authUser?.userId || "",
      tenantUserIds: selectedTenantUserIds,
      clientContactIds: selectedClientContactIds,
      externalAttendees: meeting?.externalAttendees || "",
    }),
    [meeting, selectedTenantUserIds, selectedClientContactIds, authUser]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: editMeetingSchema,
    onSubmit: async (values) => {
      try {
        if (!id) {
          showError("Meeting ID is required");
          return;
        }

        if (!clientId) {
          showError("Client ID is required. Please wait for the meeting to load.");
          return;
        }

        if (!meeting?.tenantId) {
          showError("ID is required");
          return;
        }

        const payload = {
          tenantId: meeting.tenantId,
          clientId: clientId,
          meetingTitle: values.meetingTitle,
          meetingDescription: values.meetingDescription,
          meetingDate: formatDateToISO(values.meetingDate),
          meetingStartTime: formatTimeWithSeconds(values.meetingStartTime),
          meetingEndTime: formatTimeWithSeconds(values.meetingEndTime),
          meetingLocation: values.meetingLocation,
          meetingType: values.meetingType,
          organizerUserId: values.organizerUserId || meeting?.organizerUserId || authUser?.userId || "",
          tenantUserIds: values.tenantUserIds || [],
          clientContactIds: values.clientContactIds && values.clientContactIds.length > 0 ? values.clientContactIds : null,
          externalAttendees: values.externalAttendees || "",
        };

        console.log("Submitting meeting update:", { id, clientId, payload });
        
        const result = await dispatch(updateClientMeetingForEdit({ id, clientId, data: payload }));
        
        console.log("Update result:", result);
        
        if (result.meta.requestStatus === "fulfilled") {
          // Check if the API returned success message
          const responseMessage = result.payload?.message || "Meeting updated successfully";
          showSuccess(responseMessage);
          setTimeout(() => {
            navigate(`/meetings/view/${id}`);
          }, 500);
        } else {
          // Handle rejected case
          const errorPayload = result.payload as any;
          const errorMessage = errorPayload?.message || errorPayload?.error || result.error?.message || "Failed to update meeting";
          console.error("Update meeting error:", result);
          showError(errorMessage);
        }
      } catch (error: any) {
        console.error("Error updating meeting:", error);
        showError(error?.message || "An error occurred while updating the meeting");
      }
    },
  });

  // Show loading if fetching or waiting for clientId
  if (loading || (!meeting && id && !clientId)) {
    return <Loader />;
  }

  // Show error if clientId is required but not available
  if (id && !clientId && !meeting && !loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="warning">
            Client ID is required to load meeting details. Please try again from the meetings list.
          </Alert>
          <Button color="primary" onClick={() => navigate("/clients/meetings")} className="mt-3">
            <i className="ri-arrow-left-line align-bottom me-1"></i>
            Back to Meetings
          </Button>
        </Container>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Meeting not found</Alert>
          <Button color="primary" onClick={() => navigate("/clients/meetings")} className="mt-3">
            <i className="ri-arrow-left-line align-bottom me-1"></i>
            Back to Meetings
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Edit Meeting" pageTitle="Meetings" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Edit Meeting Details</h5>
                  <Button
                    color="light"
                    onClick={() => navigate(`/meetings/view/${id}`)}
                  >
                    <i className="ri-arrow-left-line align-bottom me-1"></i>
                    Back to View
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {error && (
                  <Alert color="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Submit form - Formik will handle validation
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
                                  c.clientId === clientId &&
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
                                  c.clientId === clientId
                              )
                              .map((contact: any) => ({
                                value: contact.id,
                                label: `${contact.contactFirstName} ${contact.contactLastName} (${contact.email})`,
                              }))}
                            placeholder={
                              clientId
                                ? "Select client contacts"
                                : "Client ID required"
                            }
                            isDisabled={!clientId}
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
                        <Button
                          color="light"
                          onClick={() => navigate(`/meetings/view/${id}`)}
                      disabled={saving}
                        >
                      <i className="ri-close-line align-bottom me-1"></i>
                          Cancel
                        </Button>
                    <Button color="primary" type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="ri-save-line align-bottom me-1"></i>
                          Update Meeting
                        </>
                      )}
                        </Button>
                      </div>
                    </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MeetingEdit;
