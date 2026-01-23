'use client'

import React from 'react'
import { Linkedin, Github, Mail, Globe, Code2, ExternalLink, Blocks } from 'lucide-react'
import type { Locale } from '@/i18n-config';

interface FooterProps {
  lang: Locale;
  dict: {
    about: {
      headline: string;
    };
    footer: {
      location: string;
      socialTitle: string;
      contactTitle: string;
      rights: string;
      builtBy: string;
    };
  };
}

/**
 * COMPONENTE: Footer
 * Encerramento da narrativa com foco em conversão e transparência tecnológica.
 */
export const Footer = ({ lang, dict }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  const email = "santossergiorealbjj@outlook.com"
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz"
  const githubUrl = "https://github.com/Santosdevbjj"

  const about = dict?.about || {};
  const footer = dict?.footer || {};

  // Mecanismo de contingência para traduções (Fail-Safe)
  const localFallbacks = {
    pt: { location: "Brasil", builtBy: "Desenvolvido por", contact: "Contato", social: "Redes Sociais", rights: "Todos os direitos reservados" },
    en: { location: "Brazil", builtBy: "Developed by", contact: "Contact", social: "Social Media", rights: "All rights reserved" },
    es: { location: "Brasil", builtBy: "Desarrollado por", contact: "Contacto", social: "Redes Sociales", rights: "Todos los derechos reservados" }
  }[lang];

  return (
    <footer className="bg-slate-50 dark:bg-[#020617] pt-24 pb-12 border-t border-slate-200 dark:border-slate-800/60 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* COLUNA 1: IDENTIDADE */}
          <div className="md:col-span-2">
            <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white mb-6 block uppercase group cursor-default">
              Sérgio<span className="text-blue-600 group-hover:text-blue-500 transition-colors">Santos</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed font-medium text-base mb-8">
              {about?.headline || "Data Specialist & Governance Expert"}
            </p>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <Globe className="w-4 h-4 text-blue-500 animate-pulse" />
              {footer?.location || localFallbacks.location}
            </div>
          </div>

          {/* COLUNA 2: CONEXÕES */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-8 uppercase tracking-[0.2em] text-[10px] opacity-60">
              {footer?.socialTitle || localFallbacks.social}
            </h4>
            <ul className="flex flex-col gap-5">
              <li>
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm"
                >
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              </li>
              <li>
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm"
                >
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                    <Github className="w-4 h-4" />
                  </div>
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* COLUNA 3: CANAL DIRETO */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-8 uppercase tracking-[0.2em] text-[10px] opacity-60">
              {footer?.contactTitle || localFallbacks.contact}
            </h4>
            <a href={`mailto:${email}`} className="group flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold text-sm">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>Email</span>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 break-all bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-transparent group-hover:border-blue-500/20 transition-all">
                {email}
              </span>
            </a>
          </div>
        </div>

        {/* BARRA INFERIOR: COPYRIGHT E STACK */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800/80 flex flex-col xl:flex-row justify-between items-center gap-10">
          
          <div className="flex flex-col gap-2 items-center xl:items-start text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center xl:text-left">
            <p>© {currentYear} • {footer?.rights || localFallbacks.rights}</p>
            <p className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Code2 className="w-4 h-4" />
              {footer?.builtBy || localFallbacks.builtBy} <span className="text-slate-900 dark:text-white ml-0.5">Sérgio Santos</span>
            </p>
          </div>
          
          {/* TECH STACK BADGE */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900/50 px-6 py-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 pr-0 sm:pr-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 pb-2 sm:pb-0 justify-center">
              <Blocks className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Stack</span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase max-w-[300px] sm:max-w-none">
              <span>Next.js 15</span>
              <Dot />
              <span>React 19</span>
              <Dot />
              <span>Tailwind</span>
              <Dot />
              <span>TypeScript</span>
              <Dot />
              <span>Lucide</span>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  )
}

const Dot = () => <span className="w-1 h-1 bg-blue-600/30 rounded-full shrink-0" />
