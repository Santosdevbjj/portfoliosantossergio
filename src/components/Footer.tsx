/**
 * src/components/Footer.tsx
 * Versão: 6 de Abril de 2026 (Pós-depreciação de Brand Icons)
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2 | Node 24
 * Status: FIX BRAND ICONS | MULTILÍNGUE | 100% RESPONSIVO
 */

'use client';

import Link from 'next/link';
import type { ReactNode, JSX } from 'react';
import {
  Mail,
  Globe,
  Code2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

import type {
  Locale,
  CommonDictionary,
  ContactDictionary,
  ArticlesSectionDictionary,
} from '@/types/dictionary';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { NAV_SECTIONS, getNavHash } from '@/domain/navigation';

interface FooterProps {
  readonly lang: Locale;
  readonly common: CommonDictionary;
  readonly contact: ContactDictionary;
  readonly articles: ArticlesSectionDictionary;
}

export default function Footer({
  lang,
  common,
  contact,
  articles,
}: FooterProps): JSX.Element {
  // URLs seguras vindas do dicionário common
  const { linkedin, github, email: mailtoLink } = common.externalLinks;

  return (
    <footer
      role="contentinfo"
      className="mt-24 border-t border-slate-200 dark:border-slate-800/60
                 bg-slate-50 dark:bg-[#020617] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24 space-y-20">

        {/* SECTION: CTA (Call to Action) - Suporte Multilíngue */}
        <section
          className="relative overflow-hidden rounded-[2.5rem]
                     bg-gradient-to-br from-blue-600 to-indigo-700
                     text-white p-8 md:p-12 lg:p-16
                     flex flex-col lg:flex-row justify-between
                     items-start lg:items-center gap-10"
        >
          {/* Efeito Visual Tailwind 4.2 */}
          <div className="absolute -right-20 -top-20 size-64 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-xl">
            <h3 className="text-2xl md:text-4xl font-black tracking-tight mb-4 italic uppercase">
              {contact.ctaTitle || articles.title}
            </h3>
            <p className="text-sm md:text-base font-medium leading-relaxed text-blue-50/90">
              {contact.subtitle}
            </p>
          </div>

          <a
            href={`mailto:${mailtoLink}`}
            className="group relative z-10 inline-flex
                       items-center gap-3 bg-white text-blue-700
                       px-8 py-4 rounded-2xl text-xs
                       font-black uppercase tracking-wider
                       hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-950/20"
          >
            {contact.cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </section>

        {/* GRID: LINKS & INFO - Totalmente Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* COL 1: IDENTIDADE */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black tracking-tighter uppercase
                               text-slate-900 dark:text-white">
                Sérgio<span className="text-blue-600"> Santos</span>
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest
                            text-slate-400 dark:text-slate-500 leading-tight">
                {common.role}
              </p>
            </div>

            <div
              className="inline-flex items-center gap-2.5
                         px-4 py-2 rounded-full
                         bg-white dark:bg-slate-900
                         border border-slate-200 dark:border-slate-800
                         text-[10px] font-black uppercase
                         tracking-[0.2em] text-slate-500 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
              {lang.toUpperCase()}
            </div>
          </div>

          {/* COL 2: NAVEGAÇÃO */}
          <nav aria-label={common.navigation}>
            <h4 className={STYLES.footerTitle}>
              {common.navigation}
            </h4>
            <ul className="space-y-3">
              {NAV_SECTIONS.map((section) => (
                <li key={section}>
                  <Link
                    href={`/${lang}${getNavHash(section)}`}
                    className={STYLES.footerLink}
                  >
                    {common.nav[section] || section}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* COL 3: SELETOR DE IDIOMA (PT, EN, ES-ES, ES-AR, ES-MX) */}
          <div>
            <h4 className={STYLES.footerTitle}>
              {common.languageSwitcher}
            </h4>
            <div className="max-w-[200px]">
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>

          {/* COL 4: CONTATO & SOCIAL (Fix: Brand SVGs) */}
          <div className="space-y-6">
            <h4 className={STYLES.footerTitle}>
              {contact.title}
            </h4>

            <a href={`mailto:${mailtoLink}`} className="group block space-y-3 focus:outline-none">
              <div className="flex items-center gap-3 text-sm font-bold
                             text-slate-500 group-hover:text-blue-600
                             transition-colors">
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>{contact.emailLabel}</span>
              </div>

              <p className="break-all rounded-xl border border-transparent
                           bg-slate-100/50 dark:bg-slate-800/30
                           p-4 text-[11px] font-mono font-bold
                           text-slate-400 group-hover:border-blue-500/30 
                           group-focus:border-blue-500/30 transition-all">
                {common.email}
              </p>
            </a>

            <div className="flex gap-3 pt-2">
              {/* LinkedIn SVG Manual */}
              <SocialIcon href={linkedin} label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </SocialIcon>

              {/* GitHub SVG Manual */}
              <SocialIcon href={github} label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* FINAL: COPYRIGHT */}
        <div className="pt-10 border-t border-slate-200
                       dark:border-slate-800/80
                       flex flex-col md:flex-row
                       items-center justify-between gap-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center md:text-left">
            {common.footer}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
            <Code2 className="w-4 h-4 text-blue-600" aria-hidden="true" />
            {common.builtWith}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --- COMPONENTES AUXILIARES --- */

interface SocialIconProps {
  readonly href: string;
  readonly label: string;
  readonly children: ReactNode;
}

function SocialIcon({ href, label, children }: SocialIconProps): JSX.Element {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex items-center gap-2 rounded-xl border border-slate-200
                 dark:border-slate-800
                 bg-white dark:bg-slate-900
                 p-2.5 text-slate-400
                 hover:text-blue-600 hover:border-blue-600/30 
                 transition-all hover:scale-110 active:scale-95 shadow-sm"
    >
      {children}
      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
    </a>
  );
}

const STYLES = {
  footerTitle:
    'mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500',
  footerLink:
    'inline-block text-sm font-bold text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all focus:text-blue-600 outline-none',
};
