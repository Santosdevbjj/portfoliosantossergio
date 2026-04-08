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
   * 🧠 Helper seguro para gtag
   */
  const getGtag = () => {
    if (typeof window === 'undefined') return null;

    return window.gtag as
      | ((...args: unknown[]) => void)
      | undefined;
  };

  /**
   * 🧠 Inicializa Consent Mode (DEFAULT DENIED)
   */
  const initConsentMode = useCallback(() => {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];

    if (!window.gtag) {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args);
      };
    }

    const gtag = getGtag();
    if (!gtag) return;

    gtag('consent', 'default', {
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
    const gtag = getGtag();
    if (!gtag) return;

    gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
    });
  }, []);

  /**
   * 📊 Carrega Google Analytics (lazy)
   */
  const loadAnalytics = useCallback(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;

    if (!gaId || typeof window === 'undefined') return;
    if (document.getElementById('ga-script')) return;

    const script = document.createElement('script');
    script.id = 'ga-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.gtag('js', new Date());
      window.gtag('config', '${gaId}', { anonymize_ip: true });
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
        const timer = setTimeout(() => setIsOpen(true), 1200);
        return () => clearTimeout(timer);
      }

      const parsed: CookieConsent = JSON.parse(stored);

      if (parsed.version !== CONSENT_VERSION) {
        setIsOpen(true);
        return;
      }

      setAnalyticsEnabled(parsed.analytics);
      updateConsent(parsed.analytics);

      if (parsed.analytics) loadAnalytics();
    } catch {
      setIsOpen(true);
    }
  }, [initConsentMode, updateConsent, loadAnalytics]);

  /**
   * 💾 Persistência (LGPD + GDPR)
   */
  const persistConsent = useCallback(
    (analytics: boolean) => {
      startTransition(() => {
        try {
          const consent: CookieConsent = {
            necessary: true,
            analytics,
            date: new Date().toISOString(),
            version: CONSENT_VERSION,
          };

          const enriched = {
            ...consent,
            userAgent: navigator.userAgent,
            locale: navigator.language,
          };

          localStorage.setItem(CONSENT_KEY, JSON.stringify(enriched));

          updateConsent(analytics);
          if (analytics) loadAnalytics();

          const secure =
            process.env.NODE_ENV === 'production' ? 'Secure;' : '';

          document.cookie = `${CONSENT_KEY}=${
            analytics ? 'all' : 'essential'
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
  const handleAcceptAll = () => persistConsent(true);
  const handleRejectAll = () => persistConsent(false);
  const handleSavePreferences = () => persistConsent(analyticsEnabled);

  if (!isOpen) return null;

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-[200] p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 max-w-md mx-auto backdrop-blur-xl">

        <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
          {cookie.description}
        </p>

        <label className="flex items-center justify-between mb-4 cursor-pointer">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {cookie.analytics}
          </span>

          <input
            type="checkbox"
            checked={analyticsEnabled}
            onChange={(e) => setAnalyticsEnabled(e.target.checked)}
            className="w-4 h-4"
          />
        </label>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleAcceptAll}
            disabled={isPending}
            className="w-full bg-black text-white py-2 rounded-lg text-xs font-bold hover:opacity-90 transition"
          >
            {cookie.acceptAll}
          </button>

          <button
            onClick={handleRejectAll}
            disabled={isPending}
            className="w-full bg-gray-200 dark:bg-slate-700 py-2 rounded-lg text-xs font-bold"
          >
            {cookie.rejectAll ?? 'Recusar'}
          </button>

          <button
            onClick={handleSavePreferences}
            disabled={isPending}
            className="w-full border py-2 rounded-lg text-xs font-bold"
          >
            {cookie.savePreferences ?? 'Salvar preferências'}
          </button>
        </div>
      </div>
    </aside>
  );
}
