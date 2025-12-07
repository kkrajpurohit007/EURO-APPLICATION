import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  updateClientContact,
  fetchClientContacts,
  selectClientContactById,
  selectClientContactLoading,
  selectClientContactError,
} from "../../../slices/clientContacts/clientContact.slice";
import { selectClientList } from "../../../slices/clients/client.slice";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";

import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";

const ContactEdit: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_CONTACT_EDIT;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useFlash();
  const contact = useSelector((state: any) => selectClientContactById(state, id || ""));
  const loading = useSelector(selectClientContactLoading);
  const error = useSelector(selectClientContactError);
  const clients = useSelector(selectClientList);

  // Get clientId from URL params or from contact object
  const clientIdFromUrl = searchParams.get("clientId") || "";
  const clientId = clientIdFromUrl || contact?.clientId || "";

  const clientOptions = clients
    .filter((c: any) => !c.isDeleted)
    .map((client: any) => ({
      value: client.id,
      label: client.name,
    }));

  const initialValues = useMemo(
    () => ({
      title: contact?.title || "",
      contactFirstName: contact?.contactFirstName || "",
      contactLastName: contact?.contactLastName || "",
      email: contact?.email || "",
      workPhone: contact?.workPhone || "",
      mobile: contact?.mobile || "",
      notes: contact?.notes || "",
      isAllowPortalAccess: contact?.isAllowPortalAccess || false,
    }),
    [contact]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      contactFirstName: Yup.string().required("First name is required"),
      contactLastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      workPhone: Yup.string().required("Work phone is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        id: id as string,
        data: values,
      };
      const result = await dispatch(updateClientContact(payload));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Contact updated successfully");
        // Refresh client contacts list after successful update
        dispatch(fetchClientContacts({ pageNumber: 1, pageSize: 50 }));
        // Delay navigation to show notification
        setTimeout(() => {
          // If edited from client view, navigate back to client view
          if (clientId) {
            navigate(`/clients/view/${clientId}`);
          } else {
            navigate("/clients/contacts");
          }
        }, 500);
      } else {
        showError("Failed to update contact");
      }
    },
  });

  if (!contact) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">Client Contact not found</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Edit Contact" pageTitle="Client Contacts" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Edit Client Contact</h5>
                <div className="d-flex gap-2">
                  <Button
                    color="light"
                    onClick={() => {
                      if (clientId) {
                        navigate(`/clients/view/${clientId}`);
                      } else {
                        navigate("/clients/contacts");
                      }
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => {
                      if (clientId) {
                        navigate(`/clients/view/${clientId}`);
                      } else {
                        navigate("/clients/contacts");
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => validation.handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Update"}
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
                  <Row className="g-3">
                    <Col md={6}>
                      <Label className="form-label">Client</Label>
                      <Select
                        value={clientOptions.find(
                          (option: any) => option.value === contact.clientId
                        )}
                        isDisabled={true}
                        options={clientOptions}
                        placeholder="Select client"
                        classNamePrefix="select2-selection"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Title</Label>
                      <Input
                        type="text"
                        name="title"
                        value={validation.values.title}
                        onChange={validation.handleChange}
                        placeholder="Enter title (e.g., Mr., Ms., Mrs., Dr.)"
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">First Name *</Label>
                      <Input
                        name="contactFirstName"
                        value={validation.values.contactFirstName}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.contactFirstName &&
                            validation.errors.contactFirstName
                          )
                        }
                      />
                      {validation.touched.contactFirstName &&
                        validation.errors.contactFirstName && (
                          <FormFeedback type="invalid">
                            {String(validation.errors.contactFirstName)}
                          </FormFeedback>
                        )}
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Last Name *</Label>
                      <Input
                        name="contactLastName"
                        value={validation.values.contactLastName}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.contactLastName &&
                            validation.errors.contactLastName
                          )
                        }
                      />
                      {validation.touched.contactLastName &&
                        validation.errors.contactLastName && (
                          <FormFeedback type="invalid">
                            {String(validation.errors.contactLastName)}
                          </FormFeedback>
                        )}
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Email *</Label>
                      <Input
                        type="email"
                        name="email"
                        value={validation.values.email}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.email && validation.errors.email
                          )
                        }
                      />
                      {validation.touched.email && validation.errors.email && (
                        <FormFeedback type="invalid">
                          {String(validation.errors.email)}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Work Phone *</Label>
                      <Input
                        name="workPhone"
                        value={validation.values.workPhone}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.workPhone &&
                            validation.errors.workPhone
                          )
                        }
                      />
                      {validation.touched.workPhone &&
                        validation.errors.workPhone && (
                          <FormFeedback type="invalid">
                            {String(validation.errors.workPhone)}
                          </FormFeedback>
                        )}
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Mobile</Label>
                      <Input
                        name="mobile"
                        value={validation.values.mobile}
                        onChange={validation.handleChange}
                      />
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Portal Access</Label>
                      <div className="form-check form-switch form-switch-lg mt-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="portalAccessSwitch"
                          checked={validation.values.isAllowPortalAccess}
                          onChange={(e) =>
                            validation.setFieldValue(
                              "isAllowPortalAccess",
                              e.target.checked
                            )
                          }
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="portalAccessSwitch"
                        >
                          {validation.values.isAllowPortalAccess
                            ? "Allowed"
                            : "Not Allowed"}
                        </Label>
                      </div>
                    </Col>

                    <Col md={12}>
                      <Label className="form-label">Notes</Label>
                      <Input
                        type="textarea"
                        rows={3}
                        name="notes"
                        value={validation.values.notes}
                        onChange={validation.handleChange}
                      />
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactEdit;
