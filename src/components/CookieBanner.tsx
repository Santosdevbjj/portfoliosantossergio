'use client'

/**
 * COOKIE BANNER: Governança de Consentimento (LGPD / GDPR)
 * -----------------------------------------------------------------------------
 * - i18n: Suporte nativo para PT, EN e ES.
 * - UX: Animação suave e não intrusiva.
 * - A11y: Gerenciamento de foco e ARIA Roles para leitores de tela.
 */

import { useEffect, useState, useCallback } from 'react'
import { Cookie, ShieldCheck, X } from 'lucide-react'
import type { Locale } from '@/i18n-config'
import type { Dictionary } from '@/types/Dictionary'

const CONSENT_KEY = 'santos-sergio-consent'

interface CookieBannerProps {
  readonly lang: Locale
  readonly dict: Dictionary['cookie']
}

export function CookieBanner({ lang, dict }: CookieBannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  /* -------------------------- Consent Logic -------------------------- */
  
  useEffect(() => {
    const hasConsent = localStorage.getItem(CONSENT_KEY)
    if (!hasConsent) {
      // Pequeno delay para não impactar o LCP (performance)
      const timer = setTimeout(() => setIsOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSaveConsent = useCallback((all: boolean) => {
    const consent = {
      necessary: true,
      analytics: all ? true : analyticsEnabled,
      date: new Date().toISOString(),
    }
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    
    // Define cookie para leitura no lado do servidor (SSR)
    const secure = window.location.protocol === 'https:' ? 'Secure;' : ''
    document.cookie = `${CONSENT_KEY}=${all ? 'all' : 'custom'}; path=/; max-age=31536000; SameSite=Lax; ${secure}`
    
    setIsOpen(false)
  }, [analyticsEnabled])

  if (!isOpen) return null

  return (
    <aside
      role="alertdialog"
      aria-labelledby="cookie-heading"
      aria-describedby="cookie-desc"
      className="
        fixed bottom-6 left-6 right-6 z-[200]
        md:left-auto md:right-8 md:bottom-8 md:max-w-md
        bg-white dark:bg-slate-900 
        border border-slate-200 dark:border-slate-800
        rounded-[2rem] p-6 shadow-2xl shadow-blue-500/10
        animate-in slide-in-from-bottom-8 duration-700
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          <Cookie size={20} />
        </div>
        <h2 id="cookie-heading" className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">
          {dict.title}
        </h2>
      </div>

      {/* BODY */}
      <p id="cookie-desc" className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        {dict.description}
      </p>

      {/* OPTIONS */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-500" />
            {dict.necessaryLabel}
          </span>
          <span className="text-[10px] font-black uppercase text-slate-400">{dict.alwaysActive}</span>
        </div>

        <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer group">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors group-hover:text-blue-600">
            {dict.analyticsLabel}
          </span>
          <input
            type="checkbox"
            checked={analyticsEnabled}
            onChange={(e) => setAnalyticsEnabled(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </label>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleSaveConsent(true)}
          className="
            flex-1 bg-blue-600 hover:bg-blue-700 text-white
            px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest
            transition-all active:scale-95 shadow-lg shadow-blue-600/20
          "
        >
          {dict.acceptAll}
        </button>
        <button
          onClick={() => handleSaveConsent(false)}
          className="
            flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
            text-slate-900 dark:text-white px-5 py-3.5 rounded-2xl
            font-black text-xs uppercase tracking-widest transition-all
          "
        >
          {dict.savePreference}
        </button>
      </div>

      {/* CLOSE ICON (OPCIONAL) */}
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </aside>
  )
}
