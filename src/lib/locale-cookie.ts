/**
 * LIB: Locale Cookie
 * -----------------------------------------------------------------------------
 * Responsável por gerenciar a persistência do idioma do usuário via Cookies.
 * Este arquivo garante que a escolha do usuário seja respeitada entre 
 * sessões e requisições, servindo como base para o Middleware e o LanguageSwitcher.
 */

import { i18n, type Locale } from '@/i18n-config';

/**
 * Nome canônico do cookie de idioma.
 * 'NEXT_LOCALE' é o padrão reconhecido pelo ecossistema Next.js.
 */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * ALIAS PARA COMPATIBILIDADE:
 * Adicionado para resolver o erro de build nos componentes que buscam 'LOCALE_COOKIE'.
 */
export const LOCALE_COOKIE = LOCALE_COOKIE_NAME;

/**
 * Reexportação do tipo para manter a independência do domínio de cookies
 */
export type SupportedLocale = Locale;

/**
 * Locale padrão obtido diretamente da configuração global (SSOT - Single Source of Truth)
 */
export const DEFAULT_LOCALE: SupportedLocale = i18n.defaultLocale;

/**
 * Opções de configuração do cookie.
 * Configurado para durar 1 ano e ser acessível via Client/Server.
 */
export const LOCALE_COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: false, // Necessário para o LanguageSwitcher (Client Side) ler/gravar
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 365, // 1 ano (31.536.000 segundos)
} as const;

/**
 * Type Guard: Valida se um valor de entrada é um idioma suportado pelo sistema.
 */
export function isValidLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === 'string' && 
    (i18n.locales as readonly string[]).includes(value)
  );
}

/**
 * Helper: Retorna um locale válido garantido.
 * Caso a entrada seja inválida ou nula, retorna o fallback (pt).
 */
export function getSafeLocale(
  value: unknown,
  fallback: SupportedLocale = DEFAULT_LOCALE,
): SupportedLocale {
  return isValidLocale(value) ? value : fallback;
}
