export interface ErrorResponseData {
  message: string;
  details?: any;
  errors?: { field: string; message: string }[];
}