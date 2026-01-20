'use client'

import React, { useState, useCallback } from 'react';
import { Mail, Linkedin, Github, Copy, Check } from 'lucide-react';

interface ContactSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * CONTACT SECTION - FOCO EM CONVERSÃO E LEADS
 * Corrigido para evitar erro de JSX Namespace e garantir responsividade total.
 */
export const ContactSection = ({ lang, dict }: ContactSectionProps) => {
  const [copied, setCopied] = useState(false);
  
  const email = "santossergiorealbjj@outlook.com";
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz";
  const githubUrl = "https://github.com/Santosdevbjj";

  // Mapeamento dinâmico via dicionário com fallbacks tipados por idioma
  const content = dict?.contact || {};
  
  const texts = {
    title: content.title || {
      pt: 'Vamos conversar?',
      en: "Let's talk?",
      es: '¿Hablamos?'
    }[lang],
    sub: content.subtitle || {
      pt: 'Disponível para consultoria e projetos estratégicos de dados.',
      en: 'Available for consulting and strategic data projects.',
      es: 'Disponible para consultoría y proyectos estratégicos de datos.'
    }[lang],
    emailBtn: content.emailBtn || {
      pt: 'Enviar E-mail',
      en: 'Send Email',
      es: 'Enviar Correo'
    }[lang],
    socialLabel: content.socialLabel || {
      pt: 'Redes Profissionais',
      en: 'Social Media',
      es: 'Redes Profesionales'
    }[lang],
    status: content.status || {
      pt: 'Disponível para novos desafios',
      en: 'Open for new challenges',
      es: 'Disponible para nuevos desafíos'
    }[lang],
    copyHint: {
      pt: 'Copiar',
      en: 'Copy',
      es: 'Copiar'
    }[lang],
    copiedMsg: {
      pt: 'Copiado!',
      en: 'Copied!',
      es: '¡Copiado!'
    }[lang]
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
        
        {/* Container Principal */}
        <div className="bg-blue-600 dark:bg-blue-700 rounded-[2.5rem] lg:rounded-[5rem] p-6 sm:p-12 md:p-16 lg:p-24 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 overflow-hidden relative border border-white/10">
          
          {/* Elementos Decorativos */}
          <div className="absolute -right-20 -top-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 md:w-96 md:h-96 bg-blue-900/40 rounded-full blur-3xl pointer-events-none" />

          {/* Lado Esquerdo: CTA */}
          <div className="max-w-xl text-center lg:text-left relative z-20">
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[0.95]">
              {texts.title}
            </h2>
            <p className="text-base md:text-xl text-blue-100 mb-8 md:mb-12 leading-relaxed font-medium opacity-90 px-4 lg:px-0">
              {texts.sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href={`mailto:${email}`}
                className="group flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-blue-900/20"
              >
                <Mail className="w-5 h-5 md:w-6 md:h-6 group-hover:-rotate-12 transition-transform" />
                {texts.emailBtn}
              </a>
              
              <button 
                onClick={copyToClipboard}
                title={texts.copyHint}
                className="group flex items-center justify-center gap-3 bg-blue-800/40 text-white border border-white/20 px-6 py-4 md:px-8 md:py-5 rounded-2xl font-bold hover:bg-blue-800/60 transition-all backdrop-blur-md active:scale-95 w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300 animate-in zoom-in" />
                    <span className="text-sm font-mono text-emerald-300">{texts.copiedMsg}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                    <span className="text-xs md:text-sm font-mono tracking-tight truncate">{email}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lado Direito: Social Box */}
          <div className="w-full lg:w-auto relative z-20">
            <div className="bg-white/10 backdrop-blur-2xl p-8 lg:p-12 rounded-[2.5rem] border border-white/20 shadow-2xl">
              <p className="text-blue-100 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-center opacity-70">
                {texts.socialLabel}
              </p>
              
              <div className="flex justify-center items-center gap-6 md:gap-8">
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative p-5 md:p-6 bg-white text-blue-600 hover:text-white rounded-2xl md:rounded-3xl transition-all hover:-translate-y-2 hover:bg-blue-600 shadow-xl"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest hidden md:block">LinkedIn</span>
                </a>
                
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative p-5 md:p-6 bg-slate-900 text-white hover:bg-black rounded-2xl md:rounded-3xl transition-all hover:-translate-y-2 shadow-xl"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-8 h-8 md:w-10 md:h-10" />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest hidden md:block">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <div className="inline-flex items-center gap-3 md:gap-4 px-6 md:px-8 py-3 md:py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] md:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.25em]">
              {texts.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
