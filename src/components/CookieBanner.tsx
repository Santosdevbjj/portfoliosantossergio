'use client';

/**
 * COOKIE BANNER: Gestão de Consentimento e Privacidade
 * -----------------------------------------------------------------------------
 * - Fix: Renomeada constante interna para 'bannerI18n' para evitar conflito de build.
 * - Fix: Tipagem explícita para eliminar erro de inferência circular.
 * - Responsividade: Design mobile-first com breakpoints para desktop (bottom-right).
 * - Multilingue: Suporte nativo a PT, EN e ES.
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

  // Tipagem explícita para evitar o erro de 'implicitly has any type' do build
  const bannerI18n: Record<SupportedLocale, { 
    title: string; desc: string; nec: string; active: string; ana: string; all: string; save: string; 
  }> = {
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
  };

  const content = bannerI18n[lang] || bannerI18n.pt;

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
    
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'Secure;' : '';
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
        rounded-[2rem] p-6 shadow-2xl shadow-blue-500/10
        animate-in slide-in-from-bottom-12 duration-700
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-xl text-white">
          <Cookie size={18} aria-hidden="true" />
        </div>
        <h2 id="cookie-heading" className="font-bold text-xs uppercase tracking-widest text-slate-900 dark:text-white">
          {content.title}
        </h2>
      </div>

      {/* DESCRIÇÃO */}
      <p id="cookie-desc" className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        {content.desc}
      </p>

      {/* PREFERÊNCIAS */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-500" />
            {content.nec}
          </span>
          <span className="text-[10px] font-bold uppercase text-slate-400">{content.active}</span>
        </div>

        <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {content.ana}
          </span>
          <input
            type="checkbox"
            checked={analyticsEnabled}
            onChange={(e) => setAnalyticsEnabled(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </label>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleSaveConsent(true)}
          className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
        >
          {content.all}
        </button>
        <button
          onClick={() => handleSaveConsent(false)}
          className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
        >
          {content.save}
        </button>
      </div>

      {/* FECHAR RÁPIDO */}
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        aria-label={dict.common.closeMenu}
      >
        <X size={18} />
      </button>
    </aside>
  );
}
