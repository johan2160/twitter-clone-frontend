import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateResponse,
  useGetTweetResponses,
  useGetResponseById,
  useUpdateResponse,
  useDeleteResponse,
} from "../../hooks/useResponses";
import {
  responseCreateFormSchema,
  ResponseCreateFormValues,
  responseUpdateFormSchema,
  ResponseUpdateFormValues,
} from "../../schemas/response";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResultsDisplay } from "./ResultsDisplay";

export function ResponseTester() {
  const [createTweetId, setCreateTweetId] = useState("");
  const [getListTweetId, setGetListTweetId] = useState("");
  const [getResponseId, setGetResponseId] = useState("");
  const [updateResponseId, setUpdateResponseId] = useState("");
  const [deleteResponseId, setDeleteResponseId] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const createResponseMutation = useCreateResponse();
  const getTweetResponsesQuery = useGetTweetResponses({
    tweetId: getListTweetId || null,
    page,
    limit,
  });
  const getResponseByIdQuery = useGetResponseById(getResponseId || null);
  const updateResponseMutation = useUpdateResponse();
  const deleteResponseMutation = useDeleteResponse();

  const createForm = useForm<ResponseCreateFormValues>({
    resolver: zodResolver(responseCreateFormSchema),
    defaultValues: { body: "", mediaUrl: "" },
  });

  const updateForm = useForm<ResponseUpdateFormValues>({
    resolver: zodResolver(responseUpdateFormSchema),
    defaultValues: { body: "", mediaUrl: "" },
  });

  const handleCreateResponse: SubmitHandler<ResponseCreateFormValues> = (
    data
  ) => {
    if (!createTweetId) {
      alert("Please enter the Tweet ID to respond to.");
      return;
    }
    createResponseMutation.mutate({ tweetId: createTweetId, data });
    createForm.reset();
  };

  const handleUpdateResponse: SubmitHandler<ResponseUpdateFormValues> = (
    data
  ) => {
    if (!updateResponseId) {
      alert("Please enter the ID of the response to update.");
      return;
    }
    const payload: Record<string, any> = {};
    if (data.body !== undefined) payload.body = data.body;
    if (data.mediaUrl !== undefined) payload.mediaUrl = data.mediaUrl;

    if (Object.keys(payload).length === 0) {
      alert("Please provide at least body or a media URL to update.");
      return;
    }

    updateResponseMutation.mutate({
      responseId: updateResponseId,
      data: payload,
    });
    updateForm.reset({ body: "", mediaUrl: "" });
  };

  const handleDeleteResponse = () => {
    if (!deleteResponseId) {
      alert("Please enter the ID of the response to delete.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete response ${deleteResponseId}?`
      )
    ) {
      const responseData = getResponseByIdQuery.data;
      const tweetId = responseData?.tweetId;

      deleteResponseMutation.mutate({ responseId: deleteResponseId, tweetId });
      setDeleteResponseId("");
      if (getResponseId === deleteResponseId) setGetResponseId("");
      if (updateResponseId === deleteResponseId) setUpdateResponseId("");
    }
  };

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Backend Response Endpoint Testing
      </h1>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Create Response (POST /api/responses/tweets/:tweetId/responses)
        </h2>
        <div className="mb-4">
          <Label htmlFor="create-tweet-id">Tweet ID to Respond To *</Label>
          <Input
            id="create-tweet-id"
            type="text"
            value={createTweetId}
            onChange={(e) => setCreateTweetId(e.target.value)}
            placeholder="Enter Tweet ID"
            className="mt-1"
            disabled={createResponseMutation.isPending}
          />
        </div>
        <form
          onSubmit={createForm.handleSubmit(handleCreateResponse)}
          className="space-y-4 border p-4 rounded bg-muted/20"
        >
          <div>
            <Label htmlFor="create-response-body">Body *</Label>
            <Textarea
              id="create-response-body"
              {...createForm.register("body")}
              placeholder="Your response text..."
              rows={3}
              className="mt-1"
              disabled={createResponseMutation.isPending}
            />
            {createForm.formState.errors.body && (
              <p className="text-red-500 text-sm mt-1">
                {createForm.formState.errors.body.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="create-response-mediaUrl">
              Media URL (Optional)
            </Label>
            <Input
              id="create-response-mediaUrl"
              type="text"
              {...createForm.register("mediaUrl")}
              placeholder="http://example.com/image.jpg"
              className="mt-1"
              disabled={createResponseMutation.isPending}
            />
            {createForm.formState.errors.mediaUrl && (
              <p className="text-red-500 text-sm mt-1">
                {createForm.formState.errors.mediaUrl.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={createResponseMutation.isPending || !createTweetId}
          >
            {createResponseMutation.isPending
              ? "Creating..."
              : "Create Response"}
          </Button>
        </form>
        <ResultsDisplay
          title="Create Result"
          data={createResponseMutation.data}
          isLoading={createResponseMutation.isPending}
          isError={createResponseMutation.isError}
          error={createResponseMutation.error}
        />
      </section>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Get Tweet Responses (GET /api/responses/tweets/:tweetId/responses)
        </h2>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <Label htmlFor="get-list-tweet-id">Tweet ID:</Label>
            <Input
              id="get-list-tweet-id"
              type="text"
              value={getListTweetId}
              onChange={(e) => setGetListTweetId(e.target.value)}
              placeholder="Enter Tweet ID"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="resp-page">Page:</Label>
            <Input
              id="resp-page"
              type="number"
              value={page}
              onChange={(e) =>
                setPage(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="resp-limit">Limit:</Label>
            <Input
              id="resp-limit"
              type="number"
              value={limit}
              onChange={(e) =>
                setLimit(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <Button
            onClick={() => getTweetResponsesQuery.refetch()}
            disabled={getTweetResponsesQuery.isFetching || !getListTweetId}
            className="self-end"
          >
            {getTweetResponsesQuery.isFetching
              ? "Fetching..."
              : "Get Responses"}
          </Button>
        </div>
        <ResultsDisplay
          title={`Responses List (Tweet: ${
            getListTweetId || "N/A"
          }, Page: ${page}, Limit: ${limit})`}
          data={getTweetResponsesQuery.data}
          isLoading={getTweetResponsesQuery.isLoading}
          isError={getTweetResponsesQuery.isError}
          error={getTweetResponsesQuery.error}
        />
      </section>

      <section className="p-4 border rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold mb-4">
          Actions on Specific Response
        </h2>

        <div>
          <h3 className="text-xl font-semibold mb-2">
            Get Response by ID (GET /api/responses/responses/:id)
          </h3>
          <div className="flex items-center gap-2">
            <Label htmlFor="get-response-id">Response ID:</Label>
            <Input
              id="get-response-id"
              type="text"
              value={getResponseId}
              onChange={(e) => setGetResponseId(e.target.value)}
              placeholder="Enter Response ID"
              className="flex-grow"
            />
            <Button
              onClick={() => getResponseByIdQuery.refetch()}
              disabled={!getResponseId || getResponseByIdQuery.isFetching}
            >
              {getResponseByIdQuery.isFetching ? "Fetching..." : "Get Response"}
            </Button>
          </div>
          <ResultsDisplay
            title="Get Response Result"
            data={getResponseByIdQuery.data}
            isLoading={getResponseByIdQuery.isLoading}
            isError={getResponseByIdQuery.isError}
            error={getResponseByIdQuery.error}
          />
        </div>

        <hr />

        <div>
          <h3 className="text-xl font-semibold mb-2">
            Update Response (PUT /api/responses/responses/:id)
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <Label htmlFor="update-response-id">Response ID to Update:</Label>
            <Input
              id="update-response-id"
              type="text"
              value={updateResponseId}
              onChange={(e) => setUpdateResponseId(e.target.value)}
              placeholder="Enter Response ID"
              className="flex-grow"
            />
          </div>
          <form
            onSubmit={updateForm.handleSubmit(handleUpdateResponse)}
            className="space-y-4 border p-4 rounded bg-muted/20"
          >
            <p className="text-sm text-muted-foreground">
              Enter new values (leave blank to keep current). Set Media URL to
              empty string to remove it.
            </p>
            <div>
              <Label htmlFor="update-response-body">New Body</Label>
              <Textarea
                id="update-response-body"
                {...updateForm.register("body")}
                placeholder="New response text"
                rows={3}
                className="mt-1"
                disabled={updateResponseMutation.isPending}
              />
              {updateForm.formState.errors.body && (
                <p className="text-red-500 text-sm mt-1">
                  {updateForm.formState.errors.body.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="update-response-mediaUrl">
                New Media URL (empty to remove)
              </Label>
              <Input
                id="update-response-mediaUrl"
                type="text"
                {...updateForm.register("mediaUrl")}
                placeholder="http://new.com/image.png or leave empty"
                className="mt-1"
                disabled={updateResponseMutation.isPending}
              />
              {updateForm.formState.errors.mediaUrl && (
                <p className="text-red-500 text-sm mt-1">
                  {updateForm.formState.errors.mediaUrl.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={updateResponseMutation.isPending || !updateResponseId}
            >
              {updateResponseMutation.isPending
                ? "Updating..."
                : "Update Response"}
            </Button>
          </form>
          <ResultsDisplay
            title="Update Result"
            data={updateResponseMutation.data}
            isLoading={updateResponseMutation.isPending}
            isError={updateResponseMutation.isError}
            error={updateResponseMutation.error}
          />
        </div>

        <hr />

        <div>
          <h3 className="text-xl font-semibold mb-2">
            Delete Response (DELETE /api/responses/responses/:id)
          </h3>
          <div className="flex items-center gap-2">
            <Label htmlFor="delete-response-id">Response ID:</Label>
            <Input
              id="delete-response-id"
              type="text"
              value={deleteResponseId}
              onChange={(e) => setDeleteResponseId(e.target.value)}
              placeholder="Enter Response ID"
              className="flex-grow"
            />
            <Button
              variant="destructive"
              onClick={handleDeleteResponse}
              disabled={deleteResponseMutation.isPending || !deleteResponseId}
            >
              {deleteResponseMutation.isPending
                ? "Deleting..."
                : "Delete Response"}
            </Button>
          </div>
          <ResultsDisplay
            title="Delete Result"
            data={null}
            isLoading={deleteResponseMutation.isPending}
            isError={deleteResponseMutation.isError}
            error={deleteResponseMutation.error}
          />
        </div>
      </section>
    </div>
  );
}
