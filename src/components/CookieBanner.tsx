'use client';

import { useEffect, useState } from 'react';
import { dictionary, type Lang } from '@/lib/dictionary';
import { CONSENT_COOKIE } from '@/lib/consent';

/**
 * CookieBanner - Totalmente Responsivo e Multilíngue
 * Suporta pt, en, es via dicionário centralizado
 */
export const CookieBanner = ({ lang }: { lang: Lang }) => {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  // Fallback seguro para evitar erros de renderização caso o dicionário falhe
  const t = dictionary?.cookie;

  useEffect(() => {
    // Verificação de ambiente para evitar erro de SSR no Next.js
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem(CONSENT_COOKIE);
      if (!consent) {
        setOpen(true);
      }
    }
  }, []);

  const saveConsent = (acceptAll = false) => {
    const value = {
      necessary: true,
      analytics: acceptAll ? true : analytics,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(CONSENT_COOKIE, JSON.stringify(value));
    
    // Configuração de Cookie segura (SameSite e Path)
    document.cookie = `${CONSENT_COOKIE}=${JSON.stringify(value)};path=/;max-age=31536000;SameSite=Lax`;
    
    setOpen(false);
  };

  if (!open || !t) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-[calc(100%-2rem)] sm:max-w-md 
                 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 
                 dark:bg-slate-900 dark:ring-slate-800 transition-all duration-300"
    >
      <h3 className="font-black text-xs sm:text-sm uppercase tracking-widest text-blue-600 dark:text-blue-400">
        {t.title[lang] || t.title['pt']}
      </h3>

      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
        {t.description[lang] || t.description['pt']}
      </p>

      <div className="mt-5 space-y-3">
        <label className="flex items-center gap-3 text-sm font-medium cursor-not-allowed opacity-80">
          <input 
            type="checkbox" 
            checked 
            disabled 
            className="w-4 h-4 rounded border-slate-300 text-blue-600"
          />
          {t.necessary[lang] || t.necessary['pt']}
        </label>

        <label className="flex items-center gap-3 text-sm font-medium cursor-pointer group">
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {t.analytics[lang] || t.analytics['pt']}
          </span>
        </label>
      </div>

      {/* Botões empilhados no mobile, lado a lado no tablet/desktop */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={() => saveConsent(true)}
          className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          {t.acceptAll[lang] || t.acceptAll['pt']}
        </button>

        <button
          onClick={() => saveConsent(false)}
          className="w-full sm:flex-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 px-4 rounded-xl font-bold transition-all active:scale-95"
        >
          {t.save[lang] || t.save['pt']}
        </button>
      </div>
    </div>
  );
};
