// ==========================================================
// AMIOUT Enterprise Edition
// Common Authentication Service
// ==========================================================

import api from "../../../services/api";

// ==========================================================
// HELPERS
// ==========================================================

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const getResponseData = (response) => response.data;

// ==========================================================
// FIRST-TIME ACCOUNT ACTIVATION
// ==========================================================

// These endpoints are planned for the
// common activation flow.
//
// Backend implementation must be verified
// before using them in the frontend.

export const requestActivationOTP = async (email) => {
  const response = await api.post("/auth/activation/request-otp", {
    email: normalizeEmail(email),
  });

  return getResponseData(response);
};

export const activateAccount = async ({ email, otp }) => {
  const response = await api.post("/auth/activation/verify-otp", {
    email: normalizeEmail(email),
    otp: String(otp || "").trim(),
  });

  return getResponseData(response);
};

export const resendActivationOTP = async (email) => {
  const response = await api.post("/auth/activation/resend-otp", {
    email: normalizeEmail(email),
  });

  return getResponseData(response);
};

// ==========================================================
// COMMON LOGIN
// ==========================================================

// One login endpoint for all eight roles.
//
// AuthContext is responsible for storing
// the authenticated session.

export const login = async ({ email, password }) => {
  const response = await api.post("/auth/login", {
    email: normalizeEmail(email),
    password,
  });

  return getResponseData(response);
};

// ==========================================================
// EXISTING EMAIL VERIFICATION OTP
// ==========================================================

export const verifyOTP = async (data) => {
  const response = await api.post("/auth/verify-otp", data);

  return getResponseData(response);
};

export const resendOTP = async (email) => {
  const response = await api.post("/auth/resend-otp", {
    email: normalizeEmail(email),
  });

  return getResponseData(response);
};

// ==========================================================
// FORGOT PASSWORD
// ==========================================================

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email: normalizeEmail(email),
  });

  return getResponseData(response);
};

export const verifyResetOTP = async (data) => {
  const response = await api.post("/auth/verify-reset-otp", data);

  return getResponseData(response);
};

export const resendResetOTP = async (email) => {
  const response = await api.post("/auth/resend-reset-otp", {
    email: normalizeEmail(email),
  });

  return getResponseData(response);
};

export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);

  return getResponseData(response);
};

// ==========================================================
// CHANGE PASSWORD
// ==========================================================

// Used for:
// 1. Mandatory first-login password change
// 2. Normal authenticated password change
// 3. SUPER_ADMIN changing own password
//
// Backend revokes refresh sessions after
// a successful password change.
//
// Frontend must clear its access token
// and redirect to login on success.

// ==========================================================
// CHANGE PASSWORD
// ==========================================================

export const changePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  const response = await api.put("/auth/change-password", {
    oldPassword,
    newPassword,
    confirmPassword,
  });

  return getResponseData(response);
};

// ==========================================================
// REFRESH TOKEN
// ==========================================================

// Refresh token is expected to be stored
// in an HttpOnly cookie.
//
// Axios must send credentials for
// cross-origin cookie authentication.

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh-token");

  return getResponseData(response);
};

// ==========================================================
// LOGOUT
// ==========================================================

// Call the backend to revoke the
// refresh-token session.
//
// Local state is cleared separately
// by AuthContext.

export const logout = async () => {
  const response = await api.post("/auth/logout");

  return getResponseData(response);
};

// ==========================================================
// PROFILE
// ==========================================================

export const getProfile = async () => {
  const response = await api.get("/auth/me");

  return getResponseData(response);
};

export const updateProfile = async (data) => {
  const response = await api.put("/auth/profile", data);

  return getResponseData(response);
};
