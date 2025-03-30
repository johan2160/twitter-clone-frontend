import { useState } from "react";
import {
  useFollowUser,
  useUnfollowUser,
  useGetFollowers,
  useGetFollowing,
  useCheckFollowStatus,
} from "../../hooks/useFollows";
import { ResultsDisplay } from "./ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FollowTester() {
  const [targetUserIdAction, setTargetUserIdAction] = useState("");
  const [listUserId, setListUserId] = useState("");
  const [followersPage, setFollowersPage] = useState(1);
  const [followersLimit, setFollowersLimit] = useState(5);
  const [followingPage, setFollowingPage] = useState(1);
  const [followingLimit, setFollowingLimit] = useState(5);

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const followersQuery = useGetFollowers({
    userId: listUserId || null,
    page: followersPage,
    limit: followersLimit,
  });
  const followingQuery = useGetFollowing({
    userId: listUserId || null,
    page: followingPage,
    limit: followingLimit,
  });
  const followStatusQuery = useCheckFollowStatus(targetUserIdAction || null);

  const handleFollow = () => {
    if (!targetUserIdAction) return;
    followMutation.mutate(targetUserIdAction);
  };
  const handleUnfollow = () => {
    if (!targetUserIdAction) return;
    unfollowMutation.mutate(targetUserIdAction);
  };
  const handleCheckStatus = () => {
    if (!targetUserIdAction) return;
    followStatusQuery.refetch();
  };

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Backend Follow Endpoint Testing
      </h1>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Follow Actions & Status Check
        </h2>
        <div className="flex flex-wrap items-end gap-2 mb-4">
          <div className="flex-grow">
            <Label
              htmlFor="action-target-user-id"
              className="whitespace-nowrap"
            >
              Target User ID:
            </Label>
            <Input
              id="action-target-user-id"
              type="text"
              value={targetUserIdAction}
              onChange={(e) => setTargetUserIdAction(e.target.value)}
              placeholder="Enter User ID to action/check"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleFollow}
            disabled={
              followMutation.isPending ||
              unfollowMutation.isPending ||
              !targetUserIdAction
            }
            variant="outline"
            className="bg-green-500/20 hover:bg-green-500/30 border-green-700"
          >
            {followMutation.isPending ? "Following..." : "Follow"}
          </Button>
          <Button
            onClick={handleUnfollow}
            disabled={
              followMutation.isPending ||
              unfollowMutation.isPending ||
              !targetUserIdAction
            }
            variant="destructive"
          >
            {unfollowMutation.isPending ? "Unfollowing..." : "Unfollow"}
          </Button>
          <Button
            onClick={handleCheckStatus}
            disabled={followStatusQuery.isFetching || !targetUserIdAction}
            variant="outline"
          >
            {followStatusQuery.isFetching ? "Checking..." : "Check Status"}
          </Button>
        </div>
        <ResultsDisplay
          title="Follow Action Result"
          data={followMutation.data}
          isLoading={followMutation.isPending}
          isError={followMutation.isError}
          error={followMutation.error}
        />
        <ResultsDisplay
          title="Unfollow Action Result"
          data={null}
          isLoading={unfollowMutation.isPending}
          isError={unfollowMutation.isError}
          error={unfollowMutation.error}
        />
        <ResultsDisplay
          title={`Follow Status (vs ${targetUserIdAction || "N/A"})`}
          data={followStatusQuery.data}
          isLoading={followStatusQuery.isLoading}
          isError={followStatusQuery.isError}
          error={followStatusQuery.error}
        />
      </section>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Get Followers (GET /api/follow/users/:userId/followers)
        </h2>
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div className="flex-grow">
            <Label htmlFor="list-user-id-followers">User ID:</Label>
            <Input
              id="list-user-id-followers"
              type="text"
              value={listUserId}
              onChange={(e) => setListUserId(e.target.value)}
              placeholder="Enter User ID for list"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="followers-page">Page:</Label>
            <Input
              id="followers-page"
              type="number"
              value={followersPage}
              onChange={(e) =>
                setFollowersPage(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="followers-limit">Limit:</Label>
            <Input
              id="followers-limit"
              type="number"
              value={followersLimit}
              onChange={(e) =>
                setFollowersLimit(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <Button
            onClick={() => followersQuery.refetch()}
            disabled={followersQuery.isFetching || !listUserId}
          >
            {followersQuery.isFetching ? "Fetching..." : "Get Followers"}
          </Button>
        </div>
        <ResultsDisplay
          title={`Followers List (User: ${listUserId || "N/A"})`}
          data={followersQuery.data}
          isLoading={followersQuery.isLoading}
          isError={followersQuery.isError}
          error={followersQuery.error}
        />
      </section>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Get Following (GET /api/follow/users/:userId/following)
        </h2>
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div className="flex-grow">
            <Label htmlFor="list-user-id-following">User ID:</Label>
            <Input
              id="list-user-id-following"
              type="text"
              value={listUserId}
              onChange={(e) => setListUserId(e.target.value)}
              placeholder="Enter User ID for list"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="following-page">Page:</Label>
            <Input
              id="following-page"
              type="number"
              value={followingPage}
              onChange={(e) =>
                setFollowingPage(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="following-limit">Limit:</Label>
            <Input
              id="following-limit"
              type="number"
              value={followingLimit}
              onChange={(e) =>
                setFollowingLimit(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <Button
            onClick={() => followingQuery.refetch()}
            disabled={followingQuery.isFetching || !listUserId}
          >
            {followingQuery.isFetching ? "Fetching..." : "Get Following"}
          </Button>
        </div>
        <ResultsDisplay
          title={`Following List (User: ${listUserId || "N/A"})`}
          data={followingQuery.data}
          isLoading={followingQuery.isLoading}
          isError={followingQuery.isError}
          error={followingQuery.error}
        />
      </section>
    </div>
  );
}
