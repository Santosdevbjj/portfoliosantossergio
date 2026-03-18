'use client'

import { useEffect, useMemo, useState, type JSX } from 'react'
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

export default function Navbar({ lang, common, contact }: NavbarProps): JSX.Element {
  // Removido 'menu' da desestruturação para evitar erro de variável não utilizada
  const { nav, theme } = common
  const { activeSection } = useScrollSpy()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = ''
    }
  }, [isOpen])

  // Memoização otimizada para React 19
  const internalLinks = useMemo(() => 
    NAV_SECTIONS.map((section) => ({
      id: section,
      href: `/${lang}${getNavHash(section)}`,
      label: nav[section as keyof typeof nav] || section,
    })), [lang, nav]
  );

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
          ? 'bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        
        {/* Logo */}
        <Link href={`/${lang}`} className="relative z-[110] outline-none group">
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white transition-colors">
            SÉRGIO<span className="text-blue-600 group-hover:text-blue-500 transition-colors"> SANTOS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-7">
            {internalLinks.map((link) => (
              <Link 
                key={link.id} 
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-blue-600 ${
                  activeSection === link.id ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Botão de CV - Destaque Principal */}
          <a 
            href={resumeData.href}
            target="_blank"
            rel="noopener noreferrer"
            download={resumeData.downloadName}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Download size={14} />
            {resumeData.label}
          </a>

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} />
            <ThemeToggle labels={theme} />
          </div>
        </div>

        {/* Mobile UI */}
        <div className="flex items-center gap-3 lg:hidden relative z-[110]">
          <a 
            href={resumeData.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-blue-600 text-white rounded-full shadow-lg active:scale-90 transition-transform"
            aria-label={resumeData.label}
          >
            <FileText size={20} />
          </a>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-900 dark:text-white"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-[100] bg-white dark:bg-[#020617] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
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
              <span className="text-blue-600 text-sm font-mono opacity-70 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
              {link.label}
            </Link>
          ))}
          
          <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6">
             <LanguageSwitcher currentLang={lang} />
             <ThemeToggle labels={theme} />
          </div>
        </div>
      </div>
    </nav>
  )
}
