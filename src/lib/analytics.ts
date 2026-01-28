/**
 * LIB: Analytics Unified Layer - Versão Blindada
 */

import {
  CONSENT_COOKIE_NAME,
  DEFAULT_CONSENT,
  getSafeConsent,
  type ConsentPreferences,
} from '@/lib/consent';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (event: string, options?: { props?: any }) => void;
    posthog?: { capture: (event: string, props?: any) => void };
  }
}

function getActiveConsent(): ConsentPreferences {
  // Proteção contra execução no servidor
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_CONSENT;
  }

  try {
    const cookies = document.cookie.split('; ');
    const consentRow = cookies.find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

    if (!consentRow || !consentRow.includes('=')) return DEFAULT_CONSENT;

    const value = consentRow.split('=')[1];
    if (!value) return DEFAULT_CONSENT;

    const rawValue = decodeURIComponent(value).trim();
    
    // Se o valor não for um JSON válido, retorna o padrão para evitar crash
    if (!rawValue.startsWith('{')) return DEFAULT_CONSENT;

    const parsedValue = JSON.parse(rawValue);
    return getSafeConsent(parsedValue);
  } catch (error) {
    console.error('[Analytics] Erro ao ler consentimento:', error);
    return DEFAULT_CONSENT;
  }
}

export function track({ name, props }: { name: string; props?: any }): void {
  if (typeof window === 'undefined') return;

  try {
    const consent = getActiveConsent();
    if (!consent?.analytics) return;

    const eventProps = props || {};

    if (typeof window.gtag === 'function') {
      window.gtag('event', name, eventProps);
    }

    if (typeof window.plausible === 'function') {
      window.plausible(name, { props: eventProps });
    }

    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(name, eventProps);
    }
  } catch (e) {
    console.warn('[Analytics] Falha silenciosa no rastreio:', e);
  }
}
