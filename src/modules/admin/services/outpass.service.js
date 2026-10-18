import api from "../../../services/api";

// ============================================================
// ADMIN OUTPASS LIST
// ============================================================

export const getOutpasses = async (params = {}) => {
  const response = await api.get("/admin/outpasses", { params });

  return response.data;
};

// ============================================================
// FULL OUTPASS DETAILS
// ============================================================

export const getOutpassDetails = async (id) => {
  const response = await api.get(`/admin/outpasses/${encodeURIComponent(id)}`);

  return response.data;
};

// ============================================================
// ADMIN DASHBOARD STATS
// ============================================================

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};

// ============================================================
// DOWNLOAD OUTPASS EXCEL REPORT
// ============================================================

export const downloadOutpassExcel = async (params = {}) => {
  const response = await api.get("/admin/outpasses/export/excel", {
    params,
    responseType: "blob",
  });

  const contentType = response.headers?.["content-type"] || "";

  if (contentType.includes("application/json")) {
    const errorText = await response.data.text();

    let message = "Excel export failed.";

    try {
      message = JSON.parse(errorText)?.message || message;
    } catch {
      // Keep the generic message.
    }

    throw new Error(message);
  }

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  link.href = url;
  link.download = `AMIOUT_Outpass_Report_${timestamp}.xlsx`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};
