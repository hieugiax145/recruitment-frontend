import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationServices } from "../../../services/notificationServices";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await notificationServices.getNotifications();
      return res.data?.data?.result || [];
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationServices.markAllAsRead(),
    onSuccess: () => {
      // Update the cache to mark all notifications as read
      queryClient.setQueryData(["notifications"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(notification => ({
          ...notification,
          read: true,
          readAt: new Date().toISOString()
        }));
      });
    },
  });
};
