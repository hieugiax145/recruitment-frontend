import api from "../../../config/axios";

export const candidateServices = {
  getCandidates: async (params = {}) => {
    return api.get("/candidate-service/candidates", { params });
  },

  getCandidateById: async (id) => {
    return api.get(`/candidate-service/candidates/${id}`);
  },

  newCandidate: async (data) => {
    return api.post("/candidate-service/candidates", data);
  },

  updateCandidateStatus: async (id, status) => {
    return api.put(`/candidate-service/candidates/status/${id}?status=${status}`);
  },

  deleteCandidate: async (id) => {
    return api.delete(`/candidate-service/candidates/${id}`);
  },

  commentCandidate: async (data) => {
    return api.post(`/candidate-service/comments`, data);
  },

  getCandidateComments: async (candidateId) => {
    return api.get(`/candidate-service/comments`, { params: { candidateId } });
  },

  changeStageCandidate: async (id, stage) => {
    return api.put(`/candidate-service/candidates/status/${id}?status=${stage}`);
  },

  evaluateCandidate: async (data) => {
    return api.post("/candidate-service/reviews", data);
  },

  getCandidateReviews: async (candidateId) => {
    return api.get(`/candidate-service/candidates/${candidateId}/reviews`);
  },

  convertToEmployee: async (candidateId) => {
    return api.post(`/candidate-service/candidates/convert/${candidateId}`);
  },

  getInterviewedCandidates: async (params = {}) => {
    return api.get("/candidate-service/candidates/interviewed", { params });
  },
};
