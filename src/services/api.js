import axios from "axios";

// ==========================================
// API CONFIGURATION
// ==========================================

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

// Separate Axios instance to avoid
// refresh requests entering the same
// response interceptor recursively.

const refreshClient = axios.create({
  baseURL,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

// ==========================================
// SESSION HELPERS
// ==========================================

const clearStoredSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  localStorage.removeItem("activeRole");
  localStorage.removeItem("user");

  // Notify AuthContext and other listeners
  // that the stored session is no longer valid.
  window.dispatchEvent(new Event("amiout:session-expired"));
};

const isPublicAuthRequest = (url = "") => {
  const path = String(url).split("?")[0];

  return [
    "/auth/login",
    "/auth/register",
    "/auth/verify-otp",
    "/auth/resend-otp",
    "/auth/forgot-password",
    "/auth/verify-reset-otp",
    "/auth/resend-reset-otp",
    "/auth/reset-password",
    "/auth/activation/request-otp",
    "/auth/activation/verify-otp",
    "/auth/activation/resend-otp",
  ].some((endpoint) => path.endsWith(endpoint));
};

// ==========================================
// REFRESH REQUEST MANAGEMENT
// ==========================================

// All concurrent 401 responses share
// one refresh operation.

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh-token")
      .then(({ data }) => {
        const newAccessToken = data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Refresh response did not contain an access token.");
        }

        localStorage.setItem("accessToken", newAccessToken);

        window.dispatchEvent(
          new CustomEvent("amiout:access-token-refreshed", {
            detail: {
              accessToken: newAccessToken,
            },
          }),
        );

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },

  (error) => Promise.reject(error),
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = originalRequest.url || "";

    // ======================================
    // HANDLE NON-401 ERRORS
    // ======================================

    if (status !== 401) {
      return Promise.reject(error);
    }

    // ======================================
    // DO NOT REFRESH PUBLIC AUTH REQUESTS
    // ======================================

    // Wrong login credentials and invalid
    // OTP responses should reach the form
    // without destroying the current session.

    if (isPublicAuthRequest(requestUrl)) {
      return Promise.reject(error);
    }

    // ======================================
    // PREVENT INFINITE RETRIES
    // ======================================

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // ====================================
      // REFRESH ACCESS TOKEN
      // ====================================

      const newAccessToken = await refreshAccessToken();

      originalRequest.headers = originalRequest.headers || {};

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // ====================================
      // RETRY ORIGINAL REQUEST
      // ====================================

      return api(originalRequest);
    } catch (refreshError) {
      clearStoredSession();

      // Avoid a forced page reload.
      // AuthContext / route guards should
      // handle navigation after this event.

      return Promise.reject(refreshError);
    }
  },
);

// ==========================================
// EXPORT
// ==========================================

export default api;
