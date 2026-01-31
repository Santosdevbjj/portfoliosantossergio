'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react' // Removido o Globe daqui

import type { Locale } from '@/i18n-config'
import type { Dictionary } from '@/types/dictionary'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useScrollSpy } from '@/hooks/useScrollSpy'

interface NavbarProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export function Navbar({ lang, dict }: NavbarProps) {
  const { nav, common } = dict

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  const sectionIds = ['about', 'experience', 'projects', 'articles', 'contact'] as const
  const activeSection = useScrollSpy(sectionIds, 100)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen, mounted])

  if (!mounted) return null

  const navLinks = [
    { id: 'about', href: `/${lang}#about`, label: nav.about },
    { id: 'experience', href: `/${lang}#experience`, label: nav.experience },
    { id: 'projects', href: `/${lang}#projects`, label: nav.projects },
    { id: 'articles', href: `/${lang}#articles`, label: nav.articles },
    { id: 'contact', href: `/${lang}#contact`, label: nav.contact },
  ] as const

  return (
    <nav
      className={`fixed top-0 z-[100] w-full transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#020617]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href={`/${lang}`} className="group outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded">
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
            SÉRGIO<span className="text-blue-600">SANTOS</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-8">
            {navLinks.map(link => (
              <Link
                key={link.id}
                href={link.href}
                aria-current={activeSection === link.id ? 'page' : undefined}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                  activeSection === link.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
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
            onClick={() => setIsOpen(prev => !prev)}
            className="p-2 text-slate-900 dark:text-white"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] transition-all duration-300 ${
          isOpen ? 'max-h-[90vh] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-6 p-8">
          {navLinks.map(link => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-2xl font-black tracking-tighter ${
                activeSection === link.id ? 'text-blue-600' : 'text-slate-900 dark:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
             <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {common.navigation}
            </p>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>
    </nav>
  )
}
