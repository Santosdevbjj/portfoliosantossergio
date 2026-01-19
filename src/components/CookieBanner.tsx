'use client'

import React, { useEffect, useState } from 'react'
import { ShieldCheck, X, Cookie } from 'lucide-react'
import { usePathname } from 'next/navigation'

/**
 * COMPONENTE DE GOVERNANÇA (LGPD/GDPR)
 * Exibe o consentimento de dados com foco em transparência técnica.
 */
export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false)
  const pathname = usePathname()
  
  // Identifica o idioma para conformidade regional específica
  const lang = pathname?.split('/')[1] || 'pt'

  const contentMap = {
    pt: {
      title: "Privacidade e Governança",
      text: "Este portfólio utiliza tecnologias essenciais para garantir segurança e alto desempenho, operando em total conformidade com a LGPD brasileira.",
      accept: "Aceitar e Continuar",
      policy: "Termos de Dados"
    },
    en: {
      title: "Privacy & Governance",
      text: "This portfolio uses essential technologies to ensure security and peak performance, in full compliance with GDPR global standards.",
      accept: "Accept & Continue",
      policy: "Data Terms"
    },
    es: {
      title: "Privacidad y Gobernanza",
      text: "Este portafolio utiliza tecnologías esenciales para garantizar seguridad y rendimiento, cumpliendo plenamente con las normativas LGPD y GDPR.",
      accept: "Aceptar y Continuar",
      policy: "Términos de Datos"
    }
  };

  const currentContent = contentMap[lang as keyof typeof contentMap] || contentMap.pt;

  useEffect(() => {
    // Verifica se o usuário já deu consentimento anteriormente
    const hasConsent = localStorage.getItem('cookie-consent-sergio')
    if (!hasConsent) {
      // Delay estratégico para priorizar o carregamento do conteúdo principal (LCP)
      const timer = setTimeout(() => setShowBanner(true), 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent-sergio', 'true')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div 
      role="alert"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-[110] animate-in slide-in-from-bottom-10 duration-700 ease-out"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 rounded-[2rem] shadow-2xl ring-1 ring-black/5">
        <div className="flex items-start gap-4">
          {/* Ícone de Escudo: Reforça a autoridade em segurança */}
          <div className="hidden xs:flex p-3 bg-blue-600/10 rounded-2xl text-blue-600 dark:text-blue-400">
            <ShieldCheck size={24} />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] md:text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                {currentContent.title}
              </h4>
              <button 
                onClick={() => setShowBanner(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {currentContent.text}
            </p>

            <div className="flex flex-col xs:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleAccept}
                className="w-full xs:flex-1 bg-slate-900 dark:bg-blue-600 text-white text-xs font-bold py-3 px-4 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                {currentContent.accept}
              </button>
              <button className="text-[11px] font-bold text-slate-500 dark:text-slate-400 underline underline-offset-4 hover:text-blue-600 transition-colors py-2">
                {currentContent.policy}
              </button>
            </div>
          </div>
        </div>
        
        {/* Assinatura de Compliance: Reforça o ano corrente (2026) */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cookie size={12} className="text-slate-400" />
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              Data Governance Protocol
            </span>
          </div>
          <span className="text-[9px] font-bold text-blue-500/60 dark:text-blue-400/60">
            v2026.1
          </span>
        </div>
      </div>
    </div>
  )
}
