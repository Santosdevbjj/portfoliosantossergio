/**
 * LIB: Consent Management
 * -----------------------------------------------------------------------------
 * Gerencia preferências de consentimento do usuário em conformidade com LGPD / GDPR.
 * * * Foco: Integridade de dados para Analytics e Cookies Essenciais.
 * * Este arquivo é o contrato de verdade para o Cookie Banner e Scripts de Terceiros.
 */

/**
 * Versão do schema de consentimento.
 * Incrementada apenas se a estrutura da interface mudar.
 */
export const CONSENT_VERSION = 'v1';

/**
 * Nome canônico do cookie de consentimento.
 */
export const CONSENT_COOKIE_NAME = `portfolio_consent_${CONSENT_VERSION}`;

/**
 * Estrutura oficial de preferências de consentimento.
 * O uso de 'readonly' garante que as preferências não sejam alteradas acidentalmente em runtime.
 */
export interface ConsentPreferences {
  /**
   * Cookies estritamente necessários (Sessão, Idioma, Segurança).
   * Obrigatório por lei → sempre true.
   */
  readonly necessary: true;

  /**
   * Cookies de performance e analytics (Google Analytics, Vercel Analytics).
   */
  readonly analytics: boolean;
}

/**
 * Consentimento padrão (Privacy by Default).
 * Em conformidade com a LGPD, analytics começa como 'false'.
 */
export const DEFAULT_CONSENT: Readonly<ConsentPreferences> = {
  necessary: true,
  analytics: false,
};

/**
 * Opções de persistência para o cookie de consentimento.
 */
export const CONSENT_COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: false, // Precisa ser lido via JS para ativar scripts de Analytics
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 365, // 1 ano
} as const;

/**
 * Type Guard: Valida se um objeto desconhecido (vindo do cookie) 
 * respeita o contrato de consentimento.
 */
export function isValidConsent(value: unknown): value is ConsentPreferences {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    candidate.necessary === true &&
    typeof candidate.analytics === 'boolean'
  );
}

/**
 * Helper: Retorna um objeto de consentimento seguro.
 * Protege a aplicação contra valores corrompidos ou schemas antigos no navegador do usuário.
 */
export function getSafeConsent(value: unknown): ConsentPreferences {
  if (isValidConsent(value)) {
    return value;
  }
  return DEFAULT_CONSENT;
}

/**
 * Nota Técnica:
 * Para salvar o consentimento, utilize:
 * cookieStore.set(CONSENT_COOKIE_NAME, JSON.stringify(preferences), CONSENT_COOKIE_OPTIONS);
 */
