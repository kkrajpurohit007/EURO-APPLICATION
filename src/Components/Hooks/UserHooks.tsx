import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getLoggedinUser } from "../../helpers/api_helper";

const useProfile = () => {
  // Get auth state from Redux store
  const reduxUser = useSelector((state: any) => state.login?.user || {});
  
  const [userProfile, setUserProfile] = useState(() => {
    const stored = getLoggedinUser();
    return stored || null;
  });
  
  const [loading, setLoading] = useState(() => {
    const stored = getLoggedinUser();
    return !stored;
  });

  // Update profile when Redux state changes (after login/logout)
  useEffect(() => {
    if (reduxUser && reduxUser.token) {
      setUserProfile(reduxUser);
      setLoading(false);
    } else {
      // Fallback to storage if Redux doesn't have it yet
      const stored = getLoggedinUser();
      if (stored) {
        setUserProfile(stored);
        setLoading(false);
      } else {
        setUserProfile(null);
        setLoading(true);
      }
    }
  }, [reduxUser]);

  // Listen to storage changes (for cross-tab sync and immediate updates)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authUser" || e.key === null) {
        const stored = getLoggedinUser();
        if (stored) {
          setUserProfile(stored);
          setLoading(false);
        } else {
          setUserProfile(null);
          setLoading(true);
        }
      }
    };

    // Custom event for same-tab storage updates
    const handleCustomStorageChange = () => {
      const stored = getLoggedinUser();
      const currentToken = userProfile?.token || userProfile?.jwt;
      const storedToken = stored?.token || stored?.jwt;
      
      // Only update if token changed
      if (currentToken !== storedToken) {
        if (stored) {
          setUserProfile(stored);
          setLoading(false);
        } else {
          setUserProfile(null);
          setLoading(true);
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
      const currentToken = userProfile?.token || userProfile?.jwt;
      const storedToken = stored?.token || stored?.jwt;
      
      // Only update if token changed
      if (currentToken !== storedToken) {
        if (stored) {
          setUserProfile(stored);
          setLoading(false);
        } else {
          setUserProfile(null);
          setLoading(true);
        }
      }
    }, 500); // Check every 500ms - reasonable balance between responsiveness and performance

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStorageUpdate", handleCustomStorageChange);
      clearInterval(interval);
    };
  }, [userProfile?.token, userProfile?.jwt]);

  const token = userProfile?.token || userProfile?.jwt || null;

  return { userProfile, loading, token };
};

export { useProfile };
