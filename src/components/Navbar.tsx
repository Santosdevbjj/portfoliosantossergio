'use client';

/**
 * NAVBAR COMPONENT — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - Otimizado para Next.js 16 / React 19.
 * - Prevenção de Hydration Mismatch via Safe Mounting.
 * - Totalmente Responsivo, Acessível e Multilingue.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import type { Route } from 'next';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/types/dictionary';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface NavbarProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export function Navbar({ lang, dict }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { nav, common } = dict;

  // Garante que o componente só execute lógica de navegador após o mount
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Links de navegação baseados no dicionário
  const navLinks = [
    { href: `#about` as Route, label: nav.about },
    { href: `#experience` as Route, label: nav.experience },
    { href: `#projects` as Route, label: nav.projects },
    { href: `#articles` as Route, label: nav.articles },
    { href: `#contact` as Route, label: nav.contact },
  ];

  // Enquanto não estiver montado, renderiza uma versão simplificada para evitar erro de hidratação
  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-[100] bg-transparent py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">
           <div className="font-black text-xl md:text-2xl tracking-tighter text-slate-900 dark:text-white uppercase">
            SÉRGIO<span className="text-blue-600">SANTOS</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">
        
        {/* LOGO — Mantém o contexto do idioma */}
        <Link href={`/${lang}` as Route} className="group outline-none">
          <span className="font-black text-xl md:text-2xl tracking-tighter text-slate-900 dark:text-white uppercase transition-opacity group-hover:opacity-80">
            SÉRGIO<span className="text-blue-600">SANTOS</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          
          {/* Alternador de Idioma */}
          <LanguageSwitcher currentLang={lang} />
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="lg:hidden p-2 text-slate-900 dark:text-white transition-transform active:scale-90 outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? common.closeMenu : common.openMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY & CONTENT */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-[-1]" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 p-8 animate-in slide-in-from-top duration-500 shadow-2xl">
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                  <Globe size={14} className="text-blue-600" />
                  {lang === 'pt' ? 'Idioma' : lang === 'en' ? 'Language' : 'Idioma'}
                </p>
                <LanguageSwitcher currentLang={lang} />
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
