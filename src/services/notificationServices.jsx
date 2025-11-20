import api from "../config/axios";

export const notificationServices = {
  getNotifications: async (params = {}) => {
    return await api.get("/communications-service/notifications", { params });
  },

  getNotification: async (id) => {
    return await api.get(`/communications-service/notifications/${id}`);
  },

  markAsRead: async (id) => {
    return await api.put(`/communications-service/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return await api.put("/communications-service/notifications/read-all");
  },

  deleteNotification: async (id) => {
    return await api.delete(`/communications-service/notifications/${id}`);
  },
};