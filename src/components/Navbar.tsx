'use client'

import { useEffect, useMemo, useState, type JSX } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, FileText } from 'lucide-react'
import type { SupportedLocale } from "@/dictionaries/locales"
import type { CommonDictionary, ContactDictionary } from '@/types/dictionary'
import { NAV_SECTIONS, getNavHash } from '@/domain/navigation'
import { getResumePath } from '@/lib/resume/resumePdfMap'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useScrollSpy } from '@/contexts/scroll-spy.client'

/**
 * NAVBAR COMPONENT - VERSÃO 2026 (INTEGRADA)
 * -----------------------------------------------------------------------------
 * ✔ Unificação: Tudo baseia-se na rota /[lang]
 * ✔ Fix: Integração direta com resumePdfMap para evitar conflito de estado
 * ✔ Stack: React 19, TS 6.0, Tailwind 4.2, Next.js 16
 */

interface NavbarProps {
  readonly lang: SupportedLocale;
  readonly common: CommonDictionary;
  readonly contact: ContactDictionary; // Necessário para o label do CV
}

export default function Navbar({ lang, common, contact }: NavbarProps): JSX.Element {
  const { nav, menu, theme, languageSwitcher } = common
  const { activeSection } = useScrollSpy()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Controle de scroll otimizado
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll para React 19 quando o menu mobile está aberto
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = ''
    }
  }, [isOpen])

  // Mapeamento de links unificado
  const navLinks = useMemo(() => {
    // 1. Seções da Home (Scroll)
    const baseLinks = NAV_SECTIONS.map((section) => ({
      id: section,
      href: `/${lang}${getNavHash(section)}`,
      label: nav[section as keyof typeof nav] || section,
      isExternal: false
    }));

    // 2. Link do Currículo (PDF Dinâmico baseado no idioma da URL)
    const resumeLink = {
      id: 'resume',
      href: getResumePath(lang),
      label: contact.cvLabel || 'CV',
      isExternal: true,
      icon: <FileText size={14} className="mr-1 inline" />
    };

    return [...baseLinks, resumeLink];
  }, [lang, nav, contact.cvLabel]);

  return (
    <nav 
      role="navigation" 
      aria-label={common.navigation}
      data-scrolled={isScrolled}
      className={`fixed top-0 z-[100] w-full transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-white/90 dark:bg-[#020617]/90 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/60 py-3 shadow-xl' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link 
          href={`/${lang}`} 
          className="group relative z-[110] outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
          onClick={() => setIsOpen(false)}
        >
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white transition-colors group-hover:text-blue-600">
            SÉRGIO<span className="text-blue-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"> SANTOS</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-8">
            {navLinks.map(link => {
              const isActive = activeSection === link.id
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-blue-600 flex items-center ${
                    isActive ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {link.icon && link.icon}
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-blue-600 rounded-full animate-in fade-in zoom-in duration-500" />
                  )}
                </Link>
              )
            })}
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-6">
            <LanguageSwitcher currentLang={lang} />
            <ThemeToggle labels={theme} />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-4 lg:hidden relative z-[110]">
          <ThemeToggle labels={theme} />
          <button
            type="button"
            aria-label={isOpen ? menu.aria.close : menu.aria.open}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-900 dark:text-white focus:outline-none"
          >
            {isOpen ? (
              <X size={32} className="text-blue-600 animate-in spin-in-90 duration-300" />
            ) : (
              <Menu size={32} className="animate-in fade-in duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-[100] bg-white dark:bg-[#020617] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="flex flex-col h-full justify-center gap-12 p-12">
          <div className="space-y-8">
            {navLinks.map((link, idx) => (
              <Link
                key={link.id}
                href={link.href}
                target={link.isExternal ? "_blank" : undefined}
                onClick={() => setIsOpen(false)}
                className="block text-4xl font-black text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <span className="text-blue-600 mr-4 font-mono text-sm">0{idx + 1}.</span>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-12 border-t border-slate-100 dark:border-slate-800/50">
            <p className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {languageSwitcher}
            </p>
            <div className="flex justify-start scale-125 origin-left">
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
