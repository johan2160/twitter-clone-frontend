import React from "react";

interface ResultsDisplayProps {
  title: string;
  data: any;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  title,
  data,
  isLoading,
  isError,
  error,
}) => (
  <div className="mt-4 p-4 border rounded bg-muted/40">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {isLoading && <p>Loading...</p>}
    {isError && (
      <div className="text-red-500 break-words">
        <p>Error: {error?.message || "An unknown error occurred"}</p>
        {(error as any)?.response?.data && (
          <pre className="text-xs mt-2 bg-red-900/20 p-2 rounded">
            {JSON.stringify((error as any).response.data, null, 2)}
          </pre>
        )}
      </div>
    )}
    {data && (
      <pre className="text-xs overflow-auto max-h-96 bg-background p-2 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    )}
    {!isLoading &&
      !isError &&
      !data &&
      typeof data !== "undefined" &&
      data !== null && (
        <p className="text-sm text-muted-foreground">
          Action completed successfully, but no data returned (e.g., Delete).
        </p>
      )}
    {!isLoading && !isError && typeof data === "undefined" && (
      <p className="text-sm text-muted-foreground">
        No data available or action not yet performed.
      </p>
    )}
  </div>
);
