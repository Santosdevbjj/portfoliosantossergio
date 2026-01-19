'use client'

import React, { useState } from 'react';
import { Mail, Linkedin, Github, Copy, Check } from 'lucide-react';

interface ContactSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

export const ContactSection = ({ lang, dict }: ContactSectionProps) => {
  const [copied, setCopied] = useState(false);
  
  const email = "santossergiorealbjj@outlook.com";
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz";
  const githubUrl = "https://github.com/Santosdevbjj";

  // Mapeamento dinâmico via dicionário
  const content = dict?.contact || {};
  
  // Fallbacks estratégicos caso o dicionário falhe
  const texts = {
    title: content.title || (lang === 'pt' ? 'Vamos conversar?' : lang === 'es' ? '¿Hablamos?' : "Let's talk?"),
    sub: content.subtitle || dict?.about?.headline || "",
    emailBtn: content.emailBtn || (lang === 'pt' ? 'Enviar E-mail' : lang === 'es' ? 'Enviar Correo' : 'Send Email'),
    socialLabel: content.socialLabel || (lang === 'pt' ? 'Redes Profissionais' : lang === 'es' ? 'Redes Profesionales' : 'Social Media'),
    status: content.status || (lang === 'pt' ? 'Disponível para novos desafios' : lang === 'es' ? 'Disponible para nuevos desafíos' : 'Open for new challenges'),
    copyHint: lang === 'pt' ? 'Copiar' : lang === 'es' ? 'Copiar' : 'Copy'
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Container Principal: Card Estilo Enterprise */}
        <div className="bg-blue-600 dark:bg-blue-700 rounded-[3rem] lg:rounded-[5rem] p-8 md:p-16 lg:p-24 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-16 overflow-hidden relative border border-white/10">
          
          {/* Elementos Decorativos Subtis */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-900/40 rounded-full blur-3xl pointer-events-none" />

          {/* Lado Esquerdo: Textos e Botões Primários */}
          <div className="max-w-xl text-center lg:text-left relative z-20">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
              {texts.title}
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-12 leading-relaxed font-medium opacity-90">
              {texts.sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Botão de E-mail Direto */}
              <a 
                href={`mailto:${email}`}
                className="group flex items-center justify-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-blue-900/20"
              >
                <Mail size={22} className="group-hover:-rotate-12 transition-transform" />
                {texts.emailBtn}
              </a>
              
              {/* Botão de Copiar E-mail (Altamente Interativo) */}
              <button 
                onClick={copyToClipboard}
                title={texts.copyHint}
                className="group flex items-center justify-center gap-4 bg-blue-800/40 text-white border border-white/20 px-8 py-5 rounded-2xl font-bold hover:bg-blue-800/60 transition-all backdrop-blur-md active:scale-95"
              >
                {copied ? <Check size={22} className="text-emerald-300 animate-in zoom-in" /> : <Copy size={20} className="opacity-70 group-hover:opacity-100" />}
                <span className="text-sm font-mono tracking-tight">{email}</span>
              </button>
            </div>
          </div>

          {/* Lado Direito: Card de Social Media Tech */}
          <div className="w-full lg:w-auto relative z-20">
            <div className="bg-white/10 backdrop-blur-2xl p-10 lg:p-12 rounded-[3rem] border border-white/20 shadow-2xl">
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-center opacity-70">
                {texts.socialLabel}
              </p>
              
              <div className="flex justify-center items-center gap-8">
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative p-6 bg-white text-blue-600 hover:text-white rounded-3xl transition-all hover:-translate-y-3 hover:bg-blue-600 shadow-xl"
                >
                  <Linkedin size={40} fill="currentColor" />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">LinkedIn</span>
                </a>
                
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative p-6 bg-slate-900 text-white hover:bg-black rounded-3xl transition-all hover:-translate-y-3 shadow-xl"
                >
                  <Github size={40} />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Status de Disponibilidade (Footer da Seção) */}
        <div className="mt-16 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em]">
              {texts.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
