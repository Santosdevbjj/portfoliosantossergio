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
 * Executa apenas no Client-side com proteções robustas contra falhas.
 */
function getActiveConsent(): ConsentPreferences {
  // 1. Proteção absoluta contra execução no Servidor (SSR)
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_CONSENT;
  }

  try {
    const cookies = document.cookie.split('; ');
    const consentRow = cookies.find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

    // 2. Se o cookie não existir ou for inválido, retorna padrão sem erro
    if (!consentRow || !consentRow.includes('=')) {
      return DEFAULT_CONSENT;
    }

    const value = consentRow.split('=')[1];
    if (!value) return DEFAULT_CONSENT;

    const rawValue = decodeURIComponent(value).trim();

    // 3. Verificação pré-parse: se não parecer um objeto JSON, aborta
    if (!rawValue.startsWith('{') || !rawValue.endsWith('}')) {
      return DEFAULT_CONSENT;
    }

    const parsedValue = JSON.parse(rawValue);

    // 4. Valida a estrutura através da lib/consent
    return getSafeConsent(parsedValue);
  } catch (error) {
    // 5. Fallback silencioso: o site continua funcionando mesmo se o cookie falhar
    console.error('[Analytics] Erro crítico ao processar consentimento:', error);
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

  try {
    // Verificação de soberania do usuário (LGPD)
    const consent = getActiveConsent();
    if (!consent.analytics) {
      return;
    }

    // Sanitização de propriedades
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
  } catch (trackError) {
    // Garante que uma falha no rastreio não interrompa a experiência do usuário
    console.warn('[Analytics] Falha ao disparar evento:', name, trackError);
  }
}
