'use client'

import React from 'react'
import { Linkedin, Github, Mail, Cpu, Globe, Code2, ExternalLink, Blocks } from 'lucide-react'

interface FooterProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * COMPONENTE: Footer
 * Totalmente responsivo e multilingue.
 * Exibe a stack tecnológica completa e informações de copyright.
 */
export const Footer = ({ lang, dict }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  // Dados de contato centralizados
  const email = "santossergiorealbjj@outlook.com"
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz"
  const githubUrl = "https://github.com/Santosdevbjj"

  // Acesso aos dicionários com fallbacks
  const about = dict?.about || {};
  const footer = dict?.footer || {};

  // Traduções locais para garantir consistência mesmo sem o JSON carregado
  const localFallbacks = {
    pt: { location: "Brasil", builtBy: "Desenvolvido por", contact: "Contato", social: "Redes Sociais" },
    en: { location: "Brazil", builtBy: "Developed by", contact: "Contact", social: "Social Media" },
    es: { location: "Brasil", builtBy: "Desarrollado por", contact: "Contacto", social: "Redes Sociales" }
  }[lang];

  return (
    <footer className="bg-slate-50 dark:bg-[#020617] pt-20 pb-10 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Coluna 1: Marca e Branding */}
          <div className="md:col-span-2">
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
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                    <Github className="w-4 h-4" />
                  </div>
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-8 uppercase tracking-[0.2em] text-[10px] opacity-70">
              {footer?.contactTitle || localFallbacks.contact}
            </h4>
            <a href={`mailto:${email}`} className="group flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold text-sm">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shrink-0 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <span>Email</span>
              </div>
              <span className="text-[10px] md:text-xs font-medium text-slate-400 break-all bg-slate-100/50 dark:bg-slate-800/30 p-3 rounded-xl border border-transparent group-hover:border-blue-500/20 transition-all">
                {email}
              </span>
            </a>
          </div>
        </div>

        {/* Linha Final: Direitos e Tech Stack Consolidada */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col xl:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col gap-2 items-center xl:items-start text-[10px] font-black uppercase tracking-widest text-slate-400 text-center xl:text-left">
            <p>© {currentYear} • {footer?.rights || "Sérgio Santos • All rights reserved"}</p>
            <p className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Code2 className="w-3.5 h-3.5" />
              {footer?.builtBy || localFallbacks.builtBy} <span className="text-slate-900 dark:text-white ml-1">Sérgio Santos</span>
            </p>
          </div>
          
          {/* Badge de Tecnologias Utilizadas */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-500/5">
            <div className="flex items-center gap-2 pr-4 sm:border-r border-slate-200 dark:border-slate-800">
              <Blocks className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Tech Stack</span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-3 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
              <span>Node.js</span>
              <Dot />
              <span>React 19</span>
              <Dot />
              <span>Next.js 15</span>
              <Dot />
              <span>Tailwind CSS</span>
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

// Pequeno componente auxiliar para os separadores da stack
const Dot = () => <span className="w-1 h-1 bg-blue-600/30 dark:bg-blue-400/30 rounded-full" />
