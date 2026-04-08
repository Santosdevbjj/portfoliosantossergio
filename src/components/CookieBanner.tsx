'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import type { Dictionary } from '@/types/dictionary';
import type { CookieConsent } from '@/types/cookies';

/**
 * 🔒 CONFIG
 */
const CONSENT_KEY = 'santos-sergio-consent';
const CONSENT_VERSION = '1.0';

interface CookieBannerProps {
  readonly dict: Dictionary;
}

export function CookieBanner({ dict }: CookieBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { cookie, common } = dict;
  const { menu } = common;

  /**
   * 🚀 Load Google Analytics SOMENTE após consentimento
   */
  const loadAnalytics = useCallback(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return;
    if (typeof window === 'undefined') return;

    // Evita duplicação
    if ((window as any).gtag) return;

    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script1.async = true;

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${gaId}', {
        anonymize_ip: true
      });
    `;

    document.head.appendChild(script1);
    document.head.appendChild(script2);
  }, []);

  /**
   * 🔍 Verifica consentimento existente
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);

      if (!stored) {
        const timer = setTimeout(() => setIsOpen(true), 2500);
        return () => clearTimeout(timer);
      }

      const parsed: CookieConsent = JSON.parse(stored);

      // 🔥 Validação de versão (GDPR)
      if (parsed.version !== CONSENT_VERSION) {
        setIsOpen(true);
        return;
      }

      // 🔥 Se já aceitou analytics → carrega
      if (parsed.analytics) {
        loadAnalytics();
      }
    } catch {
      setIsOpen(true);
    }
  }, [loadAnalytics]);

  /**
   * 💾 Persistência de consentimento
   */
  const persistConsent = useCallback((consent: CookieConsent) => {
    startTransition(() => {
      try {
        const enrichedConsent = {
          ...consent,
          version: CONSENT_VERSION,
          userAgent: navigator.userAgent,
          locale: navigator.language,
        };

        localStorage.setItem(CONSENT_KEY, JSON.stringify(enrichedConsent));

        const isProd = process.env.NODE_ENV === 'production';
        const secure = isProd ? 'Secure;' : '';

        document.cookie = `${CONSENT_KEY}=${
          consent.analytics ? 'all' : 'essential'
        }; path=/; max-age=31536000; SameSite=Lax; ${secure}`;

        if (consent.analytics) {
          loadAnalytics();
        }

        setIsOpen(false);
      } catch {
        setIsOpen(false);
      }
    });
  }, [loadAnalytics]);

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
                 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl
                      border border-slate-200 dark:border-slate-800
                      rounded-[2rem] p-5 md:p-7 shadow-2xl">

        {/* HEADER */}
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

        {/* OPTIONS */}
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

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAcceptAll}
            disabled={isPending}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold disabled:opacity-50"
          >
            {cookie.acceptAll}
          </button>

          <button
            onClick={handleRejectAll}
            disabled={isPending}
            className="w-full bg-slate-200 py-3 rounded-xl text-xs font-bold disabled:opacity-50"
          >
            Recusar
          </button>

          <button
            onClick={handleSavePreferences}
            disabled={isPending}
            className="w-full border py-3 rounded-xl text-xs font-bold disabled:opacity-50"
          >
            {cookie.savePreferences}
          </button>
        </div>

        {/* CLOSE */}
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
