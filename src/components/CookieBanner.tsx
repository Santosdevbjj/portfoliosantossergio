'use client';

import { useEffect, useState, useCallback } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import type { Dictionary } from '@/types/dictionary';

interface CookieBannerProps {
  readonly dict: Dictionary;
}

const CONSENT_KEY = 'santos-sergio-consent';

type CookieConsent = {
  necessary: true;
  analytics: boolean;
  date: string;
};

export function CookieBanner({ dict }: CookieBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const { cookie } = dict;

  useEffect(() => {
    try {
      const hasConsent = localStorage.getItem(CONSENT_KEY);
      if (!hasConsent) {
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Silencioso por segurança (modo restrito / SSR edge)
    }
  }, []);

  const persistConsent = useCallback((consent: CookieConsent) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

    const secure =
      typeof window !== 'undefined' &&
      window.location.protocol === 'https:'
        ? 'Secure;'
        : '';

    document.cookie = `${CONSENT_KEY}=${
      consent.analytics ? 'all' : 'custom'
    }; path=/; max-age=31536000; SameSite=Lax; ${secure}`;

    setIsOpen(false);
  }, []);

  const handleAcceptAll = () => {
    persistConsent({
      necessary: true,
      analytics: true,
      date: new Date().toISOString(),
    });
  };

  const handleSavePreferences = () => {
    persistConsent({
      necessary: true,
      analytics: analyticsEnabled,
      date: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <aside
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cookie-heading"
      aria-describedby="cookie-description"
      className="fixed bottom-4 left-4 right-4 z-[200]
                 md:left-auto md:right-8 md:bottom-8 md:max-w-md
                 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md
                 border border-slate-200 dark:border-slate-800
                 rounded-[2rem] p-6 shadow-2xl
                 animate-in slide-in-from-bottom-12 duration-700"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-xl text-white">
          <Cookie size={18} aria-hidden="true" />
        </div>
        <h2
          id="cookie-heading"
          className="font-bold text-xs uppercase tracking-widest
                     text-slate-900 dark:text-white"
        >
          {cookie.title}
        </h2>
      </div>

      <p
        id="cookie-description"
        className="text-sm text-slate-600 dark:text-slate-400
                   leading-relaxed mb-6"
      >
        {cookie.description}
      </p>

      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between p-3 rounded-xl
                        bg-slate-50 dark:bg-slate-800/50
                        border border-slate-100 dark:border-slate-800"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-500" />
            {cookie.necessary}
          </span>
          <span className="text-[10px] font-bold uppercase text-slate-400">
            {cookie.alwaysActive}
          </span>
        </div>

        <label
          htmlFor="analytics-consent"
          className="flex items-center justify-between p-3 rounded-xl
                     hover:bg-slate-100 dark:hover:bg-slate-800
                     transition-colors cursor-pointer"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {cookie.analytics}
          </span>
          <input
            id="analytics-consent"
            type="checkbox"
            checked={analyticsEnabled}
            onChange={(e) => setAnalyticsEnabled(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300
                       text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleAcceptAll}
          className="w-full bg-slate-900 dark:bg-blue-600
                     hover:bg-slate-800 dark:hover:bg-blue-500
                     text-white px-4 py-3 rounded-xl
                     font-bold text-xs uppercase tracking-wider
                     transition-all"
        >
          {cookie.acceptAll}
        </button>

        <button
          onClick={handleSavePreferences}
          className="w-full bg-slate-100 dark:bg-slate-800
                     hover:bg-slate-200 dark:hover:bg-slate-700
                     text-slate-900 dark:text-white
                     px-4 py-3 rounded-xl
                     font-bold text-xs uppercase tracking-wider
                     transition-all"
        >
          {cookie.savePreferences}
        </button>
      </div>

      <button
        onClick={() => setIsOpen(false)}
        aria-label={dict.common.menu.close}
        className="absolute top-4 right-4
                   text-slate-400 hover:text-slate-600
                   dark:hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
    </aside>
  );
}
