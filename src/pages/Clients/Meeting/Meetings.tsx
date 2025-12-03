import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getMeetings } from "../../../slices/thunks";
import MeetingCard from "./MeetingCard";

import { PAGE_TITLES } from "../../../common/branding";

const Meetings: React.FC = () => {
  document.title = PAGE_TITLES.MEETINGS_SCHEDULE;

  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const { meetings } = useSelector((state: any) => state.Meetings);

  useEffect(() => {
    dispatch(getMeetings());
  }, [dispatch]);

  const upcomingMeetings = meetings.filter(
    (m: any) => m.status === "Scheduled" || m.status === "In Progress"
  );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Meetings & Schedule" pageTitle="Client Management" />

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
                      onClick={() => navigate("/meetings/list")}
                    >
                      <i className="ri-list-check align-bottom me-1"></i>
                      View All
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
                    <h4 className="mb-0">{meetings.length}</h4>
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
                    <h4 className="mb-0">
                      {
                        meetings.filter((m: any) => m.status === "Completed")
                          .length
                      }
                    </h4>
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
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Upcoming Meetings</h5>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => navigate("/meetings/list")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardBody>
                {upcomingMeetings.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="ri-calendar-line display-4 text-muted"></i>
                    <h5 className="mt-3">No upcoming meetings</h5>
                    <p className="text-muted">Schedule your first meeting</p>
                    <Button
                      color="primary"
                      onClick={() => navigate("/meetings/create")}
                    >
                      <i className="ri-add-line align-bottom me-1"></i>
                      Schedule Meeting
                    </Button>
                  </div>
                ) : (
                  <Row>
                    {upcomingMeetings.slice(0, 6).map((meeting: any) => (
                      <Col key={meeting.id} xl={4} lg={6} md={6}>
                        <MeetingCard
                          meeting={meeting}
                          onEdit={() =>
                            navigate(`/meetings/edit/${meeting.id}`)
                          }
                        />
                      </Col>
                    ))}
                  </Row>
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
