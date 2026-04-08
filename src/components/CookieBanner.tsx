'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import type { Dictionary } from '@/types/dictionary';
import type { CookieConsent } from '@/types/cookies';

/**
 * 🔒 CONFIG
 */
const CONSENT_KEY = 'santos-sergio-consent';
const CONSENT_VERSION = '1.1';

interface CookieBannerProps {
  readonly dict: Dictionary;
}

export function CookieBanner({ dict }: CookieBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { cookie } = dict;

  /**
   * 🧠 Inicializa Consent Mode (DEFAULT DENIED)
   */
  const initConsentMode = useCallback(() => {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];

    if (!window.gtag) {
      window.gtag = (command, targetId, params) => {
        window.dataLayer?.push([command, targetId, params]);
      };
    }

    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });
  }, []);

  /**
   * 🚀 Atualiza consentimento
   */
  const updateConsent = useCallback((granted: boolean) => {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
    });
  }, []);

  /**
   * 📊 Carrega Google Analytics (APÓS consentimento)
   */
  const loadAnalytics = useCallback(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return;
    if (typeof window === 'undefined') return;

    if (document.getElementById('ga-script')) return;

    const script = document.createElement('script');
    script.id = 'ga-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.gtag('js', new Date());
      window.gtag('config', '${gaId}', {
        anonymize_ip: true
      });
    `;

    document.head.appendChild(script);
    document.head.appendChild(inlineScript);
  }, []);

  /**
   * 🔍 Verifica consentimento existente
   */
  useEffect(() => {
    initConsentMode();

    try {
      const stored = localStorage.getItem(CONSENT_KEY);

      if (!stored) {
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
      }

      const parsed: CookieConsent = JSON.parse(stored);

      if (parsed.version !== CONSENT_VERSION) {
        setIsOpen(true);
        return;
      }

      updateConsent(parsed.analytics);

      if (parsed.analytics) {
        loadAnalytics();
      }

      setAnalyticsEnabled(parsed.analytics);
    } catch {
      setIsOpen(true);
    }
  }, [initConsentMode, updateConsent, loadAnalytics]);

  /**
   * 💾 Persistência (LGPD + GDPR)
   */
  const persistConsent = useCallback(
    (consent: CookieConsent) => {
      startTransition(() => {
        try {
          const enrichedConsent = {
            ...consent,
            version: CONSENT_VERSION,
            userAgent: navigator.userAgent,
            locale: navigator.language,
          };

          localStorage.setItem(
            CONSENT_KEY,
            JSON.stringify(enrichedConsent)
          );

          updateConsent(consent.analytics);

          if (consent.analytics) {
            loadAnalytics();
          }

          const isProd = process.env.NODE_ENV === 'production';
          const secure = isProd ? 'Secure;' : '';

          document.cookie = `${CONSENT_KEY}=${
            consent.analytics ? 'all' : 'essential'
          }; path=/; max-age=31536000; SameSite=Lax; ${secure}`;

          setIsOpen(false);
        } catch {
          setIsOpen(false);
        }
      });
    },
    [loadAnalytics, updateConsent]
  );

  /**
   * 🎯 Ações
   */
  const handleAcceptAll = () => {
    persistConsent({
      necessary: true,
      analytics: true,
      date: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
  };

  const handleRejectAll = () => {
    persistConsent({
      necessary: true,
      analytics: false,
      date: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-[200] p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 max-w-md mx-auto">

        <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
          {cookie.description}
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleAcceptAll}
            disabled={isPending}
            className="flex-1 bg-black text-white px-3 py-2 rounded text-xs font-bold"
          >
            {cookie.acceptAll}
          </button>

          <button
            onClick={handleRejectAll}
            disabled={isPending}
            className="flex-1 bg-gray-200 dark:bg-slate-700 px-3 py-2 rounded text-xs font-bold"
          >
            {cookie.rejectAll ?? 'Recusar'}
          </button>
        </div>
      </div>
    </aside>
  );
}
