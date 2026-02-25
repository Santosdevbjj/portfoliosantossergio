// src/env.ts
import { z } from "zod";

/**
 * Define o esquema de validação para variáveis de ambiente.
 * Alinhado com Next.js 16 e TypeScript 6.0.
 */
const envSchema = z.object({
  // Ambiente de Execução
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Configurações do Servidor de Desenvolvimento (Usado pelo MCP)
  NEXT_DEV_SERVER_HOST: z.string().default("localhost"),
  NEXT_DEV_SERVER_PORT: z.coerce.number().default(3000),
  
  // URL Completa (calculada ou vinda do ambiente)
  NEXT_DEV_SERVER_URL: z.string().url().optional(),

  // Adicione outras variáveis do seu .env aqui (ex: DATABASE_URL, API_KEYS)
});

// Validação em tempo de carregamento
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Erro de configuração nas variáveis de ambiente:");
  console.error(JSON.stringify(_env.error.format(), null, 2));
  // Em produção, queremos que o build falhe se as variáveis estiverem erradas
  if (process.env.NODE_ENV === "production") {
    throw new Error("Variáveis de ambiente inválidas.");
  }
}

// Exporta o objeto validado e tipado
export const env = _env.success ? _env.data : ({} as z.infer<typeof envSchema>);

// Helper para montar a URL se não existir
export const getBaseUrl = () => {
  if (env.NEXT_DEV_SERVER_URL) return env.NEXT_DEV_SERVER_URL;
  return `http://${env.NEXT_DEV_SERVER_HOST}:${env.NEXT_DEV_SERVER_PORT}`;
};
