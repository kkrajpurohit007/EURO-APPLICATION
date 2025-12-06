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
  Badge,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Loader from "../../../Components/Common/Loader";
import {
  fetchClientMeetingById,
  updateClientMeeting,
  selectClientMeetingById,
  selectClientMeetingDetailLoading,
  selectClientMeetingSaving,
  selectClientMeetingError,
} from "../../../slices/clientMeetings/clientMeeting.slice";
import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";
import {
  formatDateForInput,
  formatTimeForInput,
  formatDateToISO,
  formatTimeWithSeconds,
  parseExternalAttendees,
  getMeetingTypeOptions,
} from "./utils/meetingUtils";
import { meetingFormSchema } from "./utils/validationSchemas";

const MeetingEdit: React.FC = () => {
  document.title = PAGE_TITLES.MEETING_EDIT;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useFlash();

  const meeting = useSelector((state: any) =>
    selectClientMeetingById(state, id || "")
  );
  const loading = useSelector(selectClientMeetingDetailLoading);
  const saving = useSelector(selectClientMeetingSaving);
  const error = useSelector(selectClientMeetingError);

  useEffect(() => {
    if (id && !meeting) {
      dispatch(fetchClientMeetingById(id));
    }
  }, [dispatch, id, meeting]);

  const initialValues = useMemo(
    () => ({
      meetingTitle: meeting?.meetingTitle || "",
      meetingDescription: meeting?.meetingDescription || "",
      meetingDate: formatDateForInput(meeting?.meetingDate || ""),
      meetingStartTime: formatTimeForInput(meeting?.meetingStartTime || ""),
      meetingEndTime: formatTimeForInput(meeting?.meetingEndTime || ""),
      meetingLocation: meeting?.meetingLocation || "",
      meetingType: meeting?.meetingType || 1,
    }),
    [meeting]
  );

  const meetingTypeOptions = useMemo(() => getMeetingTypeOptions(), []);

  // Get selected client contacts for display
  const selectedClientContacts = useMemo(() => {
    if (!meeting || !meeting.attendees) return [];
    return meeting.attendees
      .filter((a: any) => a.clientContactName)
      .map((a: any) => ({
        id: a.clientContactId,
        name: a.clientContactName,
      }));
  }, [meeting]);

  // Get selected tenant users for display
  const selectedTenantUsers = useMemo(() => {
    if (!meeting || !meeting.attendees) return [];
    return meeting.attendees
      .filter((a: any) => a.userName)
      .map((a: any) => ({
        id: a.userId,
        name: a.userName,
      }));
  }, [meeting]);

  const getExternalAttendees = (): string[] => {
    return parseExternalAttendees(meeting?.externalAttendees);
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: meetingFormSchema,
    onSubmit: async (values) => {
      if (!id) return;

      const payload = {
        meetingTitle: values.meetingTitle,
        meetingDescription: values.meetingDescription,
        meetingDate: formatDateToISO(values.meetingDate),
        meetingStartTime: formatTimeWithSeconds(values.meetingStartTime),
        meetingEndTime: formatTimeWithSeconds(values.meetingEndTime),
        meetingLocation: values.meetingLocation,
        meetingType: values.meetingType,
      };

      const result = await dispatch(updateClientMeeting({ id, data: payload }));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Meeting updated successfully");
    setTimeout(() => {
      navigate(`/meetings/view/${id}`);
        }, 500);
      } else {
        const errorMessage = result.payload?.message || "Failed to update meeting";
        showError(errorMessage);
      }
    },
  });

  if (loading) {
    return <Loader />;
  }

  if (!meeting) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Meeting not found</Alert>
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

                  {/* Group 3 - Participants (Read-only) */}
                  <div className="mb-4">
                    <h6 className="text-muted mb-3">
                      <i className="ri-group-line align-middle me-1"></i>
                      Participants
                      <Badge color="light" className="ms-2 fs-12">
                        Read-only
                      </Badge>
                    </h6>
                    <Row className="g-3">
                      <Col md={6}>
                        <FormGroup>
                          <Label className="form-label">
                            <i className="ri-building-line align-middle me-1"></i>
                            Client
                          </Label>
                          <Input
                            type="text"
                            value={meeting?.clientName || "-"}
                            readOnly
                            plaintext
                            className="form-control-plaintext bg-light px-3 py-2 rounded"
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                          <FormGroup>
                          <Label className="form-label">
                            <i className="ri-user-line align-middle me-1"></i>
                            Organizer
                            </Label>
                            <Input
                            type="text"
                            value={meeting?.organizerUserName || "-"}
                            readOnly
                            plaintext
                            className="form-control-plaintext bg-light px-3 py-2 rounded"
                          />
                          </FormGroup>
                      </Col>

                        <Col md={6}>
                          <FormGroup>
                          <Label className="form-label">
                            <i className="ri-user-3-line align-middle me-1"></i>
                            Internal Users (Tenant Users)
                            </Label>
                          {selectedTenantUsers.length > 0 ? (
                            <div className="bg-light px-3 py-2 rounded">
                              {selectedTenantUsers.map((user: any, index: number) => (
                                <Badge
                                  key={`user-${index}`}
                                  color="primary"
                                  className="me-1 mb-1"
                                >
                                  {user.name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <Input
                              type="text"
                              value="No internal users selected"
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded text-muted"
                            />
                            )}
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                          <Label className="form-label">
                            <i className="ri-contacts-line align-middle me-1"></i>
                            Client Contacts
                          </Label>
                          {selectedClientContacts.length > 0 ? (
                            <div className="bg-light px-3 py-2 rounded">
                              {selectedClientContacts.map((contact: any, index: number) => (
                                <Badge
                                  key={`contact-${index}`}
                                  color="success"
                                  className="me-1 mb-1"
                                >
                                  {contact.name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <Input
                              type="text"
                              value="No client contacts selected"
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded text-muted"
                            />
                          )}
                          </FormGroup>
                        </Col>

                      <Col md={12}>
                      <FormGroup>
                          <Label className="form-label">
                            <i className="ri-mail-line align-middle me-1"></i>
                            External Attendees (Emails)
                        </Label>
                          {getExternalAttendees().length > 0 ? (
                            <div className="bg-light px-3 py-2 rounded">
                              {getExternalAttendees().map((email: string, index: number) => (
                                <Badge
                                  key={`external-${index}`}
                                  color="info"
                                  className="me-1 mb-1"
                                >
                                  {email}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                        <Input
                              type="text"
                              value="No external attendees"
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded text-muted"
                            />
                        )}
                      </FormGroup>
                      </Col>
                    </Row>
                    <Alert color="info" className="mt-2 mb-0">
                      <i className="ri-information-line align-middle me-1"></i>
                      Participants cannot be modified here. To change participants, please delete and recreate the meeting.
                    </Alert>
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
