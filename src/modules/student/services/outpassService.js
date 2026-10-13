"use strict";

import api from "../../../services/api";

// ============================================================
// APPLY OUTPASS
// POST /outpass/apply
// ============================================================

export const applyOutpass = async (payload) => {
  const response = await api.post("/outpass/apply", {
    reason: String(payload?.reason || "").trim(),
    destination: String(payload?.destination || "").trim(),
    outDate: payload?.outDate,
    outTime: payload?.outTime,
    inTime: payload?.inTime || null,
  });

  return response.data;
};

// ============================================================
// GET ACTIVE OUTPASS
// ============================================================

export const getActiveOutpass = async () => {
  const response = await api.get("/outpass/active");
  return response.data;
};

// ============================================================
// GET HISTORY
// ============================================================

export const getOutpassHistory = async (page = 1, limit = 10) => {
  const response = await api.get("/outpass/history", {
    params: { page, limit },
  });

  return response.data;
};

// ============================================================
// GET OUTPASS DETAILS
// ============================================================

export const getOutpassDetails = async (outpassId) => {
  const response = await api.get(`/outpass/${encodeURIComponent(outpassId)}`);

  return response.data;
};

// ============================================================
// CANCEL OUTPASS
// ============================================================

export const cancelOutpass = async (outpassId) => {
  const response = await api.patch(
    `/outpass/${encodeURIComponent(outpassId)}/cancel`,
  );

  return response.data;
};

// ============================================================
// SECURITY VERIFY EXIT
// Kept for backward compatibility.
// ============================================================

export const verifyExit = async (outpassId) => {
  const response = await api.patch(
    `/outpass/security/${encodeURIComponent(outpassId)}/verify-exit`,
  );

  return response.data;
};

// ============================================================
// EXPORT
// ============================================================

const outpassService = {
  applyOutpass,
  getActiveOutpass,
  getOutpassHistory,
  getOutpassDetails,
  cancelOutpass,
  verifyExit,
};

export default outpassService;
