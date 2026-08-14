import api from "../../../services/api";

// ======================================================
// GET ALL OUTPASSES
// ======================================================

export const getOutpasses = async (params = {}) => {
  const response = await api.get("/admin/outpasses", {
    params,
  });

  return response.data;
};

// ======================================================
// GET OUTPASS DETAILS
// ======================================================

export const getOutpassDetails = async (id) => {
  const response = await api.get(`/admin/outpasses/${id}`);

  return response.data;
};

// ======================================================
// DASHBOARD STATS
// ======================================================

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};
