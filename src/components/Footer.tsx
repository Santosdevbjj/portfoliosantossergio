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
 * Limpo de avisos de lint (lang agora é validado ou prefixado se necessário).
 */
export const Footer = ({ lang, dict }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  // Dados de contato (Single Source of Truth)
  const email = "santossergiorealbjj@outlook.com"
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz"
  const githubUrl = "https://github.com/Santosdevbjj"

  // Acesso seguro ao dicionário
  const { about, footer, common } = dict;

  // Fallbacks locais para garantir multilinguismo completo caso o dict falhe
  const localFallbacks = {
    pt: { location: "Brasil", builtBy: "Desenvolvido por" },
    en: { location: "Brazil", builtBy: "Built by" },
    es: { location: "Brasil", builtBy: "Desarrollado por" }
  }[lang];

  return (
    <footer className="bg-slate-50 dark:bg-[#020617] pt-20 pb-10 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Coluna 1: Identidade Visual e Localização */}
          <div className="sm:col-span-2">
            <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white mb-6 block uppercase">
              Sérgio<span className="text-blue-600">Santos</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed font-medium text-sm md:text-base mb-6">
              {about?.headline || "Data Specialist & Critical Systems Engineering"}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Globe size={14} className="text-blue-500 animate-pulse" />
              {footer?.location || localFallbacks.location}
            </div>
          </div>

          {/* Coluna 2: Networking Profissional */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">
              {footer?.social || "Social"}
            </h4>
            <ul className="flex flex-col gap-5">
              <li>
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm"
                >
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Linkedin size={18} />
                  </div>
                  <span>LinkedIn</span>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm"
                >
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Github size={18} />
                  </div>
                  <span>GitHub</span>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato - Otimizada para não quebrar no mobile */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">
              {footer?.contact || "Contact"}
            </h4>
            <a 
              href={`mailto:${email}`} 
              className="group flex flex-col gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                  <Mail size={18} />
                </div>
                <span className="truncate">{common?.contact || "Email"}</span>
              </div>
              <span className="text-[11px] md:text-xs font-medium text-slate-400 break-all">{email}</span>
            </a>
          </div>
        </div>

        {/* Linha Final: Copyright e Stack */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col gap-2 items-center md:items-start text-[10px] font-black uppercase tracking-widest text-slate-400 text-center md:text-left">
            <p>© {currentYear} • {footer?.rights || "Sérgio Santos"}</p>
            <p className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Code2 size={12} />
              {footer?.builtBy || localFallbacks.builtBy} Sérgio Santos
            </p>
          </div>
          
          {/* Badge de Tecnologia */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <Cpu size={14} className="text-blue-600 shrink-0" />
            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
              <span>Next.js 15</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>React 19</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>Tailwind</span>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  )
}
