export interface ErrorDetail {
  title: string;
  message: string;
  action: string;
}

export interface ErrorDictionary {
  InternalServerError: ErrorDetail;
  NotFoundError: ErrorDetail;
  ValidationError: ErrorDetail;
  UnauthorizedError: ErrorDetail;
  ForbiddenError: ErrorDetail;
  TooManyRequestsError: ErrorDetail;
  UnprocessableEntityError: ErrorDetail;
  MethodNotAllowedError: ErrorDetail;
}
