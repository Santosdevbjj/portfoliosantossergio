'use client'

import { useEffect, useMemo, useState, type JSX } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

import type { SupportedLocale } from "@/dictionaries/locales"
import type { CommonDictionary } from '@/types/dictionary'
import { NAV_SECTIONS, getNavHash } from '@/domain/navigation'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useScrollSpy } from '@/contexts/scroll-spy.client'

/**
 * NAVBAR COMPONENT - CORRIGIDO
 * -----------------------------------------------------------------------------
 * ✔ Fix: TypeScript Index Signature Error resolvido
 * ✔ Stack: React 19, TS 6.0, Tailwind 4.2, Next.js 16
 */

interface NavbarProps {
  readonly lang: SupportedLocale;
  readonly common: CommonDictionary;
}

export default function Navbar({ lang, common }: NavbarProps): JSX.Element {
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

  // Lock body scroll para React 19
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Mapeamento dinâmico integrado com a nova página de Artigos
  const navLinks = useMemo(() => {
    // Links baseados nas seções de scroll da Home
    const baseLinks = NAV_SECTIONS.map((section) => ({
      id: section,
      href: `/${lang}${getNavHash(section)}`,
      label: nav[section as keyof typeof nav] || section,
      isExternal: false
    }));

    // Acesso seguro à tradução de artigos
    // Cast para Record para evitar erro de indexação do TS
    const navTranslations = nav as Record<string, string>;
    const articlesLabel = navTranslations['articles'] || navTranslations['artigos'] || 'Artigos';

    return [
      ...baseLinks,
      { 
        id: 'articles', 
        href: `/${lang}/artigos`, 
        label: articlesLabel,
        isExternal: true 
      }
    ];
  }, [lang, nav]);

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
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-blue-600 ${
                    isActive ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
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
      <div 
        className={`lg:hidden fixed inset-0 z-[100] bg-white dark:bg-[#020617] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex flex-col h-full justify-center gap-12 p-12">
          <div className="space-y-8">
            {navLinks.map((link, idx) => (
              <Link 
                key={link.id} 
                href={link.href} 
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
