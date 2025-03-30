import axios, { AxiosError } from "axios";

interface BackendErrorResponse {
  status: "error";
  message: string;
  details?: any;
}

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.data) {
      const backendError = error.response.data as BackendErrorResponse;

      if (backendError.message && typeof backendError.message === "string") {
        try {
          if (
            backendError.message.startsWith("[") &&
            backendError.message.endsWith("]")
          ) {
            const validationErrors = JSON.parse(backendError.message);
            const formattedMessage = validationErrors
              .map(
                (err: { field: string; message: string }) =>
                  `${err.field || "Error"}: ${err.message}`
              )
              .join("\n");
            error.message = `Validation failed:\n${formattedMessage}`;
          } else {
            error.message = backendError.message;
          }
        } catch (parseError) {
          error.message = backendError.message;
        }
      } else if (typeof error.response.data === "string") {
        error.message = error.response.data;
      }
    } else if (error.request) {
      error.message =
        "Network Error: Could not reach the server. Please try again later.";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
