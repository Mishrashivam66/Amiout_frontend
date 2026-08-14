
import api from "../../../services/api";

// ============================================================================
// Upload Students
// ============================================================================

export const importStudents = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/admin/import/students", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ============================================================================
// Upload Mentors
// ============================================================================

export const importMentors = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/admin/import/mentors", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ============================================================================
// Upload Students PDF
// ============================================================================

export const importStudentsPDF = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/admin/import/students/pdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ============================================================================
// Upload Groups
// ============================================================================

export const importGroups = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/admin/import/groups", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ============================================================================
// Import History
// ============================================================================

export const getImportHistory = async () => {
  const response = await api.get("/admin/import/history");

  return response.data;
};

// ============================================================================
// Import History By ID
// ============================================================================

export const getImportHistoryById = async (id) => {
  const response = await api.get(`/admin/import/history/${id}`);

  return response.data;
};

// ============================================================================
// Download Templates
// ============================================================================

export const downloadStudentTemplate = async () => {
  return api.get("/admin/import/templates/student", {
    responseType: "blob",
  });
};

export const downloadMentorTemplate = async () => {
  return api.get("/admin/import/templates/mentor", {
    responseType: "blob",
  });
};

export const downloadGroupTemplate = async () => {
  return api.get("/admin/import/templates/group", {
    responseType: "blob",
  });
};
