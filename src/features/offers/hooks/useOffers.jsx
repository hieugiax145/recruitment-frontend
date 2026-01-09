import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { offerServices } from "../services/offerServices";
import { toast } from "react-toastify";

export const offerKeys = {
  all: ["offers"],
  list: (params) => ["offers", "list", params],
  detail: (id) => ["offers", "detail", id],
};

export const useOffers = (params = {}) => {
  return useQuery({
    queryKey: offerKeys.list(params),
    queryFn: async () => {
      const response = await offerServices.getOffers(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useOffer = (id, options = {}) => {
  return useQuery({
    queryKey: offerKeys.detail(id),
    queryFn: async () => {
      const response = await offerServices.getOfferById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useUpdateOfferStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await offerServices.updateOfferStatus(id, status);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể cập nhật offer";
      toast.error(errorMessage);
    },
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerData) => {
      const response = await offerServices.createOffer(offerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể tạo offer";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await offerServices.updateOffer(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(variables.id) });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể cập nhật offer";
      toast.error(errorMessage);
    },
  });
};

export const useApproveOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }) => {
      const response = await offerServices.approveOffer(action, id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể phê duyệt offer";
      toast.error(errorMessage);
    },
  });
};

export const useRejectOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await offerServices.rejectOffer(data, id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(variables.id) });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể từ chối offer";
      toast.error(errorMessage);
    },
  });
};

export const useSubmitOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await offerServices.submitOffer(id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(variables.id) });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể nộp offer";
      toast.error(errorMessage);
    },
  });
};

export const useReturnOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await offerServices.returnOffer(data, id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(variables.id) });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể trả về offer";
      toast.error(errorMessage);
    },
  });
};

export const useCancelOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await offerServices.cancelOffer(data, id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(variables.id) });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể hủy offer";
      toast.error(errorMessage);
    },
  });
};

export const useWithdrawOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await offerServices.withdrawOffer(data, id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(variables.id) });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể thu hồi offer";
      toast.error(errorMessage);
    },
  });
};
