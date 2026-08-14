import api from "../../../services/api";

// ============================================================================
// Apply Outpass
// ============================================================================

export const applyOutpass = async (payload) => {
  const response = await api.post("/outpass/apply", payload);

  return response.data;
};

// ============================================================================
// Get Active Outpass
// ============================================================================

export const getActiveOutpass = async () => {
  const response = await api.get("/outpass/active");

  return response.data;
};

// ============================================================================
// Get History
// ============================================================================

export const getOutpassHistory = async (page = 1, limit = 10) => {
  const response = await api.get(
    `/outpass/history?page=${page}&limit=${limit}`,
  );

  return response.data;
};

// ============================================================================
// Get Outpass Details
// ============================================================================

export const getOutpassDetails = async (outpassId) => {
  const response = await api.get(`/outpass/${outpassId}`);

  return response.data;
};

// ============================================================================
// Cancel Outpass
// ============================================================================

export const cancelOutpass = async (outpassId) => {
  const response = await api.patch(`/outpass/${outpassId}/cancel`);

  return response.data;
};

// ============================================================================
// Verify Exit
// ============================================================================

export const verifyExit = async (outpassId) => {
  const response = await api.patch(
    `/outpass/security/${outpassId}/verify-exit`,
  );

  return response.data;
};
// ============================================================================
// Export
// ============================================================================

export default {
  applyOutpass,
  getActiveOutpass,
  getOutpassHistory,
  getOutpassDetails,
  cancelOutpass,
  verifyExit,
};
