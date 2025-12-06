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
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Loader from "../../../Components/Common/Loader";
import {
  fetchClientMeetingById,
  rescheduleClientMeeting,
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
} from "./utils/meetingUtils";
import { rescheduleMeetingSchema } from "./utils/validationSchemas";

const MeetingReschedule: React.FC = () => {
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
      newDate: formatDateForInput(meeting?.meetingDate || ""),
      newStartTime: formatTimeForInput(meeting?.meetingStartTime || ""),
      newEndTime: formatTimeForInput(meeting?.meetingEndTime || ""),
    }),
    [meeting]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: rescheduleMeetingSchema,
    onSubmit: async (values) => {
      if (!id) return;

      const result = await dispatch(
        rescheduleClientMeeting({
          id,
          newDate: formatDateToISO(values.newDate),
          newStartTime: formatTimeWithSeconds(values.newStartTime),
          newEndTime: formatTimeWithSeconds(values.newEndTime),
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Meeting rescheduled successfully");
        setTimeout(() => {
          navigate(`/meetings/view/${id}`);
        }, 500);
      } else {
        showError("Failed to reschedule meeting");
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
        <BreadCrumb title="Reschedule Meeting" pageTitle="Meetings" />

        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Reschedule Meeting</h5>
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
                <div className="mb-3">
                  <h6 className="text-muted">Current Schedule</h6>
                  <p className="mb-1">
                    <strong>Meeting:</strong> {meeting.meetingTitle}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {formatDateForInput(meeting.meetingDate)}
                  </p>
                  <p className="mb-0">
                    <strong>Time:</strong> {formatTimeForInput(meeting.meetingStartTime)} - {formatTimeForInput(meeting.meetingEndTime)}
                  </p>
                </div>

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
                  <Row className="g-3">
                    <Col md={12}>
                      <FormGroup>
                        <Label className="form-label">
                          New Date <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="date"
                          name="newDate"
                          value={validation.values.newDate}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.newDate &&
                              validation.errors.newDate
                            )
                          }
                        />
                        {validation.touched.newDate &&
                          validation.errors.newDate && (
                            <div className="invalid-feedback d-block">
                              {String(validation.errors.newDate)}
                            </div>
                          )}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label className="form-label">
                          New Start Time{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="time"
                          name="newStartTime"
                          value={validation.values.newStartTime}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.newStartTime &&
                              validation.errors.newStartTime
                            )
                          }
                        />
                        {validation.touched.newStartTime &&
                          validation.errors.newStartTime && (
                            <div className="invalid-feedback d-block">
                              {String(validation.errors.newStartTime)}
                            </div>
                          )}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label className="form-label">
                          New End Time{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="time"
                          name="newEndTime"
                          value={validation.values.newEndTime}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.newEndTime &&
                              validation.errors.newEndTime
                            )
                          }
                        />
                        {validation.touched.newEndTime &&
                          validation.errors.newEndTime && (
                            <div className="invalid-feedback d-block">
                              {String(validation.errors.newEndTime)}
                            </div>
                          )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 justify-content-end mt-4">
                    <Button
                      color="light"
                      onClick={() => navigate(`/meetings/view/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button color="warning" type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Rescheduling...
                        </>
                      ) : (
                        <>
                          <i className="ri-calendar-event-line align-bottom me-1"></i>
                          Reschedule Meeting
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

export default MeetingReschedule;

