import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetTweets,
  useGetTweetById,
  useCreateTweet,
  useUpdateTweet,
  useDeleteTweet,
} from "../../hooks/useTweets";
import {
  tweetCreateFormSchema,
  TweetCreateFormValues,
  tweetUpdateFormSchema,
  TweetUpdateFormValues,
} from "../../schemas/tweet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResultsDisplay } from "./ResultsDisplay";

export function TweetTester() {
  const [getTweetId, setGetTweetId] = useState("");
  const [updateTweetId, setUpdateTweetId] = useState("");
  const [deleteTweetId, setDeleteTweetId] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const getTweetsQuery = useGetTweets({ page, limit });
  const getTweetByIdQuery = useGetTweetById(getTweetId || null);
  const createTweetMutation = useCreateTweet();
  const updateTweetMutation = useUpdateTweet();
  const deleteTweetMutation = useDeleteTweet();

  const createForm = useForm<TweetCreateFormValues>({
    resolver: zodResolver(tweetCreateFormSchema),
    defaultValues: { content: "", mediaUrl: "" },
  });

  const updateForm = useForm<TweetUpdateFormValues>({
    resolver: zodResolver(tweetUpdateFormSchema),
    defaultValues: { content: "", mediaUrl: "" },
  });

  const handleCreateTweet: SubmitHandler<TweetCreateFormValues> = (data) => {
    createTweetMutation.mutate(data);
    createForm.reset();
  };

  const handleUpdateTweet: SubmitHandler<TweetUpdateFormValues> = (data) => {
    if (!updateTweetId) {
      alert("Please enter the ID of the tweet to update.");
      return;
    }
    const payload: Record<string, any> = {};
    if (data.content !== undefined && data.content !== "")
      payload.content = data.content;
    if (data.mediaUrl !== undefined)
      payload.mediaUrl = data.mediaUrl === "" ? null : data.mediaUrl;

    if (Object.keys(payload).length === 0) {
      alert("Please provide at least content or a media URL to update.");
      return;
    }

    updateTweetMutation.mutate({ tweetId: updateTweetId, data: payload });
    updateForm.reset({ content: "", mediaUrl: "" });
  };

  const handleDeleteTweet = () => {
    if (!deleteTweetId) {
      alert("Please enter the ID of the tweet to delete.");
      return;
    }
    if (
      window.confirm(`Are you sure you want to delete tweet ${deleteTweetId}?`)
    ) {
      deleteTweetMutation.mutate(deleteTweetId);
      setDeleteTweetId("");
    }
  };

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Backend Tweet Endpoint Testing
      </h1>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Create Tweet (POST /api/tweets)
        </h2>
        <form
          onSubmit={createForm.handleSubmit(handleCreateTweet)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="create-content">Content *</Label>
            <Textarea
              id="create-content"
              {...createForm.register("content")}
              placeholder="What's happening?"
              rows={3}
              className="mt-1"
              disabled={createTweetMutation.isPending}
            />
            {createForm.formState.errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {createForm.formState.errors.content.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="create-mediaUrl">Media URL (Optional)</Label>
            <Input
              id="create-mediaUrl"
              type="text"
              {...createForm.register("mediaUrl")}
              placeholder="http://example.com/image.jpg"
              className="mt-1"
              disabled={createTweetMutation.isPending}
            />
            {createForm.formState.errors.mediaUrl && (
              <p className="text-red-500 text-sm mt-1">
                {createForm.formState.errors.mediaUrl.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={createTweetMutation.isPending}>
            {createTweetMutation.isPending ? "Creating..." : "Create Tweet"}
          </Button>
        </form>
        <ResultsDisplay
          title="Create Result"
          data={createTweetMutation.data}
          isLoading={createTweetMutation.isPending}
          isError={createTweetMutation.isError}
          error={createTweetMutation.error}
        />
      </section>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Get Tweets (GET /api/tweets)
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <Label htmlFor="page">Page:</Label>
          <Input
            id="page"
            type="number"
            value={page}
            onChange={(e) =>
              setPage(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20"
          />
          <Label htmlFor="limit">Limit:</Label>
          <Input
            id="limit"
            type="number"
            value={limit}
            onChange={(e) =>
              setLimit(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20"
          />
          <Button
            onClick={() => getTweetsQuery.refetch()}
            disabled={getTweetsQuery.isFetching}
          >
            {getTweetsQuery.isFetching ? "Fetching..." : "Refetch Tweets"}
          </Button>
        </div>
        <ResultsDisplay
          title={`Tweets List (Page: ${page}, Limit: ${limit})`}
          data={getTweetsQuery.data}
          isLoading={getTweetsQuery.isLoading}
          isError={getTweetsQuery.isError}
          error={getTweetsQuery.error}
        />
      </section>

      <section className="p-4 border rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold mb-4">
          Actions on Specific Tweet
        </h2>

        <div>
          <h3 className="text-xl font-semibold mb-2">
            Get Tweet by ID (GET /api/tweets/:id)
          </h3>
          <div className="flex items-center gap-2">
            <Label htmlFor="get-tweet-id">Tweet ID:</Label>
            <Input
              id="get-tweet-id"
              type="text"
              value={getTweetId}
              onChange={(e) => setGetTweetId(e.target.value)}
              placeholder="Enter Tweet ID"
              className="flex-grow"
            />
            <Button
              onClick={() => getTweetByIdQuery.refetch()}
              disabled={!getTweetId || getTweetByIdQuery.isFetching}
            >
              {getTweetByIdQuery.isFetching ? "Fetching..." : "Get Tweet"}
            </Button>
          </div>
          <ResultsDisplay
            title="Get Tweet Result"
            data={getTweetByIdQuery.data}
            isLoading={getTweetByIdQuery.isLoading}
            isError={getTweetByIdQuery.isError}
            error={getTweetByIdQuery.error}
          />
        </div>

        <hr />

        <div>
          <h3 className="text-xl font-semibold mb-2">
            Update Tweet (PUT /api/tweets/:id)
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <Label htmlFor="update-tweet-id">Tweet ID to Update:</Label>
            <Input
              id="update-tweet-id"
              type="text"
              value={updateTweetId}
              onChange={(e) => setUpdateTweetId(e.target.value)}
              placeholder="Enter Tweet ID"
              className="flex-grow"
            />
          </div>
          <form
            onSubmit={updateForm.handleSubmit(handleUpdateTweet)}
            className="space-y-4 border p-4 rounded bg-muted/20"
          >
            <p className="text-sm text-muted-foreground">
              Enter new values (leave blank to keep current). You can set Media
              URL to empty string to remove it.
            </p>
            <div>
              <Label htmlFor="update-content">New Content</Label>
              <Textarea
                id="update-content"
                {...updateForm.register("content")}
                placeholder="New tweet text"
                rows={3}
                className="mt-1"
                disabled={updateTweetMutation.isPending}
              />
              {updateForm.formState.errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {updateForm.formState.errors.content.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="update-mediaUrl">
                New Media URL (empty to remove)
              </Label>
              <Input
                id="update-mediaUrl"
                type="text"
                {...updateForm.register("mediaUrl")}
                placeholder="http://new.com/image.png or leave empty"
                className="mt-1"
                disabled={updateTweetMutation.isPending}
              />
              {updateForm.formState.errors.mediaUrl && (
                <p className="text-red-500 text-sm mt-1">
                  {updateForm.formState.errors.mediaUrl.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={updateTweetMutation.isPending || !updateTweetId}
            >
              {updateTweetMutation.isPending ? "Updating..." : "Update Tweet"}
            </Button>
          </form>
          <ResultsDisplay
            title="Update Result"
            data={updateTweetMutation.data}
            isLoading={updateTweetMutation.isPending}
            isError={updateTweetMutation.isError}
            error={updateTweetMutation.error}
          />
        </div>

        <hr />

        <div>
          <h3 className="text-xl font-semibold mb-2">
            Delete Tweet (DELETE /api/tweets/:id)
          </h3>
          <div className="flex items-center gap-2">
            <Label htmlFor="delete-tweet-id">Tweet ID:</Label>
            <Input
              id="delete-tweet-id"
              type="text"
              value={deleteTweetId}
              onChange={(e) => setDeleteTweetId(e.target.value)}
              placeholder="Enter Tweet ID"
              className="flex-grow"
            />
            <Button
              variant="destructive"
              onClick={handleDeleteTweet}
              disabled={deleteTweetMutation.isPending || !deleteTweetId}
            >
              {deleteTweetMutation.isPending ? "Deleting..." : "Delete Tweet"}
            </Button>
          </div>
          <ResultsDisplay
            title="Delete Result"
            data={null}
            isLoading={deleteTweetMutation.isPending}
            isError={deleteTweetMutation.isError}
            error={deleteTweetMutation.error}
          />
        </div>
      </section>
    </div>
  );
}
