export const SUPPORTED_LOCALES = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX",
] as const;

export type SupportedLocale =
  (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(
  value: string
): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(
    value as SupportedLocale
  );
}
