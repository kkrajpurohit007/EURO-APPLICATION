import React, { useEffect, useState, useRef, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch, useSelector } from "react-redux";

import { useProfile } from "../Components/Hooks/UserHooks";

import { logoutUser } from "../slices/auth/login/thunk";
import { appInitService } from "../services/AppInitService";

const AuthProtected = (props: any) => {
  const dispatch: any = useDispatch();
  const { userProfile, loading, token } = useProfile();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Use refs to track initialization state (won't cause re-renders)
  const hasInitializedRef = useRef(false);
  const hasCheckedAuthRef = useRef(false);
  const isInitializingRef = useRef(false);
  
  // Store current values in refs to avoid dependency issues
  const userProfileRef = useRef(userProfile);
  const tokenRef = useRef(token);
  const loadingRef = useRef(loading);
  
  // Update refs when values change (without causing re-renders)
  useEffect(() => {
    userProfileRef.current = userProfile;
    tokenRef.current = token;
    loadingRef.current = loading;
  }, [userProfile, token, loading]);

  // Check authentication state from Redux as well - stabilize with useMemo
  const reduxUserRaw = useSelector((state: any) => state.login?.user);
  const reduxUser = useMemo(() => reduxUserRaw || null, [reduxUserRaw]);
  const reduxToken = useMemo(() => {
    if (!reduxUser) return null;
    return reduxUser.token || reduxUser.jwt || null;
  }, [reduxUser]);
  const hasReduxAuth = !!reduxToken;

  // Single effect to handle all auth and initialization logic
  useEffect(() => {
    // Use refs for current values to avoid dependency issues
    const currentUserProfile = userProfileRef.current;
    const currentToken = tokenRef.current;
    const currentLoading = loadingRef.current;
    
    // Initial auth check - only run once when loading completes OR if Redux has auth
    if (!hasCheckedAuthRef.current) {
      // If Redux has auth, we can immediately proceed (after OTP verification)
      if (hasReduxAuth && reduxToken) {
        setAuthorization(reduxToken);
        setIsCheckingAuth(false);
        hasCheckedAuthRef.current = true;
        return;
      }
      
      if (currentLoading) {
        // Still loading, wait
        return;
      }
      
      const hasAuth = (currentUserProfile && currentToken) || hasReduxAuth;
      
      if (hasAuth) {
        const authToken = currentToken || reduxToken;
        if (authToken) {
          setAuthorization(authToken);
        }
      }
      
      setIsCheckingAuth(false);
      hasCheckedAuthRef.current = true;
      return; // Exit early after initial check
    }
    
    // Handle app initialization - only when auth check is complete and not already initialized
    // Check isCheckingAuth state value (will be false after initial check completes)
    if (hasCheckedAuthRef.current && !hasInitializedRef.current) {
      // Wait for isCheckingAuth to be false (set in initial check above)
      if (isCheckingAuth || currentLoading) {
        return;
      }
      
      const hasAuth = (currentUserProfile && currentToken) || hasReduxAuth;
      
      if (hasAuth && !isInitializingRef.current) {
        const authToken = currentToken || reduxToken;
        if (authToken && !appInitService.getIsInitialized()) {
          isInitializingRef.current = true;
          appInitService.initialize(dispatch).finally(() => {
            isInitializingRef.current = false;
            hasInitializedRef.current = true;
          });
        } else {
          hasInitializedRef.current = true;
        }
      } else if (!hasAuth) {
        // Only logout if we're sure there's no auth (after initial check)
        dispatch(logoutUser());
        hasInitializedRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, reduxToken, hasReduxAuth, reduxUser]); // Depend on Redux auth state to detect login

  // Separate effect to trigger initialization when isCheckingAuth becomes false
  useEffect(() => {
    if (!hasCheckedAuthRef.current || hasInitializedRef.current) return;
    if (isCheckingAuth || loadingRef.current) return;
    
    const currentUserProfile = userProfileRef.current;
    const currentToken = tokenRef.current;
    const hasAuth = (currentUserProfile && currentToken) || hasReduxAuth;
    
    if (hasAuth && !isInitializingRef.current) {
      const authToken = currentToken || reduxToken;
      if (authToken && !appInitService.getIsInitialized()) {
        isInitializingRef.current = true;
        appInitService.initialize(dispatch).finally(() => {
          isInitializingRef.current = false;
          hasInitializedRef.current = true;
        });
      } else {
        hasInitializedRef.current = true;
      }
    } else if (!hasAuth) {
      dispatch(logoutUser());
      hasInitializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckingAuth]); // Only run when isCheckingAuth changes (from true to false)

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
