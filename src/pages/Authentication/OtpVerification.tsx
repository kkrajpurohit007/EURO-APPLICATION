import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import logoLight from "../../assets/images/logo-light.png";
import { createSelector } from "reselect";
import { verifyOtp, resendOtp } from "../../slices/thunks";
import "./OtpVerification.scss";

const OtpVerification = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const selectOtpState = (state: any) => state;
  const otpPageData = createSelector(selectOtpState, (state) => ({
    sessionToken: state.Otp.sessionToken,
    userEmail: state.Otp.userEmail,
    otpLoading: state.Otp.otpLoading,
    otpError: state.Otp.otpError,
    otpExpiry: state.Otp.otpExpiry,
    otpSent: state.Otp.otpSent,
  }));

  const { sessionToken, userEmail, otpLoading, otpError, otpExpiry, otpSent } =
    useSelector(otpPageData);

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

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

  // Redirect if no session token (user didn't complete Step 1)
  useEffect(() => {
    if (!sessionToken && !otpSent) {
      navigate("/login");
    }
  }, [sessionToken, otpSent, navigate]);

  const handleVerifyOtp = () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      return;
    }

    if (!sessionToken) return;

    dispatch(verifyOtp(sessionToken, otp, navigate));
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

    // Auto-submit if all digits filled
    if (newDigits.every((digit) => digit !== "")) {
      setTimeout(() => {
        if (sessionToken) {
          dispatch(verifyOtp(sessionToken, newDigits.join(""), navigate));
        }
      }, 100);
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
    if (!sessionToken) return;

    dispatch(resendOtp(sessionToken));
    setCanResend(false);
    setTimeLeft(300);
    setOtpDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const isOtpComplete = otpDigits.every((digit) => digit !== "");

  document.title = "OTP Verification | ESRM Application";

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <img src={logoLight} alt="" height="20" />
                  </div>
                  <p className="mt-3 fs-15 fw-medium">Two-Step Verification</p>
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
                        We've sent a 6-digit code to{" "}
                        <strong>{userEmail}</strong>
                      </p>
                    </div>

                    {otpError && (
                      <Alert color="danger" className="mb-3">
                        {otpError}
                      </Alert>
                    )}

                    <div className="p-2 mt-4">
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
                                className={`otp-input-box ${
                                  digit ? "filled" : ""
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
                          onClick={() => navigate("/login")}
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
