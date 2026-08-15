import api from "../../../services/api";

// ============================================================================
// Get Notifications
// ============================================================================

export const getNotifications = async (page = 1, limit = 10) => {
  const { data } = await api.get("/notifications", {
    params: {
      page,
      limit,
    },
  });

  return data;
};

// ============================================================================
// Unread Count
// ============================================================================

export const getUnreadCount = async () => {
  const { data } = await api.get("/notifications/unread-count");

  return data;
};

// ============================================================================
// Mark As Read
// ============================================================================

export const markAsRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/read`);

  return data;
};

// ============================================================================
// Mark All As Read
// ============================================================================

export const markAllAsRead = async () => {
  const { data } = await api.patch("/notifications/mark-all-read");

  return data;
};

// ============================================================================
// Delete Notification
// ============================================================================

export const deleteNotification = async (id) => {
  const { data } = await api.delete(`/notifications/${id}`);

  return data;
};

// ============================================================================
// Clear All Notifications
// ============================================================================

export const clearNotifications = async () => {
  const { data } = await api.delete("/notifications");

  return data;
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
};
