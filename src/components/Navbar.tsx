'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Globe } from 'lucide-react'
import type { Locale } from '@/i18n-config'
import type { Dictionary } from '@/types/dictionary'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

interface NavbarProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export function Navbar({ lang, dict }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { nav, common } = dict

  // Efeito de desfoque ao rolar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: `#about`, label: nav.about },
    { href: `#experience`, label: nav.experience },
    { href: `#projects`, label: nav.projects },
    { href: `#articles`, label: nav.articles },
    { href: `#contact`, label: nav.contact },
  ]

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* LOGO */}
        <Link href={`/${lang}`} className="group">
          <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white uppercase">
            SÉRGIO<span className="text-blue-600 group-hover:text-blue-500 transition-colors">SANTOS</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
          <LanguageSwitcher currentLang={lang} />
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? common.closeMenu : common.openMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Globe size={14} className="text-blue-600" />
                Language / Idioma
              </p>
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
