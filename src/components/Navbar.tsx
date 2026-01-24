'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, Layers, ChevronRight } from 'lucide-react'

import type { Locale } from '@/i18n-config'
import type { Dictionary } from '@/types/Dictionary'

import {
  NAV_SECTIONS,
  NAV_HASH_MAP,
  NavSection,
} from '@/domain/navigation'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface NavbarProps {
  lang: Locale
  dict: Pick<Dictionary, 'nav' | 'common'>
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function Navbar({ lang, dict }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  /* ------------------------------ Scroll UI ------------------------------ */

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  /* ------------------------------ Guards --------------------------------- */

  /**
   * Falha explícita em DEV se o dicionário estiver incompleto
   * (evita erro silencioso em produção)
   */
  if (process.env.NODE_ENV !== 'production') {
    if (!dict.nav || !dict.common) {
      throw new Error('[Navbar] Dicionário incompleto: nav ou common ausente')
    }

    for (const section of NAV_SECTIONS) {
      if (!dict.nav[section]) {
        throw new Error(`[Navbar] Chave nav.${section} ausente no Dictionary`)
      }
    }
  }

  /* ------------------------------ Derived -------------------------------- */

  const navItems = NAV_SECTIONS.map((section) => ({
    key: section,
    href: `/${lang}/${NAV_HASH_MAP[section]}`,
    label: dict.nav[section],
  }))

  /* ---------------------------------------------------------------------- */

  return (
    <header
      data-scrolled={isScrolled}
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-xl py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href={`/${lang}`}
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3 z-[120]"
          aria-label="Home"
        >
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-110">
            <Layers className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-black uppercase tracking-tight text-slate-900 dark:text-white text-base md:text-xl">
              Sérgio<span className="text-blue-600">Santos</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {dict.common.role}
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label={dict.common.navigation}
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="relative px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors group"
            >
              {item.label}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label={
            isMobileMenuOpen ? dict.common.closeMenu : dict.common.openMenu
          }
          aria-expanded={isMobileMenuOpen}
          className="md:hidden z-[120] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white active:scale-90"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-0 z-[110] md:hidden flex flex-col p-8 bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl transition-all ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="mt-24 space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 ml-2">
            {dict.common.navigation}
          </p>

          <nav className="flex flex-col gap-3">
            {navItems.map((item, index) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ transitionDelay: `${index * 40}ms` }}
                className="flex items-center justify-between p-5 text-xl font-black rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white active:scale-95 transition-all"
              >
                {item.label}
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </Link>
            ))}
          </nav>
        </div>

        <footer className="mt-auto py-10 border-t border-slate-100 dark:border-slate-900 text-center">
          <p className="text-xs font-medium text-slate-400">
            {dict.common.footer}
          </p>
        </footer>
      </div>
    </header>
  )
}
