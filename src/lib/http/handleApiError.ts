import { NextRequest, NextResponse } from "next/server";
import {
  BaseError,
  InternalServerError,
} from "@/lib/errors";
import { getErrorDictionary } from "@/dictionaries/errors";
import {
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/i18n/locale";
import type { ErrorKey } from "@/types/error-dictionary";
import { logger } from "@/lib/logger";

function resolveLocale(
  request?: NextRequest
): SupportedLocale {
  const header =
    request?.headers
      .get("accept-language")
      ?.split(",")[0] ?? "pt-BR";

  if (isSupportedLocale(header)) {
    return header;
  }

  if (header.startsWith("en")) return "en-US";
  if (header.startsWith("es")) return "es-ES";

  return "pt-BR";
}

function isErrorKey(
  value: string,
  dictionary: Record<string, unknown>
): value is ErrorKey {
  return value in dictionary;
}

export function handleApiError(
  error: unknown,
  request?: NextRequest
) {
  const err =
    error instanceof BaseError
      ? error
      : new InternalServerError(
          error instanceof Error
            ? error.message
            : "Unexpected error"
        );

  logger.error(err);

  const locale = resolveLocale(request);
  const dictionary = getErrorDictionary(locale);

  const key: ErrorKey = isErrorKey(
    err.name,
    dictionary
  )
    ? err.name
    : "InternalServerError";

  const translation = dictionary[key];

  return NextResponse.json(
    {
      error: {
        name: key,
        title: translation.title,
        message:
          err.message || translation.message,
        action: translation.action,
        errorId: err.errorId,
      },
    },
    { status: err.statusCode }
  );
}
