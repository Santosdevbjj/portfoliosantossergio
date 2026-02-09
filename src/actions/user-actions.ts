// src/actions/user-actions.ts
'use server';

import { logger } from "@/lib/logger";
import { ValidationError, InternalServerError } from "@/lib/errors";

export async function updateProfileAction(formData: FormData) {
  try {
    const name = formData.get("name");

    // 1. Simulação de Validação
    if (!name || name.length < 3) {
      throw new ValidationError({
        message: "Nome muito curto",
        context: { field: "name", value: name },
        errorLocationCode: "USER_ACTION_001"
      });
    }

    // 2. Lógica de Negócio (ex: Banco de Dados)
    // await db.user.update(...)
    
    return { success: true };

  } catch (error) {
    // 3. REGISTRO NO LOGGER (O ciclo de observabilidade)
    // O logger captura o erro técnico completo no servidor
    logger.error(error, { action: "updateProfileAction" });

    // 4. RETORNO PARA O CLIENTE
    // Normalizamos o erro para que o componente React saiba o que exibir
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          name: error.name,
          message: error.message, // Será traduzida no componente
          errorId: error.errorId
        }
      };
    }

    // Erro genérico/inesperado
    const internalErr = new InternalServerError({ cause: error });
    return {
      success: false,
      error: {
        name: internalErr.name,
        message: internalErr.message,
        errorId: internalErr.errorId
      }
    };
  }
}
