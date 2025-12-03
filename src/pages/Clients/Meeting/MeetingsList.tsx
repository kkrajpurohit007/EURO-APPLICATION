import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Loader from "../../../Components/Common/Loader";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { getMeetings, deleteMeeting } from "../../../slices/thunks";
import MeetingCard from "./MeetingCard";

import { PAGE_TITLES } from "../../../common/branding";

const MeetingsList: React.FC = () => {
  document.title = PAGE_TITLES.MEETINGS_LIST;

  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const { meetings } = useSelector((state: any) => state.Meetings);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [deleteModal, setDeleteModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getMeetings());
    setTimeout(() => setLoading(false), 500);
  }, [dispatch]);

  const handleEdit = (id: number) => {
    navigate(`/meetings/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setMeetingToDelete(id);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (meetingToDelete !== null) {
      dispatch(deleteMeeting(meetingToDelete));
    }
    setDeleteModal(false);
    setMeetingToDelete(null);
  };

  const filteredMeetings = meetings.filter((meeting: any) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "upcoming" &&
        (meeting.status === "Scheduled" || meeting.status === "In Progress")) ||
      (activeTab === "completed" && meeting.status === "Completed") ||
      (activeTab === "cancelled" && meeting.status === "Cancelled");

    return matchesSearch && matchesTab;
  });

  const upcomingCount = meetings.filter(
    (m: any) => m.status === "Scheduled" || m.status === "In Progress"
  ).length;
  const completedCount = meetings.filter(
    (m: any) => m.status === "Completed"
  ).length;
  const cancelledCount = meetings.filter(
    (m: any) => m.status === "Cancelled"
  ).length;

  // note: scroll area removed (reverted to default page scroll)

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Meetings List" pageTitle="Client Management" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">All Meetings</h5>
                <div className="d-flex gap-2">
                  <Button
                    color="success"
                    onClick={() => navigate("/meetings/create")}
                  >
                    <i className="ri-add-line align-bottom me-1"></i>
                    Schedule Meeting
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate("/meetings/calendar")}
                  >
                    <i className="ri-calendar-line align-bottom me-1"></i>
                    Calendar View
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Row className="mb-3">
                  <Col md={8}>
                    <Nav tabs className="nav-tabs-custom">
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "all",
                          })}
                          onClick={() => setActiveTab("all")}
                          style={{ cursor: "pointer" }}
                        >
                          All ({meetings.length})
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "upcoming",
                          })}
                          onClick={() => setActiveTab("upcoming")}
                          style={{ cursor: "pointer" }}
                        >
                          Upcoming ({upcomingCount})
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "completed",
                          })}
                          onClick={() => setActiveTab("completed")}
                          style={{ cursor: "pointer" }}
                        >
                          Completed ({completedCount})
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "cancelled",
                          })}
                          onClick={() => setActiveTab("cancelled")}
                          style={{ cursor: "pointer" }}
                        >
                          Cancelled ({cancelledCount})
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex justify-content-end">
                      <Input
                        type="text"
                        placeholder="Search meetings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: 280 }}
                      />
                    </div>
                  </Col>
                </Row>

                {filteredMeetings.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="ri-calendar-line display-4 text-muted"></i>
                    <h5 className="mt-3">No meetings found</h5>
                    <p className="text-muted">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "Schedule your first meeting"}
                    </p>
                    <Button
                      color="primary"
                      onClick={() => navigate("/meetings/create")}
                    >
                      Schedule Meeting
                    </Button>
                  </div>
                ) : (
                  <Row>
                    {filteredMeetings.map((meeting: any) => (
                      <Col key={meeting.id} xl={4} lg={6} md={6}>
                        <MeetingCard
                          meeting={meeting}
                          onEdit={() => handleEdit(meeting.id)}
                          onDelete={() => handleDelete(meeting.id)}
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
      <DeleteModal
        show={deleteModal}
        onDeleteClick={confirmDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
    </div>
  );
};

export default MeetingsList;
