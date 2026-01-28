'use client';

/**
 * COOKIE BANNER: Gestão de Consentimento e Privacidade
 * -----------------------------------------------------------------------------
 * - UI: Design flutuante responsivo com animações de entrada.
 * - I18n: Adaptado para suportar PT, EN e ES via dicionário.
 * - LGPD/GDPR: Persistência em LocalStorage e Cookies de sessão.
 */

import { useEffect, useState, useCallback } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import type { SupportedLocale } from '@/dictionaries';
import type { Dictionary } from '@/types/dictionary';

interface CookieBannerProps {
  readonly lang: SupportedLocale;
  readonly dict: Dictionary;
}

const CONSENT_KEY = 'santos-sergio-consent';

export function CookieBanner({ lang, dict }: CookieBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  // Textos de Fallback caso não queira atualizar os JSONs agora
  // Recomendo adicionar a chave "cookie" no seu Dictionary futuramente
  const i18n = {
    pt: {
      title: "Privacidade e Cookies",
      desc: "Utilizamos cookies para melhorar sua experiência e analisar o tráfego do site.",
      nec: "Essenciais",
      active: "Sempre Ativo",
      ana: "Análise de Tráfego",
      all: "Aceitar Todos",
      save: "Salvar Preferências"
    },
    en: {
      title: "Privacy & Cookies",
      desc: "We use cookies to enhance your experience and analyze our traffic.",
      nec: "Necessary",
      active: "Always Active",
      ana: "Analytics",
      all: "Accept All",
      save: "Save Preferences"
    },
    es: {
      title: "Privacidad y Cookies",
      desc: "Utilizamos cookies para mejorar su experiencia y analizar el tráfico del sitio.",
      nec: "Necesarias",
      active: "Siempre Activo",
      ana: "Análisis",
      all: "Aceptar Todo",
      save: "Guardar Preferencias"
    }
  }[lang] || i18n.pt;

  useEffect(() => {
    const hasConsent = localStorage.getItem(CONSENT_KEY);
    if (!hasConsent) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSaveConsent = useCallback((all: boolean) => {
    const consent = {
      necessary: true,
      analytics: all ? true : analyticsEnabled,
      date: new Date().toISOString(),
    };
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    
    const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
    document.cookie = `${CONSENT_KEY}=${all ? 'all' : 'custom'}; path=/; max-age=31536000; SameSite=Lax; ${secure}`;
    
    setIsOpen(false);
  }, [analyticsEnabled]);

  if (!isOpen) return null;

  return (
    <aside
      role="alertdialog"
      aria-labelledby="cookie-heading"
      aria-describedby="cookie-desc"
      className="
        fixed bottom-4 left-4 right-4 z-[200]
        md:left-auto md:right-8 md:bottom-8 md:max-w-md
        bg-white/98 dark:bg-slate-900/98 backdrop-blur-md
        border border-slate-200 dark:border-slate-800
        rounded-[2.5rem] p-6 shadow-2xl shadow-blue-500/20
        animate-in slide-in-from-bottom-12 duration-700
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30">
          <Cookie size={20} aria-hidden="true" />
        </div>
        <h2 id="cookie-heading" className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white">
          {i18n.title}
        </h2>
      </div>

      {/* DESCRIÇÃO */}
      <p id="cookie-desc" className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
        {i18n.desc}
      </p>

      {/* PREFERÊNCIAS */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-500" />
            {i18n.nec}
          </span>
          <span className="text-[10px] font-black uppercase text-slate-400">{i18n.active}</span>
        </div>

        <label className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer group">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors group-hover:text-blue-600">
            {i18n.ana}
          </span>
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
            />
          </div>
        </label>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleSaveConsent(true)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-600/20"
        >
          {i18n.all}
        </button>
        <button
          onClick={() => handleSaveConsent(false)}
          className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
        >
          {i18n.save}
        </button>
      </div>

      {/* FECHAR RÁPIDO */}
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-5 right-5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Fechar banner de cookies"
      >
        <X size={20} />
      </button>
    </aside>
  );
}
