'use client';

/**
 * NAVBAR COMPONENT — SÉRGIO SANTOS (REVISÃO 2026)
 * -----------------------------------------------------------------------------
 * - Responsividade: Adaptativa com Menu Overlay e suporte a Gestos.
 * - I18n: Consome estritamente o Dictionary.ts para PT, EN, ES.
 * - Integração: Inclui ThemeToggle (Modo Escuro) e LanguageSwitcher.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import type { Route } from 'next';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/types/dictionary';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle'; // Importação do sistema unificado
import { useScrollSpy } from '@/hooks/useScrollSpy';

interface NavbarProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export function Navbar({ lang, dict }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { nav, common } = dict;

  // IDs das seções sincronizados com os IDs do page.tsx
  const sectionIds = ['about', 'experience', 'projects', 'articles', 'contact'];
  const activeSection = useScrollSpy(sectionIds, 100);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mapeamento dinâmico baseado no seu dicionário JSON
  const navLinks = [
    { id: 'about', href: `#about` as Route, label: nav.about },
    { id: 'experience', href: `#experience` as Route, label: nav.experience },
    { id: 'projects', href: `#projects` as Route, label: nav.projects },
    { id: 'articles', href: `#articles` as Route, label: nav.articles },
    { id: 'contact', href: `#contact` as Route, label: nav.contact },
  ];

  if (!mounted) return null;

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 dark:bg-[#020617]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3 shadow-lg' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">
        
        {/* LOGO ESTRATÉGICO */}
        <Link href={`/${lang}` as Route} className="group outline-none">
          <span className="font-black text-xl md:text-2xl tracking-tighter text-slate-900 dark:text-white uppercase transition-opacity group-hover:opacity-80">
            SÉRGIO<span className="text-blue-600">SANTOS</span>
          </span>
        </Link>

        {/* DESKTOP NAV E CONTROLES */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-600 ${
                  activeSection === link.id 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-500 dark:text-slate-400'
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
            className="p-2 text-slate-900 dark:text-white transition-transform active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? common.closeMenu : common.openMenu}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[90vh] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-2xl font-black tracking-tighter transition-colors ${
                activeSection === link.id ? 'text-blue-600' : 'text-slate-900 dark:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2">
                <Globe size={14} className="text-blue-600" />
                {common.navigation}
              </p>
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
