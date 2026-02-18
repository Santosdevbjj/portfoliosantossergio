export interface BaseErrorParams {
  name: string;
  message: string;
  statusCode?: number;
  errorId?: string;
  requestId?: string;
  context?: unknown;
  cause?: unknown;
}

export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly errorId: string;
  public readonly requestId?: string;
  public readonly context?: unknown;

  constructor(params: BaseErrorParams) {
    super(params.message);

    this.name = params.name;
    this.statusCode = params.statusCode ?? 500;
    this.errorId = params.errorId ?? crypto.randomUUID();
    this.requestId = params.requestId;
    this.context = params.context;

    if (params.cause) {
      this.cause = params.cause;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/* ============================================================
   ERROR CLASSES — 100% alinhadas com ErrorDictionary
============================================================ */

export class InternalServerError extends BaseError {
  constructor(message = "Internal Server Error") {
    super({
      name: "InternalServerError",
      message,
      statusCode: 500,
    });
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "Resource Not Found") {
    super({
      name: "NotFoundError",
      message,
      statusCode: 404,
    });
  }
}

export class ValidationError extends BaseError {
  constructor(message = "Validation failed") {
    super({
      name: "ValidationError",
      message,
      statusCode: 400,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super({
      name: "UnauthorizedError",
      message,
      statusCode: 401,
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super({
      name: "ForbiddenError",
      message,
      statusCode: 403,
    });
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(message = "Too Many Requests") {
    super({
      name: "TooManyRequestsError",
      message,
      statusCode: 429,
    });
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(message = "Unprocessable Entity") {
    super({
      name: "UnprocessableEntityError",
      message,
      statusCode: 422,
    });
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(message = "Method Not Allowed") {
    super({
      name: "MethodNotAllowedError",
      message,
      statusCode: 405,
    });
  }
}
