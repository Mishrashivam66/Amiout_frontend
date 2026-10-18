import api from "../../../services/api";

// ============================================================
// VALIDATE MASTER ID
// ============================================================

const validateMasterId = (id) => {
  const value = String(id ?? "").trim();

  if (!/^[a-fA-F0-9]{24}$/.test(value)) {
    throw new Error("Invalid Master record ID.");
  }

  return value;
};

// ============================================================
// SEND STUDENT CREDENTIALS
// ============================================================

export const sendStudentCredentials = async (masterId) => {
  const id = validateMasterId(masterId);

  const response = await api.post(
    `/admin/users/credentials/students/${id}/send`,
  );

  return response.data;
};

// ============================================================
// SEND FACULTY CREDENTIALS
// ============================================================

export const sendFacultyCredentials = async (masterId) => {
  const id = validateMasterId(masterId);

  const response = await api.post(
    `/admin/users/credentials/faculty/${id}/send`,
  );

  return response.data;
};

// ============================================================
// GET CREDENTIAL DELIVERY HISTORY
// ============================================================

export const getCredentialStatuses = async () => {
  const response = await api.get("/admin/users/credentials/status");

  return response.data;
};

// ============================================================
// GET IMPORTED STUDENTS / FACULTY
// ============================================================

export const getCredentialCandidates = async ({
  type = "STUDENT",
  status = "NOT_SENT",
  search = "",
  page = 1,
  limit = 20,
} = {}) => {
  const response = await api.get("/admin/users/credentials/candidates", {
    params: {
      type,
      status,
      search,
      page,
      limit,
    },
  });

  return response.data;
};
