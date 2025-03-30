import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import { toast } from "sonner";
import { Tweet } from "./useTweets";
import { BookmarkStatusResponse } from "../types/bookmark";
import { AxiosError } from "axios";
import { ErrorResponseData } from "../types/error";

export const useCreateBookmark = (): UseMutationResult<
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
        `/bookmarks/tweets/${tweetId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data, tweetId) => {
      toast.success(data.message || `Tweet (ID: ${tweetId}) bookmarked!`);
      queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarkStatus", tweetId] });
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: (error, tweetId) => {
      const errorMsg =
        error.response?.data?.message || error.message || "An error occurred";
      if (error.response?.status === 409) {
        toast.error(`Failed to bookmark: ${errorMsg} (Already bookmarked?)`);
      } else {
        toast.error(`Failed to bookmark tweet ${tweetId}: ${errorMsg}`);
      }
      console.error(
        `Error bookmarking tweet ${tweetId}:`,
        error.response?.data || error
      );
    },
  });
};

export const useRemoveBookmark = (): UseMutationResult<
  void,
  AxiosError<ErrorResponseData>,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponseData>, string>({
    mutationFn: async (tweetId) => {
      await apiClient.delete(`/bookmarks/tweets/${tweetId}`, {
        withCredentials: true,
      });
    },
    onSuccess: (_, tweetId) => {
      toast.success(`Bookmark removed from tweet (ID: ${tweetId})`);
      queryClient.invalidateQueries({ queryKey: ["tweet", tweetId] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarkStatus", tweetId] });
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: (error, tweetId) => {
      const errorMsg =
        error.response?.data?.message || error.message || "An error occurred";
      if (error.response?.status === 400) {
        toast.error(
          `Failed to remove bookmark: ${errorMsg} (Maybe not bookmarked?)`
        );
      } else {
        toast.error(
          `Failed to remove bookmark for tweet ${tweetId}: ${errorMsg}`
        );
      }
      console.error(
        `Error removing bookmark for tweet ${tweetId}:`,
        error.response?.data || error
      );
    },
  });
};

interface GetBookmarksParams {
  page?: number;
  limit?: number;
}

export const useGetBookmarks = (
  params: GetBookmarksParams = {}
): UseQueryResult<Tweet[], AxiosError<ErrorResponseData>> => {
  const { page = 1, limit = 10 } = params;
  return useQuery<Tweet[], AxiosError<ErrorResponseData>>({
    queryKey: ["bookmarks", { page, limit }],
    queryFn: async () => {
      const response = await apiClient.get(`/bookmarks`, {
        params: { page, limit },
        withCredentials: true,
      });
      return response.data;
    },
  });
};

export const useCheckBookmarkStatus = (
  tweetId: string | null
): UseQueryResult<BookmarkStatusResponse, AxiosError<ErrorResponseData>> => {
  return useQuery<BookmarkStatusResponse, AxiosError<ErrorResponseData>>({
    queryKey: ["bookmarkStatus", tweetId],
    queryFn: async () => {
      if (!tweetId)
        throw new Error("Tweet ID is required for useCheckBookmarkStatus");
      const response = await apiClient.get(
        `/bookmarks/tweets/${tweetId}/status`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    enabled: !!tweetId,
  });
};
