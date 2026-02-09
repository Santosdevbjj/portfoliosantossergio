// src/lib/http/handleApiError.ts
import { NextRequest, NextResponse } from "next/server";
import { BaseError, InternalServerError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { ErrorDictionary } from "@/types/error-dictionary";

// Importação dinâmica dos dicionários (Pode ser ajustado conforme sua estratégia de build)
import ptBR from "@/dictionaries/errors/pt-BR.json";
import enUS from "@/dictionaries/errors/en-US.json";
import esES from "@/dictionaries/errors/es-ES.json";
import esAR from "@/dictionaries/errors/es-AR.json";
import esMX from "@/dictionaries/errors/es-MX.json";

const dictionaries: Record<string, { errors: ErrorDictionary }> = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
  "es-AR": esAR,
  "es-MX": esMX,
};

/**
 * Handle API Error
 * Totalmente consistente com o dicionário de erros e suporte i18n.
 */
export function handleApiError(error: unknown, request?: NextRequest) {
  // 1. Normalização do Erro
  const err =
    error instanceof BaseError
      ? error
      : new InternalServerError({
          cause: error,
          message: error instanceof Error ? error.message : undefined,
        });

  // 2. Registro do Log (Backend retém o erro técnico completo)
  logger.error(err);

  // 3. Identificação do Idioma (i18n)
  // Tenta pegar do header Accept-Language, fallback para pt-BR
  const acceptLanguage = request?.headers.get("accept-language")?.split(",")[0] || "pt-BR";
  const locale = dictionaries[acceptLanguage] ? acceptLanguage : "pt-BR";
  const dictionary = dictionaries[locale].errors;

  // 4. Mapeamento da tradução baseada na classe do erro
  // Se o erro for "NotFoundError", buscamos dictionary.NotFoundError
  const errorKey = err.name as keyof ErrorDictionary;
  const translation = dictionary[errorKey] || dictionary.InternalServerError;

  // 5. Construção da Resposta para o Cliente
  return NextResponse.json(
    {
      error: {
        name: err.name,
        title: translation.title, // Consistente com o dicionário
        message: err.message || translation.message, // Prioriza mensagem específica ou a do dicionário
        action: translation.action, // Instrução amigável do dicionário
        error_id: err.errorId,
        request_id: err.requestId,
        // Segurança: Contexto apenas para erros de validação (ex: campos faltando)
        context: err.name === "ValidationError" ? err.context : undefined,
      },
    },
    { status: err.statusCode }
  );
}
