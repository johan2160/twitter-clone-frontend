import { useState } from "react";
import { ResultsDisplay } from "./ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUserById, useGetUsers } from "@/hooks/useUsers";

export function UserTester() {
  const [getUserId, setGetUserId] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const getUsersQuery = useGetUsers({ page, limit });
  const getUserByIdQuery = useGetUserById(getUserId || null);

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Backend User Endpoint Testing (GET Requests)
      </h1>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Get Users (GET /api/users)
        </h2>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <Label htmlFor="user-page">Page:</Label>
            <Input
              id="user-page"
              type="number"
              value={page}
              onChange={(e) =>
                setPage(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="user-limit">Limit:</Label>
            <Input
              id="user-limit"
              type="number"
              value={limit}
              onChange={(e) =>
                setLimit(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 mt-1"
            />
          </div>
          <Button
            onClick={() => getUsersQuery.refetch()}
            disabled={getUsersQuery.isFetching}
            className="self-end"
          >
            {getUsersQuery.isFetching ? "Fetching..." : "Refetch Users"}
          </Button>
        </div>
        <ResultsDisplay
          title={`Users List (Page: ${page}, Limit: ${limit})`}
          data={getUsersQuery.data}
          isLoading={getUsersQuery.isLoading}
          isError={getUsersQuery.isError}
          error={getUsersQuery.error}
        />
      </section>

      <section className="p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Get User by ID (GET /api/users/:userId)
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <Label htmlFor="get-user-id">User ID:</Label>
          <Input
            id="get-user-id"
            type="text"
            value={getUserId}
            onChange={(e) => setGetUserId(e.target.value)}
            placeholder="Enter User ID (e.g., UUID or specific identifier)"
            className="flex-grow mt-1"
          />
          <Button
            onClick={() => getUserByIdQuery.refetch()}
            disabled={!getUserId || getUserByIdQuery.isFetching}
            className="self-end"
          >
            {getUserByIdQuery.isFetching ? "Fetching..." : "Get User"}
          </Button>
        </div>

        <ResultsDisplay
          title={`Get User Result (ID: ${getUserId || "N/A"})`}
          data={getUserByIdQuery.data}
          isLoading={getUserByIdQuery.isLoading}
          isError={getUserByIdQuery.isError}
          error={getUserByIdQuery.error}
        />
      </section>
    </div>
  );
}
