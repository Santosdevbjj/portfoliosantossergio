import { z } from "zod";

/**
 * SCHEMA DE VALIDAÇÃO DE AMBIENTE - NEXT.JS 16.2 + TS 6.0
 * -----------------------------------------------------------------------------
 * Alinhado com Node 24 e as novas regras de acesso a process.env.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_DEV_SERVER_HOST: z.string().default("localhost"),
  NEXT_DEV_SERVER_PORT: z.coerce.number().default(3000),
  
  // URL Base do App - Otimizado para SEO e MetadataBase do Next 16
  NEXT_PUBLIC_APP_URL: z.string().url().default("https://portfoliosantossergio.vercel.app"),
  
  // Token de segurança (exemplo para o GitHub Octokit)
  GITHUB_TOKEN: z.string().optional(),
});

/**
 * ACESSO SEGURO (TS 6.0 / NODE 24)
 * Conforme o erro do log: acesso via ['CHAVE'] para satisfazer a index signature.
 */
const _env = envSchema.safeParse({
  NODE_ENV: process.env['NODE_ENV'],
  NEXT_DEV_SERVER_HOST: process.env['NEXT_DEV_SERVER_HOST'],
  NEXT_DEV_SERVER_PORT: process.env['NEXT_DEV_SERVER_PORT'],
  NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'],
  GITHUB_TOKEN: process.env['GITHUB_TOKEN'],
});

if (!_env.success) {
  // Log detalhado para depuração no Vercel em tempo de build
  console.error("❌ [ENV] Variáveis de ambiente inválidas:", JSON.stringify(_env.error.format(), null, 2));
  
  // Em produção, interrompemos o build para evitar deploy com erros de config
  if (process.env['NODE_ENV'] === "production") {
    throw new Error("Falha no build: Variáveis de ambiente obrigatórias não configuradas.");
  }
}

// Exportação tipada e segura
export const env = _env.success ? _env.data : ({} as z.infer<typeof envSchema>);

/**
 * FUNÇÃO HELPER: getBaseUrl
 * Alinhada com as novas APIs de Metadata do Next.js 16.2 e React 19.
 */
export const getBaseUrl = () => {
  // 1. Prioridade: Variável pública definida no Vercel
  if (env.NEXT_PUBLIC_APP_URL) return env.NEXT_PUBLIC_APP_URL;
  
  // 2. Client-side: Usa caminhos relativos para evitar erros de CORS (React 19)
  if (typeof window !== "undefined") return ""; 
  
  // 3. Fallback Local (Node 24 Server Side)
  return `http://${env.NEXT_DEV_SERVER_HOST}:${env.NEXT_DEV_SERVER_PORT}`;
};
