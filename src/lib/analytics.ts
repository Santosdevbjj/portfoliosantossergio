/**
 * LIB: Analytics Unified Layer (Versão Sênior - Anti-Hydration Error)
 */

import {
  CONSENT_COOKIE_NAME,
  DEFAULT_CONSENT,
  getSafeConsent,
  type ConsentPreferences,
} from '@/lib/consent';

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

/**
 * Recupera o consentimento apenas no lado do cliente.
 */
function getActiveConsent(): ConsentPreferences {
  // Se não estiver no navegador, retorna o padrão restritivo imediatamente
  if (typeof window === 'undefined') return DEFAULT_CONSENT;

  try {
    const cookies = document.cookie.split('; ');
    const consentRow = cookies.find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

    if (!consentRow || !consentRow.includes('=')) return DEFAULT_CONSENT;

    const value = consentRow.split('=')[1];
    if (!value) return DEFAULT_CONSENT;

    const rawValue = decodeURIComponent(value).trim();
    
    // Proteção crucial: Só tenta o parse se a string parecer um objeto
    if (rawValue.startsWith('{') && rawValue.endsWith('}')) {
      const parsedValue = JSON.parse(rawValue);
      return getSafeConsent(parsedValue);
    }
    
    return DEFAULT_CONSENT;
  } catch (error) {
    console.warn('[Analytics] Consent recovery silent fail:', error);
    return DEFAULT_CONSENT;
  }
}

/**
 * Dispara eventos de forma segura.
 */
export function track({ name, props }: AnalyticsEvent): void {
  // 1. Bloqueio de execução no servidor (Hydration Shield)
  if (typeof window === 'undefined') return;

  try {
    const consent = getActiveConsent();
    
    // 2. Só prossegue se o usuário deu ok para analytics
    if (!consent?.analytics) return;

    const eventProps = props || {};

    // 3. Execução segura nos provedores
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
    // 4. Erros de tracking nunca devem derrubar a aplicação principal
    console.error('[Analytics] Track failed:', err);
  }
}
