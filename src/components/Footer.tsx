'use client';

import React from 'react';
import Link from 'next/link';
import {
  Linkedin,
  Github,
  Mail,
  Globe,
  Code2,
  ExternalLink,
  Blocks,
  ArrowRight,
} from 'lucide-react';

import type { Locale } from '@/i18n-config';
import {
  NAV_SECTIONS,
  NAV_HASH_MAP,
  NavSection,
} from '@/domain/navigation';

interface FooterProps {
  lang: Locale;
  dict: {
    navigation: Record<NavSection, string>;
    footer: {
      location: string;
      rights: string;
      builtBy: string;
      emailLabel: string;
      stackLabel: string;
      ctaTitle: string;
      ctaSubtitle: string;
      ctaAction: string;
      sitemapTitle: string;
      languageTitle: string;
    };
  };
}

/**
 * FOOTER — RESPONSIVO • MULTILÍNGUE • DOMAIN-DRIVEN • SEO-FRIENDLY
 */
export const Footer = ({ lang, dict }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const email = 'santossergiorealbjj@outlook.com';
  const linkedinUrl = 'https://www.linkedin.com/in/santossergioluiz';
  const githubUrl = 'https://github.com/Santosdevbjj';

  const { footer, navigation } = dict;

  return (
    <footer className="bg-slate-50 dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 space-y-24">
        {/* CTA ESTRATÉGICO */}
        <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 lg:p-16 flex flex-col lg:flex-row justify-between gap-10 items-start lg:items-center shadow-xl">
          <div className="max-w-xl">
            <h3 className="text-2xl lg:text-3xl font-black mb-4">
              {footer.ctaTitle}
            </h3>
            <p className="text-white/90 leading-relaxed font-medium">
              {footer.ctaSubtitle}
            </p>
          </div>

          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-xl font-black uppercase tracking-wide text-xs hover:scale-[1.03] transition-transform shadow-lg"
          >
            {footer.ctaAction}
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* IDENTIDADE */}
          <div className="space-y-6">
            <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white uppercase">
              Sérgio
              <span className="text-blue-600">Santos</span>
            </span>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <Globe className="w-4 h-4 text-blue-500" />
              {footer.location}
            </div>
          </div>

          {/* MINI SITEMAP (navigation.ts) */}
          <div>
            <h4 className="footer-title">{footer.sitemapTitle}</h4>
            <ul className="space-y-4">
              {NAV_SECTIONS.map((section) => (
                <li key={section}>
                  <Link
                    href={`/${lang}${NAV_HASH_MAP[section]}`}
                    className="footer-link"
                  >
                    {navigation[section]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* IDIOMA */}
          <div>
            <h4 className="footer-title">{footer.languageTitle}</h4>
            <ul className="space-y-4">
              {(['pt', 'en', 'es'] as const).map((locale) => (
                <li key={locale}>
                  <Link
                    href={`/${locale}`}
                    className={`footer-link ${
                      locale === lang ? 'text-blue-600 font-black' : ''
                    }`}
                  >
                    {locale.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTATO */}
          <div>
            <h4 className="footer-title">{footer.emailLabel}</h4>

            <a
              href={`mailto:${email}`}
              className="group flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-blue-600 transition-colors font-bold text-sm">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{footer.emailLabel}</span>
              </div>

              <span className="text-xs font-bold text-slate-400 break-all bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-2xl">
                {email}
              </span>
            </a>
          </div>
        </div>

        {/* BARRA INFERIOR */}
        <div className="pt-12 border-t border-slate-200 dark:border-slate-800/80 flex flex-col xl:flex-row justify-between items-center gap-10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center xl:text-left">
            © {currentYear} • {footer.rights}
          </div>

          <div className="flex items-center gap-6">
            <SocialIcon href={linkedinUrl}>
              <Linkedin className="w-4 h-4" />
            </SocialIcon>

            <SocialIcon href={githubUrl}>
              <Github className="w-4 h-4" />
            </SocialIcon>

            <div className="flex items-center gap-2 text-[10px] font-black uppercase">
              <Code2 className="w-4 h-4 text-blue-600" />
              {footer.builtBy}
            </div>
          </div>

          <div className="flex items-center gap-3 text-[9px] font-bold uppercase text-slate-500">
            <Blocks className="w-4 h-4 text-blue-600" />
            Next.js • React • TypeScript • Tailwind
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ---------- HELPERS ---------- */

const SocialIcon = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 hover:scale-110 transition-all"
  >
    {children}
    <ExternalLink className="w-3 h-3 opacity-0" />
  </a>
);

/* ---------- TAILWIND SHORTCUTS ---------- */

const footerTitle =
  'font-black uppercase tracking-[0.2em] text-[10px] mb-6 text-slate-900 dark:text-white opacity-60';

const footerLink =
  'font-bold text-sm text-slate-500 hover:text-blue-600 transition-colors';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      h4: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      > & { className?: string };
    }
  }
}
