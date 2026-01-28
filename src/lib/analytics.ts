/**
 * LIB: Analytics Unified Layer
 * -----------------------------------------------------------------------------
 * Camada de abstração para rastreamento de eventos.
 * * Garante que NENHUM dado seja enviado se o usuário não consentir.
 * * Blindado contra erros de SSR (Server-Side Rendering).
 * * Compatível com múltiplos provedores simultaneamente.
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

/**
 * Estrutura de um evento de métrica.
 */
export interface AnalyticsEvent {
  readonly name: string;
  readonly props?: Record<string, unknown>;
}

/**
 * Extensão do objeto Window para suporte aos SDKs de terceiros.
 * Evita o uso de 'any' e melhora o IntelliSense.
 */
declare global {
  interface Window {
    // Google Analytics
    gtag?: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    
    // Plausible Analytics
    plausible?: (
      event: string,
      options?: { props?: Record<string, unknown> }
    ) => void;
    
    // PostHog
    posthog?: {
      capture: (event: string, props?: Record<string, unknown>) => void;
    };
  }
}

/* -------------------------------------------------------------------------- */
/* CONSENT ENGINE                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Recupera as preferências de consentimento diretamente do navegador.
 * Executa apenas no Client-side.
 */
function getActiveConsent(): ConsentPreferences {
  // Se estiver no servidor, retorna o padrão restritivo
  if (typeof document === 'undefined') return DEFAULT_CONSENT;

  try {
    const cookies = document.cookie.split('; ');
    const consentRow = cookies.find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

    if (!consentRow) return DEFAULT_CONSENT;

    // CORREÇÃO: Pegamos a parte após o '=' e garantimos que não é undefined
    const parts = consentRow.split('=');
    const value = parts[1];

    if (!value) return DEFAULT_CONSENT;

    const rawValue = decodeURIComponent(value);
    const parsedValue = JSON.parse(rawValue);

    return getSafeConsent(parsedValue);
  } catch (error) {
    console.warn('[Analytics] Erro ao ler cookie de consentimento, usando padrão.', error);
    return DEFAULT_CONSENT;
  }
}

/* -------------------------------------------------------------------------- */
/* TRACKING CORE                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Dispara um evento para todos os provedores ativos, 
 * desde que o consentimento de 'analytics' esteja habilitado.
 */
export function track({ name, props }: AnalyticsEvent): void {
  // Proteção contra execução no servidor
  if (typeof window === 'undefined') return;

  // Verificação de soberania do usuário (LGPD)
  const consent = getActiveConsent();
  if (!consent.analytics) {
    return;
  }

  // Sanitização de propriedades para evitar envio de dados sensíveis vazios
  const eventProps = props || {};

  /* 1. Google Analytics (gtag.js) */
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, eventProps);
  }

  /* 2. Plausible Analytics */
  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: eventProps });
  }

  /* 3. PostHog */
  if (typeof window.posthog?.capture === 'function') {
    window.posthog.capture(name, eventProps);
  }
}
