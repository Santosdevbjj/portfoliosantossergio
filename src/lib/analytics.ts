/**
 * LIB: Analytics Unified Layer
 * -----------------------------------------------------------------------------
 * Blindado contra erros de Hidratação e Runtime Exceptions.
 */

import {
  CONSENT_COOKIE_NAME,
  DEFAULT_CONSENT,
  getSafeConsent,
  type ConsentPreferences,
} from '@/lib/consent';

/* -------------------------------------------------------------------------- */
/* TYPES & GLOBAL DECLARATIONS                                                */
/* -------------------------------------------------------------------------- */

export interface AnalyticsEvent {
  readonly name: string;
  readonly props?: Record<string, unknown>;
}

declare global {
  interface Window {
    gtag?: (command: any, targetId: any, config?: any) => void;
    plausible?: (event: string, options?: { props?: any }) => void;
    posthog?: { capture: (event: string, props?: any) => void };
  }
}

/* -------------------------------------------------------------------------- */
/* CONSENT ENGINE                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Recupera o consentimento com múltiplas camadas de proteção.
 */
function getActiveConsent(): ConsentPreferences {
  // 1. SSR Check: Nunca tenta ler cookies no servidor
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_CONSENT;
  }

  try {
    const cookies = document.cookie.split('; ');
    const consentRow = cookies.find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

    // 2. Se o cookie não existir ou estiver vazio
    if (!consentRow || !consentRow.includes('=')) {
      return DEFAULT_CONSENT;
    }

    const parts = consentRow.split('=');
    // Garantia para o TypeScript: extraímos o valor e checamos se ele existe
    const valueToDecode = parts[1];

    if (!valueToDecode) {
      return DEFAULT_CONSENT;
    }

    const rawValue = decodeURIComponent(valueToDecode).trim();

    // 3. Validação de formato JSON: Impede que o JSON.parse quebre o site
    if (!rawValue || !rawValue.startsWith('{') || !rawValue.endsWith('}')) {
      return DEFAULT_CONSENT;
    }

    const parsedValue = JSON.parse(rawValue);
    
    // 4. Sanitização do Objeto
    return getSafeConsent(parsedValue);
  } catch (error) {
    // 5. Fail-safe: Em caso de erro, usa o padrão restritivo e não derruba o app
    console.warn('[Analytics] Consent recovery failed, using defaults.', error);
    return DEFAULT_CONSENT;
  }
}

/* -------------------------------------------------------------------------- */
/* TRACKING CORE                                                              */
/* -------------------------------------------------------------------------- */

export function track({ name, props }: AnalyticsEvent): void {
  // Proteção: Nunca roda tracking no servidor ou se o ambiente não estiver pronto
  if (typeof window === 'undefined') return;

  try {
    const consent = getActiveConsent();
    
    // LGPD: Só rastreia se houver consentimento explícito para analytics
    if (!consent || !consent.analytics) return;

    const eventProps = props || {};

    // Injeção segura nos provedores
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, eventProps);
    }

    if (typeof window.plausible === 'function') {
      window.plausible(name, { props: eventProps });
    }

    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(name, eventProps);
    }
  } catch (err) {
    // Silencia erros de tracking para não afetar a UX
    console.error('[Analytics] Tracking error:', err);
  }
}
