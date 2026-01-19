'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Layers, ChevronRight } from 'lucide-react'

interface NavbarProps {
  dict: any; // Dicionário traduzido vindo do servidor ou layout
  lang: string;
}

/**
 * NAVBAR PROFISSIONAL
 * Design adaptativo com suporte a modo escuro e internacionalização.
 * Otimizada para SEO e performance mobile.
 */
export const Navbar = ({ dict, lang }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Efeito de detecção de scroll para alterar transparência
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fechar menu mobile ao redimensionar tela (prevenção de bugs visuais)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mapeamento de links usando o dicionário i18n
  const navLinks = [
    { href: '#about', label: dict.about?.title || 'Sobre' },
    { href: '#projects', label: dict.portfolio?.title || 'Projetos' },
    { href: '#contact', label: dict.common?.contact || 'Contato' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-xl' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO: Identidade Visual Sérgio Santos */}
        <Link href={`/${lang}`} className="flex items-center gap-3 group transition-transform active:scale-95">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30 group-hover:rotate-[10deg] transition-transform duration-300">
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

        {/* NAVEGAÇÃO DESKTOP (Oculta em Mobile) */}
        <nav className="hidden md:flex items-center gap-2">
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

        {/* BOTÃO HAMBÚRGUER (Mobile Only) */}
        <button 
          className="md:hidden p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Abrir Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MENU MOBILE: Overlay Estilizado (Responsive Card) */}
      {isMobileMenuOpen && (
        <>
          {/* Fundo escurecido para foco no menu */}
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm md:hidden z-[-1]" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          
          <div className="fixed inset-x-4 top-24 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col gap-3 md:hidden animate-in slide-in-from-top-8 duration-500 z-[100]">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={`/${lang}${link.href}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-5 text-xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 rounded-3xl hover:bg-blue-600 hover:text-white transition-all group"
              >
                {link.label}
                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center group-hover:bg-white/20">
                  <ChevronRight size={18} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
              </Link>
            ))}
            
            <div className="mt-4 p-4 border-t border-slate-100 dark:border-slate-800 text-center">
               <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                 Sérgio Santos &copy; 2026
               </span>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
