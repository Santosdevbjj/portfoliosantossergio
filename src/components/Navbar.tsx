'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Code2, Layers } from 'lucide-react'

interface NavbarProps {
  dict: any; // Recebe o dicionário traduzido
  lang: string;
}

export const Navbar = ({ dict, lang }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Controle de scroll para mudar o estilo da Navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Links dinâmicos baseados no dicionário unificado
  const navLinks = [
    { href: '#about', label: dict.about.title },
    { href: '#projects', label: dict.portfolio.title },
    { href: '#contact', label: dict.common.contact },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Técnico */}
        <Link href={`/${lang}`} className="flex items-center gap-2 group transition-transform active:scale-95">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/20 group-hover:rotate-[10deg] transition-transform duration-300">
            <Layers size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg leading-none tracking-tighter text-slate-900 dark:text-white uppercase">
              Sérgio<span className="text-blue-600">Santos</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">
              Data Engineer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Mobile Menu Button - Animado */}
        <button 
          className="md:hidden p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay - Responsividade Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col gap-4 md:hidden animate-in slide-in-from-top-4 duration-300 z-[100]">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={`/${lang}${link.href}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 text-xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"
            >
              {link.label}
              <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
