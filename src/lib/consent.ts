/**
 * LIB: Consent Management (LGPD/GDPR)
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Suporte a Cookies e Server/Client components.
 * ✔ TypeScript 6.0: Correção de Index Signature Access.
 * ✔ Node 24: Otimização de serialização determinística.
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

/**
 * CONFIGURAÇÕES DE COOKIE
 * TS 6.0 exige acesso via colchetes para process.env
 */
export const CONSENT_COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
  httpOnly: false, // Precisa ser acessível via JS para GTM/Analytics
  secure: process.env['NODE_ENV'] === "production",
  maxAge: 60 * 60 * 24 * 365, // 1 ano
} as const;

/**
 * TYPE GUARD SEGURO (TS 6.0 COMPLIANT)
 * -----------------------------------------------------------------------------
 * Resolve o erro de 'index signature' usando acesso via colchetes.
 */
export function isValidConsent(
  value: unknown,
): value is ConsentPreferences {
  if (typeof value !== "object" || value === null) return false;

  // Casting para Record para validação de chaves dinâmicas
  const candidate = value as Record<string, unknown>;

  // No TS 6.0, propriedades de Records devem ser acessadas com ['key']
  return (
    candidate['necessary'] === true &&
    typeof candidate['analytics'] === "boolean"
  );
}

/**
 * RETORNA CONSENTIMENTO SEGURO
 */
export function getSafeConsent(
  value: unknown,
): ConsentPreferences {
  return isValidConsent(value)
    ? value
    : DEFAULT_CONSENT;
}

/**
 * SERIALIZAÇÃO DETERMINÍSTICA (Node 24 Optimized)
 * Garante que o JSON no cookie seja válido e seguro contra caracteres especiais.
 */
export function serializeConsent(
  preferences: ConsentPreferences,
): string {
  try {
    return encodeURIComponent(JSON.stringify(preferences));
  } catch (error) {
    console.error("❌ [CONSENT] Erro ao serializar:", error);
    return encodeURIComponent(JSON.stringify(DEFAULT_CONSENT));
  }
}

/**
 * PARSE DE CONSENTIMENTO
 * Auxiliar para recuperar o estado do cookie no Next.js 16
 */
export function parseConsent(cookieValue: string | undefined): ConsentPreferences {
  if (!cookieValue) return DEFAULT_CONSENT;
  try {
    const decoded = JSON.parse(decodeURIComponent(cookieValue));
    return getSafeConsent(decoded);
  } catch {
    return DEFAULT_CONSENT;
  }
}
