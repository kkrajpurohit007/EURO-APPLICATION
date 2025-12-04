/**
 * Authentication utility functions
 */

import { getLoggedinUser, isAuthTokenValid } from "./api_helper";

/**
 * Checks if the user is authenticated
 * @returns boolean indicating if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  try {
    // First check if we have a user and token
    const user = getLoggedinUser();
    if (!user || !user.token) {
      return false;
    }
    
    // Then validate the token
    return isAuthTokenValid();
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};

/**
 * Gets the current user data
 * @returns User data or null if not authenticated
 */
export const getCurrentUser = (): any => {
  try {
    const user = getLoggedinUser();
    if (!user) {
      return null;
    }
    
    // Validate token before returning user data
    if (isAuthTokenValid()) {
      return user;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Checks if the user has a specific role
 * @param role - The role to check for
 * @returns boolean indicating if the user has the specified role
 */
export const hasRole = (role: string): boolean => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return false;
    }
    
    return user.roleName === role;
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};

/**
 * Checks if the user belongs to a specific group
 * @param group - The group to check for
 * @returns boolean indicating if the user belongs to the specified group
 */
export const hasGroup = (group: string): boolean => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return false;
    }
    
    return user.userGroup === group;
  } catch (error) {
    console.error("Error checking user group:", error);
    return false;
  }
};