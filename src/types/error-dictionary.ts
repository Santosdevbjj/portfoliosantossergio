export interface ErrorDetail {
  readonly title: string
  readonly message: string
  readonly action: string
}

export interface ErrorDictionary {
  readonly InternalServerError: ErrorDetail
  readonly NotFoundError: ErrorDetail
  readonly ValidationError: ErrorDetail
  readonly UnauthorizedError: ErrorDetail
  readonly ForbiddenError: ErrorDetail
  readonly TooManyRequestsError: ErrorDetail
  readonly UnprocessableEntityError: ErrorDetail
  readonly MethodNotAllowedError: ErrorDetail
}
