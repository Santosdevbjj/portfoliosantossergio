'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

import type { Locale, Dictionary } from '@/types/dictionary'
import { NavSection, getSectionId } from '@/domain/navigation'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useScrollSpy } from '@/contexts/scroll-spy.client'

interface NavbarProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export default function Navbar({ lang, dict }: NavbarProps) {
  const { common, seo, about, experience, projects, articles, contact } = dict
  const { activeSection } = useScrollSpy()

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Montagem + scroll
  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll quando menu mobile está aberto
  useEffect(() => {
    if (!mounted) return

    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, mounted])

  // Fecha menu ao trocar idioma
  useEffect(() => {
    setIsOpen(false)
  }, [lang])

  if (!mounted) return null

  const navLinks: ReadonlyArray<{
    id: NavSection
    href: string
    label: string
  }> = [
    { id: NavSection.ABOUT, href: `/${lang}#${getSectionId(NavSection.ABOUT)}`, label: about.title },
    { id: NavSection.EXPERIENCE, href: `/${lang}#${getSectionId(NavSection.EXPERIENCE)}`, label: experience.title },
    { id: NavSection.PROJECTS, href: `/${lang}#${getSectionId(NavSection.PROJECTS)}`, label: projects.title },
    { id: NavSection.ARTICLES, href: `/${lang}#${getSectionId(NavSection.ARTICLES)}`, label: articles.title },
    { id: NavSection.CONTACT, href: `/${lang}#${getSectionId(NavSection.CONTACT)}`, label: contact.title },
  ]

  return (
    <nav
      role="navigation"
      aria-label={common.navigation}
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
          aria-label={seo.siteName}
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
            aria-label={isOpen ? common.menu.aria.close : common.menu.aria.open}
            onClick={() => setIsOpen(prev => !prev)}
            className="p-2 text-slate-900 dark:text-white transition-transform active:scale-90"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full overflow-y-auto border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-6 p-8">
          {navLinks.map(link => {
            const isActive = activeSection === link.id

            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-black tracking-tighter transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-900 dark:text-white hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {common.languageSwitcher}
            </p>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>
    </nav>
  )
}
