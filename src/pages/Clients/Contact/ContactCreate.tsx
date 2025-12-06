import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  createClientContact,
  fetchClientContacts,
  selectClientContactLoading,
  selectClientContactError,
} from "../../../slices/clientContacts/clientContact.slice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getLoggedinUser } from "../../../helpers/api_helper";
import { selectClientList } from "../../../slices/clients/client.slice";
import Select from "react-select";
import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";

const ClientContactCreate: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_CONTACT_CREATE;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useFlash();
  const loading = useSelector(selectClientContactLoading);
  const error = useSelector(selectClientContactError);
  const clients = useSelector(selectClientList);

  const authUser = getLoggedinUser();
  const clientIdFromUrl = searchParams.get("clientId") || "";

  const clientOptions = clients
    .filter((c: any) => !c.isDeleted)
    .map((client: any) => ({
      value: client.id,
      label: client.name,
    }));

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      clientId: clientIdFromUrl,
      title: "Mr.",
      contactFirstName: "",
      contactLastName: "",
      email: "",
      workPhone: "",
      mobile: "",
      notes: "",
      isAllowPortalAccess: false,
    },
    validationSchema: Yup.object({
      clientId: Yup.string().required("Client is required"),
      contactFirstName: Yup.string().required("First name is required"),
      contactLastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      workPhone: Yup.string().required("Work phone is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        tenantId: authUser?.tenantId || "",
        ...values,
      };
      const result = await dispatch(createClientContact(payload));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Contact created successfully");
        // Refresh client contacts list
        dispatch(fetchClientContacts({ pageNumber: 1, pageSize: 50 }));
        // Delay navigation to show notification
        setTimeout(() => {
          // If created from client view, navigate back to client view
          if (clientIdFromUrl) {
            navigate(`/clients/view/${clientIdFromUrl}`);
          } else {
            navigate("/clients/contacts");
          }
        }, 500);
      } else {
        showError("Failed to create contact");
      }
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create Contact" pageTitle="Client Contacts" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">New Client Contact</h5>
                <div className="d-flex gap-2">
                  <Button
                    color="light"
                    onClick={() => {
                      if (clientIdFromUrl) {
                        navigate(`/clients/view/${clientIdFromUrl}`);
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
                      if (clientIdFromUrl) {
                        navigate(`/clients/view/${clientIdFromUrl}`);
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
                    {loading ? <Spinner size="sm" /> : "Save"}
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
                      <Label className="form-label">Client *</Label>
                      <Select
                        value={clientOptions.find(
                          (option: any) =>
                            option.value === validation.values.clientId
                        )}
                        onChange={(selectedOption: any) => {
                          validation.setFieldValue(
                            "clientId",
                            selectedOption?.value || ""
                          );
                        }}
                        options={clientOptions}
                        placeholder="Select client"
                        classNamePrefix="select2-selection"
                      />
                      {validation.touched.clientId &&
                        validation.errors.clientId && (
                          <div className="invalid-feedback d-block">
                            {String(validation.errors.clientId)}
                          </div>
                        )}
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Title</Label>
                      <Input
                        type="select"
                        name="title"
                        value={validation.values.title}
                        onChange={validation.handleChange}
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Dr.">Dr.</option>
                      </Input>
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
                          name="isAllowPortalAccess"
                          checked={validation.values.isAllowPortalAccess}
                          onChange={validation.handleChange}
                        />
                        <Label className="form-check-label">
                          {validation.values.isAllowPortalAccess
                            ? "Enabled"
                            : "Disabled"}
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

export default ClientContactCreate;
