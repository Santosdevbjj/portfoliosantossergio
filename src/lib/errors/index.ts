// src/lib/errors/index.ts
import crypto from "crypto";

/**
 * Contrato base de construção de erros
 */
export interface BaseErrorParams {
  name: string;
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
    this.statusCode = params.statusCode ?? 500;
    this.errorId = params.errorId ?? crypto.randomUUID();
    this.requestId = params.requestId;
    this.action = params.action;
    this.context = params.context;
    this.errorLocationCode = params.errorLocationCode;
    this.key = params.key;
    this.type = params.type;
    this.databaseErrorCode = params.databaseErrorCode;

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
======================= */

export class InternalServerError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      name: "InternalServerError",
      message: params.message ?? "Um erro interno não esperado aconteceu.",
      action:
        params.action ??
        "Informe ao suporte o valor encontrado no campo 'error_id'.",
      statusCode: params.statusCode ?? 500,
      requestId: params.requestId,
      errorId: params.errorId,
      stack: params.stack,
      errorLocationCode: params.errorLocationCode,
      cause: params.cause,
    });
  }
}

export class NotFoundError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      name: "NotFoundError",
      message:
        params.message ??
        "Não foi possível encontrar este recurso no sistema.",
      action:
        params.action ??
        "Verifique se o caminho (PATH) está correto.",
      statusCode: 404,
      requestId: params.requestId,
      errorId: params.errorId,
      stack: params.stack,
      errorLocationCode: params.errorLocationCode,
      key: params.key,
    });
  }
}

export class ValidationError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      name: "ValidationError",
      message: params.message ?? "Um erro de validação ocorreu.",
      action:
        params.action ??
        "Ajuste os dados enviados e tente novamente.",
      statusCode: params.statusCode ?? 400,
      stack: params.stack,
      context: params.context,
      errorLocationCode: params.errorLocationCode,
      key: params.key,
      type: params.type,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      name: "UnauthorizedError",
      message: params.message ?? "Usuário não autenticado.",
      action:
        params.action ??
        "Verifique se você está autenticado com uma sessão ativa.",
      statusCode: 401,
      requestId: params.requestId,
      stack: params.stack,
      errorLocationCode: params.errorLocationCode,
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      name: "ForbiddenError",
      message:
        params.message ??
        "Você não possui permissão para executar esta ação.",
      action:
        params.action ??
        "Verifique se você possui permissão para executar esta ação.",
      statusCode: 403,
      requestId: params.requestId,
      stack: params.stack,
      errorLocationCode: params.errorLocationCode,
    });
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      name: "TooManyRequestsError",
      message:
        params.message ??
        "Você realizou muitas requisições recentemente.",
      action:
        params.action ??
        "Tente novamente mais tarde ou contate o suporte.",
      statusCode: 429,
      context: params.context,
      stack: params.stack,
      errorLocationCode: params.errorLocationCode,
    });
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      name: "UnprocessableEntityError",
      message:
        params.message ??
        "Não foi possível realizar esta operação.",
      action:
        params.action ??
        "Os dados enviados estão corretos, porém a operação falhou.",
      statusCode: 422,
      stack: params.stack,
      errorLocationCode: params.errorLocationCode,
    });
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(params: Partial<BaseErrorParams> = {}) {
    super({
      name: "MethodNotAllowedError",
      message:
        params.message ??
        "Método não permitido para este recurso.",
      action:
        params.action ??
        "Verifique se o método HTTP utilizado é válido.",
      statusCode: 405,
      requestId: params.requestId,
      errorId: params.errorId,
      stack: params.stack,
      errorLocationCode: params.errorLocationCode,
    });
  }
}
