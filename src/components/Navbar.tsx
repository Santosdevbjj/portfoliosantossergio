'use client'

/**
 * NAVBAR: Navegação Global e Controle de Contexto
 * -----------------------------------------------------------------------------
 * - Responsividade: Menu mobile com lock de scroll e animações fluidas.
 * - SEO/I18n: Links dinâmicos baseados no locale atual.
 * - UX: ScrollSpy integrado para feedback visual de seção ativa.
 */

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Menu, X, Layers, ChevronRight } from 'lucide-react'

import type { Locale } from '@/i18n-config'
import type { Dictionary } from '@/types/Dictionary'

import {
  NAV_SECTIONS,
  NAV_HASH_MAP,
  type NavSection,
} from '@/domain/navigation'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useScrollSpy } from '@/hooks/useScrollSpy'

interface NavbarProps {
  readonly lang: Locale
  readonly dict: Pick<Dictionary, 'nav' | 'common'>
}

export function Navbar({ lang, dict }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  /* ------------------------------ Scroll Handler -------------------------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // Initial check
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ------------------------------ ScrollSpy ------------------------------ */
  const activeSection = useScrollSpy(NAV_SECTIONS, 120) as NavSection | null

  /* ------------------------------ Interactions --------------------------- */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Lock scroll quando o menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  /* ------------------------------ Memoized Items ------------------------- */
  const navItems = useMemo(() => 
    NAV_SECTIONS.map((section) => ({
      key: section,
      href: `/${lang}/${NAV_HASH_MAP[section]}`,
      label: dict.nav[section],
      active: activeSection === section,
    })), [lang, dict.nav, activeSection])

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 flex items-center justify-between">
        
        {/* 🚀 LOGO / BRAND */}
        <Link
          href={`/${lang}`}
          onClick={closeMobileMenu}
          className="flex items-center gap-3 z-[120] group outline-none"
          aria-label="Home"
        >
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105 group-active:scale-95">
            <Layers className="w-5 h-5 md:w-6 md:h-6" />
          </div>

          <div className="leading-tight hidden xs:block">
            <span className="font-black text-slate-900 dark:text-white text-lg tracking-tight">
              Sérgio<span className="text-blue-600">Santos</span>
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              {dict.common.roleSenior}
            </p>
          </div>
        </Link>

        {/* 🖥️ DESKTOP NAV */}
        <nav
          className="hidden md:flex items-center gap-1"
          role="navigation"
          aria-label="Desktop Navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={`relative px-4 py-2 text-sm font-bold transition-all duration-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 ${
                item.active
                  ? 'text-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
          ))}
        </nav>

        {/* 🛠️ ACTIONS */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <LanguageSwitcher currentLang={lang} />
          </div>

          {/* 📱 MOBILE TOGGLE */}
          <button
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? dict.common.closeMenu : dict.common.openMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden z-[120] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white active:scale-90 transition-transform"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU OVERLAY */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[110] md:hidden bg-white dark:bg-slate-950 px-6 py-24 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isMobileMenuOpen
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-3" role="navigation">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              onClick={closeMobileMenu}
              className={`flex justify-between items-center p-5 rounded-2xl font-black text-lg transition-all ${
                item.active
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent'
              }`}
            >
              {item.label}
              <ChevronRight className={item.active ? 'opacity-100' : 'opacity-30'} />
            </Link>
          ))}
        </nav>

        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  )
}
