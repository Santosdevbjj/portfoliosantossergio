'use client'

import React from 'react'
import { translations } from '@/constants/translations'
import { Linkedin, Github, Mail, ExternalLink } from 'lucide-react'

export const Footer = ({ lang }: { lang: 'pt' | 'en' | 'es' }) => {
  const t = translations[lang]
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800/50">
      <div className="main-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Bio Curta */}
          <div className="lg:col-span-2">
            <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white mb-6 block">
              SÉRGIO<span className="text-blue-600">SANTOS</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              {t.headline}
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">
              Social
            </h4>
            <div className="flex flex-col gap-4">
              <a href="https://linkedin.com/in/santos-sergio" target="_blank" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
                <Linkedin size={18} /> LinkedIn
              </a>
              <a href="https://github.com/Santosdevbjj" target="_blank" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
                <Github size={18} /> GitHub
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">
              Contato
            </h4>
            <a href="mailto:sergiosantosluiz@gmail.com" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors break-all">
              <Mail size={18} /> sergiosantosluiz@gmail.com
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
          <p>© {currentYear} • Sérgio Santos • {t.role.split('|')[0]}</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1">
              Built with <span className="text-blue-600 font-bold">Next.js 15</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
