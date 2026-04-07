'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import type { Dictionary } from '@/types/dictionary';

/**
 * COMPONENTE: CookieBanner
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.2 & React 19: Persistência via useTransition.
 * ✔ TypeScript 6.0.2: Tipagem estrita via interface Dictionary.
 * ✔ Tailwind CSS 4.2: Design fluido e ultra-responsivo.
 * ✔ I18n: Suporte completo para PT, EN e variações de ES.
 */

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
  const [isPending, startTransition] = useTransition();

  // Acesso tipado e seguro conforme src/types/dictionary.ts
  const { cookie, common } = dict;
  const { menu } = common;

  useEffect(() => {
    try {
      const hasConsent = localStorage.getItem(CONSENT_KEY);
      if (!hasConsent) {
        // Delay suave para não impactar o First Contentful Paint (FCP)
        const timer = setTimeout(() => setIsOpen(true), 2500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback para navegadores com armazenamento restrito
    }
  }, []);

  const persistConsent = useCallback((consent: CookieConsent) => {
    startTransition(() => {
      try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

        const isProd = process.env.NODE_ENV === 'production';
        const secure = isProd ? 'Secure;' : '';
        const sameSite = 'SameSite=Lax;';
        
        // Define o cookie de consentimento para o servidor (Next.js Middleware)
        document.cookie = `${CONSENT_KEY}=${
          consent.analytics ? 'all' : 'min'
        }; path=/; max-age=31536000; ${sameSite} ${secure}`;

        setIsOpen(false);
      } catch (error) {
        setIsOpen(false);
      }
    });
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
      className="fixed bottom-0 left-0 right-0 z-[200] p-4 
                 md:bottom-6 md:right-6 md:left-auto md:max-w-md
                 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl
                      border border-slate-200 dark:border-slate-800
                      rounded-[2rem] p-5 md:p-7 shadow-2xl">
        
        {/* HEADER */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Cookie size={24} aria-hidden="true" />
          </div>
          <div className="pr-6">
            <h2 id="cookie-heading" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-1">
              {cookie.title}
            </h2>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {common.rights}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          {cookie.description}
        </p>

        {/* OPTIONS CONTAINER */}
        <div className="space-y-3 mb-8">
          {/* NECESSARY (Always On) */}
          <div className="flex items-center justify-between p-4 rounded-2xl
                          bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {cookie.necessary}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              {cookie.alwaysActive}
            </span>
          </div>

          {/* ANALYTICS (Toggle) */}
          <label className="flex items-center justify-between p-4 rounded-2xl
                            bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
                            hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer group">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {cookie.analytics}
            </span>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:bg-blue-600 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                            shadow-inner"></div>
            </div>
          </label>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAcceptAll}
            disabled={isPending}
            className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl
                       font-black text-xs uppercase tracking-widest
                       hover:scale-[1.02] active:scale-[0.98] transition-all 
                       disabled:opacity-50 shadow-xl shadow-blue-500/10"
          >
            {cookie.acceptAll}
          </button>

          <button
            onClick={handleSavePreferences}
            disabled={isPending}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl
                       font-black text-xs uppercase tracking-widest
                       hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            {cookie.savePreferences}
          </button>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label={menu.aria.close}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </aside>
  );
}
