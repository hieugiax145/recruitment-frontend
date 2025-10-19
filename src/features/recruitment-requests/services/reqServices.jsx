import api from "../../../config/axios";

export const reqServices = {
    getRequests: async () => {
        return api.get("/api/v1/recruitment-requests");
    },

    getRequestsByDepartment: async (departmentId) => {
        return api.get(`/api/v1/recruitment-requests/department/${departmentId}`);
    },

    createRequest: async (data) => {
        return api.post("/api/v1/recruitment-requests", data);
    },  
    updateRequest: async (id, data) => {
        return api.put(`/api/v1/recruitment-requests/${id}`, data);
    },

    deleteRequest: async (id) => {
        return api.delete(`/api/v1/recruitment-requests/${id}`);
    }
};