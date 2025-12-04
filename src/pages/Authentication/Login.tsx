import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { initiateLoginWithOtp } from "../../slices/thunks";

import logoLight from "../../assets/images/logo-light.png";
import { createSelector } from "reselect";
import { PAGE_TITLES, APP_TAGLINE } from "../../common/branding";

const Login = (props: any) => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const selectLayoutState = (state: any) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    otpSent: state.Otp.otpSent,
    otpError: state.Otp.otpError,
    otpLoading: state.Otp.otpLoading,
  }));
  // Inside your component
  const { otpSent, otpError, otpLoading } = useSelector(loginpageData);

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
      // Step 1: Initiate login with OTP - email only
      dispatch(initiateLoginWithOtp({ email: values.email }));
    },
  });

  // Redirect to OTP page when OTP is sent
  useEffect(() => {
    if (otpSent) {
      navigate("/otp-verification");
    }
  }, [otpSent, navigate]);

  document.title = PAGE_TITLES.login;
  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="75" />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium">{APP_TAGLINE}</p>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Welcome Back !</h5>
                      <p className="text-muted">
                        Enter your email to receive an OTP
                      </p>
                    </div>
                    {otpError && <Alert color="danger"> {otpError} </Alert>}
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action="#"
                      >
                        <div className="mb-3">
                          <Label htmlFor="email" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            disabled={otpLoading}
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            {otpLoading && (
                              <Spinner size="sm" className="me-2">
                                {" "}
                                Loading...{" "}
                              </Spinner>
                            )}
                            Send OTP
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
