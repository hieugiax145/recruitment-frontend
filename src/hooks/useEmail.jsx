import { useMutation } from "@tanstack/react-query";
import { emailServices } from "../services/emailServices";
import { toast } from "react-toastify";

export const useSendEmail = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await emailServices.sendEmail(data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Gửi email thành công");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Có lỗi khi gửi email";
      toast.error(message);
    },
  });
};
