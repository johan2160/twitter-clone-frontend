import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import { toast } from "sonner";
import { LikeWithUser, LikeWithTweet } from "../types/like";
import { AxiosError } from "axios";
import { ErrorResponseData } from "../types/error";

export const useLikeTweet = (): UseMutationResult<
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
    mutationFn: async (tweetId) => {
      const response = await apiClient.post(
        `/likes/tweets/${tweetId}/likes`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data, tweetId) => {
      toast.success(data.message || `Tweet (ID: ${tweetId}) liked!`);
      queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
      queryClient.invalidateQueries({ queryKey: ["tweetLikes", tweetId] });
      queryClient.invalidateQueries({ queryKey: ["userLikes"] });
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: (error, tweetId) => {
      const errorMsg =
        error.response?.data?.message || error.message || "An error occurred";

      if (error.response?.status === 409) {
        toast.error(
          `Failed to like: ${errorMsg} (You might have already liked it)`
        );
      } else {
        toast.error(`Failed to like tweet ${tweetId}: ${errorMsg}`);
      }
      console.error(
        `Error liking tweet ${tweetId}:`,
        error.response?.data || error
      );
    },
  });
};

export const useUnlikeTweet = (): UseMutationResult<
  void,
  AxiosError<ErrorResponseData>,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponseData>, string>({
    mutationFn: async (tweetId) => {
      await apiClient.delete(`/likes/tweets/${tweetId}/likes`, {
        withCredentials: true,
      });
    },
    onSuccess: (_, tweetId) => {
      toast.success(`Tweet (ID: ${tweetId}) unliked successfully!`);
      queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
      queryClient.invalidateQueries({ queryKey: ["tweetLikes", tweetId] });
      queryClient.invalidateQueries({ queryKey: ["userLikes"] });
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: (error, tweetId) => {
      const errorMsg =
        error.response?.data?.message || error.message || "An error occurred";

      if (error.response?.status === 400) {
        toast.error(
          `Failed to unlike: ${errorMsg} (You might not have liked it yet)`
        );
      } else {
        toast.error(`Failed to unlike tweet ${tweetId}: ${errorMsg}`);
      }
      console.error(
        `Error unliking tweet ${tweetId}:`,
        error.response?.data || error
      );
    },
  });
};

interface GetTweetLikesParams {
  tweetId: string | null;
  page?: number;
  limit?: number;
}

export const useGetTweetLikes = (
  params: GetTweetLikesParams
): UseQueryResult<LikeWithUser[], AxiosError<ErrorResponseData>> => {
  const { tweetId, page = 1, limit = 10 } = params;
  return useQuery<LikeWithUser[], AxiosError<ErrorResponseData>>({
    queryKey: ["tweetLikes", tweetId, { page, limit }],
    queryFn: async () => {
      if (!tweetId)
        throw new Error("Tweet ID is required for useGetTweetLikes");
      const response = await apiClient.get(`/likes/tweets/${tweetId}/likes`, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!tweetId,
  });
};

interface GetUserLikesParams {
  userId: string | null;
  page?: number;
  limit?: number;
}

export const useGetUserLikes = (
  params: GetUserLikesParams
): UseQueryResult<LikeWithTweet[], AxiosError<ErrorResponseData>> => {
  const { userId, page = 1, limit = 10 } = params;
  return useQuery<LikeWithTweet[], AxiosError<ErrorResponseData>>({
    queryKey: ["userLikes", userId, { page, limit }],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required for useGetUserLikes");
      const response = await apiClient.get(`/likes/users/${userId}/likes`, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!userId,
  });
};
