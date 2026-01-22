'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Layers, ChevronRight, Languages } from 'lucide-react'
import type { Locale } from '@/i18n-config'

interface NavbarProps {
  dict: {
    nav: {
      about: string;
      experience: string;
      articles: string;
      projects: string;
      contact: string;
      changeLang?: string;
    }
  };
  lang: Locale;
}

/**
 * NAVBAR PROFISSIONAL E MULTILINGUE - NEXT.JS 15 READY
 * Design: Glassmorphism responsivo com tratamento de rotas dinâmicas.
 */
export const Navbar = ({ dict, lang }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Controle de transparência no scroll para legibilidade
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll para evitar scroll duplo quando menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  /**
   * RECONSTRUÇÃO DE PATHNAME (CORREÇÃO DE BUILD)
   * Resolve o erro 'Type string is not assignable to UrlObject'
   */
  const redirectedPathName = (locale: string) => {
    if (!pathname) return `/${locale}`
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/') || `/${locale}`
  }

  const navLinks = [
    { href: '#about', label: dict.nav.about },
    { href: '#experience', label: dict.nav.experience },
    { href: '#articles', label: dict.nav.articles },
    { href: '#projects', label: dict.nav.projects },
    { href: '#contact', label: dict.nav.contact },
  ]

  const languages = [
    { code: 'pt', label: 'Português', short: 'PT' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'es', label: 'Español', short: 'ES' }
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">
        
        {/* LOGO */}
        <Link 
          href={`/${lang}` as any} 
          className="flex items-center gap-3 group relative z-[110]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Layers className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base md:text-xl leading-none tracking-tighter text-slate-900 dark:text-white uppercase">
              Sérgio<span className="text-blue-600">Santos</span>
            </span>
            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] leading-tight">
              Data Specialist
            </span>
          </div>
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={`/${lang}/${link.href}` as any}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-all relative group/link"
              >
                {link.label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* Switcher de Idiomas Desktop */}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
            <div className="flex gap-1">
              {languages.map((l) => (
                <Link
                  key={l.code}
                  href={redirectedPathName(l.code) as any}
                  className={`text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-lg transition-all border ${
                    lang === l.code 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {l.short}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* TRIGGER MENU MOBILE */}
        <button 
          className="md:hidden relative z-[110] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white transition-all active:scale-90 touch-manipulation"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* OVERLAY MENU MOBILE */}
      <div 
        className={`fixed inset-0 bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl z-[100] flex flex-col p-8 transition-all duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-3 mt-24">
          {navLinks.map((link, index) => (
            <Link 
              key={link.href}
              href={`/${lang}/${link.href}` as any}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-5 text-lg font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl active:scale-[0.98] transition-all"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.label}
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </Link>
          ))}
        </nav>

        {/* Seleção de Idioma Mobile (Toque Otimizado) */}
        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 text-center">
            {dict.nav.changeLang || 'Language / Idioma'}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {languages.map((l) => (
              <Link
                key={l.code}
                href={redirectedPathName(l.code) as any}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-4 rounded-xl font-black text-[10px] text-center transition-all border-2 ${
                  lang === l.code 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white dark:bg-slate-800 border-transparent text-slate-500'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
