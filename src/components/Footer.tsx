'use client'

import React from 'react'
import { translations } from '@/constants/translations'
import { Linkedin, Github, Mail, Cpu, Globe } from 'lucide-react'

export const Footer = ({ lang }: { lang: 'pt' | 'en' | 'es' }) => {
  const t = translations[lang]
  const currentYear = new Date().getFullYear()

  // Seus dados atualizados
  const email = "santossergiorealbjj@outlook.com"
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz"
  const githubUrl = "https://github.com/Santosdevbjj"

  const footerContent = {
    pt: { social: "Social", contact: "Contato", location: "Brasil" },
    en: { social: "Social", contact: "Contact", location: "Brazil" },
    es: { social: "Social", contact: "Contacto", location: "Brasil" }
  }[lang]

  return (
    <footer className="bg-slate-50 dark:bg-[#020617] pt-20 pb-10 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-500">
      <div className="main-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Identidade de Marca */}
          <div className="lg:col-span-2">
            <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white mb-6 block">
              SÉRGIO<span className="text-blue-600">SANTOS</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
              {t.headline}
            </p>
            <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <Globe size={14} className="text-blue-500" />
              {footerContent.location}
            </div>
          </div>

          {/* Redes Profissionais */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-[0.2em] text-[10px]">
              {footerContent.social}
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm">
                  <Linkedin size={18} className="group-hover:scale-110 transition-transform" /> 
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm">
                  <Github size={18} className="group-hover:scale-110 transition-transform" /> 
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Informações de Contato */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-[0.2em] text-[10px]">
              {footerContent.contact}
            </h4>
            <a 
              href={`mailto:${email}`} 
              className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm break-all"
            >
              <Mail size={18} className="group-hover:animate-pulse" /> 
              {email}
            </a>
          </div>
        </div>

        {/* Linha Final de Copyright e Stack */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
          <p className="text-center md:text-left">
            © {currentYear} • Sérgio Santos • <span className="text-blue-600 dark:text-blue-400">{t.role.split('|')[0]}</span>
          </p>
          
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="flex items-center gap-2">
              <Cpu size={14} className="text-blue-600" />
              <span>Built with <span className="text-slate-900 dark:text-white">Next.js 15</span></span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
