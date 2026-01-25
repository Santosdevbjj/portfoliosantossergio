'use client'

import { useEffect, useState } from 'react'
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
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ------------------------------ ScrollSpy ------------------------------ */
  const activeSection = useScrollSpy(
    NAV_SECTIONS,
    120
  ) as NavSection | null

  /* ------------------------------ UX Guards ------------------------------ */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  /* ------------------------------ DEV Guard ------------------------------ */
  if (process.env.NODE_ENV !== 'production') {
    for (const section of NAV_SECTIONS) {
      if (!dict.nav?.[section]) {
        throw new Error(`[Navbar] nav.${section} ausente no Dictionary`)
      }
    }
  }

  /* ------------------------------ Derived -------------------------------- */
  const navItems = NAV_SECTIONS.map((section) => ({
    key: section,
    href: `/${lang}/${NAV_HASH_MAP[section]}`,
    label: dict.nav[section],
    active: activeSection === section,
  }))

  /* ---------------------------------------------------------------------- */

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-xl py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 flex items-center justify-between">
        {/* LOGO / BRAND */}
        <Link
          href={`/${lang}`}
          className="flex items-center gap-3 z-[120]"
          aria-label="Home"
        >
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
            <Layers className="w-5 h-5 md:w-6 md:h-6" />
          </div>

          <div className="leading-tight">
            <span className="font-black text-slate-900 dark:text-white text-lg">
              Sérgio<span className="text-blue-600">Santos</span>
            </span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {dict.common.roleSenior}
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`relative px-4 py-2 text-sm font-bold transition-colors ${
                item.active
                  ? 'text-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher currentLang={lang} />
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label={dict.common.openMenu}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[110] md:hidden bg-white dark:bg-slate-950 p-8 transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <nav className="mt-24 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex justify-between items-center p-5 rounded-xl font-black transition ${
                item.active
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-900'
              }`}
            >
              {item.label}
              <ChevronRight />
            </Link>
          ))}
        </nav>

        <div className="mt-10 flex justify-center">
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  )
}
