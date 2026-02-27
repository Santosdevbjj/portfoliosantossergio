'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  Linkedin,
  Github,
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
}: FooterProps) {
  const { email, linkedin, github } = common.externalLinks;

  return (
    <footer
      role="contentinfo"
      className="mt-24 border-t border-slate-200 dark:border-slate-800/60
                 bg-slate-50 dark:bg-[#020617] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24 space-y-20">

        {/* CTA */}
        <section
          className="relative overflow-hidden rounded-[2.5rem]
                     bg-gradient-to-br from-blue-600 to-indigo-700
                     text-white p-8 md:p-12 lg:p-16
                     flex flex-col lg:flex-row justify-between
                     items-start lg:items-center gap-10"
        >
          <div className="relative z-10 max-w-xl">
            <h3 className="text-2xl md:text-4xl font-black tracking-tight mb-4">
              {articles.title}
            </h3>
            <p className="text-sm md:text-base font-medium leading-relaxed text-blue-50/90">
              {contact.subtitle}
            </p>
          </div>

          <a
            href={`mailto:${email}`}
            className="group relative z-10 inline-flex
                       items-center gap-3 bg-white text-blue-700
                       px-8 py-4 rounded-2xl text-xs
                       font-black uppercase tracking-wider
                       hover:bg-blue-50 transition-all"
          >
            {contact.cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </section>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* IDENTIDADE */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black tracking-tighter uppercase
                               text-slate-900 dark:text-white">
                Sérgio<span className="text-blue-600"> Santos</span>
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest
                            text-slate-400 leading-tight">
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
              <Globe className="w-3.5 h-3.5 text-blue-500" aria-hidden />
              {lang}
            </div>
          </div>

          {/* NAVEGAÇÃO */}
          <nav aria-label={common.navigation}>
            <h4 className={STYLES.footerTitle}>
              {common.navigation}
            </h4>
            <ul className="space-y-3">
              {NAV_SECTIONS.map(section => (
                <li key={section}>
                  <Link
                    href={`/${lang}${getNavHash(section)}`}
                    className={STYLES.footerLink}
                  >
                    {section}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* IDIOMA */}
          <div>
            <h4 className={STYLES.footerTitle}>
              {common.languageSwitcher}
            </h4>
            <div className="max-w-[200px]">
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>

          {/* CONTATO */}
          <div className="space-y-6">
            <h4 className={STYLES.footerTitle}>
              {contact.title}
            </h4>

            <a href={`mailto:${email}`} className="group block space-y-3">
              <div className="flex items-center gap-3 text-sm font-bold
                           text-slate-500 group-hover:text-blue-600
                           transition-colors">
                <Mail className="w-4 h-4" aria-hidden />
                <span>{contact.emailLabel}</span>
              </div>

              <p className="break-all rounded-xl border
                           bg-slate-100/50 dark:bg-slate-800/30
                           p-4 text-[11px] font-mono font-bold
                           text-slate-400">
                {email}
              </p>
            </a>

            <div className="flex gap-3 pt-2">
              <SocialIcon href={linkedin} label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </SocialIcon>

              <SocialIcon href={github} label="GitHub">
                <Github className="w-4 h-4" />
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* FOOTER FINAL */}
        <div className="pt-10 border-t border-slate-200
                     dark:border-slate-800/80
                     flex flex-col md:flex-row
                     items-center justify-between gap-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {common.footer}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
            <Code2 className="w-4 h-4 text-blue-600" aria-hidden />
            {common.builtWith}
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SocialIconProps {
  readonly href: string;
  readonly label: string;
  readonly children: ReactNode;
}

function SocialIcon({ href, label, children }: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group rounded-xl border border-slate-200
                 dark:border-slate-800
                 bg-white dark:bg-slate-900
                 p-2.5 text-slate-400
                 hover:text-blue-600 transition-all"
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
    'inline-block text-sm font-bold text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all',
};
