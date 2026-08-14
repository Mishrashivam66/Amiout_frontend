import api from "../../../services/api";

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markAsRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await api.patch("/notifications/mark-all-read");
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await api.delete(`/notifications/${id}`);
  return data;
};
