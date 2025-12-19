import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeServices } from "../services/employeeServices";
import { toast } from "react-toastify";

export const employeeKeys = {
  all: ["employees"],
  list: (params) => ["employees", "list", params],
  detail: (id) => ["employees", "detail", id],
};

export const useEmployees = (params = {}, options = {}) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: async () => {
      const res = await employeeServices.getEmployees(params);
      return res.data;
    },
    enabled: options.enabled !== undefined ? options.enabled : true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useEmployee = (id, options = {}) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      const res = await employeeServices.getEmployee(id);
      return res.data;
    },
    enabled: !!id && (options.enabled !== undefined ? options.enabled : true),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await employeeServices.createEmployee(data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: employeeKeys.all });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Có lỗi khi thêm nhân sự";
      toast.error(msg);
    },
  });
};

export const useUpdateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await employeeServices.updateEmployee(id, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: employeeKeys.all });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Có lỗi khi cập nhật";
      toast.error(msg);
    },
  });
};

export const useDeleteEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await employeeServices.deleteEmployee(id);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: employeeKeys.all });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Có lỗi khi xóa";
      toast.error(msg);
    },
  });
};
