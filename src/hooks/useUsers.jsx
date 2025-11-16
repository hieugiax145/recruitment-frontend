import { useQuery } from "@tanstack/react-query";
import { userServices } from "../services/userServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const userKeys = {
  all: ["users"],
  list: (params) => ["users", "list", params],
  detail: (id) => ["users", "detail", id],
};

export const useUsers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await userServices.getUsers(params);
      return response.data;
    },
    enabled: options.enabled !== undefined ? options.enabled : true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUser = (id, options = {}) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await userServices.getUser(id);
      return response.data?.data;
    },
    enabled: !!id && (options.enabled !== undefined ? options.enabled : true),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await userServices.createUser(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("Thêm tài khoản thành công");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Có lỗi khi tạo tài khoản";
      toast.error(message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await userServices.updateUser(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("Cập nhật tài khoản thành công");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Có lỗi khi cập nhật tài khoản";
      toast.error(message);
    },
  });
};
