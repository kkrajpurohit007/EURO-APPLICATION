import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  createLead,
  fetchLeads,
  selectLeadLoading,
  selectLeadError,
} from "../../../slices/leads/lead.slice";
import { LeadStatusLabels } from "../../../slices/leads/lead.fakeData";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getLoggedinUser } from "../../../helpers/api_helper";

import { PAGE_TITLES } from "../../../common/branding";

const LeadCreate: React.FC = () => {
  document.title = PAGE_TITLES.LEAD_CREATE;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const loading = useSelector(selectLeadLoading);
  const error = useSelector(selectLeadError);

  const authUser = getLoggedinUser();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      contactPerson: "",
      contactEmail: "",
      description: "",
      leadStatus: 0,
      tentativeHours: 0,
      notes: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      contactPerson: Yup.string().required("Contact person is required"),
      contactEmail: Yup.string()
        .email("Enter a valid email")
        .required("Contact email is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        tenantId: authUser?.tenantId || "",
        clientId: null,
        userId: authUser?.userId || "",
        ...values,
        leadStatus: values.leadStatus as any,
      };
      const result = await dispatch(createLead(payload));
      if (result.meta.requestStatus === "fulfilled") {
        // Refresh leads list
        dispatch(fetchLeads({ pageNumber: 1, pageSize: 500 }));
        navigate("/leads/list");
      }
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create Lead" pageTitle="Leads" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">New Scaffolding Lead</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/leads/list")}>
                    Close
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => navigate("/leads/list")}
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
                      <Label className="form-label">Title *</Label>
                      <Input
                        name="title"
                        value={validation.values.title}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.title && validation.errors.title
                          )
                        }
                        placeholder="e.g., MR., MRS., etc."
                      />
                      {validation.touched.title && validation.errors.title && (
                        <FormFeedback type="invalid">
                          {String(validation.errors.title)}
                        </FormFeedback>
                      )}
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Contact Person *</Label>
                      <Input
                        name="contactPerson"
                        value={validation.values.contactPerson}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.contactPerson &&
                            validation.errors.contactPerson
                          )
                        }
                      />
                      {validation.touched.contactPerson &&
                        validation.errors.contactPerson && (
                          <FormFeedback type="invalid">
                            {String(validation.errors.contactPerson)}
                          </FormFeedback>
                        )}
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Contact Email *</Label>
                      <Input
                        type="email"
                        name="contactEmail"
                        value={validation.values.contactEmail}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.contactEmail &&
                            validation.errors.contactEmail
                          )
                        }
                      />
                      {validation.touched.contactEmail &&
                        validation.errors.contactEmail && (
                          <FormFeedback type="invalid">
                            {String(validation.errors.contactEmail)}
                          </FormFeedback>
                        )}
                    </Col>
                    <Col md={6}>
                      <Label className="form-label">Lead Status</Label>
                      <Input
                        type="select"
                        name="leadStatus"
                        value={validation.values.leadStatus}
                        onChange={validation.handleChange}
                      >
                        {Object.entries(LeadStatusLabels).map(
                          ([key, label]) => (
                            <option key={key} value={parseInt(key)}>
                              {label}
                            </option>
                          )
                        )}
                      </Input>
                    </Col>

                    <Col md={12}>
                      <Label className="form-label">Description *</Label>
                      <Input
                        type="textarea"
                        rows={3}
                        name="description"
                        value={validation.values.description}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          !!(
                            validation.touched.description &&
                            validation.errors.description
                          )
                        }
                      />
                      {validation.touched.description &&
                        validation.errors.description && (
                          <FormFeedback type="invalid">
                            {String(validation.errors.description)}
                          </FormFeedback>
                        )}
                    </Col>

                    <Col md={6}>
                      <Label className="form-label">Tentative Hours</Label>
                      <Input
                        type="number"
                        name="tentativeHours"
                        value={validation.values.tentativeHours}
                        onChange={validation.handleChange}
                      />
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

export default LeadCreate;
