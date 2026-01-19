'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Layers, ChevronRight } from 'lucide-react'
import type { Locale } from '@/i18n-config'

interface NavbarProps {
  dict: any;
  lang: Locale; // Uso do tipo estrito que configuramos no i18n-config
}

/**
 * NAVBAR PROFISSIONAL - ENGENHARIA DE ELITE
 * Design adaptativo com suporte a modo escuro e internacionalização.
 * Otimizada para SEO e ergonomia mobile.
 */
export const Navbar = ({ dict, lang }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Efeito de detecção de scroll: Melhora a legibilidade ao descer a página
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevenção de "Scroll Lock" e bugs visuais ao redimensionar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    
    // Trava o scroll do corpo quando o menu mobile está aberto (UX Sênior)
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileMenuOpen])

  // Mapeamento de links com Fallbacks de segurança para o dicionário
  const navLinks = [
    { href: '#about', label: dict?.nav?.about || dict?.about?.title || 'Sobre' },
    { href: '#articles', label: dict?.nav?.articles || 'Artigos' },
    { href: '#projects', label: dict?.nav?.projects || dict?.portfolio?.title || 'Projetos' },
    { href: '#contact', label: dict?.nav?.contact || dict?.common?.contact || 'Contato' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO: Identidade Visual Sérgio Santos */}
        <Link 
          href={`/${lang}`} 
          className="flex items-center gap-3 group transition-transform active:scale-95"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30 group-hover:rotate-12 transition-transform duration-300">
            <Layers size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg leading-none tracking-tighter text-slate-900 dark:text-white uppercase">
              Sérgio<span className="text-blue-600">Santos</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
              Data Specialist
            </span>
          </div>
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={`/${lang}${link.href}`}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-600/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* BOTÃO HAMBÚRGUER (Mobile) */}
        <button 
          className="md:hidden p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white active:scale-90 transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={dict?.common?.menu_aria || "Abrir Menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MENU MOBILE: Overlay Fullscreen Estilizado */}
      <div 
        className={`fixed inset-0 bg-white dark:bg-slate-950 z-[-1] flex flex-col p-8 transition-all duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4 mt-20">
          {navLinks.map((link, index) => (
            <Link 
              key={link.href}
              href={`/${lang}${link.href}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-6 text-2xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl active:bg-blue-600 active:text-white transition-all shadow-sm"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.label}
              <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center">
                <ChevronRight size={20} className="text-blue-600" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-auto pb-10 text-center">
           <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
             Sérgio Santos &bull; 2026
           </p>
        </div>
      </div>
    </header>
  )
}
