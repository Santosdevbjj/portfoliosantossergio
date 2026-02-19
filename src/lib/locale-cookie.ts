/**
 * LIB: Locale Cookie
 * -----------------------------------------------------------------------------
 * Persistência oficial do locale.
 * Alinhado com dictionaries/locales (SSOT).
 */

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/dictionaries/locales";

export const LOCALE_COOKIE = "NEXT_LOCALE" as const;

export type { SupportedLocale };

export const LOCALE_COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 365,
} as const;

export function isValidLocale(
  value: unknown,
): value is SupportedLocale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

export function getSafeLocale(
  value: unknown,
  fallback: SupportedLocale = DEFAULT_LOCALE,
): SupportedLocale {
  return isValidLocale(value) ? value : fallback;
}
