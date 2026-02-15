// src/lib/errors/index.ts
import { randomUUID } from "crypto";

/**
 * Contrato base de construção de erros alinhado com ErrorDictionary
 */
export interface BaseErrorParams {
  name: string;
  title?: string; // Adicionado para consistência com o dicionário
  message: string;
  action?: string;
  statusCode?: number;
  errorId?: string;
  requestId?: string;
  context?: unknown;
  stack?: string;
  cause?: unknown;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;
}

export class BaseError extends Error {
  public readonly title?: string;
  public readonly statusCode: number;
  public readonly errorId: string;
  public readonly requestId?: string;
  public readonly action?: string;
  public readonly context?: unknown;
  public readonly errorLocationCode?: string;
  public readonly key?: string;
  public readonly type?: string;
  public readonly databaseErrorCode?: string;

  constructor(params: BaseErrorParams) {
    super(params.message);

    this.name = params.name;
    this.title = params.title;
    this.statusCode = params.statusCode ?? 500;
    this.errorId = params.errorId ?? randomUUID();
    this.requestId = params.requestId;
    this.action = params.action;
    this.context = params.context;
    this.errorLocationCode = params.errorLocationCode;
    this.key = params.key;
    this.type = params.type;
    this.databaseErrorCode = params.databaseErrorCode;

    // TypeScript 6.0+ captura de stack trace otimizada
    if (params.stack) {
      this.stack = params.stack;
    }

    if (params.cause) {
      this.cause = params.cause;
    }
  }
}

/* =======================
   Erros específicos
   Nota: As mensagens default aqui servem apenas como "fallback"
   técnico caso o dicionário i18n falhe.
======================= */

export class InternalServerError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "InternalServerError",
      message: params.message ?? "Internal Server Error",
      statusCode: 500,
    });
  }
}

export class NotFoundError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "NotFoundError",
      message: params.message ?? "Resource Not Found",
      statusCode: 404,
    });
  }
}

export class ValidationError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "ValidationError",
      message: params.message ?? "Validation Failed",
      statusCode: 400,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "UnauthorizedError",
      message: params.message ?? "Unauthorized",
      statusCode: 401,
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "ForbiddenError",
      message: params.message ?? "Forbidden",
      statusCode: 403,
    });
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "TooManyRequestsError",
      message: params.message ?? "Too Many Requests",
      statusCode: 429,
    });
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "UnprocessableEntityError",
      message: params.message ?? "Unprocessable Entity",
      statusCode: 422,
    });
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      ...params,
      name: "MethodNotAllowedError",
      message: params.message ?? "Method Not Allowed",
      statusCode: 405,
    });
  }
}
