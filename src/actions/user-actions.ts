'use server';

import { logger } from "@/lib/logger";
import {
  ValidationError,
  InternalServerError,
  BaseError,
} from "@/lib/errors";
import type { ErrorKey } from "@/types/error-dictionary";

/**
 * Tipagem forte do retorno da Action
 */
export type UpdateProfileActionState =
  | { success: true }
  | {
      success: false;
      error: {
        name: ErrorKey;
        message: string;
        errorId: string;
      };
    };

/**
 * ACTION: updateProfileAction
 * Alinhado com:
 * - Next.js 16 Server Actions
 * - TypeScript 6 strict mode
 * - ErrorDictionary
 */
export async function updateProfileAction(
  _: UpdateProfileActionState | null,
  formData: FormData
): Promise<UpdateProfileActionState> {
  try {
    const rawName = formData.get("name");
    const name =
      typeof rawName === "string"
        ? rawName.trim()
        : "";

    /**
     * 1. Validação segura
     */
    if (!name || name.length < 3) {
      throw new ValidationError(
        "ValidationError"
      );
    }

    /**
     * 2. Simulação de regra de negócio
     * Exemplo real:
     * await db.user.update({ data: { name } })
     */

    return { success: true };

  } catch (error: unknown) {
    /**
     * 3. Normalização segura de erro
     */
    const err =
      error instanceof BaseError
        ? error
        : new InternalServerError(
            error instanceof Error
              ? error.message
              : "Unexpected error"
          );

    /**
     * 4. Log estruturado
     */
    logger.error(err);

    /**
     * 5. Retorno compatível com ErrorDictionary
     */
    const errorKey: ErrorKey =
      err.name as ErrorKey;

    return {
      success: false,
      error: {
        name: errorKey,
        message: err.message,
        errorId: err.errorId,
      },
    };
  }
}
