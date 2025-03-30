import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import { toast } from "sonner";

export interface ResponseItem {
  id: string;
  body: string;
  mediaUrl: string | null;
  createdAt: string;
  updatedAt: string;
  tweetId: string;
  userId: string;
  user: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
}

interface CreateResponsePayload {
  body: string;
  mediaUrl?: string;
}

interface UpdateResponsePayload {
  body?: string;
  mediaUrl?: string | null;
}

interface GetTweetResponsesParams {
  tweetId: string | null;
  page?: number;
  limit?: number;
}
export const useGetTweetResponses = (
  params: GetTweetResponsesParams
): UseQueryResult<ResponseItem[], Error> => {
  const { tweetId, page = 1, limit = 10 } = params;
  return useQuery<ResponseItem[], Error>({
    queryKey: ["tweetResponses", tweetId, { page, limit }],
    queryFn: async () => {
      if (!tweetId) throw new Error("Tweet ID is required");
      const response = await apiClient.get(
        `/responses/tweets/${tweetId}/responses`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    },
    enabled: !!tweetId,
  });
};

export const useGetResponseById = (
  responseId: string | null
): UseQueryResult<ResponseItem, Error> => {
  return useQuery<ResponseItem, Error>({
    queryKey: ["response", responseId],
    queryFn: async () => {
      if (!responseId) throw new Error("Response ID is required");
      const response = await apiClient.get(
        `/responses/responses/${responseId}`
      );
      return response.data;
    },
    enabled: !!responseId,
  });
};

interface CreateResponseVariables {
  tweetId: string;
  data: CreateResponsePayload;
}
export const useCreateResponse = (): UseMutationResult<
  ResponseItem,
  Error,
  CreateResponseVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<ResponseItem, Error, CreateResponseVariables>({
    mutationFn: async ({ tweetId, data }) => {
      const payload = {
        ...data,
        mediaUrl: data.mediaUrl === "" ? undefined : data.mediaUrl,
      };
      const response = await apiClient.post(
        `/responses/tweets/${tweetId}/responses`,
        payload,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (newResponse, variables) => {
      toast.success(`Response created successfully! (ID: ${newResponse.id})`);
      queryClient.invalidateQueries({
        queryKey: ["tweetResponses", variables.tweetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tweet", variables.tweetId],
      });
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: (error, variables) => {
      console.error(
        `Error creating response for tweet ${variables.tweetId}:`,
        error
      );
      toast.error(`Failed to create response: ${error.message}`);
    },
  });
};

interface UpdateResponseVariables {
  responseId: string;
  data: UpdateResponsePayload;
}
export const useUpdateResponse = (): UseMutationResult<
  ResponseItem,
  Error,
  UpdateResponseVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<ResponseItem, Error, UpdateResponseVariables>({
    mutationFn: async ({ responseId, data }) => {
      const payload: UpdateResponsePayload = {};
      if (data.body !== undefined) {
        payload.body = data.body;
      }
      if (data.mediaUrl !== undefined) {
        payload.mediaUrl = data.mediaUrl === "" ? null : data.mediaUrl;
      }

      if (Object.keys(payload).length === 0) {
        throw new Error("No fields provided for update.");
      }

      const response = await apiClient.put(
        `/responses/responses/${responseId}`,
        payload,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (updatedResponse) => {
      toast.success(
        `Response updated successfully! (ID: ${updatedResponse.id})`
      );
      queryClient.invalidateQueries({
        queryKey: ["response", updatedResponse.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["tweetResponses", updatedResponse.tweetId],
      });
      queryClient.setQueryData(
        ["response", updatedResponse.id],
        updatedResponse
      );
    },
    onError: (error, variables) => {
      console.error(`Error updating response ${variables.responseId}:`, error);
      toast.error(`Failed to update response: ${error.message}`);
    },
  });
};

interface DeleteResponseVariables {
  responseId: string;
  tweetId?: string;
}
export const useDeleteResponse = (): UseMutationResult<
  void,
  Error,
  DeleteResponseVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteResponseVariables>({
    mutationFn: async ({ responseId }) => {
      await apiClient.delete(`/responses/responses/${responseId}`, {
        withCredentials: true,
      });
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Response deleted successfully! (ID: ${variables.responseId})`
      );
      queryClient.removeQueries({
        queryKey: ["response", variables.responseId],
      });
      if (variables.tweetId) {
        queryClient.invalidateQueries({
          queryKey: ["tweetResponses", variables.tweetId],
        });
        queryClient.invalidateQueries({
          queryKey: ["tweet", variables.tweetId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["tweetResponses"] });
        queryClient.invalidateQueries({ queryKey: ["tweets"] });
      }
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: (error, variables) => {
      console.error(`Error deleting response ${variables.responseId}:`, error);
      toast.error(`Failed to delete response: ${error.message}`);
    },
  });
};
