export interface StrapiValidationErrorResponse {
  data: unknown;
  error: StrapiValidationError;
}

export interface StrapiValidationError {
  status: number;
  name: string;
  message: string;
  details: { [key: string]: unknown };
}
