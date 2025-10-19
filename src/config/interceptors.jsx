import api from "./axios";

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      response.success = true;
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
