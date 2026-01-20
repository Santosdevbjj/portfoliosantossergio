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
 * NAVBAR PROFISSIONAL
 * Suporte total a i18n com seletor de idiomas e design responsivo.
 */
export const Navbar = ({ dict, lang }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Detecta scroll para mudar o estilo da barra
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Gerenciamento de Menu Mobile e Redimensionamento
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileMenuOpen])

  // Função para trocar o idioma mantendo a rota atual
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
    { code: 'pt', label: 'PT' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' }
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link 
          href={`/${lang}`} 
          className="flex items-center gap-3 group transition-transform active:scale-95"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30 group-hover:rotate-6 transition-transform">
            <Layers className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base md:text-lg leading-none tracking-tighter text-slate-900 dark:text-white uppercase">
              Sérgio<span className="text-blue-600">Santos</span>
            </span>
            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Data Specialist
            </span>
          </div>
        </Link>

        {/* NAVEGAÇÃO DESKTOP E SELETOR DE IDIOMAS */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={`/${lang}${link.href}`}
                className="px-3 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-all rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Seletor de Idiomas Desktop */}
          <div className="flex items-center gap-2 pl-6 border-l border-slate-200 dark:border-slate-800">
            <Languages className="w-4 h-4 text-slate-400" />
            <div className="flex gap-2">
              {languages.map((l) => (
                <Link
                  key={l.code}
                  href={redirectedPathName(l.code)}
                  className={`text-[10px] font-black px-2 py-1 rounded-md transition-all ${
                    lang === l.code 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:text-blue-600 dark:hover:text-white'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* BOTÃO MOBILE */}
        <button 
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MENU MOBILE OVERLAY */}
      <div 
        className={`fixed inset-0 bg-white dark:bg-slate-950 z-[-1] flex flex-col p-6 transition-all duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-3 mt-24">
          {navLinks.map((link, index) => (
            <Link 
              key={link.href}
              href={`/${lang}${link.href}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-5 text-xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl active:bg-blue-600 active:text-white transition-all shadow-sm"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.label}
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </Link>
          ))}
        </div>

        {/* Seletor de Idiomas Mobile */}
        <div className="mt-10 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 text-center">
            {lang === 'pt' ? 'Alterar Idioma' : lang === 'es' ? 'Cambiar Idioma' : 'Change Language'}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {languages.map((l) => (
              <Link
                key={l.code}
                href={redirectedPathName(l.code)}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex justify-center py-3 rounded-xl font-black text-xs transition-all ${
                  lang === l.code ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-auto pb-6 text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             Sérgio Santos • 2026
           </p>
        </div>
      </div>
    </header>
  )
}
