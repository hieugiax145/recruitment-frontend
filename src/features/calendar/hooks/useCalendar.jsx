import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { calendarServices } from "../services/calendarServices";
import { toast } from "react-toastify";

export const calendarKeys = {
  all: ["calendar"],
  list: (params) => ["calendar", "list", params],
};

export const useCalendar = (params = {}) => {
  return useQuery({
    queryKey: calendarKeys.list(params),
    queryFn: async () => {
      const data = await calendarServices.getCalendar(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const data = await calendarServices.createSchedule(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      toast.success("Tạo sự kiện thành công!");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Không thể tạo sự kiện";
      toast.error(message);
    },
  });
};
