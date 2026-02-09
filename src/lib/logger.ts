// src/lib/logger.ts
import { BaseError } from "@/lib/errors";

export const logger = {
  error: (error: unknown, additionalContext?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    
    if (error instanceof BaseError) {
      const logPayload = {
        level: "ERROR",
        timestamp,
        name: error.name,
        message: error.message,
        errorId: error.errorId,
        requestId: error.requestId,
        location: error.errorLocationCode,
        context: {
          ...(error.context as object),
          ...additionalContext,
        },
        stack: error.stack, // Em produção, você pode querer omitir isso ou enviar apenas para o Sentry
      };

      // Em desenvolvimento usamos console.error colorido, 
      // Em produção, isso iria para um serviço de agregação de logs (Datadog, BetterStack, etc)
      console.error(`[${timestamp}] 🔴 ${error.name} (${error.errorId}): ${error.message}`, logPayload);
      return;
    }

    // Fallback para erros genéricos (não instanciados pela nossa BaseError)
    console.error(`[${timestamp}] 🔴 UNKNOWN_ERROR:`, error, additionalContext);
  },

  info: (message: string, context?: Record<string, unknown>) => {
    console.log(`[${new Date().toISOString()}] 🔵 INFO: ${message}`, context || "");
  }
};
