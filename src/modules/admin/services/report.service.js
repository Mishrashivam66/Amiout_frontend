import api from "../../../services/api";

// ============================================================================
// Outpass Summary
// ============================================================================

export const getOutpassSummary = async () => {
  const { data } = await api.get("/admin/reports/outpasses/summary");
  return data;
};

// ============================================================================
// Outpass Status Report
// ============================================================================

export const getOutpassStatusReport = async () => {
  const { data } = await api.get("/admin/reports/outpasses/status");
  return data;
};

// ============================================================================
// Detailed Report
// ============================================================================

export const getOutpassDetailedReport = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
) => {
  const { data } = await api.get("/admin/reports/outpasses", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

  return data;
};

// ============================================================================
// Monthly Report
// ============================================================================

export const getOutpassMonthlyReport = async (year) => {
  const { data } = await api.get("/admin/reports/outpasses/monthly", {
    params: {
      year,
    },
  });

  return data;
};

export default {
  getOutpassSummary,
  getOutpassStatusReport,
  getOutpassDetailedReport,
  getOutpassMonthlyReport,
};
