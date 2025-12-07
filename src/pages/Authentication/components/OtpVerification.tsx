import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PAGE_TITLES, APP_TAGLINE } from "../../../common/branding";
import {
  Card,
  CardBody,
  Col,
  Container,
  Label,
  Row,
  Button,
  Alert,
  Spinner,
  FormGroup,
  Progress,
} from "reactstrap";
import ParticlesAuth from "../../AuthenticationInner/ParticlesAuth";
import logoLight from "../../../assets/images/logo-light.png";
import { createSelector } from "reselect";
import { verifyOtp, resendOtp } from "../../../slices/thunks";
import { clearOtpData } from "../../../slices/auth/otp/reducer";

import "./OtpVerification.scss";

const OtpVerification = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isVerifyingRef = useRef(false); // Track if verification is in progress
  const hasNavigatedRef = useRef(false); // Track if navigation has been initiated

  const selectOtpState = (state: any) => state;
  const otpPageData = createSelector(selectOtpState, (state) => ({
    userId: state.Otp.sessionToken, // sessionToken now holds userId
    userEmail: state.Otp.userEmail,
    otpLoading: state.Otp.otpLoading,
    otpError: state.Otp.otpError,
    otpExpiry: state.Otp.otpExpiry,
    otpSent: state.Otp.otpSent,
    otpVerified: state.Otp.otpVerified, // Added to track verification status
  }));

  const { userId, userEmail, otpLoading, otpError, otpExpiry, otpSent, otpVerified } =
    useSelector(otpPageData);

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // Local state to persist loading

  // Timer for OTP expiry
  useEffect(() => {
    if (!otpExpiry) return;

    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((otpExpiry - Date.now()) / 1000)
      );
      setTimeLeft(remaining);

      if (remaining === 0) {
        setCanResend(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [otpExpiry]);

  // Track verification state to persist loading UI
  useEffect(() => {
    if (otpLoading) {
      setIsVerifying(true);
      isVerifyingRef.current = true;
    }
  }, [otpLoading]);

  // Redirect if no userId (user didn't complete Step 1)
  // But don't redirect if OTP is currently being verified or has been verified
  useEffect(() => {
    if (!userId && !otpSent && !otpLoading && !isVerifying && !hasNavigatedRef.current) {
      navigate("/login");
    }
  }, [userId, otpSent, otpLoading, isVerifying, navigate]);

  // Redirect to dashboard if already verified
  // Only navigate once and check authentication
  useEffect(() => {
    if (hasNavigatedRef.current) {
      return; // Already navigating, don't do anything
    }

    if (!otpVerified || isVerifying) {
      return; // Not verified yet or still verifying
    }

    // Check if user is actually authenticated before redirecting
    const authUser = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    if (!authUser) {
      return; // No auth user yet
    }

    try {
      const user = JSON.parse(authUser);
      if (user && (user.token || user.jwt)) {
        hasNavigatedRef.current = true;
        // Navigate immediately without delay for better UX
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error parsing auth user:", error);
    }
  }, [otpVerified, isVerifying, navigate]);

  const handleVerifyOtp = () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      return;
    }

    if (!userId) return;

    // Set verifying state immediately to prevent form from showing again
    setIsVerifying(true);
    isVerifyingRef.current = true;
    
    dispatch(verifyOtp(userId, otp, navigate));
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^[0-9]?$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Move to next input if digit entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResendOtp = () => {
    if (!userEmail) return;

    dispatch(resendOtp(userEmail));
    setCanResend(false);
    setTimeLeft(300);
    setOtpDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleBackToLogin = () => {
    // Clear OTP state and navigate to login
    dispatch(clearOtpData());
    navigate("/login");
  };

  const isOtpComplete = otpDigits.every((digit) => digit !== "");

  document.title = PAGE_TITLES.OTP_VERIFICATION;

  // Show loading state when OTP is being verified or has been verified
  // Keep showing loading until navigation completes to prevent flash of OTP form
  if (isVerifying || otpLoading || (otpVerified && !hasNavigatedRef.current)) {
    return (
      <React.Fragment>
        <ParticlesAuth>
          <div className="auth-page-content">
            <Container>
              <Row className="justify-content-center">
                <Col md={8} lg={6} xl={5}>
                  <Card className="mt-4">
                    <CardBody className="p-4">
                      <div className="text-center">
                        <div className="mb-4">
                          <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
                        </div>
                        <h5 className="text-primary mb-2">
                          {otpVerified ? "Authentication Successful!" : "Verifying OTP"}
                        </h5>
                        <p className="text-muted">
                          {otpVerified 
                            ? "Redirecting to dashboard..." 
                            : "Please wait while we authenticate your account..."}
                        </p>
                        {otpVerified && (
                          <div className="mt-3">
                            <i className="ri-checkbox-circle-fill text-success" style={{ fontSize: '2rem' }}></i>
                          </div>
                        )}
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
  }

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-50">
                  <div>
                    <img src={logoLight} alt="" height="75" />
                  </div>
                  <p className="mt-3 fs-15 fw-medium">{APP_TAGLINE}</p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    {/* Step Progress */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small text-muted">Step 1 of 2</span>
                        <span className="small fw-bold text-primary">
                          OTP Verification
                        </span>
                      </div>
                      <Progress value={100} style={{ height: "4px" }} />
                    </div>

                    <div className="text-center mt-4 mb-4">
                      <h5 className="text-primary mb-2">Enter OTP</h5>
                      <p className="text-muted">
                        We've sent a 6-digit code to <strong>{userEmail}</strong>
                      </p>
                    </div>

                    <div className="p-2 mt-4">
                      {/* Show error message if exists */}
                      {otpError && (
                        <Alert color="danger" className="mb-3">
                          {otpError}
                        </Alert>
                      )}

                      <FormGroup>
                        <Label className="form-label mb-3">
                          OTP Code <span className="text-danger">*</span>
                        </Label>

                        {/* 6-Digit OTP Input Boxes */}
                        <div className="otp-input-container mb-4">
                          <div className="otp-input-group">
                            {otpDigits.map((digit, index) => (
                              <input
                                key={index}
                                ref={(el) => {
                                  inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                  handleOtpChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`otp-input-box ${digit ? "filled" : ""
                                  }`}
                                placeholder="0"
                              />
                            ))}
                          </div>
                        </div>

                        <small className="text-muted d-block mt-2 text-center">
                          Demo OTP: 123456
                        </small>
                      </FormGroup>

                      <div className="text-center mt-4 mb-3">
                        <Button
                          color="success"
                          className="btn btn-success w-100"
                          onClick={handleVerifyOtp}
                          disabled={
                            otpLoading || !isOtpComplete || timeLeft === 0
                          }
                        >
                          {otpLoading && (
                            <Spinner size="sm" className="me-2">
                              Loading...
                            </Spinner>
                          )}
                          Verify OTP
                        </Button>
                      </div>

                      <div className="text-center">
                        <p className="text-muted mb-3">
                          {timeLeft > 0 ? (
                            <>
                              OTP expires in:{" "}
                              <span className="fw-bold text-danger">
                                {formatTime(timeLeft)}
                              </span>
                            </>
                          ) : (
                            <span className="text-danger fw-bold">
                              OTP Expired
                            </span>
                          )}
                        </p>

                        <div className="d-flex gap-2 justify-content-center">
                          <span className="text-muted">Didn't receive?</span>
                          <Button
                            color="link"
                            className="p-0 text-decoration-none"
                            onClick={handleResendOtp}
                            disabled={!canResend || otpLoading}
                          >
                            {canResend ? "Resend OTP" : "Resend"}
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <Button
                          color="secondary"
                          outline
                          className="w-100"
                          onClick={handleBackToLogin}
                          disabled={otpLoading}
                        >
                          Back to Login
                        </Button>
                      </div>
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

export default OtpVerification;