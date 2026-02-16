/**
 * LIB: Consent Management
 * -----------------------------------------------------------------------------
 * Contrato oficial de consentimento (LGPD/GDPR compliant).
 * Compatível com Next.js 16 + TypeScript 6.
 */

export const CONSENT_VERSION = "v1";

export const CONSENT_COOKIE_NAME =
  `portfolio_consent_${CONSENT_VERSION}` as const;

export interface ConsentPreferences {
  readonly necessary: true;
  readonly analytics: boolean;
}

export const DEFAULT_CONSENT: Readonly<ConsentPreferences> = Object.freeze({
  necessary: true,
  analytics: false,
});

export const CONSENT_COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 365,
} as const;

/**
 * Type guard seguro
 */
export function isValidConsent(
  value: unknown,
): value is ConsentPreferences {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    candidate.necessary === true &&
    typeof candidate.analytics === "boolean"
  );
}

/**
 * Retorna consentimento seguro.
 */
export function getSafeConsent(
  value: unknown,
): ConsentPreferences {
  return isValidConsent(value)
    ? value
    : DEFAULT_CONSENT;
}

/**
 * Serializa consentimento de forma determinística.
 */
export function serializeConsent(
  preferences: ConsentPreferences,
): string {
  return encodeURIComponent(JSON.stringify(preferences));
}
