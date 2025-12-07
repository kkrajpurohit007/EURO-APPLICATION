import { useEffect, useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { getLoggedinUser } from "../../helpers/api_helper";

const useProfile = () => {
  // Get auth state from Redux store - use useMemo to prevent new object creation
  const reduxUserRaw = useSelector((state: any) => state.login?.user);
  const reduxUser = useMemo(() => reduxUserRaw || null, [reduxUserRaw]);
  
  // Get stable token reference for comparison
  const reduxToken = useMemo(() => {
    if (!reduxUser) return null;
    return reduxUser.token || reduxUser.jwt || null;
  }, [reduxUser]);
  
  const [userProfile, setUserProfile] = useState(() => {
    const stored = getLoggedinUser();
    return stored || null;
  });
  
  const [loading, setLoading] = useState(() => {
    const stored = getLoggedinUser();
    return !stored;
  });

  // Use ref to track current token to avoid stale closures
  const currentTokenRef = useRef<string | null>(null);
  const updateTokenRef = (token: string | null) => {
    currentTokenRef.current = token;
  };

  // Update token ref when userProfile changes
  useEffect(() => {
    const token = userProfile?.token || userProfile?.jwt || null;
    updateTokenRef(token);
  }, [userProfile?.token, userProfile?.jwt]);

  // Update profile when Redux state changes (after login/logout)
  useEffect(() => {
    if (reduxUser && reduxToken) {
      const currentToken = userProfile?.token || userProfile?.jwt || null;
      // Only update if token actually changed
      if (currentToken !== reduxToken) {
        setUserProfile(reduxUser);
        setLoading(false);
        updateTokenRef(reduxToken);
      }
    } else if (!reduxUser && reduxToken === null) {
      // Redux says no user - check storage
      const stored = getLoggedinUser();
      const storedToken = stored?.token || stored?.jwt || null;
      const currentToken = userProfile?.token || userProfile?.jwt || null;
      
      // Only update if there's a change
      if (currentToken !== storedToken) {
        if (stored) {
          setUserProfile(stored);
          setLoading(false);
          updateTokenRef(storedToken);
        } else {
          setUserProfile(null);
          setLoading(true);
          updateTokenRef(null);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxUser, reduxToken, userProfile?.token, userProfile?.jwt]); // Dependencies include token refs

  // Listen to storage changes (for cross-tab sync and immediate updates)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authUser" || e.key === null) {
        const stored = getLoggedinUser();
        const storedToken = stored?.token || stored?.jwt || null;
        const currentToken = currentTokenRef.current;
        
        // Only update if token changed
        if (currentToken !== storedToken) {
          if (stored) {
            setUserProfile(stored);
            setLoading(false);
            updateTokenRef(storedToken);
          } else {
            setUserProfile(null);
            setLoading(true);
            updateTokenRef(null);
          }
        }
      }
    };

    // Custom event for same-tab storage updates
    const handleCustomStorageChange = () => {
      const stored = getLoggedinUser();
      const storedToken = stored?.token || stored?.jwt || null;
      const currentToken = currentTokenRef.current;
      
      // Only update if token changed
      if (currentToken !== storedToken) {
        if (stored) {
          setUserProfile(stored);
          setLoading(false);
          updateTokenRef(storedToken);
        } else {
          setUserProfile(null);
          setLoading(true);
          updateTokenRef(null);
        }
      }
    };

    // Listen to storage events (cross-tab)
    window.addEventListener("storage", handleStorageChange);
    
    // Listen to custom storage update event (same-tab)
    window.addEventListener("authStorageUpdate", handleCustomStorageChange);
    
    // Also check storage periodically for same-tab updates (when localStorage is set directly)
    // Use a reasonable interval to avoid performance issues
    const interval = setInterval(() => {
      const stored = getLoggedinUser();
      const storedToken = stored?.token || stored?.jwt || null;
      const currentToken = currentTokenRef.current;
      
      // Only update if token changed
      if (currentToken !== storedToken) {
        if (stored) {
          setUserProfile(stored);
          setLoading(false);
          updateTokenRef(storedToken);
        } else {
          setUserProfile(null);
          setLoading(true);
          updateTokenRef(null);
        }
      }
    }, 1000); // Increased to 1000ms to reduce frequency

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStorageUpdate", handleCustomStorageChange);
      clearInterval(interval);
    };
  }, []); // Empty dependency array - use refs for current values

  const token = userProfile?.token || userProfile?.jwt || null;

  return { userProfile, loading, token };
};

export { useProfile };
