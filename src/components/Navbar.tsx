'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Menu, X, FileText, Download } from 'lucide-react'

import type { SupportedLocale } from "@/dictionaries/locales"
import type { CommonDictionary, ContactDictionary } from '@/types/dictionary'
import { NAV_SECTIONS, getNavHash } from '@/domain/navigation'
import { getResumePath, getResumeDownloadName } from '@/lib/resume/resumePdfMap'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useScrollSpy } from '@/contexts/scroll-spy.client'

interface NavbarProps {
  readonly lang: SupportedLocale;
  readonly common: CommonDictionary;
  readonly contact: ContactDictionary;
}

/**
 * NAVBAR MULTILINGUE - SÉRGIO SANTOS
 * Suporte: PT-BR, EN-US, ES-ES, ES-AR, ES-MX
 * Stack: Next.js 16.2.0, React 19, Tailwind 4.2
 */
export default function Navbar({ lang, common, contact }: NavbarProps) {
  const { nav, theme, menu } = common
  const { activeSection } = useScrollSpy()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Controle de Scroll para efeito Glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll quando menu mobile está aberto
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = ''
    }
  }, [isOpen])

  // Memoização dos links baseada no dicionário (React 19)
  const internalLinks = useMemo(() => 
    NAV_SECTIONS.map((section) => ({
      id: section,
      href: `/${lang}${getNavHash(section)}`,
      label: nav[section as keyof typeof nav] || section,
    })), [lang, nav]
  );

  // Mapeamento dinâmico para os PDFs regionais
  const resumeData = useMemo(() => ({
    href: getResumePath(lang),
    label: contact.cvLabel || 'CV',
    downloadName: getResumeDownloadName(lang)
  }), [lang, contact.cvLabel]);

  return (
    <nav 
      role="navigation" 
      aria-label={common.navigation}
      className={`fixed top-0 z-[100] w-full transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-3 shadow-sm' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        
        {/* Logo Estilizada */}
        <Link href={`/${lang}`} className="relative z-[110] outline-none group">
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white transition-colors">
            SÉRGIO<span className="text-blue-600 group-hover:text-blue-500 transition-colors"> SANTOS</span>
          </span>
        </Link>

        {/* Desktop Navigation - Totalmente Responsivo */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-7">
            {internalLinks.map((link) => (
              <Link 
                key={link.id} 
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-600 ${
                  activeSection === link.id 
                    ? 'text-blue-600 after:content-[""] after:block after:w-full after:h-0.5 after:bg-blue-600 after:mt-1' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Botão de CV: Dinâmico por Idioma (PT, EN, ES) */}
          <a 
            href={resumeData.href}
            target="_blank"
            rel="noopener noreferrer"
            download={resumeData.downloadName}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Download size={14} />
            {resumeData.label}
          </a>

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} />
            <ThemeToggle labels={theme} />
          </div>
        </div>

        {/* Mobile UI Controls */}
        <div className="flex items-center gap-3 lg:hidden relative z-[110]">
          <a 
            href={resumeData.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-blue-600 text-white rounded-full shadow-lg active:scale-90 transition-transform"
            aria-label={`${resumeData.label} (${lang})`}
          >
            <FileText size={20} />
          </a>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-900 dark:text-white focus:outline-none"
            aria-expanded={isOpen}
            aria-label={isOpen ? menu.close : menu.open}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Tailwind 4.2 Smooth Transitions */}
      <div 
        className={`lg:hidden fixed inset-0 z-[100] bg-white dark:bg-[#020617] transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex flex-col h-full justify-center p-10 gap-8">
          {internalLinks.map((link, idx) => (
            <Link 
              key={link.id} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-4xl font-black text-slate-900 dark:text-white flex items-baseline gap-4 group"
            >
              <span className="text-blue-600 text-sm font-mono opacity-70">0{idx + 1}</span>
              <span className="group-hover:translate-x-3 transition-transform duration-300">{link.label}</span>
            </Link>
          ))}
          
          <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6">
             <div className="flex flex-col gap-2">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                 {common.languageSwitcher}
               </span>
               <LanguageSwitcher currentLang={lang} />
             </div>
             <div className="flex flex-col gap-2">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                 {theme.system}
               </span>
               <ThemeToggle labels={theme} />
             </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
