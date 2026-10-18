import api from "../../../services/api";

// ============================================================
// COMMON EXCEL / PDF UPLOAD HELPER
// ============================================================

const uploadFile = async (endpoint, file) => {
  if (!file) {
    throw new Error("Please select a file.");
  }

  const formData = new FormData();

  formData.append("file", file);

  // Let Axios/browser set the multipart boundary.

  const response = await api.post(endpoint, formData);

  return response.data;
};

// ============================================================
// STUDENT EXCEL IMPORT
// ============================================================

export const importStudents = async (file) => {
  return uploadFile("/admin/import/students", file);
};

// ============================================================
// FACULTY EXCEL IMPORT
// ============================================================

// Supports:
// MENTOR
// COORDINATOR
// HOD
// HOI
//
// Uses the Admin import controller that was updated
// for role-based validation.
//
// Backend route:
// POST /admin/import/mentors

export const importMentors = async (file) => {
  if (!(file instanceof File)) {
    throw new Error("Please select a valid Faculty Excel file.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!["xlsx", "xls"].includes(extension)) {
    throw new Error("Faculty import supports Excel files only.");
  }

  return uploadFile("/admin/import/mentors", file);
};

// ============================================================
// STUDENT PDF IMPORT
// ============================================================

export const importStudentsPDF = async (file) => {
  return uploadFile("/admin/import/students/pdf", file);
};

// ============================================================
// GROUP EXCEL IMPORT
// ============================================================

export const importGroups = async (file) => {
  return uploadFile("/admin/import/groups", file);
};

// ============================================================
// IMPORT HISTORY
// ============================================================

export const getImportHistory = async () => {
  const response = await api.get("/admin/import/history");

  return response.data;
};

// ============================================================
// IMPORT HISTORY BY ID
// ============================================================

export const getImportHistoryById = async (id) => {
  if (!id) {
    throw new Error("Import history ID is required.");
  }

  const response = await api.get(
    `/admin/import/history/${encodeURIComponent(id)}`,
  );

  return response.data;
};

// ============================================================
// DOWNLOAD STUDENT TEMPLATE
// ============================================================

export const downloadStudentTemplate = async () => {
  return api.get("/admin/import/templates/student", {
    responseType: "blob",
  });
};

// ============================================================
// DOWNLOAD FACULTY TEMPLATE
// ============================================================

// Keep original export name for compatibility.

export const downloadMentorTemplate = async () => {
  return api.get("/admin/import/templates/mentor", {
    responseType: "blob",
  });
};

// ============================================================
// DOWNLOAD GROUP TEMPLATE
// ============================================================

export const downloadGroupTemplate = async () => {
  return api.get("/admin/import/templates/group", {
    responseType: "blob",
  });
};
