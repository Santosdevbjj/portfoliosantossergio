'use client'

import React, { useEffect, useState } from 'react'
import { ShieldCheck, X, Cookie } from 'lucide-react'
import { usePathname } from 'next/navigation'

/**
 * COMPONENTE DE PRIVACIDADE E CONFORMIDADE (LGPD/GDPR)
 * Estrutura otimizada para 2026 com foco em transparência de dados e UX.
 */
export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false)
  const pathname = usePathname()
  
  // Extração segura do locale da URL
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
    // Verificação de consentimento persistente
    const hasConsent = typeof window !== 'undefined' ? localStorage.getItem('cookie-consent-sergio') : null;
    
    if (!hasConsent) {
      // Delay estratégico para não competir com a animação da Hero Section
      const timer = setTimeout(() => setShowBanner(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent-sergio', 'true')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div 
      role="alert"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-[150] animate-in slide-in-from-bottom-10 duration-700 ease-out"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-7 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 dark:ring-white/5">
        <div className="flex items-start gap-5">
          
          {/* Ícone de Autoridade Técnica */}
          <div className="hidden sm:flex p-3.5 bg-blue-600/10 rounded-[1.25rem] text-blue-600 dark:text-blue-400 shrink-0">
            <ShieldCheck size={26} />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">
                {currentContent.title}
              </h4>
              <button 
                onClick={() => setShowBanner(false)}
                className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors touch-manipulation"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {currentContent.text}
            </p>

            {/* Ações Mobile-Optimized */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleAccept}
                className="w-full sm:flex-1 bg-slate-900 dark:bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest py-4 px-6 rounded-2xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/10 touch-manipulation"
              >
                {currentContent.accept}
              </button>
              <button className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 underline underline-offset-8 hover:text-blue-600 transition-colors py-2 touch-manipulation">
                {currentContent.policy}
              </button>
            </div>
          </div>
        </div>
        
        {/* Camada de Metadata do Banner */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cookie size={14} className="text-blue-500/50" />
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              Data Shield: Active
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-300 dark:text-slate-700">
            SEC-PROT-2026
          </span>
        </div>
      </div>
    </div>
  )
}
