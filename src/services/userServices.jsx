import { LogOut } from "lucide-react";
import api from "../config/axios";

export const userServices = {
  logIn: async (data) => {
    return api.post("/user-service/auth/login", data);
  },

  logOut: async () => {
    return api.post("/user-service/auth/logout");
  },

  getCurrentUser: async () => {
    return await api.get("/user-service/auth/account");
  },

  getDepartments: async () => {
    return await api.get("/user-service/departments");
  },

  getUsers: async (params = {}) => {
    return await api.get("/user-service/users", { params });
  },
  createUser: async (data) => {
    if (data instanceof FormData) {
      return await api.post("/user-service/users", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return await api.post("/user-service/users", data);
  },

  getRoles: async (params = {}) => {
    return await api.get("/user-service/roles", { params });
  },
  getRole: async (id) => {
    return await api.get(`/user-service/roles/${id}`);
  },
  createRole: async (data) => {
    return await api.post("/user-service/roles", data);
  },
  updateRole: async (id, data) => {
    return await api.put(`/user-service/roles/${id}`, data);
  },
  updateRolePermissions: async (id, permissionIds) => {
    return await api.put(`/user-service/roles/${id}/permissions`, {
      permissionIds,
    });
  },
  getPermissions: async (params = {}) => {
    return await api.get("/user-service/permissions", { params });
  },
};
