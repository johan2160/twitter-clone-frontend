import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import { toast } from "sonner";
import { UserPublicProfile } from "../types/user";
import { AxiosError } from "axios";
import { ErrorResponseData } from "../types/error";
import { FollowStatusResponse } from "@/types/follow";

export const useFollowUser = (): UseMutationResult<
  { message: string },
  AxiosError<ErrorResponseData>,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    AxiosError<ErrorResponseData>,
    string
  >({
    mutationFn: async (targetUserId) => {
      const response = await apiClient.post(
        `/follow/users/${targetUserId}/follow`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data, targetUserId) => {
      toast.success(
        data.message || `Successfully followed user ${targetUserId}`
      );
      queryClient.invalidateQueries({
        queryKey: ["followStatus", targetUserId],
      });
      queryClient.invalidateQueries({ queryKey: ["user", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["followers", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error, targetUserId) => {
      const errorMsg =
        error.response?.data?.message || error.message || "An error occurred";
      if (error.response?.status === 409) {
        toast.error(`Failed to follow: ${errorMsg} (Maybe already following?)`);
      } else if (error.response?.status === 400) {
        toast.error(`Failed to follow: ${errorMsg}`);
      } else {
        toast.error(`Failed to follow user ${targetUserId}: ${errorMsg}`);
      }
      console.error(
        `Error following user ${targetUserId}:`,
        error.response?.data || error
      );
    },
  });
};

export const useUnfollowUser = (): UseMutationResult<
  void,
  AxiosError<ErrorResponseData>,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponseData>, string>({
    mutationFn: async (targetUserId) => {
      await apiClient.delete(`/follow/users/${targetUserId}/follow`, {
        withCredentials: true,
      });
    },
    onSuccess: (_, targetUserId) => {
      toast.success(`Successfully unfollowed user ${targetUserId}`);
      queryClient.invalidateQueries({
        queryKey: ["followStatus", targetUserId],
      });
      queryClient.invalidateQueries({ queryKey: ["user", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["followers", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error, targetUserId) => {
      const errorMsg =
        error.response?.data?.message || error.message || "An error occurred";
      if (error.response?.status === 400) {
        toast.error(`Failed to unfollow: ${errorMsg} (Maybe not following?)`);
      } else {
        toast.error(`Failed to unfollow user ${targetUserId}: ${errorMsg}`);
      }
      console.error(
        `Error unfollowing user ${targetUserId}:`,
        error.response?.data || error
      );
    },
  });
};

interface GetFollowsParams {
  userId: string | null;
  page?: number;
  limit?: number;
}

export const useGetFollowers = (
  params: GetFollowsParams
): UseQueryResult<UserPublicProfile[], AxiosError<ErrorResponseData>> => {
  const { userId, page = 1, limit = 15 } = params;
  return useQuery<UserPublicProfile[], AxiosError<ErrorResponseData>>({
    queryKey: ["followers", userId, { page, limit }],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required for useGetFollowers");
      const response = await apiClient.get(
        `/follow/users/${userId}/followers`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useGetFollowing = (
  params: GetFollowsParams
): UseQueryResult<UserPublicProfile[], AxiosError<ErrorResponseData>> => {
  const { userId, page = 1, limit = 15 } = params;
  return useQuery<UserPublicProfile[], AxiosError<ErrorResponseData>>({
    queryKey: ["following", userId, { page, limit }],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required for useGetFollowing");
      const response = await apiClient.get(
        `/follow/users/${userId}/following`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useCheckFollowStatus = (
  targetUserId: string | null
): UseQueryResult<FollowStatusResponse, AxiosError<ErrorResponseData>> => {
  return useQuery<FollowStatusResponse, AxiosError<ErrorResponseData>>({
    queryKey: ["followStatus", targetUserId],
    queryFn: async () => {
      if (!targetUserId)
        throw new Error("Target User ID is required for useCheckFollowStatus");
      const response = await apiClient.get(
        `/follow/users/${targetUserId}/follow-status`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    enabled: !!targetUserId,
  });
};
