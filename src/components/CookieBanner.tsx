'use client'

import React, { useEffect, useState } from 'react'
import { ShieldCheck, X, Cookie } from 'lucide-react'
import { usePathname } from 'next/navigation'

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false)
  const pathname = usePathname()
  const lang = pathname?.split('/')[1] || 'pt'

  // Textos multilingues focados em conformidade (LGPD/GDPR)
  const content = {
    pt: {
      title: "Privacidade e Governança",
      text: "Este portfólio utiliza tecnologias essenciais para garantir segurança e melhor desempenho, em total conformidade com a LGPD.",
      accept: "Aceitar e Continuar",
      policy: "Termos de Dados"
    },
    en: {
      title: "Privacy & Governance",
      text: "This portfolio uses essential technologies to ensure security and performance, in full compliance with GDPR standards.",
      accept: "Accept & Continue",
      policy: "Data Terms"
    },
    es: {
      title: "Privacidad y Gobernanza",
      text: "Este portafolio utiliza tecnologías esenciales para garantizar seguridad y rendimiento, cumpliendo plenamente con la LGPD y GDPR.",
      accept: "Aceptar y Continuar",
      policy: "Términos de Datos"
    }
  }[lang as 'pt' | 'en' | 'es'] || content.pt

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent-sergio')
    if (!hasConsent) {
      // Pequeno delay para não assustar o usuário assim que a página carrega
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent-sergio', 'true')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-[110] animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-2xl ring-1 ring-black/5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600 dark:text-blue-400">
            <ShieldCheck size={24} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {content.title}
              </h4>
              <button 
                onClick={() => setShowBanner(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {content.text}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleAccept}
                className="flex-1 bg-slate-900 dark:bg-blue-600 text-white text-xs font-bold py-3 px-4 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                {content.accept}
              </button>
              <button className="text-[11px] font-bold text-slate-500 dark:text-slate-400 underline underline-offset-4 hover:text-blue-600 transition-colors">
                {content.policy}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer técnico discreto */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Cookie size={12} className="text-slate-400" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Compliance Mode: Active (2026)
          </span>
        </div>
      </div>
    </div>
  )
}
