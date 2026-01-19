'use client'

import React from 'react'
import { Linkedin, Github, Mail, Cpu, Globe, Code2 } from 'lucide-react'

interface FooterProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

export const Footer = ({ lang, dict }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  // Seus dados consolidados
  const email = "santossergiorealbjj@outlook.com"
  const linkedinUrl = "https://www.linkedin.com/in/santossergioluiz"
  const githubUrl = "https://github.com/Santosdevbjj"

  // Acesso seguro ao dicionário
  const about = dict?.about || {}
  const footerDict = dict?.footer || {
    social: lang === 'pt' ? 'Redes Profissionais' : lang === 'es' ? 'Redes Profesionales' : 'Social Media',
    contact: lang === 'pt' ? 'Contato' : lang === 'es' ? 'Contacto' : 'Contact',
    location: lang === 'pt' ? 'Brasil' : lang === 'es' ? 'Brasil' : 'Brazil',
    builtBy: lang === 'pt' ? 'Desenvolvido por' : lang === 'es' ? 'Desarrollado por' : 'Developed by'
  }

  return (
    <footer className="bg-slate-50 dark:bg-[#020617] pt-20 pb-10 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Identidade de Marca e Especialidade */}
          <div className="lg:col-span-2">
            <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white mb-6 block uppercase">
              Sérgio<span className="text-blue-600">Santos</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed font-medium text-sm md:text-base">
              {about.headline || "Data Science & Critical Systems Engineering"}
            </p>
            <div className="mt-8 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Globe size={14} className="text-blue-500" />
              {footerDict.location}
            </div>
          </div>

          {/* Redes Profissionais */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">
              {footerDict.social}
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
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">
              {footerDict.contact}
            </h4>
            <a 
              href={`mailto:${email}`} 
              className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-sm break-all"
            >
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Mail size={16} />
              </div>
              <span className="truncate">{email}</span>
            </a>
          </div>
        </div>

        {/* Linha Final: Copyright e Tech Stack */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col gap-2 items-center md:items-start text-[10px] font-black uppercase tracking-widest text-slate-400">
            <p>© {currentYear} • Sérgio Santos</p>
            <p className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Code2 size={12} />
              {footerDict.builtBy} Sérgio Santos
            </p>
          </div>
          
          {/* Badge de Tecnologia Utilizada */}
          <div className="flex flex-wrap justify-center gap-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              <Cpu size={14} className="text-blue-600" />
              <span>Next.js 15</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>React 19</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>Tailwind CSS</span>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  )
}
