import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { candidateServices } from "../services/candidateServices";
import { toast } from "react-toastify";

// Query Keys
export const candidateKeys = {
  all: ["candidates"],
  list: (params) => ["candidates", "list", params],
  detail: (id) => ["candidates", "detail", id],
};

// Custom hook to fetch candidates with optional filters
export const useCandidates = (params = {}) => {
  return useQuery({
    queryKey: candidateKeys.list(params),
    queryFn: async () => {
      const response = await candidateServices.getCandidates(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
  });
};

// Custom hook to fetch a single candidate by id
export const useCandidate = (id, options = {}) => {
  return useQuery({
    queryKey: candidateKeys.detail(id),
    queryFn: async () => {
      const response = await candidateServices.getCandidateById(id);
      return response.data;
    },
    enabled: !!id, // Only run if id exists
    staleTime: 5 * 60 * 1000,
    ...options, // Allow passing additional options
  });
};

// Custom hook to update candidate status
export const useUpdateCandidateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await candidateServices.updateCandidateStatus(
        id,
        status
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.all });
      toast.success("Cập nhật trạng thái thành công");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể cập nhật trạng thái";
      toast.error(errorMessage);
    },
  });
};

// Custom hook to create a new candidate
export const useCreateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      console.log("Creating candidate with data:", data);
      console.log("Data fields:", {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
        jobPositionId: data.jobPositionId,
      });
      const response = await candidateServices.newCandidate(data);
      console.log("Create candidate response:", response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.all });
      toast.success("Thêm ứng viên thành công!");
    },
    onError: (error) => {
      console.error("Error creating candidate:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi thêm ứng viên";
      toast.error(errorMessage);
    },
  });
};

// Custom hook to delete a candidate
export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await candidateServices.deleteCandidate(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.all });
      toast.success("Xóa ứng viên thành công");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Không thể xóa ứng viên";
      toast.error(errorMessage);
    },
  });
};
