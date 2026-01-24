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

import { LanguageSwitcher } from '@/components/LanguageSwitcher'

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
  const [activeSection, setActiveSection] = useState<NavSection | null>(null)

  /* ------------------------------ Scroll UI ------------------------------ */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ------------------------------ ScrollSpy ------------------------------ */
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    NAV_SECTIONS.forEach((section) => {
      const el = document.getElementById(section)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(section)
        },
        {
          rootMargin: '-45% 0px -45% 0px',
          threshold: 0.1,
        }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

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
      if (!dict.nav[section]) {
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
        <Link href={`/${lang}`} className="flex items-center gap-3 z-[120]">
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
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600" />
              )}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE (LANGUAGE SWITCHER) */}
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
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="mt-24 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex justify-between items-center p-5 rounded-xl bg-slate-50 dark:bg-slate-900 font-black"
            >
              {item.label}
              <ChevronRight className="text-blue-600" />
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
