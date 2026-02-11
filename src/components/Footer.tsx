'use client'

import Link from 'next/link'
import {
  Linkedin,
  Github,
  Mail,
  Globe,
  Code2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react'

import type { Locale, Dictionary } from '@/types/dictionary'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { NAV_SECTIONS, getNavHash } from '@/domain/navigation'

interface FooterProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export function Footer({ lang, dict }: FooterProps) {
  // ✅ Extração correta (incluindo articles)
  const { common, seo, contact, articles } = dict

  // ✅ Narrow seguro para evitar erro de possível undefined
  const articlesSeo = seo.pages['articles']

  const email = common.externalLinks.email
  const linkedinUrl = common.externalLinks.linkedin
  const githubUrl = common.externalLinks.github

  const countryLabel = lang === 'en-US' ? 'Brazil' : 'Brasil'

  return (
    <footer
      role="contentinfo"
      className="bg-slate-50 dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800/60 transition-colors mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24 space-y-20">

        {/* CTA */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row justify-between gap-10 items-start lg:items-center shadow-2xl shadow-blue-500/20">
          <div className="max-w-xl relative z-10">
            <h3 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">
              {articlesSeo?.title ?? articles.title}
            </h3>

            <p className="text-blue-50/90 leading-relaxed font-medium text-sm md:text-base">
              {articlesSeo?.description ?? ''}
            </p>
          </div>

          <a
            href={`mailto:${email}`}
            className="group relative z-10 inline-flex items-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-blue-50 transition-all shadow-xl active:scale-95"
          >
            {contact.cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-[80px]" />
        </section>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* IDENTIDADE */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white uppercase">
                Sérgio<span className="text-blue-600">Santos</span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                {common.role}
              </p>
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              {countryLabel}
            </div>
          </div>

          {/* NAVEGAÇÃO */}
          <nav aria-label={common.navigation}>
            <h4 className={STYLES.footerTitle}>{common.navigation}</h4>
            <ul className="space-y-3">
              {NAV_SECTIONS.map((section) => (
                <li key={section}>
                  <Link
                    href={`/${lang}${getNavHash(section)}`}
                    className={STYLES.footerLink}
                  >
                    {seo.pages[section]?.title ?? section}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* IDIOMA */}
          <div>
            <h4 className={STYLES.footerTitle}>{common.languageSwitcher}</h4>
            <div className="max-w-[200px]">
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>

          {/* CONTATO */}
          <div className="space-y-6">
            <h4 className={STYLES.footerTitle}>Email</h4>
            <a href={`mailto:${email}`} className="group block space-y-3">
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-blue-600 transition-colors font-bold text-sm">
                <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{contact.emailLabel}</span>
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-400 break-all bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-xl border">
                {email}
              </p>
            </a>
          </div>
        </div>

        {/* FOOTER FINAL */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {common.footer}
          </div>

          <div className="flex items-center gap-4">
            <SocialIcon href={linkedinUrl} label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </SocialIcon>

            <SocialIcon href={githubUrl} label="GitHub">
              <Github className="w-4 h-4" />
            </SocialIcon>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
              <Code2 className="w-4 h-4 text-blue-600" />
              {common.builtWith}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer me"
      aria-label={label}
      className="group p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-600/30 hover:-translate-y-1 transition-all flex items-center gap-2"
    >
      {children}
      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
    </a>
  )
}

const STYLES = {
  footerTitle:
    'font-black uppercase tracking-[0.2em] text-[10px] mb-6 text-slate-400 dark:text-slate-500',
  footerLink:
    'font-bold text-sm text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all inline-block',
}
