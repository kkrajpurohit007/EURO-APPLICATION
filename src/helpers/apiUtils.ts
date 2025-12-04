/**
 * Utility functions for API calls with better error handling
 */

/**
 * Wraps an API call with timeout and error handling
 * @param apiCall - The API call promise
 * @param timeoutMs - Timeout in milliseconds (default: 10000)
 * @param serviceName - Name of the service for logging
 * @returns Promise with result or default value on error/timeout
 */
export const apiCallWithFallback = async <T>(
  apiCall: Promise<T>,
  defaultValue: T,
  timeoutMs: number = 10000,
  serviceName: string = "API"
): Promise<T> => {
  try {
    // Create timeout promise
    const timeoutPromise = new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${serviceName} timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    // Race between API call and timeout
    const result = await Promise.race([apiCall, timeoutPromise]);
    return result;
  } catch (error) {
    console.warn(`${serviceName} call failed:`, error);
    // Return default value to prevent blocking the application
    return defaultValue;
  }
};

/**
 * Checks if a response is a 204 No Content response
 * @param response - The response object
 * @returns boolean indicating if it's a 204 response
 */
export const isNoContentResponse = (response: any): boolean => {
  // Handle various ways a 204 response might be represented
  if (!response) return true;
  if (typeof response === 'object' && Object.keys(response).length === 0) return true;
  return false;
};

/**
 * Checks if a response is a successful but empty response (200 or 204)
 * @param response - The response object
 * @returns boolean indicating if it's an empty success response
 */
export const isEmptySuccessResponse = (response: any): boolean => {
  // Handle 204 No Content
  if (isNoContentResponse(response)) return true;
  
  // Handle 200 OK with empty data
  if (response && typeof response === 'object') {
    // Check if it's a paginated response with no items
    if ('items' in response && Array.isArray(response.items) && response.items.length === 0) {
      return true;
    }
    
    // Check if it's an empty object (but not null)
    if (Object.keys(response).length === 0 && response.constructor === Object) {
      return true;
    }
  }
  
  return false;
};

/**
 * Normalizes API response to ensure consistent structure
 * @param response - The raw API response
 * @param defaultStructure - Default structure to return if response is empty
 * @returns Normalized response
 */
export const normalizeApiResponse = <T>(response: any, defaultStructure: T): T => {
  // If it's an empty success response, return the default structure
  if (isEmptySuccessResponse(response)) {
    return defaultStructure;
  }
  
  // If response has data property, return that
  if (response && typeof response === 'object' && response.data) {
    return response.data;
  }
  
  // Return the response as-is if it's not empty
  return response;
};