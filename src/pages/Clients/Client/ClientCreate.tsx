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
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  createClient,
  fetchClients,
  selectClientLoading,
  selectClientError,
} from "../../../slices/clients/client.slice";
import { selectCountryList } from "../../../slices/countries/country.slice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getLoggedinUser } from "../../../helpers/api_helper";

import { PAGE_TITLES } from "../../../common/branding";
import { useFlash } from "../../../hooks/useFlash";

const ClientCreate: React.FC = () => {
  document.title = PAGE_TITLES.CLIENT_CREATE;
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useFlash();
  const loading = useSelector(selectClientLoading);
  const error = useSelector(selectClientError);
  const countries = useSelector(selectCountryList);

  const authUser = getLoggedinUser();

  // Transform countries for react-select
  const countryOptions = [
    {
      options: countries.map((country: any) => ({
        label: country.name,
        value: country.id,
      })),
    },
  ];

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      registeredNumber: "",
      gstNumber: "",
      address1: "",
      address2: "",
      countryId: "",
      zipcode: "",
      managerFirstName: "",
      managerLastName: "",
      managerEmailId: "",
      isPriority: false,
      priorityReason: "",
      logo: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Client name is required"),
      address1: Yup.string().required("Address is required"),
      countryId: Yup.string().required("Country is required"),
      zipcode: Yup.string().required("Zipcode is required"),
      managerFirstName: Yup.string().required("Manager first name is required"),
      managerLastName: Yup.string().required("Manager last name is required"),
      managerEmailId: Yup.string()
        .email("Enter a valid email")
        .required("Manager email is required"),
      priorityReason: Yup.string().when("isPriority", {
        is: true,
        then: (schema) => schema.required("Priority reason is required when priority customer is selected"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      const payload = {
        tenantId: authUser?.tenantId || "",
        name: values.name,
        registeredNumber: values.registeredNumber,
        gstNumber: values.gstNumber,
        address1: values.address1,
        address2: values.address2,
        countryId: values.countryId,
        zipcode: values.zipcode,
        managerFirstName: values.managerFirstName,
        managerLastName: values.managerLastName,
        managerEmailId: values.managerEmailId,
        isPriority: values.isPriority,
        priorityReason: values.priorityReason,
        logo: null,
      };
      const result = await dispatch(createClient(payload));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Client created successfully");
        // Refresh clients list
        dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
        // Delay navigation to show notification
        setTimeout(() => {
          navigate("/clients/list");
        }, 500);
      } else {
        showError("Failed to create client");
      }
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Add Client" pageTitle="Clients" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">New Client</h5>
                <div className="d-flex gap-2">
                  <Button color="light" onClick={() => navigate("/clients/list")}>
                    Close
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => navigate("/clients/list")}
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
                  {/* Section A: Client Info */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Client Info</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">Client Name *</Label>
                        <Input
                          name="name"
                          value={validation.values.name}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.name && validation.errors.name
                            )
                          }
                          placeholder="Enter client name"
                        />
                        {validation.touched.name && validation.errors.name && (
                          <FormFeedback type="invalid">
                            {String(validation.errors.name)}
                          </FormFeedback>
                        )}
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Registered Number</Label>
                        <Input
                          name="registeredNumber"
                          value={validation.values.registeredNumber}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          placeholder="Enter registered number"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">GST Number</Label>
                        <Input
                          name="gstNumber"
                          value={validation.values.gstNumber}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          placeholder="Enter GST number"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Priority Customer</Label>
                        <div className="form-check form-switch form-switch-lg">
                          <Input
                            type="switch"
                            className="form-check-input"
                            id="isPriority"
                            name="isPriority"
                            checked={validation.values.isPriority}
                            onChange={(e) => {
                              validation.setFieldValue("isPriority", e.target.checked);
                              // Clear priority reason if unchecked
                              if (!e.target.checked) {
                                validation.setFieldValue("priorityReason", "");
                              }
                            }}
                          />
                          <Label className="form-check-label" htmlFor="isPriority">
                            {validation.values.isPriority ? "Enabled" : "Disabled"}
                          </Label>
                        </div>
                      </Col>
                      {validation.values.isPriority && (
                        <Col md={12}>
                          <Label className="form-label">Priority Reason *</Label>
                          <Input
                            name="priorityReason"
                            type="textarea"
                            rows="3"
                            value={validation.values.priorityReason}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              !!(
                                validation.touched.priorityReason && 
                                validation.errors.priorityReason
                              )
                            }
                            placeholder="Enter priority reason"
                          />
                          {validation.touched.priorityReason && 
                           validation.errors.priorityReason && (
                            <FormFeedback type="invalid">
                              {String(validation.errors.priorityReason)}
                            </FormFeedback>
                          )}
                        </Col>
                      )}
                    </Row>
                  </div>

                  {/* Section B: Address */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Address</h5>
                    <Row className="g-3">
                      <Col md={12}>
                        <Label className="form-label">Address Line 1 *</Label>
                        <Input
                          name="address1"
                          value={validation.values.address1}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.address1 &&
                              validation.errors.address1
                            )
                          }
                          placeholder="Enter address line 1"
                        />
                        {validation.touched.address1 &&
                          validation.errors.address1 && (
                            <FormFeedback type="invalid">
                              {String(validation.errors.address1)}
                            </FormFeedback>
                          )}
                      </Col>
                      <Col md={12}>
                        <Label className="form-label">Address Line 2</Label>
                        <Input
                          name="address2"
                          value={validation.values.address2}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          placeholder="Enter address line 2 (optional)"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Country *</Label>
                        <Select
                          value={
                            countryOptions[0]?.options.find(
                              (option: any) =>
                                option.value === validation.values.countryId
                            ) || null
                          }
                          onChange={(selectedOption: any) => {
                            validation.setFieldValue(
                              "countryId",
                              selectedOption?.value || ""
                            );
                          }}
                          options={countryOptions}
                          placeholder="Select country"
                          classNamePrefix="select2-selection form-select"
                        />
                        {validation.errors.countryId &&
                          validation.touched.countryId ? (
                          <div className="invalid-feedback d-block">
                            {String(validation.errors.countryId)}
                          </div>
                        ) : null}
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Zip Code</Label>
                        <Input
                          name="zipcode"
                          value={validation.values.zipcode}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          placeholder="Enter zip code"
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Section C: Manager Details */}
                  <div className="border border-dashed border-primary-subtle rounded p-3 mb-4">
                    <h5 className="mb-3">Manager Details</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Label className="form-label">First Name *</Label>
                        <Input
                          name="managerFirstName"
                          value={validation.values.managerFirstName}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.managerFirstName &&
                              validation.errors.managerFirstName
                            )
                          }
                          placeholder="Enter manager first name"
                        />
                        {validation.touched.managerFirstName &&
                          validation.errors.managerFirstName && (
                            <FormFeedback type="invalid">
                              {String(validation.errors.managerFirstName)}
                            </FormFeedback>
                          )}
                      </Col>
                      <Col md={6}>
                        <Label className="form-label">Last Name *</Label>
                        <Input
                          name="managerLastName"
                          value={validation.values.managerLastName}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.managerLastName &&
                              validation.errors.managerLastName
                            )
                          }
                          placeholder="Enter manager last name"
                        />
                        {validation.touched.managerLastName &&
                          validation.errors.managerLastName && (
                            <FormFeedback type="invalid">
                              {String(validation.errors.managerLastName)}
                            </FormFeedback>
                          )}
                      </Col>
                      <Col md={12}>
                        <Label className="form-label">Email *</Label>
                        <Input
                          type="email"
                          name="managerEmailId"
                          value={validation.values.managerEmailId}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            !!(
                              validation.touched.managerEmailId &&
                              validation.errors.managerEmailId
                            )
                          }
                          placeholder="Enter manager email"
                        />
                        {validation.touched.managerEmailId &&
                          validation.errors.managerEmailId && (
                            <FormFeedback type="invalid">
                              {String(validation.errors.managerEmailId)}
                            </FormFeedback>
                          )}
                      </Col>
                    </Row>
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

export default ClientCreate;
