import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workflowServices } from "../services/workflowServices";
import { toast } from "react-toastify";

export const workflowKeys = {
  all: ["workflows"],
  list: (params) => ["workflows", "list", params],
  detail: (id) => ["workflows", "detail", id],
};

export const useWorkflows = (params = {}, options = {}) => {
  return useQuery({
    queryKey: workflowKeys.list(params),
    queryFn: async () => {
      const response = await workflowServices.getWorkflows(params);
      return response.data;
    },
    enabled: options.enabled !== undefined ? options.enabled : true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useWorkflow = (id, options = {}) => {
  return useQuery({
    queryKey: workflowKeys.detail(id),
    queryFn: async () => {
      const response = await workflowServices.getWorkflow(id);
      return response.data?.data;
    },
    enabled: !!id && (options.enabled !== undefined ? options.enabled : true),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await workflowServices.createWorkflow(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Có lỗi khi tạo luồng phê duyệt";
      toast.error(message);
    },
  });
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await workflowServices.updateWorkflow(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Có lỗi khi cập nhật luồng phê duyệt";
      toast.error(message);
    },
  });
};

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await workflowServices.deleteWorkflow(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Có lỗi khi xóa luồng phê duyệt";
      toast.error(message);
    },
  });
};
