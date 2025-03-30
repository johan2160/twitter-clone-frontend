import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import { toast } from "sonner";

export interface Tweet {
  id: string;
  body: string;
  mediaUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    username?: string | null;
    name?: string | null;
    image?: string | null;
  };
  _count: {
    likes: number;
    responses: number;
    bookmarks: number;
  };
}

interface CreateTweetPayload {
  content: string;
  mediaUrl?: string;
}

interface UpdateTweetPayload {
  content?: string;
  mediaUrl?: string | null;
}

interface GetTweetsParams {
  page?: number;
  limit?: number;
}
export const useGetTweets = (
  params: GetTweetsParams = {}
): UseQueryResult<Tweet[], Error> => {
  const { page = 1, limit = 10 } = params;
  return useQuery<Tweet[], Error>({
    queryKey: ["tweets", { page, limit }],
    queryFn: async () => {
      const response = await apiClient.get("/tweets", {
        params: { page, limit },
        withCredentials: true,
      });
      return response.data;
    },
  });
};

export const useGetTweetById = (
  tweetId: string | null
): UseQueryResult<Tweet, Error> => {
  return useQuery<Tweet, Error>({
    queryKey: ["tweet", tweetId],
    queryFn: async () => {
      if (!tweetId) throw new Error("Tweet ID is required");
      const response = await apiClient.get(`/tweets/${tweetId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!tweetId,
  });
};

export const useCreateTweet = (): UseMutationResult<
  Tweet,
  Error,
  CreateTweetPayload
> => {
  const queryClient = useQueryClient();

  return useMutation<Tweet, Error, CreateTweetPayload>({
    mutationFn: async (tweetData) => {
      const payload = {
        ...tweetData,
        mediaUrl: tweetData.mediaUrl === "" ? undefined : tweetData.mediaUrl,
      };
      const response = await apiClient.post("/tweets", payload, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (newTweet) => {
      toast.success(`Tweet created successfully! (ID: ${newTweet.id})`);
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: (error) => {
      console.error("Error creating tweet:", error);
      toast.error(`Failed to create tweet: ${error.message}`);
    },
  });
};

interface UpdateTweetVariables {
  tweetId: string;
  data: UpdateTweetPayload;
}
export const useUpdateTweet = (): UseMutationResult<
  Tweet,
  Error,
  UpdateTweetVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<Tweet, Error, UpdateTweetVariables>({
    mutationFn: async ({ tweetId, data }) => {
      const payload = {
        ...data,
        mediaUrl: data.mediaUrl === "" ? null : data.mediaUrl,
      };
      Object.keys(payload).forEach(
        (key) =>
          payload[key as keyof typeof payload] === undefined &&
          delete payload[key as keyof typeof payload]
      );

      if (Object.keys(payload).length === 0) {
        throw new Error("No fields provided for update.");
      }

      const response = await apiClient.put(`/tweets/${tweetId}`, payload, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (updatedTweet) => {
      toast.success(`Tweet updated successfully! (ID: ${updatedTweet.id})`);
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
      queryClient.invalidateQueries({ queryKey: ["tweet", updatedTweet.id] });
    },
    onError: (error, variables) => {
      console.error(`Error updating tweet ${variables.tweetId}:`, error);
      toast.error(`Failed to update tweet: ${error.message}`);
    },
  });
};

export const useDeleteTweet = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (tweetId) => {
      await apiClient.delete(`/tweets/${tweetId}`, {
        withCredentials: true,
      });
    },
    onSuccess: (_, tweetId) => {
      toast.success(`Tweet deleted successfully! (ID: ${tweetId})`);
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
      queryClient.removeQueries({ queryKey: ["tweet", tweetId] });
    },
    onError: (error, tweetId) => {
      console.error(`Error deleting tweet ${tweetId}:`, error);
      toast.error(`Failed to delete tweet: ${error.message}`);
    },
  });
};
