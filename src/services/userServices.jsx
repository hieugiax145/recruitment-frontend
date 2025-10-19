import { LogOut } from "lucide-react";
import api from "../config/axios";

export const userServices =  {
  logIn: async (data) => {
    return api.post("/api/v1/auth/login", data);
  },

  logOut: async () => {
    return api.post("/api/v1/auth/logout");
  },

  getCurrentUser: async () => {
    return await api.get("/api/v1/auth/account");
  }
};