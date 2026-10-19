import api from "../../../services/api";

const unwrap = (response) => {
  const body = response?.data;

  if (!body || body.success === false || !body.data) {
    throw new Error(body?.message || "Invalid Super Admin API response.");
  }

  return body.data;
};

const superAdminService = {
  // ==========================================================
  // ADMIN MANAGEMENT
  // ==========================================================

  async getAdmins() {
    return unwrap(await api.get("/super-admin/admins"));
  },

  async createAdmin({ name, email, phone }) {
    return unwrap(
      await api.post("/super-admin/admins", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      }),
    );
  },

  async updateAdminStatus(id, isActive) {
    return unwrap(
      await api.patch(`/super-admin/admins/${encodeURIComponent(id)}/status`, {
        isActive,
      }),
    );
  },

  // ==========================================================
  // STUDENT MONITORING
  // ==========================================================

  async getStudents(params = {}) {
    return unwrap(
      await api.get("/super-admin/students", {
        params,
      }),
    );
  },

  async getStudentFilters() {
    return unwrap(await api.get("/super-admin/students/filters"));
  },

  // ==========================================================
  // UNIVERSITY-WIDE OUTPASS MONITORING
  // ==========================================================

  async getOutpasses(params = {}) {
    return unwrap(
      await api.get("/super-admin/outpasses", {
        params,
      }),
    );
  },

  async getOutpassDetails(id) {
    return unwrap(
      await api.get(`/super-admin/outpasses/${encodeURIComponent(id)}`),
    );
  },

  async getOutpassFilters() {
    return unwrap(await api.get("/super-admin/outpasses/filters"));
  },

  // ==========================================================
  // REPORT EXPORTS
  //
  // Same authenticated Axios instance.
  // No access token placed in the download URL.
  // ==========================================================

  async downloadOutpassReport(format, params = {}) {
    if (!["pdf", "xlsx"].includes(format)) {
      throw new Error("Unsupported report format.");
    }

    const response = await api.get("/super-admin/outpasses/export", {
      params: { ...params, format },
      responseType: "blob",
    });

    // Axios may return JSON error as Blob.
    if (response.data?.type?.includes("application/json")) {
      const json = JSON.parse(await response.data.text());

      throw new Error(json.message || "Report download failed.");
    }

    const fileName =
      format === "pdf"
        ? "AMIOUT_Outpass_Audit.pdf"
        : "AMIOUT_Outpass_Audit.xlsx";

    const blobUrl = URL.createObjectURL(response.data);

    try {
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    }

    return fileName;
  },

  // ==========================================================
  // DOWNLOAD FILTERED UNIVERSITY STUDENTS EXCEL
  //
  // Uses the current Student page filters.
  // Downloads ALL matching records, not only current page.
  // ==========================================================

  async downloadStudentsExcel(filters = {}) {
    const response = await api.get("/super-admin/students/export", {
      params: filters,
      responseType: "blob",
    });

    const blob = response.data;

    if (!(blob instanceof Blob)) {
      throw new Error("Invalid Excel download response.");
    }

    // The server might return an error as JSON Blob.
    if (blob.type.includes("application/json")) {
      const body = JSON.parse(await blob.text());

      throw new Error(body?.message || "Student Excel export failed.");
    }

    const filename = "AMIOUT_Filtered_University_Students.xlsx";

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 10000);

    return filename;
  },
};

export default superAdminService;
