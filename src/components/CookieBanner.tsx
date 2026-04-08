'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
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

/**
 * ✅ FIX: evitar conflito global com gtag
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function CookieBanner({ dict }: CookieBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { cookie, common } = dict;
  const { menu } = common;

  /**
   * 🧠 Inicializa Consent Mode (DEFAULT DENIED)
   */
  const initConsentMode = useCallback(() => {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];

    if (!window.gtag) {
      window.gtag = function (...args: unknown[]) {
        window.dataLayer?.push(args);
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
   * 📊 Carrega GA4
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
   * 💾 Persistência
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

  const handleSavePreferences = () => {
    persistConsent({
      necessary: true,
      analytics: analyticsEnabled,
      date: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
  };

  if (!isOpen) return null;

  return (
    <aside
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cookie-heading"
      className="fixed bottom-0 left-0 right-0 z-[200] p-4 
                 md:bottom-6 md:right-6 md:left-auto md:max-w-md
                 animate-in fade-in slide-in-from-bottom-5 duration-500"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl
                      border border-slate-200 dark:border-slate-800
                      rounded-[2rem] p-5 md:p-7 shadow-2xl">

        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-600 rounded-2xl text-white">
            <Cookie size={24} />
          </div>
          <div className="pr-6">
            <h2 id="cookie-heading" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
              {cookie.title}
            </h2>
            <p className="text-sm font-bold">
              {common.rights}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          {cookie.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between p-4 rounded-2xl bg-slate-50">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <span className="text-xs font-bold">
                {cookie.necessary}
              </span>
            </div>
            <span className="text-xs">
              {cookie.alwaysActive}
            </span>
          </div>

          <label className="flex justify-between p-4 rounded-2xl border cursor-pointer">
            <span className="text-xs font-bold">
              {cookie.analytics}
            </span>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
            />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAcceptAll}
            disabled={isPending}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold"
          >
            {cookie.acceptAll}
          </button>

          <button
            onClick={handleRejectAll}
            disabled={isPending}
            className="w-full bg-slate-200 py-3 rounded-xl text-xs font-bold"
          >
            {cookie.rejectAll ?? 'Recusar'}
          </button>

          <button
            onClick={handleSavePreferences}
            disabled={isPending}
            className="w-full border py-3 rounded-xl text-xs font-bold"
          >
            {cookie.savePreferences}
          </button>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          aria-label={menu.aria.close}
          className="absolute top-4 right-4"
        >
          <X size={20} />
        </button>
      </div>
    </aside>
  );
}
