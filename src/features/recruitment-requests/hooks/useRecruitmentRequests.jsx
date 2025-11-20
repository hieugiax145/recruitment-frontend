import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reqServices } from "../services/reqServices";
import { toast } from "react-toastify";

export const recruitmentRequestKeys = {
  all: ["recruitment-requests"],
  list: (params) => ["recruitment-requests", "list", params],
};

export const useRecruitmentRequests = (params = {}) => {
  return useQuery({
    queryKey: recruitmentRequestKeys.list(params),
    queryFn: async () => {
      const response = await reqServices.getRequests(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecruitmentRequest = (id) => {
  return useQuery({
    queryKey: [...recruitmentRequestKeys.all, id],
    queryFn: async () => {
      const response = await reqServices.getRequestById(id);
      return response.data?.data || response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRecruitmentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await reqServices.createRequest(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentRequestKeys.all });
      toast.success("Recruitment request created successfully");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create request";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateRecruitmentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await reqServices.updateRequest(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentRequestKeys.all });
      toast.success("Recruitment request updated successfully");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update request";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteRecruitmentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await reqServices.deleteRequest(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentRequestKeys.all });
      toast.success("Recruitment request deleted successfully");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete request";
      toast.error(errorMessage);
    },
  });
};

export const useApproveRecruitmentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await reqServices.approveRequest(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentRequestKeys.all });
      toast.success("Yêu cầu đã được phê duyệt thành công");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể phê duyệt yêu cầu";
      toast.error(errorMessage);
    },
  });
};

export const useRejectRecruitmentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await reqServices.rejectRequest(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentRequestKeys.all });
      toast.success("Yêu cầu đã bị từ chối");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể từ chối yêu cầu";
      toast.error(errorMessage);
    },
  });
};

export const useSubmitRecruitmentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await reqServices.submitRequest(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentRequestKeys.all });
      toast.success("Yêu cầu đã được nộp thành công");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể nộp yêu cầu";
      toast.error(errorMessage);
    },
  });
};

export const useReturnRecruitmentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await reqServices.returnRequest(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentRequestKeys.all });
      toast.success("Yêu cầu đã được trả về");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể trả về yêu cầu";
      toast.error(errorMessage);
    },
  });
};

export const useCancelRecruitmentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await reqServices.cancelRequest(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentRequestKeys.all });
      toast.success("Yêu cầu đã được hủy");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể hủy yêu cầu";
      toast.error(errorMessage);
    },
  });
};

export const useWithdrawRecruitmentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await reqServices.withdrawRequest(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentRequestKeys.all });
      toast.success("Yêu cầu đã được thu hồi");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể thu hồi yêu cầu";
      toast.error(errorMessage);
    },
  });
};

