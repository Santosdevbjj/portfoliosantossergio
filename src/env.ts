import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_DEV_SERVER_HOST: z.string().default("localhost"),
  NEXT_DEV_SERVER_PORT: z.coerce.number().default(3000),
  // No Next.js 16, variáveis usadas no browser PRECISAM de prefixo ou estar no schema
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

const _env = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_DEV_SERVER_HOST: process.env.NEXT_DEV_SERVER_HOST,
  NEXT_DEV_SERVER_PORT: process.env.NEXT_DEV_SERVER_PORT,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  if (process.env.NODE_ENV === "production") throw new Error("Invalid env");
}

export const env = _env.success ? _env.data : ({} as z.infer<typeof envSchema>);

export const getBaseUrl = () => {
  if (env.NEXT_PUBLIC_APP_URL) return env.NEXT_PUBLIC_APP_URL;
  if (typeof window !== "undefined") return ""; // Browser use relative
  return `http://${env.NEXT_DEV_SERVER_HOST}:${env.NEXT_DEV_SERVER_PORT}`;
};
