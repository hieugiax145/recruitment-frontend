import api from "../../../config/axios";

export const calendarServices = {
  getCalendar: async (params = {}) => {
    const response = await api.get("/communications-service/schedules", {
      params,
    });
    return response.data;
  },

  createSchedule: async (data) => {
    const response = await api.post("/communications-service/schedules", data);
    return response.data;
  },

  updateSchedule: async (id, data) => {
    const response = await api.put(
      `/communications-service/schedules/${id}`,
      data
    );
    return response.data;
  },
};
