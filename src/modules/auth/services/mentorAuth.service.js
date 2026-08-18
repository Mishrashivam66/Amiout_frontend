import api from "../../../services/api";

// ==========================================
// MENTOR REGISTER
// ==========================================

export const registerMentor = async (data) => {
  const response = await api.post("/auth/mentor/register", data);
  return response.data;
};

// ==========================================
// VERIFY OTP
// ==========================================

export const verifyMentorOtp = async (data) => {
  const response = await api.post("/auth/mentor/verify-otp", data);
  return response.data;
};

// ==========================================
// RESEND OTP
// ==========================================

export const resendMentorOtp = async (email) => {
  const response = await api.post("/auth/mentor/resend-otp", {
    email,
  });

  return response.data;
};

// ==========================================
// MENTOR LOGIN
// ==========================================

export const loginMentor = async (data) => {
  const response = await api.post("/auth/mentor/login", data);
  return response.data;
};

// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotMentorPassword = async (email) => {
  const response = await api.post("/auth/mentor/forgot-password", {
    email,
  });

  return response.data;
};

// ==========================================
// VERIFY RESET OTP
// ==========================================

export const verifyMentorResetOtp = async (data) => {
  const response = await api.post("/auth/mentor/verify-reset-otp", data);

  return response.data;
};

// ==========================================
// RESEND RESET OTP
// ==========================================

export const resendMentorResetOtp = async (email) => {
  const response = await api.post("/auth/mentor/resend-reset-otp", {
    email,
  });

  return response.data;
};

// ==========================================
// RESET PASSWORD
// ==========================================

export const resetMentorPassword = async (data) => {
  const response = await api.post("/auth/mentor/reset-password", data);

  return response.data;
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const mentorChangePassword = async (data) => {
  const response = await api.put("/auth/mentor/change-password", data);

  return response.data;
};

// ==========================================
// REFRESH TOKEN
// ==========================================

export const mentorRefreshToken = async () => {
  const response = await api.post("/auth/mentor/refresh-token");

  return response.data;
};

// ==========================================
// LOGOUT
// ==========================================

export const mentorLogout = async () => {
  const response = await api.post("/auth/mentor/logout");

  return response.data;
};
