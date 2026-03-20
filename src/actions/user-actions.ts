'use server';

import { logger } from "@/lib/logger";
import {
  ValidationError,
  InternalServerError,
  BaseError,
} from "@/lib/errors";
import type { ErrorKey } from "@/types/error-dictionary";

/**
 * ESTADO DA AÇÃO - REACT 19 COMPLIANT
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16.2.0, TS 6.0, Node 24
 */
export type UpdateProfileActionState =
  | { success: true; message?: string }
  | {
      success: false;
      error: {
        name: ErrorKey;
        message: string;
        errorId: string;
      };
    }
  | null;

export async function updateProfileAction(
  prevState: UpdateProfileActionState,
  formData: FormData
): Promise<UpdateProfileActionState> {
  try {
    // Node 24: Sanitização nativa de strings
    const name = formData.get("name")?.toString().trim() ?? "";

    // Validação de Negócio
    if (!name || name.length < 3) {
      // Lançamos o erro que mapeia para a chave 'ValidationError'
      throw new ValidationError("Nome inválido no servidor.");
    }

    // Lógica de persistência aqui (ex: DB Update)
    
    return { 
      success: true, 
      message: "Success" // Opcional, a tradução real ocorre no Client
    };

  } catch (error: unknown) {
    const err = error instanceof BaseError
      ? error
      : new InternalServerError(
          error instanceof Error ? error.message : "Unexpected error"
        );

    // Logging centralizado no Servidor
    logger.error({
      id: err.errorId,
      name: err.name,
      message: err.message
    });

    return {
      success: false,
      error: {
        name: err.name as ErrorKey, // Garante compatibilidade com o dicionário
        message: err.message,
        errorId: err.errorId,
      },
    };
  }
}
