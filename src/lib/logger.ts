// src/lib/logger.ts
import { BaseError } from "@/lib/errors";

/**
 * Interface para logs estruturados
 * Alinhado com padrões de observabilidade modernos (Datadog/Sentry)
 */
interface LogMetadata {
  level: "INFO" | "WARN" | "ERROR" | "FATAL";
  timestamp: string;
  name?: string;
  message: string;
  errorId?: string;
  requestId?: string;
  location?: string;
  context?: unknown;
  stack?: string;
  env: string;
}

export const logger = {
  /**
   * Registra erros de forma estruturada.
   * Se for uma instância de BaseError, extrai metadados automáticos.
   */
  error: (error: unknown, additionalContext?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const env = process.env.NODE_ENV || "development";

    let logPayload: LogMetadata;

    if (error instanceof BaseError) {
      logPayload = {
        level: "ERROR",
        timestamp,
        env,
        name: error.name,
        message: error.message,
        errorId: error.errorId,
        requestId: error.requestId,
        location: error.errorLocationCode,
        context: {
          ...(typeof error.context === "object" ? error.context : {}),
          ...additionalContext,
        },
        stack: error.stack,
      };
    } else {
      // Fallback para erros nativos ou desconhecidos
      const isError = error instanceof Error;
      logPayload = {
        level: "ERROR",
        timestamp,
        env,
        name: isError ? error.name : "UNKNOWN_ERROR",
        message: isError ? error.message : String(error),
        context: additionalContext,
        stack: isError ? error.stack : undefined,
      };
    }

    // Em Desenvolvimento: Log visualmente rico
    if (env === "development") {
      console.error(
        `🔴 [${logPayload.timestamp}] ${logPayload.name}${
          logPayload.errorId ? ` (${logPayload.errorId})` : ""
        }: ${logPayload.message}`,
        logPayload.context || ""
      );
      
      if (logPayload.stack) {
        // Log trace resumido em dev para não poluir o terminal, mas manter utilidade
        console.error(`🔍 Stack Trace: ${logPayload.stack.split("\n")[1]}`);
      }
    } else {
      // Em Produção: Log estruturado (JSON) para ingestão por CloudWatch/Datadog/BetterStack
      // Omitimos stack traces muito longos dependendo da política de custos/segurança
      console.log(JSON.stringify(logPayload));
    }
  },

  /**
   * Registra informações operacionais
   */
  info: (message: string, context?: Record<string, unknown>) => {
    const payload = {
      level: "INFO",
      timestamp: new Date().toISOString(),
      message,
      context,
      env: process.env.NODE_ENV || "development",
    };

    if (process.env.NODE_ENV === "development") {
      console.log(`🔵 [${payload.timestamp}] INFO: ${message}`, context || "");
    } else {
      console.log(JSON.stringify(payload));
    }
  },
};
