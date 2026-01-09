import api from "../config/axios";

export const statisticsServices = {
  getSummary: async (period = "WEEKLY", dateRange = null) => {
    const params = {};
    if (dateRange && dateRange.from && dateRange.to) {
      params.startDate = dateRange.from;
      params.endDate = dateRange.to;
    } else {
      params.period = period;
    }
    return api.get("/statistics-service/statistics/summary", { params });
  },

  getUpcomingSchedules: async () => {
    return api.get("/statistics-service/statistics/upcoming-schedules");
  },

  getJobOpenings: async () => {
    return api.get("/statistics-service/statistics/job-openings");
  },
};
