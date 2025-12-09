import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  Label,
  Input,
  Alert,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Spinner,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import ContactCard from "../../../modules/client/contact/components/ContactCard";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { selectClientById } from "../../../slices/clients/client.slice";
import {
  selectClientContactList,
  fetchClientContacts,
  deleteClientContact,
  selectClientContactLoading,
  selectClientContactError,
} from "../../../slices/clientContacts/clientContact.slice";
import { ClientContactItem } from "../../../slices/clientContacts/clientContact.fakeData";
import { filterContactsByClient } from "../Contact/utils/contactUtils";
import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";

const ClientView: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_VIEW;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { showSuccess, showError } = useFlash();
  const client = useSelector((state: any) => selectClientById(state, id || ""));
  const allContacts: ClientContactItem[] = useSelector(selectClientContactList);
  const contactsLoading = useSelector(selectClientContactLoading);
  const contactsError = useSelector(selectClientContactError);
  
  const [activeTab, setActiveTab] = useState("1");
  const [deleteModal, setDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  // Fetch contacts on mount
  useEffect(() => {
    dispatch(fetchClientContacts({ pageNumber: 1, pageSize: 50 }));
  }, [dispatch]);

  // Filter contacts by current client ID
  const clientContacts = useMemo(() => {
    if (!id || !allContacts) return [];
    return filterContactsByClient(
      allContacts.filter((c) => !c.isDeleted),
      id
    );
  }, [allContacts, id]);

  const handleDeleteContact = async (contactId: string) => {
    setContactToDelete(contactId);
    setDeleteModal(true);
  };

  const confirmDeleteContact = async () => {
    if (!contactToDelete) return;
    
    try {
      const result = await dispatch(deleteClientContact(contactToDelete));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Contact deleted successfully");
        // Refresh contacts list
        dispatch(fetchClientContacts({ pageNumber: 1, pageSize: 50 }));
      } else {
        showError("Failed to delete contact");
      }
    } catch (err) {
      showError("Failed to delete contact");
    } finally {
      setDeleteModal(false);
      setContactToDelete(null);
    }
  };

  if (!client) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Client not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="View Client" pageTitle="Clients" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">View Client Details</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/clients/list")}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate(`/clients/edit/${id}`)}
                  >
                    <i className="ri-pencil-line align-bottom me-1"></i>
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <Nav tabs className="nav-tabs-custom rounded">
                    <NavItem>
                      <NavLink
                        className={activeTab === "1" ? "active" : ""}
                        onClick={() => setActiveTab("1")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ri-information-line me-2"></i>
                        Client Info
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "2" ? "active" : ""}
                        onClick={() => setActiveTab("2")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ri-contacts-line me-2"></i>
                        Client Contacts
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>

                <TabContent activeTab={activeTab} className="p-3 text-muted">
                  <TabPane tabId="1">
                    <Form>
                      {/* Section A: Client Info */}
                      <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                        <h5 className="mb-3">Client Info</h5>
                        <Row className="g-3">
                          <Col md={6}>
                            <Label className="form-label">Client Name</Label>
                            <Input
                              name="name"
                              value={client.name || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">Registered Number</Label>
                            <Input
                              name="registeredNumber"
                              value={client.registeredNumber || client.ein || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">GST Number</Label>
                            <Input
                              name="gstNumber"
                              value={client.gstNumber || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">Priority Customer</Label>
                            <Input
                              name="isPriority"
                              value={client.isPriority ? "Yes" : "No"}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          {client.isPriority && (
                            <Col md={12}>
                              <Label className="form-label">Priority Reason</Label>
                              <Input
                                name="priorityReason"
                                value={client.priorityReason || ""}
                                readOnly
                                plaintext
                                className="form-control-plaintext bg-light px-3 py-2 rounded"
                              />
                            </Col>
                          )}
                        </Row>
                      </div>

                      {/* Section B: Address */}
                      <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                        <h5 className="mb-3">Address</h5>
                        <Row className="g-3">
                          <Col md={12}>
                            <Label className="form-label">Address Line 1</Label>
                            <Input
                              name="address1"
                              value={client.address1 || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={12}>
                            <Label className="form-label">Address Line 2</Label>
                            <Input
                              name="address2"
                              value={client.address2 || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">Country</Label>
                            <Input
                              name="countryName"
                              value={client.countryName || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">Zip Code</Label>
                            <Input
                              name="zipcode"
                              value={client.zipcode || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                        </Row>
                      </div>

                      {/* Section C: Manager Details */}
                      <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                        <h5 className="mb-3">Manager Details</h5>
                        <Row className="g-3">
                          <Col md={6}>
                            <Label className="form-label">First Name</Label>
                            <Input
                              name="managerFirstName"
                              value={client.managerFirstName || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={6}>
                            <Label className="form-label">Last Name</Label>
                            <Input
                              name="managerLastName"
                              value={client.managerLastName || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                          <Col md={12}>
                            <Label className="form-label">Email</Label>
                            <Input
                              type="email"
                              name="managerEmailId"
                              value={client.managerEmailId || ""}
                              readOnly
                              plaintext
                              className="form-control-plaintext bg-light px-3 py-2 rounded"
                            />
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  </TabPane>
                  
                  <TabPane tabId="2">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Client Contacts ({clientContacts.length})</h5>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => navigate(`/clients/contacts/create?clientId=${id}`)}
                      >
                        <i className="ri-add-line align-bottom me-1"></i>
                        Add Contact
                      </Button>
                    </div>

                    {contactsError && (
                      <Alert color="danger" className="mb-3">
                        {contactsError}
                      </Alert>
                    )}

                    {contactsLoading ? (
                      <div className="text-center py-5">
                        <Spinner color="primary" />
                        <p className="mt-2 text-muted">Loading contacts...</p>
                      </div>
                    ) : clientContacts.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="ri-contacts-line ri-2x text-muted mb-3"></i>
                        <h5 className="text-muted">No Contacts Found</h5>
                        <p className="text-muted mb-4">
                          This client doesn't have any contacts yet.
                        </p>
                        <Button
                          color="primary"
                          onClick={() => navigate(`/clients/contacts/create?clientId=${id}`)}
                        >
                          <i className="ri-add-line align-bottom me-1"></i>
                          Add First Contact
                        </Button>
                      </div>
                    ) : (
                      <Row className="row-cols-xxl-4 row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-4">
                        {clientContacts.map((contact) => (
                          <Col key={contact.id}>
                            <ContactCard
                              contact={contact}
                              onDelete={handleDeleteContact}
                            />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <DeleteModal
        show={deleteModal}
        onDeleteClick={confirmDeleteContact}
        onCloseClick={() => {
          setDeleteModal(false);
          setContactToDelete(null);
        }}
      />
    </div>
  );
};

export default ClientView;