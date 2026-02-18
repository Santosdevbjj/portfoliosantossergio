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
    this.errorId =
      params.errorId ?? crypto.randomUUID();
    this.requestId = params.requestId;
    this.context = params.context;

    if (params.cause) {
      this.cause = params.cause;
    }
  }
}

/* ==== Specific Errors ==== */

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
