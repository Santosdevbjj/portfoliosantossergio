'use client'

import React, { useState, useCallback } from 'react';
import { Mail, Linkedin, Github, Copy, Check } from 'lucide-react';

interface ContactSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * CONTACT SECTION - FOCO EM CONVERSÃO E LEADS
 * Design otimizado para alta legibilidade e ergonomia em dispositivos móveis.
 */
export const ContactSection = ({ lang, dict }: ContactSectionProps) => {
  const [copied, setCopied] = useState(false);
  
  const email = "santossergiorealbjj@outlook.com";
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz";
  const githubUrl = "https://github.com/Santosdevbjj";

  // Mapeamento dinâmico via dicionário revisado
  const content = dict?.contact || {};
  const common = dict?.common || {};
  
  // Traduções de interface para utilitários de cópia (agnóstico ao dicionário principal)
  const ui = {
    copyHint: { pt: 'Copiar', en: 'Copy', es: 'Copiar' }[lang],
    copiedMsg: { pt: 'Copiado!', en: 'Copied!', es: '¡Copiado!' }[lang]
  };

  const copyToClipboard = useCallback(() => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [email]);

  return (
    <section id="contact" className="py-20 lg:py-32 bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CONTAINER PRINCIPAL: Impacto Visual Sênior */}
        <div className="bg-blue-600 dark:bg-blue-700 rounded-[2.5rem] lg:rounded-[5rem] p-6 sm:p-12 md:p-16 lg:p-24 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 overflow-hidden relative border border-white/10">
          
          {/* Elementos Decorativos de Profundidade */}
          <div className="absolute -right-20 -top-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 md:w-96 md:h-96 bg-blue-900/40 rounded-full blur-3xl pointer-events-none" />

          {/* COLUNA ESQUERDA: Chamada para Ação */}
          <div className="max-w-xl text-center lg:text-left relative z-20">
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[0.95]">
              {content.title}
            </h2>
            <p className="text-base md:text-xl text-blue-100 mb-8 md:mb-12 leading-relaxed font-medium opacity-90">
              {content.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Botão de E-mail Principal */}
              <a 
                href={`mailto:${email}`}
                className="group flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-blue-900/20"
              >
                <Mail className="w-5 h-5 md:w-6 md:h-6 group-hover:-rotate-12 transition-transform" />
                {content.emailBtn}
              </a>
              
              {/* Botão de Cópia: Otimizado para Mobile (Evita quebra de layout) */}
              <button 
                onClick={copyToClipboard}
                title={ui.copyHint}
                className="group flex items-center justify-center gap-3 bg-blue-800/40 text-white border border-white/20 px-6 py-4 md:px-8 md:py-5 rounded-2xl font-bold hover:bg-blue-800/60 transition-all backdrop-blur-md active:scale-95 w-full sm:w-auto overflow-hidden"
              >
                {copied ? (
                  <div className="flex items-center gap-2 text-emerald-300 animate-in zoom-in duration-300">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-black uppercase tracking-widest">{ui.copiedMsg}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 max-w-full">
                    <Copy className="w-5 h-5 opacity-70 group-hover:opacity-100 shrink-0" />
                    <span className="text-[10px] md:text-sm font-mono tracking-tight truncate">
                      {email}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA: Social Box */}
          <div className="w-full lg:w-auto relative z-20">
            <div className="bg-white/10 backdrop-blur-2xl p-8 lg:p-12 rounded-[2.5rem] border border-white/20 shadow-2xl">
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-center opacity-70">
                {content.socialLabel}
              </p>
              
              <div className="flex justify-center items-center gap-6 md:gap-8">
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative p-5 md:p-6 bg-white text-blue-600 hover:text-white rounded-2xl md:rounded-3xl transition-all hover:-translate-y-2 hover:bg-blue-600 shadow-xl"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" />
                </a>
                
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative p-5 md:p-6 bg-slate-900 text-white hover:bg-black rounded-2xl md:rounded-3xl transition-all hover:-translate-y-2 shadow-xl"
                  aria-label="GitHub"
                >
                  <Github className="w-8 h-8 md:w-10 md:h-10" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* INDICADOR DE STATUS: Disponibilidade em Tempo Real */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em]">
              {content.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
