import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch, useSelector } from "react-redux";

import { useProfile } from "../Components/Hooks/UserHooks";

import { logoutUser } from "../slices/auth/login/thunk";
import { appInitService } from "../services/AppInitService";

const AuthProtected = (props: any) => {
  const dispatch: any = useDispatch();
  const { userProfile, loading, token } = useProfile();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication state from Redux as well
  const reduxUser = useSelector((state: any) => state.login?.user || {});
  const hasReduxAuth = reduxUser && (reduxUser.token || reduxUser.jwt);

  useEffect(() => {
    const initializeApp = async () => {
      // Check both storage and Redux for auth state
      const hasAuth = (userProfile && token) || hasReduxAuth;
      
      if (hasAuth && !loading) {
        const authToken = token || reduxUser.token || reduxUser.jwt;
        if (authToken) {
          setAuthorization(authToken);

          // Initialize app data if user is logged in and not already initialized
          if (!appInitService.getIsInitialized() && !isInitializing) {
            setIsInitializing(true);
            await appInitService.initialize(dispatch);
            setIsInitializing(false);
          }
        }
        setIsCheckingAuth(false);
      } else if (!hasAuth && !loading) {
        // Only logout if we're sure there's no auth (after initial check)
        if (!isCheckingAuth) {
          dispatch(logoutUser());
        } else {
          setIsCheckingAuth(false);
        }
      }
    };

    initializeApp();
  }, [token, userProfile, loading, dispatch, isInitializing, hasReduxAuth, reduxUser, isCheckingAuth]);

  /*
    Navigate is un-auth access protected routes via url
    Only redirect if we're certain there's no auth (not during initial check)
    */

  // Don't redirect during initial auth check or if Redux has auth state
  if (!isCheckingAuth && !userProfile && !hasReduxAuth && !loading && !token) {
    return (
      <React.Fragment>
        <Navigate to={{ pathname: "/login" }} />
      </React.Fragment>
    );
  }

  // Show loading state during initial check
  if (isCheckingAuth && !hasReduxAuth && !userProfile) {
    return (
      <React.Fragment>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      </React.Fragment>
    );
  }

  return <>{props.children}</>;
};

export default AuthProtected;

// import React, { useEffect } from "react";
// import { Navigate, Route } from "react-router-dom";
// import { setAuthorization } from "../helpers/api_helper";
// import { useDispatch } from "react-redux";

// import { useProfile } from "../Components/Hooks/UserHooks";

// import { logoutUser } from "../slices/auth/login/thunk";

// const AuthProtected = (props  : any) => {
//   const dispatch  : any = useDispatch();
//   const { userProfile, loading, token } = useProfile();
//   useEffect(() => {
//     if (userProfile && !loading && token) {
//       setAuthorization(token);
//     } else if (!userProfile && loading && !token) {
//       dispatch(logoutUser());
//     }
//   }, [token, userProfile, loading, dispatch]);

//   /*
//     Navigate is un-auth access protected routes via url
//     */

//   if (!userProfile && loading && !token) {
//     return (
//       <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
//     );
//   }

//   return <>{props.children}</>;
// };

// const AccessRoute = ({ component: Component, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props  : any) => {
//         return (<> <Component {...props} /> </>);
//       }}
//     />
//   );
// };

// export { AuthProtected, AccessRoute };
