"use client";

import api from "../../../services/api";

export const registerAdmin = async (payload) => {
  const { data } = await api.post("/auth/admin/register", payload);

  return data;
};

export const verifyAdminOtp = async (payload) => {
  const { data } = await api.post("/auth/admin/verify-otp", payload);

  return data;
};

export const resendAdminOtp = async (email) => {
  const { data } = await api.post("/auth/admin/resend-otp", {
    email,
  });

  return data;
};

export const loginAdmin = async (payload) => {
  const { data } = await api.post("/auth/admin/login", payload);

  return data;
};

export const getAdminProfile = async () => {
  const { data } = await api.get("/auth/admin/me");

  return data;
};

export const updateAdminProfile = async (payload) => {
  const { data } = await api.put("/auth/admin/profile", payload);

  return data;
};
