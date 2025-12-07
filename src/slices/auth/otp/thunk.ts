import {
  requestEmailOtp as apiRequestEmailOtp,
  verifyEmailOtp as apiVerifyEmailOtp,
} from "../../../services/authService";

import {
  otpGenerated,
  otpVerifiedSuccess,
  otpLoading,
  otpError,
  otpResent,
  clearOtpData,
} from "./reducer";

import { loginSuccess } from "../login/reducer";
import { appInitService } from "../../../services/AppInitService";

// Step 1: Request OTP via Email Login
export const initiateLoginWithOtp =
  (credentials: any) => async (dispatch: any) => {
    try {
      dispatch(otpLoading());

      // Call the API to request OTP
      const response = await apiRequestEmailOtp(credentials.email);

      if (response) {
        // Response should contain userId, isNewUser, isInitialSetupDone
        const userId = response.userId;
        const userEmail = credentials.email;

        if (userId) {
          dispatch(
            otpGenerated({
              sessionToken: userId, // Use userId as session token for next step
              userEmail,
            })
          );
        } else {
          dispatch(otpError("Failed to initiate login. Please try again."));
        }
      }
    } catch (error: any) {
      dispatch(otpError(error.message || "Failed to request OTP"));
    }
  };

// Step 2: Verify OTP and complete login
export const verifyOtp =
  (userId: string, otp: string, history: any) => async (dispatch: any) => {
    try {
      dispatch(otpLoading());

      // Call the API to verify OTP
      const response = await apiVerifyEmailOtp(userId, otp);

      if (response && response.jwt) {
        // Successful verification - map all response fields
        const userData = {
          token: response.jwt,
          refreshToken: response.refreshToken,
          expiresAt: response.expiresAt,
          userId: response.userId,
          profileId: response.profileId,
          profileName: response.profileName,
          roleId: response.roleId,
          roleName: response.roleName,
          userGroup: response.userGroup,
          userName: response.userName,
          firstName: response.firstName,
          lastName: response.lastName,
          tenantId: response.tenantId,
          clientId: response.clientId,
          passKey: response.passKey,
          isNewUser: response.isNewUser,
          forcePasswordChange: response.forcePasswordChange,
          avatarUrl: response.avatarUrl,
          trackingInterval: response.trackingInterval,
          themeColour: response.themeColour,
          created: response.created,
          id: response.id,
        };

        // Store in sessionStorage and localStorage for persistence
        sessionStorage.setItem("authUser", JSON.stringify(userData));
        localStorage.setItem("authUser", JSON.stringify(userData));

        // Dispatch custom event to notify useProfile hook of storage update
        window.dispatchEvent(new Event("authStorageUpdate"));

        // IMPORTANT: Set authorization header immediately before any other operations
        const { setAuthorization } = await import("../../../helpers/api_helper");
        setAuthorization(userData.token);

        // Update Redux state - mark as verified first (this keeps loading state visible)
        dispatch(otpVerifiedSuccess());
        dispatch(loginSuccess(userData));

        // Small delay to ensure state is propagated and UI updates
        await new Promise(resolve => setTimeout(resolve, 150));

        // Initialize app data after successful login
        await appInitService.initialize(dispatch);

        // Brief delay to show success state before navigation
        await new Promise(resolve => setTimeout(resolve, 300));

        // Navigate to dashboard first (before clearing OTP data)
        // This ensures navigation happens while loading state is still visible
        history("/dashboard");

        // Clear OTP data after navigation is initiated
        // Use a small delay to ensure navigation has started
        setTimeout(() => {
          dispatch(clearOtpData());
        }, 100);
      } else {
        dispatch(otpError("OTP verification failed. Please try again."));
      }
    } catch (error: any) {
      dispatch(otpError(error.message || "OTP verification failed"));
    }
  };

// Resend OTP - Request new OTP for the same email
export const resendOtp = (userEmail: string) => async (dispatch: any) => {
  try {
    dispatch(otpLoading());

    // Call the API to request OTP again with the stored email
    const response = await apiRequestEmailOtp(userEmail);

    if (response && response.userId) {
      dispatch(
        otpGenerated({
          sessionToken: response.userId,
          userEmail: userEmail,
        })
      );
      dispatch(otpResent());
    } else {
      dispatch(otpError("Failed to resend OTP"));
    }
  } catch (error: any) {
    dispatch(otpError(error.message || "Failed to resend OTP"));
  }
};
