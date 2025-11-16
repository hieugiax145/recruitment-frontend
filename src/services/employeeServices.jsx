import api from "../config/axios";

const base = "/user-service/employees";

export const employeeServices = {
  getEmployees: (params = {}) => api.get(base, { params }),
  getEmployee: (id) => api.get(`${base}/${id}`),
  createEmployee: (data) => {
    if (data instanceof FormData) {
      return api.post(base, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post(base, data);
  },
  updateEmployee: (id, data) => api.put(`${base}/${id}`, data),
  deleteEmployee: (id) => api.delete(`${base}/${id}`),
};
