import api from "../../../config/axios";

export const reqServices = {
  getRequests: async (params = {}) => {
    return api.get("/job-service/recruitment-requests", { params });
  },

  getRequestById: async (id) => {
    return api.get(`/job-service/recruitment-requests/${id}`);
  },

  createRequest: async (data) => {
    return api.post("/job-service/recruitment-requests", data);
  },
  updateRequest: async (id, data) => {
    return api.put(`/job-service/recruitment-requests/${id}`, data);
  },

  deleteRequest: async (id) => {
    return api.delete(`/job-service/recruitment-requests/${id}`);
  },

  approveRequest: async (id, data) => {
    return api.post(`/job-service/recruitment-requests/${id}/approve`, data);
  },

  rejectRequest: async (id, data) => {
    return api.post(`/job-service/recruitment-requests/${id}/reject`, data);
  },
};
