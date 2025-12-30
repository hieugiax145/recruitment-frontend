import api from "../../../config/axios";

export const candidateServices = {
  getCandidates: async (params = {}) => {
    return api.get("/candidate-service/candidates", { params });
  },

  getCandidateById: async (id) => {
    return api.get(`/candidate-service/candidates/${id}`);
  },

  newCandidate: async (data) => {
    const formData = new FormData();

    // Append all fields to FormData
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    return api.post("/candidate-service/public/upload-cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateCandidateStatus: async (id, status) => {
    return api.patch(`/candidate-service/candidates/${id}/status`, {
      status,
    });
  },

  deleteCandidate: async (id) => {
    return api.delete(`/candidate-service/candidates/${id}`);
  },

  commentCandidate: async (id, data) => {
    return api.post(`/candidate-service/comments`, data);
  },

  changeStageCandidate: async (id, stage) => {
    return api.put(`/candidate-service/candidates/status/${id}?status=${stage}`);
  },
};
