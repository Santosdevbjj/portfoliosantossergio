'use client'

import React from 'react'
import { Linkedin, Github, Mail, Cpu, Globe, Code2, ExternalLink } from 'lucide-react'

interface FooterProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * COMPONENTE: Footer
 * Totalmente responsivo e multilingue.
 * Focado em identidade profissional e acessibilidade.
 */
export const Footer = ({ lang, dict }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  // Single Source of Truth para dados de contato
  const email = "santossergiorealbjj@outlook.com"
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz"
  const githubUrl = "https://github.com/Santosdevbjj"

  // Acesso seguro e desestruturação com fallbacks
  const about = dict?.about || {};
  const footer = dict?.footer || {};
  const common = dict?.common || {};

  // Traduções locais de segurança
  const localFallbacks = {
    pt: { location: "Brasil", builtBy: "Desenvolvido por", contact: "Contato" },
    en: { location: "Brazil", builtBy: "Built by", contact: "Contact" },
    es: { location: "Brasil", builtBy: "Desarrollado por", contact: "Contacto" }
  }[lang] || { location: "Brasil", builtBy: "Built by", contact: "Contact" };

  return (
    <footer className="bg-slate-50 dark:bg-[#020617] pt-20 pb-10 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Coluna 1: Marca e Posicionamento */}
          <div className="sm:col-span-2">
            <span className="font-black text-2xl md:text-3xl tracking-tighter text-slate-900 dark:text-white mb-6 block uppercase group cursor-default">
              Sérgio<span className="text-blue-600 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.4)] transition-all">Santos</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed font-medium text-sm md:text-base mb-8">
              {about?.headline || "Data Specialist & Critical Systems Engineering"}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <Globe className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              {footer?.location || localFallbacks.location}
            </div>
          </div>

          {/* Coluna 2: Networking */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-8 uppercase tracking-[0.2em] text-[10px] opacity-70">
              {footer?.social || "Social"}
            </h4>
            <ul className="flex flex-col gap-6">
              <li>
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm"
                >
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </a>
              </li>
              <li>
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm"
                >
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <Github className="w-4 h-4" />
                  </div>
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato Direto */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-8 uppercase tracking-[0.2em] text-[10px] opacity-70">
              {footer?.contact || localFallbacks.contact}
            </h4>
            <a 
              href={`mailto:${email}`} 
              className="group flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold text-sm">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <span>Email</span>
              </div>
              <span className="text-[11px] md:text-xs font-medium text-slate-400 break-all bg-slate-100/50 dark:bg-slate-800/30 p-2 rounded-lg border border-transparent group-hover:border-blue-500/20 transition-all">
                {email}
              </span>
            </a>
          </div>
        </div>

        {/* Linha Final: Copyright e Tech Stack */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col gap-2 items-center md:items-start text-[10px] font-black uppercase tracking-widest text-slate-400 text-center md:text-left">
            <p>© {currentYear} • {footer?.rights || "Sérgio Santos • All rights reserved"}</p>
            <p className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Code2 className="w-3 h-3" />
              {footer?.builtBy || localFallbacks.builtBy} Sérgio Santos
            </p>
          </div>
          
          {/* Badge de Tecnologia Consolidada */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-blue-500/30">
            <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <div className="flex items-center gap-2.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
              <span>Next.js 15</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <span>React 19</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <span>Tailwind</span>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  )
}
