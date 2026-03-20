'use server';

import { logger } from "@/lib/logger";
import {
  ValidationError,
  InternalServerError,
  BaseError,
} from "@/lib/errors";
import type { ErrorKey } from "@/types/error-dictionary";

/**
 * ESTADO DA AÇÃO - COMPATÍVEL COM REACT 19 (useActionState)
 * -----------------------------------------------------------------------------
 * ✔ Suporte a TypeScript 6.0: Tipagem estrita de chaves de erro.
 * ✔ Alinhado com Next.js 16.2: Otimizado para Turbopack.
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
  | null; // Estado inicial permitido no React 19

/**
 * ACTION: updateProfileAction
 * Responsável por processar atualizações de perfil com validação rigorosa.
 * * @param prevState - O estado anterior (exigido pelo useActionState do React 19)
 * @param formData - Dados do formulário
 */
export async function updateProfileAction(
  prevState: UpdateProfileActionState,
  formData: FormData
): Promise<UpdateProfileActionState> {
  try {
    // 1. Extração e Sanitização (Node 24 Native methods)
    const name = formData.get("name")?.toString().trim() ?? "";

    // 2. Validação conforme Dicionário de Erros (ValidationError)
    if (!name || name.length < 3) {
      throw new ValidationError("O nome deve conter pelo menos 3 caracteres.");
    }

    // Simulação de lógica de persistência
    // await db.user.update(...)

    // 3. Sucesso: Retorno limpo para o Cliente
    return { 
      success: true, 
      message: "Perfil atualizado com sucesso" 
    };

  } catch (error: unknown) {
    // 4. Tratamento de Erros Centralizado e Multilingue
    const err = error instanceof BaseError
      ? error
      : new InternalServerError(
          error instanceof Error ? error.message : "Unexpected error"
        );

    // Logging seguro no servidor (Node 24)
    logger.error({
      id: err.errorId,
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    /**
     * MAPEAMENTO PARA O DICIONÁRIO:
     * Garante que o frontend receba uma chave válida (ErrorKey) 
     * para buscar a tradução correta no pt-BR.json, en-US.json, etc.
     */
    const errorKey = (err.name as ErrorKey) || "InternalServerError";

    return {
      success: false,
      error: {
        name: errorKey,
        message: err.message, // Mensagem técnica para log/debug
        errorId: err.errorId, // Referência para suporte técnico
      },
    };
  }
}
