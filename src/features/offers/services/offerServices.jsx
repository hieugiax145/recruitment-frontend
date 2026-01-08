import api from "../../../config/axios";

export const offerServices = {
  getOffers: async (params = {}) => {
    return api.get("/job-service/offers", { params });
  },

  getOfferById: async (id) => {
    return api.get(`/job-service/offers/${id}`);
  },

  createOffer: async (offerData) => {
    return api.post("/job-service/offers", offerData);
  },

  updateOffer: async (id, offerData) => {
    return api.put(`/job-service/offers/${id}`, offerData);
  },

  updateOfferStatus: async (id, status) => {
    return api.patch(`/job-service/offers/${id}/status`, { status });
  },

  submitOffer: async (id) => {
    return api.post(`/job-service/offers/submit/${id}`);
  },

  approveOffer: async (action, id) => {
    return api.post(`/job-service/offers/approve/${id}`, { action });
  },

  rejectOffer: async (data, id) => {
    return api.post(`/job-service/offers/reject/${id}`, data);
  },

  returnOffer: async (data, id) => {
    return api.post(`/job-service/offers/return/${id}`, data);
  },

  cancelOffer: async (data, id) => {
    return api.post(`/job-service/offers/cancel/${id}`, data);
  },

  withdrawOffer: async (data, id) => {
    return api.post(`/job-service/offers/withdraw/${id}`, data);
  },
};
