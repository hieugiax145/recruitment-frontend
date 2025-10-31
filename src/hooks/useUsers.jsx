import { useQuery } from "@tanstack/react-query";
import { userServices } from "../services/userServices";

export const userKeys = {
  all: ["users"],
  list: (params) => ["users", "list", params],
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
