import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { calendarServices } from "../services/calendarServices";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (payload) => {
      const data = await calendarServices.createSchedule(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(t("toasts.createEventSuccess"));
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Không thể tạo sự kiện";
      toast.error(message);
    },
  });
};

export const useUpdateScheduleStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const data = await calendarServices.updateScheduleStatus(id, status);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      toast.success(t("toasts.updateStatusSuccess"));
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Không thể cập nhật trạng thái";
      toast.error(message);
    },
  });
};
