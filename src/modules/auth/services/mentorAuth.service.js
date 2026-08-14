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
