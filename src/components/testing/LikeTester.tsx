import { useState } from "react";
import {
  useLikeTweet,
  useUnlikeTweet,
  useGetTweetLikes,
  useGetUserLikes,
} from "../../hooks/useLikes";
import { ResultsDisplay } from "./ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LikeTester() {
  const [toggleTweetId, setToggleTweetId] = useState("");
  const [getLikesTweetId, setGetLikesTweetId] = useState("");
  const [getLikesUserId, setGetLikesUserId] = useState("");
  const [tweetLikesPage, setTweetLikesPage] = useState(1);
  const [tweetLikesLimit, setTweetLikesLimit] = useState(5);
  const [userLikesPage, setUserLikesPage] = useState(1);
  const [userLikesLimit, setUserLikesLimit] = useState(5);

  const likeMutation = useLikeTweet();
  const unlikeMutation = useUnlikeTweet();
  const getTweetLikesQuery = useGetTweetLikes({
    tweetId: getLikesTweetId || null,
    page: tweetLikesPage,
    limit: tweetLikesLimit,
  });
  const getUserLikesQuery = useGetUserLikes({
    userId: getLikesUserId || null,
    page: userLikesPage,
    limit: userLikesLimit,
  });

  const handleLike = () => {
    if (!toggleTweetId) {
      alert("Please enter the Tweet ID to like.");
      return;
    }
    likeMutation.mutate(toggleTweetId);
  };

  const handleUnlike = () => {
    if (!toggleTweetId) {
      alert("Please enter the Tweet ID to unlike.");
      return;
    }
    unlikeMutation.mutate(toggleTweetId);
  };

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Backend Like Endpoint Testing
      </h1>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Like / Unlike Tweet (POST/DELETE /api/likes/tweets/:tweetId/likes)
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <Label htmlFor="toggle-tweet-id" className="whitespace-nowrap">
            Tweet ID:
          </Label>
          <Input
            id="toggle-tweet-id"
            type="text"
            value={toggleTweetId}
            onChange={(e) => setToggleTweetId(e.target.value)}
            placeholder="Enter Tweet ID to like/unlike"
            className="flex-grow"
          />
          <Button
            onClick={handleLike}
            disabled={
              likeMutation.isPending ||
              unlikeMutation.isPending ||
              !toggleTweetId
            }
            variant="outline"
            className="bg-green-500/20 hover:bg-green-500/30 border-green-700"
          >
            {likeMutation.isPending ? "Liking..." : "Like"}
          </Button>
          <Button
            onClick={handleUnlike}
            disabled={
              likeMutation.isPending ||
              unlikeMutation.isPending ||
              !toggleTweetId
            }
            variant="destructive"
          >
            {unlikeMutation.isPending ? "Unliking..." : "Unlike"}
          </Button>
        </div>
        <ResultsDisplay
          title="Like Action Result"
          data={likeMutation.data}
          isLoading={likeMutation.isPending}
          isError={likeMutation.isError}
          error={likeMutation.error}
        />
        <ResultsDisplay
          title="Unlike Action Result"
          data={null}
          isLoading={unlikeMutation.isPending}
          isError={unlikeMutation.isError}
          error={unlikeMutation.error}
        />
      </section>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Get Tweet Likes (GET /api/likes/tweets/:tweetId/likes)
        </h2>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <Label htmlFor="get-likes-tweet-id">Tweet ID:</Label>
            <Input
              id="get-likes-tweet-id"
              type="text"
              value={getLikesTweetId}
              onChange={(e) => setGetLikesTweetId(e.target.value)}
              placeholder="Enter Tweet ID"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tweet-likes-page">Page:</Label>
            <Input
              id="tweet-likes-page"
              type="number"
              value={tweetLikesPage}
              onChange={(e) =>
                setTweetLikesPage(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tweet-likes-limit">Limit:</Label>
            <Input
              id="tweet-likes-limit"
              type="number"
              value={tweetLikesLimit}
              onChange={(e) =>
                setTweetLikesLimit(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <Button
            onClick={() => getTweetLikesQuery.refetch()}
            disabled={getTweetLikesQuery.isFetching || !getLikesTweetId}
            className="self-end"
          >
            {getTweetLikesQuery.isFetching
              ? "Fetching..."
              : "Get Users Who Liked"}
          </Button>
        </div>
        <ResultsDisplay
          title={`Users Who Liked Tweet (ID: ${getLikesTweetId || "N/A"})`}
          data={getTweetLikesQuery.data}
          isLoading={getTweetLikesQuery.isLoading}
          isError={getTweetLikesQuery.isError}
          error={getTweetLikesQuery.error}
        />
      </section>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Get User Likes (GET /api/likes/users/:userId/likes)
        </h2>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <Label htmlFor="get-likes-user-id">User ID:</Label>
            <Input
              id="get-likes-user-id"
              type="text"
              value={getLikesUserId}
              onChange={(e) => setGetLikesUserId(e.target.value)}
              placeholder="Enter User ID"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="user-likes-page">Page:</Label>
            <Input
              id="user-likes-page"
              type="number"
              value={userLikesPage}
              onChange={(e) =>
                setUserLikesPage(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="user-likes-limit">Limit:</Label>
            <Input
              id="user-likes-limit"
              type="number"
              value={userLikesLimit}
              onChange={(e) =>
                setUserLikesLimit(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <Button
            onClick={() => getUserLikesQuery.refetch()}
            disabled={getUserLikesQuery.isFetching || !getLikesUserId}
            className="self-end"
          >
            {getUserLikesQuery.isFetching
              ? "Fetching..."
              : "Get Tweets Liked By User"}
          </Button>
        </div>
        <ResultsDisplay
          title={`Tweets Liked By User (ID: ${getLikesUserId || "N/A"})`}
          data={getUserLikesQuery.data}
          isLoading={getUserLikesQuery.isLoading}
          isError={getUserLikesQuery.isError}
          error={getUserLikesQuery.error}
        />
      </section>
    </div>
  );
}
