import api from "../../../services/api";

// ============================================================================
// Dashboard
// ============================================================================

export const getDashboard = async () => {
  const response = await api.get("/mentor/dashboard");

  return response.data;
};

// ============================================================================
// Pending Requests
// ============================================================================

export const getPendingRequests = async (page = 1, limit = 10, search = "") => {
  const response = await api.get("/mentor/outpass/pending", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
};

// ============================================================================
// Approved Requests
// ============================================================================

export const getApprovedRequests = async (page = 1, limit = 10) => {
  const response = await api.get("/mentor/outpass/approved", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

// ============================================================================
// Rejected Requests
// ============================================================================

export const getRejectedRequests = async (page = 1, limit = 10) => {
  const response = await api.get("/mentor/outpass/rejected", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

// ============================================================================
// Approve Outpass
// ============================================================================

export const approveOutpass = async (outpassId, remark = "") => {
  const response = await api.patch(`/mentor/outpass/${outpassId}/approve`, {
    remark,
  });

  return response.data;
};

// ============================================================================
// Reject Outpass
// ============================================================================

export const rejectOutpass = async (outpassId, remark = "") => {
  const response = await api.patch(`/mentor/outpass/${outpassId}/reject`, {
    remark,
  });

  return response.data;
};
// ============================================================================
// My Students
// ============================================================================

export const getStudents = async (page = 1, limit = 100, search = "") => {
  const response = await api.get("/mentor/students", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
};

export const getStudentDetails = async (studentId) => {
  const response = await api.get(`/mentor/students/${studentId}`);
  return response.data;
};

export const getHistory = async (page = 1, limit = 20, search = "") => {
  const response = await api.get("/mentor/history", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
};

export const getOutpassDetails = async (outpassId) => {
  const response = await api.get(`/mentor/outpass/${outpassId}`);

  return response.data;
};

// ============================================================================
// Mentor Profile
// ============================================================================

export const getProfile = async () => {
  const response = await api.get("/auth/mentor/me");
  return response.data;
};
export const updateProfile = async (data) => {
  const response = await api.put("/auth/mentor/profile", data);
  return response.data;
};

// ============================================================================
// Notifications
// ============================================================================

export const getNotifications = async (page = 1, limit = 10) => {
  const response = await api.get("/notifications", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);

  return response.data;
};

// ============================================================================
// Recent Requests
// ============================================================================

export const getRecentRequests = async () => {
  const response = await api.get("/mentor/outpass/pending", {
    params: {
      page: 1,
      limit: 5,
    },
  });

  return response.data;
};

export const unlockStudent = async (studentId) => {
  const response = await api.patch(`/mentor/students/${studentId}/unlock`);

  return response.data;
};

export const updateAvailability = async (availabilityStatus) => {
  const response = await api.patch("/mentor/availability", {
    availabilityStatus,
  });

  return response.data;
};
export default {
  getDashboard,
  getPendingRequests,
  getApprovedRequests,
  getRejectedRequests,
  approveOutpass,
  rejectOutpass,
  getStudents,
  getStudentDetails,
  getHistory,
  getOutpassDetails,
  getProfile,
  updateProfile,
  unlockStudent,

  getNotifications,
  markNotificationRead,

  getRecentRequests,

  updateAvailability,
};
