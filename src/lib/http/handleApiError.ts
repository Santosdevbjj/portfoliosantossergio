// src/lib/http/handleApiError.ts
import { NextResponse } from "next/server";
import { BaseError, InternalServerError } from "@/lib/errors";
import { logger } from "@/lib/logger"; // Importando o novo logger

export function handleApiError(error: unknown) {
  const err =
    error instanceof BaseError
      ? error
      : new InternalServerError({
          cause: error,
          message: error instanceof Error ? error.message : undefined,
        });

  // 📝 REGISTRO DO LOG
  // Aqui o erro é capturado internamente antes de devolver a resposta limpa para o cliente
  logger.error(err);

  return NextResponse.json(
    {
      error: {
        name: err.name,
        message: err.message,
        action: err.action,
        error_id: err.errorId,
        request_id: err.requestId,
        // Evitamos enviar o context técnico bruto para o cliente por segurança, 
        // a menos que seja estritamente necessário (como erros de validação)
        context: err.name === "ValidationError" ? err.context : undefined,
      },
    },
    { status: err.statusCode }
  );
}
