'use client'

import React, { useState } from 'react';
import { translations } from '@/constants/translations';
import { Mail, Linkedin, Github, MessageSquare, Copy, Check, ExternalLink } from 'lucide-react';

export const ContactSection = ({ lang }: { lang: 'pt' | 'en' | 'es' }) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  
  // Seus dados atualizados
  const email = "santossergiorealbjj@outlook.com";
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz";
  const githubUrl = "https://github.com/Santosdevbjj";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = {
    pt: { 
      title: "Vamos conversar?", 
      sub: "Disponível para projetos estratégicos, liderança técnica e consultoria em dados.", 
      emailBtn: "Enviar E-mail",
      socialLabel: "Redes Profissionais",
      status: "Disponível para desafios em 2026",
      copyToast: "E-mail copiado!"
    },
    en: { 
      title: "Let's talk?", 
      sub: "Available for strategic projects, technical leadership, and data consultancy.", 
      emailBtn: "Send Email",
      socialLabel: "Professional Networks",
      status: "Open for new challenges 2026",
      copyToast: "Email copied!"
    },
    es: { 
      title: "¿Hablamos?", 
      sub: "Disponible para proyectos estratégicos, liderazgo técnico y consultoría de datos.", 
      emailBtn: "Enviar Correo",
      socialLabel: "Redes Profesionales",
      status: "Disponible para desafíos 2026",
      copyToast: "¡Correo copiado!"
    }
  }[lang];

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-[#0f172a] overflow-hidden relative transition-colors duration-500">
      <div className="main-container relative z-10">
        <div className="bg-blue-600 dark:bg-blue-700 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
          
          {/* Elementos Visuais de Fundo */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-900/30 rounded-full blur-3xl" />

          <div className="max-w-2xl text-center lg:text-left flex-grow">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
              {content.title}
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed font-medium">
              {content.sub}
            </p>

            {/* Ações de Contato Direto */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href={`mailto:${email}`}
                className="group inline-flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
              >
                <Mail size={20} className="group-hover:animate-bounce" />
                {content.emailBtn}
              </a>
              
              <button 
                onClick={copyToClipboard}
                className="inline-flex items-center justify-center gap-3 bg-blue-700/50 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all backdrop-blur-sm"
              >
                {copied ? <Check size={20} className="text-emerald-300" /> : <Copy size={20} className="opacity-70" />}
                <span className="text-sm md:text-base truncate">{email}</span>
              </button>
            </div>
          </div>

          {/* Cartão de Social Media */}
          <div className="w-full lg:w-auto">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-inner">
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-center lg:text-left">
                {content.socialLabel}
              </p>
              <div className="flex justify-center lg:justify-start gap-4">
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-5 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl transition-all hover:-translate-y-2 shadow-lg"
                  title="LinkedIn"
                >
                  <Linkedin size={28} fill="currentColor" />
                </a>
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-5 bg-slate-900 text-white hover:bg-black rounded-2xl transition-all hover:-translate-y-2 shadow-lg"
                  title="GitHub"
                >
                  <Github size={28} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Badge de Status Inferior */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm animate-fade-in">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
              {content.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
