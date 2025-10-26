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
};
