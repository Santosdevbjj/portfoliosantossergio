'use client';

import React, { useState, useCallback } from 'react';
import { Mail, Linkedin, Github, Copy, Check } from 'lucide-react';
import type { Locale } from '@/i18n-config';

interface ContactSectionProps {
  lang: Locale;
  dict: any;
}

/**
 * CONTACT SECTION - CONVERSÃO DE ALTO IMPACTO
 * Design otimizado para mobile-first com feedback visual imediato.
 */
export const ContactSection = ({ lang, dict }: ContactSectionProps) => {
  const [copied, setCopied] = useState(false);
  
  const email = "santossergiorealbjj@outlook.com";
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz";
  const githubUrl = "https://github.com/Santosdevbjj";

  const content = dict?.contact || {};
  const common = dict?.common || {};
  
  // Traduções de interface e fallbacks rápidos
  const labels = {
    copy: common?.copy || (lang === 'pt' ? "Copiar" : lang === 'es' ? "Copiar" : "Copy"),
    copied: common?.copied || (lang === 'pt' ? "Copiado!" : lang === 'es' ? "¡Copiado!" : "Copied!"),
    status: content?.status || {
      pt: "Disponível para novos projetos",
      en: "Available for new projects",
      es: "Disponible para nuevos proyectos"
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
    <section id="contact" className="py-24 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* CARD PRINCIPAL (CTA BOX) */}
        <div className="bg-blue-600 dark:bg-blue-700 rounded-[3rem] lg:rounded-[4.5rem] p-10 sm:p-14 lg:p-24 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-16 overflow-hidden relative border border-white/10">
          
          {/* Efeitos de Iluminação Decorativa */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-950/40 rounded-full blur-[100px] pointer-events-none" />

          {/* LADO A: CONTEXTO E CHAMADA */}
          <div className="max-w-xl text-center lg:text-left relative z-20">
            <h2 className="text-5xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
              {content?.title || 'Contact'}
            </h2>
            <p className="text-lg md:text-xl text-blue-50 mb-12 leading-relaxed font-medium opacity-90 max-w-md mx-auto lg:mx-0">
              {content?.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Botão Principal de Email */}
              <a 
                href={`mailto:${email}`}
                className="group flex items-center justify-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all active:scale-95 shadow-2xl shadow-blue-900/30"
              >
                <Mail className="w-6 h-6 group-hover:-rotate-12 transition-transform" strokeWidth={2.5} />
                {content?.emailBtn || 'Send Email'}
              </a>
              
              {/* Botão de Cópia com feedback visual */}
              <button 
                onClick={copyToClipboard}
                className="group flex items-center justify-center gap-3 bg-blue-800/30 text-white border border-white/20 px-8 py-5 rounded-2xl font-bold hover:bg-blue-800/50 transition-all backdrop-blur-md active:scale-95 min-w-[200px]"
                title={labels.copy}
              >
                {copied ? (
                  <div className="flex items-center gap-2 text-emerald-300 animate-in zoom-in duration-300">
                    <Check className="w-5 h-5" strokeWidth={3} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{labels.copied}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    <Copy className="w-5 h-5 opacity-70 group-hover:opacity-100 shrink-0" />
                    <span className="text-xs font-mono tracking-tight truncate">
                      {email.split('@')[0]}...
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* LADO B: SOCIAL CONNECT */}
          <div className="w-full lg:w-auto relative z-20">
            <div className="bg-white/5 backdrop-blur-xl p-10 lg:p-14 rounded-[3rem] md:rounded-[4rem] border border-white/10 shadow-inner">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-center opacity-60">
                {content?.socialLabel || 'Connections'}
              </p>
              
              <div className="flex justify-center items-center gap-8">
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-6 md:p-8 bg-white text-blue-600 hover:text-white rounded-[2rem] transition-all hover:-translate-y-2 hover:bg-blue-600 shadow-xl"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-10 h-10" fill="currentColor" />
                </a>
                
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-6 md:p-8 bg-slate-900 text-white hover:bg-black rounded-[2rem] transition-all hover:-translate-y-2 shadow-xl"
                  aria-label="GitHub"
                >
                  <Github className="w-10 h-10" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* INDICADOR DE DISPONIBILIDADE */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-full transition-all hover:border-emerald-500/30 group">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] group-hover:text-emerald-500 transition-colors">
              {labels.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
