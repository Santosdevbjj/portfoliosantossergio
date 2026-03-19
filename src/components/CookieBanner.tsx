'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import type { Dictionary } from '@/types/dictionary';

/**
 * COMPONENTE: CookieBanner
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Client Component otimizado
 * ✔ React 19: Uso de useTransition para persistência sem travar a UI
 * ✔ TypeScript 6.0: Acesso seguro a dicionários e tipos estritos
 * ✔ Tailwind CSS 4.2: Utiliza novas classes de animação e blur
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

  // Acesso seguro aos dicionários conforme definido no seu src/types/dictionary.ts
  const { cookie, common, menu } = dict;

  // Fallback seguro para o rótulo de fechar (compatível com TS 6)
  const closeLabel = menu?.close ?? common?.nav?.contact ?? 'Close';

  useEffect(() => {
    // Verificação de consentimento prévio no carregamento
    try {
      const hasConsent = localStorage.getItem(CONSENT_KEY);
      if (!hasConsent) {
        // Delay suave para não impactar o LCP (Largest Contentful Paint)
        const timer = setTimeout(() => setIsOpen(true), 2000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("LocalStorage bloqueado ou indisponível.");
    }
  }, []);

  /**
   * Persistência de Consentimento
   * Alinhado com as novas regras de segurança de cookies do Node 24
   */
  const persistConsent = useCallback((consent: CookieConsent) => {
    startTransition(() => {
      try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

        const isProd = process.env.NODE_ENV === 'production';
        const secure = isProd ? 'Secure;' : '';
        const sameSite = 'SameSite=Lax;';
        
        // Define o cookie de forma determinística
        document.cookie = `${CONSENT_KEY}=${
          consent.analytics ? 'all' : 'custom'
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
                 md:bottom-8 md:right-8 md:left-auto md:max-w-md
                 animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
                      border border-slate-200 dark:border-slate-800
                      rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                      dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-shrink-0 p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Cookie size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="cookie-heading" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              {cookie.title}
            </h2>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Privacidade & Dados
            </p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
          {cookie.description}
        </p>

        {/* PREFERENCES BOX */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between p-4 rounded-2xl
                          bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {cookie.necessary}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md text-slate-500 dark:text-slate-400">
              {cookie.alwaysActive}
            </span>
          </div>

          <label className="flex items-center justify-between p-4 rounded-2xl
                            hover:bg-slate-100 dark:hover:bg-slate-800/60
                            transition-all cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {cookie.analytics}
            </span>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:bg-blue-600 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all shadow-sm"></div>
            </div>
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAcceptAll}
            disabled={isPending}
            className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl
                       font-black text-xs uppercase tracking-widest
                       hover:scale-[1.02] active:scale-[0.98] transition-all
                       shadow-xl shadow-blue-500/10 disabled:opacity-50"
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
          aria-label={closeLabel}
          className="absolute top-6 right-6 p-1 rounded-full
                     text-slate-400 hover:text-slate-900 dark:hover:text-white 
                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </aside>
  );
}
