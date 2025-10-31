import api from "../../../config/axios";

export const candidateServices = {
  getCandidates: async (params = {}) => {
    return api.get("/candidate-service/applications", { params });
  },

  getCandidateById: async (id) => {
    return api.get(`/candidate-service/applications/${id}`);
  },

  newCandidate: async (data) => {
    const formData = new FormData();

    // Append all fields to FormData
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
        console.log(`FormData append: ${key} = ${data[key]}`);
      }
    });

    console.log("Sending FormData to API...");
    return api.post("/candidate-service/public/upload-cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateCandidateStatus: async (id, status) => {
    return api.patch(`/candidate-service/applications/${id}/status`, {
      status,
    });
  },

  deleteCandidate: async (id) => {
    return api.delete(`/candidate-service/applications/${id}`);
  },

  commentCandidate: async (id, data) => {
    return api.post(`/candidate-service/comments`, data);
  },

  changeStageCandidate: async (id, stage) => {
    return api.put(`/candidate-service/applications/status/${id}?status=${stage}`);
  },
};
