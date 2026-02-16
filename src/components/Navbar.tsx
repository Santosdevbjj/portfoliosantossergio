'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

import type { Locale, CommonDictionary } from '@/types/dictionary'
import {
  NavSection,
  NAV_SECTIONS,
  getSectionId,
} from '@/domain/navigation'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useScrollSpy } from '@/contexts/scroll-spy.client'

interface NavbarProps {
  readonly lang: Locale
  readonly dict: CommonDictionary
}

export default function Navbar({
  lang,
  dict,
}: NavbarProps): React.JSX.Element {
  const { navigation, menu, languageSwitcher } = dict
  const { activeSection } = useScrollSpy()

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  /* -------------------------------------------------------------------------- */
  /*                                SCROLL STATE                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* -------------------------------------------------------------------------- */
  /*                             BODY SCROLL LOCK                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  /* -------------------------------------------------------------------------- */
  /*                          FECHA MENU AO TROCAR IDIOMA                        */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setIsOpen(false)
  }, [lang])

  /* -------------------------------------------------------------------------- */
  /*                             NAV LINKS DERIVADOS                             */
  /* -------------------------------------------------------------------------- */

  const navLinks = useMemo(
    () =>
      NAV_SECTIONS.map(section => {
        const labels: Record<NavSection, string> = {
          [NavSection.ABOUT]: dict.role, // título curto (acessível)
          [NavSection.EXPERIENCE]: dict.role,
          [NavSection.PROJECTS]: dict.role,
          [NavSection.ARTICLES]: dict.role,
          [NavSection.CONTACT]: dict.role,
        }

        return {
          id: section,
          href: `/${lang}#${getSectionId(section)}`,
          label: labels[section],
        }
      }),
    [lang, dict],
  )

  return (
    <nav
      role="navigation"
      aria-label={navigation}
      className={`fixed top-0 z-[100] w-full transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#020617]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* LOGO */}
        <Link
          href={`/${lang}`}
          aria-label="Home"
          className="group rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
            SÉRGIO<span className="text-blue-600">SANTOS</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-8">
            {navLinks.map(link => {
              const isActive = activeSection === link.id

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} />
            <ThemeToggle />
          </div>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            aria-label={isOpen ? menu.aria.close : menu.aria.open}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen(prev => !prev)}
            className="p-2 text-slate-900 dark:text-white transition-transform active:scale-90"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        id="mobile-menu"
        className={`lg:hidden absolute top-full left-0 w-full overflow-y-auto border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-6 p-8">
          {navLinks.map(link => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {languageSwitcher}
            </p>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>
    </nav>
  )
}
