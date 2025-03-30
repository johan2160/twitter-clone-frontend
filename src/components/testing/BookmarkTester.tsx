import { useState } from "react";
import {
  useCreateBookmark,
  useRemoveBookmark,
  useGetBookmarks,
  useCheckBookmarkStatus,
} from "../../hooks/useBookmarks";
import { ResultsDisplay } from "./ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BookmarkTester() {
  const [actionTweetId, setActionTweetId] = useState("");
  const [bookmarksPage, setBookmarksPage] = useState(1);
  const [bookmarksLimit, setBookmarksLimit] = useState(5);

  const createBookmarkMutation = useCreateBookmark();
  const removeBookmarkMutation = useRemoveBookmark();
  const getBookmarksQuery = useGetBookmarks({
    page: bookmarksPage,
    limit: bookmarksLimit,
  });
  const checkStatusQuery = useCheckBookmarkStatus(actionTweetId || null);

  const handleBookmark = () => {
    if (!actionTweetId) return;
    createBookmarkMutation.mutate(actionTweetId);
  };
  const handleUnbookmark = () => {
    if (!actionTweetId) return;
    removeBookmarkMutation.mutate(actionTweetId);
  };
  const handleCheckStatus = () => {
    if (!actionTweetId) return;
    checkStatusQuery.refetch();
  };

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Backend Bookmark Endpoint Testing
      </h1>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Bookmark Actions & Status Check
        </h2>
        <div className="flex flex-wrap items-end gap-2 mb-4">
          <div className="flex-grow">
            <Label
              htmlFor="action-tweet-id-bookmark"
              className="whitespace-nowrap"
            >
              Tweet ID:
            </Label>
            <Input
              id="action-tweet-id-bookmark"
              type="text"
              value={actionTweetId}
              onChange={(e) => setActionTweetId(e.target.value)}
              placeholder="Enter Tweet ID to action/check"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleBookmark}
            disabled={
              createBookmarkMutation.isPending ||
              removeBookmarkMutation.isPending ||
              !actionTweetId
            }
            variant="outline"
            className="bg-blue-500/20 hover:bg-blue-500/30 border-blue-700"
          >
            {createBookmarkMutation.isPending ? "Adding..." : "Bookmark"}
          </Button>
          <Button
            onClick={handleUnbookmark}
            disabled={
              createBookmarkMutation.isPending ||
              removeBookmarkMutation.isPending ||
              !actionTweetId
            }
            variant="destructive"
          >
            {removeBookmarkMutation.isPending ? "Removing..." : "Unbookmark"}
          </Button>
          <Button
            onClick={handleCheckStatus}
            disabled={checkStatusQuery.isFetching || !actionTweetId}
            variant="outline"
          >
            {checkStatusQuery.isFetching ? "Checking..." : "Check Status"}
          </Button>
        </div>
        <ResultsDisplay
          title="Add Bookmark Result"
          data={createBookmarkMutation.data}
          isLoading={createBookmarkMutation.isPending}
          isError={createBookmarkMutation.isError}
          error={createBookmarkMutation.error}
        />
        <ResultsDisplay
          title="Remove Bookmark Result"
          data={null}
          isLoading={removeBookmarkMutation.isPending}
          isError={removeBookmarkMutation.isError}
          error={removeBookmarkMutation.error}
        />
        <ResultsDisplay
          title={`Bookmark Status (Tweet: ${actionTweetId || "N/A"})`}
          data={checkStatusQuery.data}
          isLoading={checkStatusQuery.isLoading}
          isError={checkStatusQuery.isError}
          error={checkStatusQuery.error}
        />
      </section>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Get My Bookmarks (GET /api/bookmarks)
        </h2>
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div>
            <Label htmlFor="bookmarks-page">Page:</Label>
            <Input
              id="bookmarks-page"
              type="number"
              value={bookmarksPage}
              onChange={(e) =>
                setBookmarksPage(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="bookmarks-limit">Limit:</Label>
            <Input
              id="bookmarks-limit"
              type="number"
              value={bookmarksLimit}
              onChange={(e) =>
                setBookmarksLimit(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <Button
            onClick={() => getBookmarksQuery.refetch()}
            disabled={getBookmarksQuery.isFetching}
          >
            {getBookmarksQuery.isFetching ? "Fetching..." : "Get My Bookmarks"}
          </Button>
        </div>
        <ResultsDisplay
          title={`My Bookmarks (Page: ${bookmarksPage})`}
          data={getBookmarksQuery.data}
          isLoading={getBookmarksQuery.isLoading}
          isError={getBookmarksQuery.isError}
          error={getBookmarksQuery.error}
        />
      </section>
    </div>
  );
}
