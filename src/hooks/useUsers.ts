import { useQuery, UseQueryResult } from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import { UserPublicProfile } from "../types/user";

interface GetUsersParams {
  page?: number;
  limit?: number;
}
export const useGetUsers = (
  params: GetUsersParams = {}
): UseQueryResult<UserPublicProfile[], Error> => {
  const { page = 1, limit = 10 } = params;
  return useQuery<UserPublicProfile[], Error>({
    queryKey: ["users", { page, limit }],
    queryFn: async () => {
      const response = await apiClient.get("/users", {
        params: { page, limit },
      });
      return response.data;
    },
  });
};

export const useGetUserById = (
  userId: string | null
): UseQueryResult<UserPublicProfile, Error> => {
  return useQuery<UserPublicProfile, Error>({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};
