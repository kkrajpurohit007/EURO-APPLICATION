import React from "react";
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
  FormFeedback,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { addNewMeeting } from "../../../slices/thunks";

import { PAGE_TITLES } from "../../../common/branding";

const MeetingCreate: React.FC = () => {
  document.title = PAGE_TITLES.MEETING_CREATE;

  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const clientOptions = [
    { value: 1, label: "Skyline Construction" },
    { value: 2, label: "John Smith" },
    { value: 3, label: "Tech Solutions Inc" },
    { value: 4, label: "ABC Construction Ltd" },
    { value: 5, label: "Metro Infrastructure" },
  ];

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    clientName: Yup.string().required("Client is required"),
    meetingDate: Yup.date().required("Meeting date is required"),
    meetingTime: Yup.string().required("Meeting time is required"),
    duration: Yup.number()
      .required("Duration is required")
      .min(15, "Duration must be at least 15 minutes"),
    location: Yup.string().required("Location is required"),
    locationType: Yup.string().required("Location type is required"),
    meetingLink: Yup.string().when("locationType", {
      is: (val: string) => val === "Virtual" || val === "Hybrid",
      then: (schema) =>
        schema.required("Meeting link is required for virtual meetings"),
    }),
    organizer: Yup.string().required("Organizer is required"),
    agenda: Yup.string().required("Agenda is required"),
    meetingType: Yup.string().required("Meeting type is required"),
    priority: Yup.string().required("Priority is required"),
  });

  const initialValues = {
    title: "",
    clientId: undefined,
    clientName: "",
    meetingDate: "",
    meetingTime: "",
    endTime: "",
    duration: 60,
    location: "",
    locationType: "In-Person",
    meetingLink: "",
    attendees: [],
    organizer: "Anna Super",
    agenda: "",
    notes: "",
    status: "Scheduled",
    meetingType: "Client Meeting",
    priority: "Medium",
    reminders: true,
  };

  const handleSubmit = (values: any) => {
    const attendeesList = values.attendees
      .split(",")
      .map((a: string) => a.trim())
      .filter((a: string) => a);

    const meetingData = {
      ...values,
      attendees: attendeesList,
    };

    dispatch(addNewMeeting(meetingData));
    setTimeout(() => {
      navigate("/meetings/list");
    }, 1000);
  };

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
                    onClick={() => navigate("/meetings/list")}
                  >
                    <i className="ri-arrow-left-line align-bottom me-1"></i>
                    Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={8}>
                          <FormGroup>
                            <Label for="title">
                              Meeting Title{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              id="title"
                              name="title"
                              value={values.title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={!!(touched.title && errors.title)}
                            />
                            {touched.title && errors.title && (
                              <FormFeedback>
                                {String(errors.title)}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </Col>

                        <Col md={4}>
                          <FormGroup>
                            <Label for="priority">
                              Priority <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="select"
                              id="priority"
                              name="priority"
                              value={values.priority}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label>
                              Client <span className="text-danger">*</span>
                            </Label>
                            <Select
                              options={clientOptions}
                              onChange={(option: any) => {
                                setFieldValue("clientId", option?.value);
                                setFieldValue(
                                  "clientName",
                                  option?.label || ""
                                );
                              }}
                              placeholder="Select Client"
                              isClearable
                            />
                            {touched.clientName && errors.clientName && (
                              <div className="text-danger mt-1 fs-12">
                                {String(errors.clientName)}
                              </div>
                            )}
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                            <Label for="meetingType">
                              Meeting Type{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="select"
                              id="meetingType"
                              name="meetingType"
                              value={values.meetingType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value="Client Meeting">
                                Client Meeting
                              </option>
                              <option value="Site Visit">Site Visit</option>
                              <option value="Review">Review</option>
                              <option value="Consultation">Consultation</option>
                              <option value="Internal">Internal</option>
                              <option value="Other">Other</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Label for="meetingDate">
                              Meeting Date{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="date"
                              id="meetingDate"
                              name="meetingDate"
                              value={values.meetingDate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={
                                !!(touched.meetingDate && errors.meetingDate)
                              }
                            />
                            {touched.meetingDate && errors.meetingDate && (
                              <FormFeedback>
                                {String(errors.meetingDate)}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </Col>

                        <Col md={4}>
                          <FormGroup>
                            <Label for="meetingTime">
                              Start Time <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="time"
                              id="meetingTime"
                              name="meetingTime"
                              value={values.meetingTime}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={
                                !!(touched.meetingTime && errors.meetingTime)
                              }
                            />
                            {touched.meetingTime && errors.meetingTime && (
                              <FormFeedback>
                                {String(errors.meetingTime)}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </Col>

                        <Col md={4}>
                          <FormGroup>
                            <Label for="duration">
                              Duration (minutes){" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="number"
                              id="duration"
                              name="duration"
                              value={values.duration}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={!!(touched.duration && errors.duration)}
                            />
                            {touched.duration && errors.duration && (
                              <FormFeedback>
                                {String(errors.duration)}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="locationType">
                              Location Type{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="select"
                              id="locationType"
                              name="locationType"
                              value={values.locationType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value="In-Person">In-Person</option>
                              <option value="Virtual">Virtual</option>
                              <option value="Hybrid">Hybrid</option>
                            </Input>
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                            <Label for="location">
                              Location <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              id="location"
                              name="location"
                              placeholder="Office address, Zoom, Teams, etc."
                              value={values.location}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={!!(touched.location && errors.location)}
                            />
                            {touched.location && errors.location && (
                              <FormFeedback>
                                {String(errors.location)}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>

                      {(values.locationType === "Virtual" ||
                        values.locationType === "Hybrid") && (
                          <FormGroup>
                            <Label for="meetingLink">
                              Meeting Link <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="url"
                              id="meetingLink"
                              name="meetingLink"
                              placeholder="https://zoom.us/j/123456789"
                              value={values.meetingLink}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={
                                !!(touched.meetingLink && errors.meetingLink)
                              }
                            />
                            {touched.meetingLink && errors.meetingLink && (
                              <FormFeedback>
                                {String(errors.meetingLink)}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        )}

                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="organizer">
                              Organizer <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              id="organizer"
                              name="organizer"
                              value={values.organizer}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={
                                !!(touched.organizer && errors.organizer)
                              }
                            />
                            {touched.organizer && errors.organizer && (
                              <FormFeedback>
                                {String(errors.organizer)}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                            <Label for="attendees">Attendees</Label>
                            <Input
                              type="text"
                              id="attendees"
                              name="attendees"
                              placeholder="Comma-separated names"
                              value={values.attendees}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <FormGroup>
                        <Label for="agenda">
                          Meeting Agenda <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="textarea"
                          id="agenda"
                          name="agenda"
                          rows={3}
                          value={values.agenda}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!(touched.agenda && errors.agenda)}
                        />
                        {touched.agenda && errors.agenda && (
                          <FormFeedback>{String(errors.agenda)}</FormFeedback>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <Label for="notes">Notes</Label>
                        <Input
                          type="textarea"
                          id="notes"
                          name="notes"
                          rows={2}
                          value={values.notes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </FormGroup>

                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="reminders"
                          name="reminders"
                          checked={values.reminders}
                          onChange={handleChange}
                        />
                        <Label check for="reminders">
                          Send reminder notifications
                        </Label>
                      </FormGroup>

                      <div className="d-flex gap-2 justify-content-end mt-4">
                        <Button
                          color="light"
                          onClick={() => navigate("/meetings/list")}
                        >
                          Cancel
                        </Button>
                        <Button color="success" type="submit">
                          <i className="ri-save-line align-bottom me-1"></i>
                          Schedule Meeting
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MeetingCreate;
