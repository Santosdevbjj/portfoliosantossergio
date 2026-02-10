// src/actions/user-actions.ts
'use server';

import { logger } from "@/lib/logger";
import { ValidationError, InternalServerError } from "@/lib/errors";

/**
 * ACTION: updateProfileAction
 * Descrição: Atualiza os dados do perfil com validação rigorosa e log de observabilidade.
 * Alinhado com: Next.js 16 e TypeScript 5.9+
 */
export async function updateProfileAction(formData: FormData) {
  try {
    // Tratamento seguro do FormData para satisfazer o TypeScript
    const rawName = formData.get("name");
    const name = typeof rawName === 'string' ? rawName.trim() : "";

    // 1. Simulação de Validação
    // Agora o TS sabe que 'name' é string, permitindo o uso de .length
    if (!name || name.length < 3) {
      throw new ValidationError({
        message: "Nome muito curto", // Chave base para tradução
        context: { field: "name", value: name },
        errorLocationCode: "USER_ACTION_001"
      });
    }

    // 2. Lógica de Negócio (Exemplo)
    // No mundo real: await db.user.update({ data: { name } })
    
    return { success: true };

  } catch (error: any) {
    // 3. REGISTRO NO LOGGER (Ciclo de observabilidade para Engenharia de Dados)
    // O erro completo (stack trace + contexto) fica apenas no servidor por segurança.
    logger.error(error, { 
      action: "updateProfileAction",
      timestamp: new Date().toISOString() 
    });

    // 4. RETORNO PARA O CLIENTE (Normalização para o Dicionário de Erros)
    // Retornamos apenas o necessário para a UI buscar a tradução nos JSONs.
    
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          name: "ValidationError", // Deve bater exatamente com a chave no ErrorDictionary
          message: error.message,
          errorId: error.errorId,
          code: error.errorLocationCode
        }
      };
    }

    // Erro genérico/inesperado (Internal Server Error)
    const internalErr = new InternalServerError({ cause: error });
    return {
      success: false,
      error: {
        name: "InternalServerError", // Chave do dicionário para erro 500
        message: internalErr.message,
        errorId: internalErr.errorId
      }
    };
  }
}
