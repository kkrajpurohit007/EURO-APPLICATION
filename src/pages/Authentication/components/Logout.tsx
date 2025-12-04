import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { logoutUser } from "../../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "../../../Components/Common/withRouter";
import { createSelector } from "reselect";
import { appInitService } from "../../../services/AppInitService";

const Logout = () => {
  const dispatch: any = useDispatch();

  const isUserLogoutSelector = createSelector(
    (state: any) => state.Login.isUserLogout,
    (isUserLogout) => isUserLogout,
  );
  const isUserLogout = useSelector(isUserLogoutSelector);

  useEffect(() => {
    // Clear all application data
    appInitService.reset();
    
    // Clear user data from storage
    sessionStorage.removeItem("authUser");
    localStorage.removeItem("authUser");
    
    // Dispatch logout action
    dispatch(logoutUser());
  }, [dispatch]);

  if (isUserLogout) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Logging out...</span>
        </div>
        <h5 className="mt-3">Logging out...</h5>
        <p className="text-muted">Please wait while we securely log you out</p>
      </div>
    </div>
  );
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);