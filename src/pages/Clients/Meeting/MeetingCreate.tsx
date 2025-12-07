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
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  createClientMeeting,
  selectClientMeetingSaving,
  selectClientMeetingError,
} from "../../../slices/clientMeetings/clientMeeting.slice";
import { selectClientList } from "../../../slices/clients/client.slice";
import { selectClientContactList } from "../../../slices/clientContacts/clientContact.slice";
import { selectGlobalUserList } from "../../../slices/globalUsers/globalUser.slice";
import { fetchClients } from "../../../slices/clients/client.slice";
import { fetchClientContacts } from "../../../slices/clientContacts/clientContact.slice";
import { fetchGlobalUsers } from "../../../slices/globalUsers/globalUser.slice";
import { getLoggedinUser } from "../../../helpers/api_helper";
import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";
import {
  formatDateToISO,
  formatTimeWithSeconds,
  getMeetingTypeOptions,
} from "./utils/meetingUtils";
import { createMeetingSchema } from "./utils/validationSchemas";

const MeetingCreate: React.FC = () => {
  document.title = PAGE_TITLES.MEETING_CREATE;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useFlash();
  const saving = useSelector(selectClientMeetingSaving);
  const error = useSelector(selectClientMeetingError);
  const clients = useSelector(selectClientList);
  const clientContacts = useSelector(selectClientContactList);
  const globalUsers = useSelector(selectGlobalUserList);

  const authUser = getLoggedinUser();

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

  const clientOptions = clients
    .filter((c: any) => !c.isDeleted)
    .map((client: any) => ({
      value: client.id,
      label: client.name,
    }));

  const globalUserOptions = globalUsers
    .filter((u: any) => !u.isDeleted)
    .map((user: any) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName} (${user.email})`,
    }));

  const meetingTypeOptions = useMemo(() => getMeetingTypeOptions(), []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      tenantId: authUser?.tenantId || "",
      clientId: "",
      meetingTitle: "",
      meetingDescription: "",
      meetingDate: "",
      meetingStartTime: "",
      meetingEndTime: "",
      meetingLocation: "",
      meetingType: 1,
      organizerUserId: authUser?.userId || "",
      tenantUserIds: [] as string[],
      clientContactIds: [] as string[],
      externalAttendees: "",
    },
    validationSchema: createMeetingSchema,
    onSubmit: async (values) => {
      const payload = {
        tenantId: values.tenantId,
        clientId: values.clientId,
        meetingTitle: values.meetingTitle,
        meetingDescription: values.meetingDescription,
        meetingDate: formatDateToISO(values.meetingDate),
        meetingStartTime: formatTimeWithSeconds(values.meetingStartTime),
        meetingEndTime: formatTimeWithSeconds(values.meetingEndTime),
        meetingLocation: values.meetingLocation,
        meetingType: values.meetingType,
        organizerUserId: values.organizerUserId,
        tenantUserIds: values.tenantUserIds,
        clientContactIds: values.clientContactIds,
        externalAttendees: values.externalAttendees,
      };

      const result = await dispatch(createClientMeeting(payload));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Meeting created successfully");
        setTimeout(() => {
          navigate("/clients/meetings");
        }, 500);
      } else {
        showError("Failed to create meeting");
      }
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Schedule Meeting" pageTitle="Meetings" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">New Meeting Details</h5>
                  <Button
                    color="light"
                    onClick={() => navigate("/clients/meetings")}
                  >
                    <i className="ri-arrow-left-line align-bottom me-1"></i>
                    Back to Meetings
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
                    validation.handleSubmit();
                  }}
                >
                  {/* Group 1 - Meeting Details */}
                  <div className="mb-4">
                    <h6 className="text-muted mb-3">Meeting Details</h6>
                    <Row className="g-3">
                      <Col md={6}>
                        <FormGroup>
                          <Label className="form-label">
                            Client <span className="text-danger">*</span>
                          </Label>
                          <Select
                            value={clientOptions.find(
                              (opt: any) => opt.value === validation.values.clientId
                            )}
                            onChange={(selectedOption: any) => {
                              validation.setFieldValue(
                                "clientId",
                                selectedOption?.value || ""
                              );
                              // Clear client contacts when client changes
                              validation.setFieldValue("clientContactIds", []);
                            }}
                            options={clientOptions}
                            placeholder="Select Client"
                            classNamePrefix="select2-selection"
                          />
                          {validation.touched.clientId &&
                            validation.errors.clientId && (
                              <div className="invalid-feedback d-block">
                                {String(validation.errors.clientId)}
                              </div>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md={6}>
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
                            rows={3}
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
                    <h6 className="text-muted mb-3">Schedule</h6>
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
                              placeholder="Office address, Zoom, Teams, etc."
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
                    <h6 className="text-muted mb-3">Participants</h6>
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
                            Internal Users (Tenant Users)
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
                                  c.clientId === validation.values.clientId &&
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
                                  c.clientId === validation.values.clientId
                              )
                              .map((contact: any) => ({
                                value: contact.id,
                                label: `${contact.contactFirstName} ${contact.contactLastName} (${contact.email})`,
                              }))}
                            placeholder={
                              validation.values.clientId
                                ? "Select client contacts"
                                : "Select a client first"
                            }
                            isDisabled={!validation.values.clientId}
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

                      <div className="d-flex gap-2 justify-content-end mt-4">
                        <Button
                          color="light"
                      onClick={() => navigate("/clients/meetings")}
                        >
                          Cancel
                        </Button>
                    <Button
                      color="success"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="ri-save-line align-bottom me-1"></i>
                          Schedule Meeting
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

export default MeetingCreate;
