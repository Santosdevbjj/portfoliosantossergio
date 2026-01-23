'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Layers, ChevronRight } from 'lucide-react'
import type { Locale } from '@/i18n-config'

interface NavbarProps {
  dict: {
    nav: {
      about: string;
      experience: string;
      articles: string;
      projects: string;
      contact: string;
    }
  };
  lang: Locale;
}

/**
 * NAVBAR ESTRATÉGICA - SÉRGIO SANTOS
 * Focada em conversão, autoridade técnica e performance.
 */
export const Navbar = ({ dict, lang }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Controle de transparência no scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll ao abrir menu mobile
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
  }, [isMobileMenuOpen])

  // Itens de navegação centralizados
  const navLinks = [
    { href: '#about', label: dict.nav.about },
    { href: '#experience', label: dict.nav.experience },
    { href: '#projects', label: dict.nav.projects },
    { href: '#contact', label: dict.nav.contact },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-xl' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">
        
        {/* LOGO: Identidade visual do especialista */}
        <Link 
          href={`/${lang}`} 
          className="flex items-center gap-3 group relative z-[120]"
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
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={`/${lang}/${link.href}`}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-all relative group/link"
            >
              {link.label}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        {/* BOTÃO MOBILE */}
        <button 
          className="md:hidden relative z-[120] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white transition-all active:scale-90"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Fechar Menu" : "Abrir Menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MENU MOBILE OVERLAY */}
      <div 
        className={`fixed inset-0 bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl z-[110] flex flex-col p-8 transition-all duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4 mt-24">
          <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] ml-2">Navegação</p>
          <nav className="flex flex-col gap-3">
            {navLinks.map((link, index) => (
              <Link 
                key={link.href}
                href={`/${lang}/${link.href}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-5 text-xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl active:scale-[0.95] transition-all"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.label}
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </Link>
            ))}
          </nav>
        </div>

        {/* FOOTER DO MENU MOBILE */}
        <div className="mt-auto py-10 border-t border-slate-100 dark:border-slate-900 text-center">
          <p className="text-xs font-medium text-slate-400">
            © 2026 • Missão Crítica & Dados
          </p>
        </div>
      </div>
    </header>
  )
}
