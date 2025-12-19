import api from "../config/axios";

export const statisticsServices = {
  getSummary: async () => {
    return api.get("/statistics-service/statistics/summary");
  },

  getUpcomingSchedules: async () => {
    return api.get("/statistics-service/statistics/upcoming-schedules");
  },

  getJobOpenings: async () => {
    return api.get("/statistics-service/statistics/job-openings");
  },
};
