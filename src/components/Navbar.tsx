'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Layers, ChevronRight, Languages } from 'lucide-react'
import type { Locale } from '@/i18n-config'

interface NavbarProps {
  dict: any;
  lang: Locale;
}

/**
 * NAVBAR PROFISSIONAL E MULTILINGUE
 * Gerencia navegação entre seções, troca de idiomas e estados de scroll.
 */
export const Navbar = ({ dict, lang }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Efeito de Vidro (Glassmorphism) no Scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Bloqueio de scroll do corpo quando o menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Função para trocar o idioma preservando a sub-rota
  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/'
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  const navLinks = [
    { href: '#about', label: dict?.nav?.about || 'Sobre' },
    { href: '#experience', label: dict?.nav?.experience || 'Experiência' },
    { href: '#articles', label: dict?.nav?.articles || 'Artigos' },
    { href: '#projects', label: dict?.nav?.projects || 'Projetos' },
    { href: '#contact', label: dict?.nav?.contact || 'Contato' },
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
          ? 'py-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-black/5' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">
        
        {/* LOGO E IDENTIDADE */}
        <Link 
          href={`/${lang}`} 
          className="flex items-center gap-3 group"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
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
          <nav className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={`/${lang}${link.href}`}
                className="px-3 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-all relative group/link"
              >
                {link.label}
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* Seletor de Idiomas Minimalista */}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
            <Languages className="w-4 h-4 text-slate-400" />
            <div className="flex gap-1.5">
              {languages.map((l) => (
                <Link
                  key={l.code}
                  href={redirectedPathName(l.code)}
                  className={`text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-lg transition-all border ${
                    lang === l.code 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-transparent border-transparent text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                  title={l.label}
                >
                  {l.short}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CONTROLE MOBILE (Hambúrguer) */}
        <button 
          className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white transition-all active:scale-90"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MENU MOBILE FULLSCREEN OVERLAY */}
      <div 
        className={`fixed inset-0 bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl z-[-1] flex flex-col p-8 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        <div className="flex flex-col gap-4 mt-24">
          {navLinks.map((link, index) => (
            <Link 
              key={link.href}
              href={`/${lang}${link.href}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-6 text-xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl active:scale-[0.98] transition-all"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.label}
              <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </div>
            </Link>
          ))}
        </div>

        {/* Idiomas no Mobile */}
        <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-6 text-center">
            {dict?.nav?.changeLang || (lang === 'pt' ? 'Idioma' : lang === 'es' ? 'Idioma' : 'Language')}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {languages.map((l) => (
              <Link
                key={l.code}
                href={redirectedPathName(l.code)}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl font-black text-xs transition-all border-2 ${
                  lang === l.code 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="text-sm">{l.short}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-auto pb-8 text-center">
           <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 mx-auto rounded-full mb-6" />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             Sérgio Santos Portfolio • 2026
           </p>
        </div>
      </div>
    </header>
  )
}
