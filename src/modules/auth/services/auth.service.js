// ==========================================================
// AMIOUT Enterprise Edition
// auth.service.js
// ==========================================================

import api from "../../../services/api";

// ==========================================================
// REGISTER
// ==========================================================

export const register = async (data) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

// ==========================================================
// LOGIN
// ==========================================================

export const login = async (data) => {
  const response = await api.post("/auth/login", data);

  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);
  }

  return response.data;
};

// ==========================================================
// VERIFY OTP
// ==========================================================

export const verifyOTP = async (data) => {
  const response = await api.post("/auth/verify-otp", data);

  return response.data;
};
// ==========================================================
// VERIFY RESET OTP
// ==========================================================

export const verifyResetOTP = async (data) => {
  const response = await api.post("/auth/verify-reset-otp", data);

  return response.data;
};
// ==========================================================
// RESEND OTP
// ==========================================================

export const resendOTP = async (email) => {
  const response = await api.post("/auth/resend-otp", {
    email,
  });

  return response.data;
};

// ==========================================================
// RESEND RESET OTP
// ==========================================================

export const resendResetOTP = async (email) => {
  const response = await api.post("/auth/resend-reset-otp", {
    email,
  });

  return response.data;
};
// ==========================================================
// FORGOT PASSWORD
// ==========================================================

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

// ==========================================================
// RESET PASSWORD
// ==========================================================

export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);

  return response.data;
};

// ==========================================================
// LOGOUT
// ==========================================================

export const logout = async () => {
  await api.post("/auth/logout");

  localStorage.removeItem("accessToken");
};

// ==========================================================
// GET PROFILE
// ==========================================================

export const getProfile = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// ==========================================================
// UPDATE PROFILE
// ==========================================================

export const updateProfile = async (data) => {
  const response = await api.put("/auth/profile", data);

  return response.data;
};
