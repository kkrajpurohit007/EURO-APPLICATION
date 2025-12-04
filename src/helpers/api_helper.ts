import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import config from "../config";

const { api } = config;

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// Initialize token from storage
const getAuthToken = () => {
  const authUser = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (authUser) {
    try {
      const user = JSON.parse(authUser);
      return user.token || user.jwt || null;
    } catch (e) {
      return null;
    }
  }
  return null;
};

const token = getAuthToken();
if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

// Request interceptor to attach token dynamically
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    // Handle 204 No Content responses
    if (response.status === 204) {
      // Return a default structure for 204 responses to prevent breaking the app
      return {
        items: [],
        pageNumber: 1,
        pageSize: 50,
        totalCount: 0,
        totalPages: 0
      };
    }
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.response?.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        // Clear auth and redirect to login
        sessionStorage.removeItem("authUser");
        localStorage.removeItem("authUser");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: any) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */
   
  // Add timeout to all GET requests
  get = (url: any, params: any) => {
    let response;

    let paramKeys: any = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(`${url}?${queryString}`, { 
        ...params,
        timeout: 10000 // 10 second timeout
      });
    } else {
      response = axios.get(`${url}`, { 
        timeout: 10000 // 10 second timeout
      });
    }

    return response;
  };
  
  /**
   * post given data to url
   */
  create = (url: any, data: any) => {
    return axios.post(url, data, {
      timeout: 10000 // 10 second timeout
    });
  };
  
  /**
   * Updates data
   */
  update = (url: any, data: any) => {
    return axios.patch(url, data, {
      timeout: 10000 // 10 second timeout
    });
  };

  put = (url: any, data: any) => {
    return axios.put(url, data, {
      timeout: 10000 // 10 second timeout
    });
  };
  
  /**
   * Delete
   */
  delete = (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    return axios.delete(url, { 
      ...config,
      timeout: 10000 // 10 second timeout
    });
  };
}

const getLoggedinUser = () => {
  const user =
    localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

/**
 * Validates if the current auth token is still valid
 * @returns boolean indicating if the token is valid
 */
export const isAuthTokenValid = (): boolean => {
  try {
    const user = getLoggedinUser();
    
    // If no user data, token is not valid
    if (!user) {
      return false;
    }
    
    // If no token, not valid
    if (!user.token) {
      return false;
    }
    
    // Check if token has expired
    if (user.expiresAt) {
      const expiryTime = new Date(user.expiresAt).getTime();
      const currentTime = new Date().getTime();
      
      // If token has expired, return false
      if (currentTime >= expiryTime) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error validating auth token:", error);
    return false;
  }
};

export { APIClient, setAuthorization, getLoggedinUser };