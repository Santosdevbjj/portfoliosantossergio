'use client'

/**
 * FOOTER: Governança de Encerramento e Conversão
 * -----------------------------------------------------------------------------
 * - Estratégia: Inclui um CTA de alto impacto para contato direto.
 * - SEO: Mini sitemap para reforçar a indexação de rotas internas.
 * - I18n: Suporte total a PT, EN e ES via dicionário injetado.
 */

import React from 'react'
import Link from 'next/link'
import {
  Linkedin,
  Github,
  Mail,
  Globe,
  Code2,
  ExternalLink,
  Blocks,
  ArrowRight,
} from 'lucide-react'

import type { Locale } from '@/i18n-config'
import {
  NAV_SECTIONS,
  NAV_HASH_MAP,
  type NavSection,
} from '@/domain/navigation'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'

interface FooterProps {
  readonly lang: Locale
  readonly dict: {
    navigation: Record<NavSection, string>
    footer: {
      location: string
      rights: string
      builtBy: string
      emailLabel: string
      stackLabel: string
      ctaTitle: string
      ctaSubtitle: string
      ctaAction: string
      sitemapTitle: string
      languageTitle: string
    }
  }
}

export function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const email = 'santossergiorealbjj@outlook.com'
  const linkedinUrl = 'https://www.linkedin.com/in/santossergioluiz'
  const githubUrl = 'https://github.com/Santosdevbjj'

  const { footer, navigation } = dict

  return (
    <footer
      role="contentinfo"
      className="bg-slate-50 dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800/60 transition-colors mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24 space-y-20">
        
        {/* 🚀 CTA ESTRATÉGICO: Projetado para conversão de recrutadores/clientes */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row justify-between gap-10 items-start lg:items-center shadow-2xl shadow-blue-500/20">
          <div className="max-w-xl relative z-10">
            <h3 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">
              {footer.ctaTitle}
            </h3>
            <p className="text-blue-50/90 leading-relaxed font-medium text-sm md:text-base">
              {footer.ctaSubtitle}
            </p>
          </div>

          <a
            href={`mailto:${email}`}
            className="group relative z-10 inline-flex items-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-blue-50 transition-all shadow-xl active:scale-95"
          >
            {footer.ctaAction}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          {/* Decorativo de fundo */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-[80px]" />
        </section>

        {/* 🗺️ GRID PRINCIPAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* IDENTIDADE */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white uppercase">
                Sérgio<span className="text-blue-600">Santos</span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Data Specialist & Developer
              </p>
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              {footer.location}
            </div>
          </div>

          {/* MINI SITEMAP (SEO Booster) */}
          <nav aria-label="Footer sitemap">
            <h4 className={STYLES.footerTitle}>{footer.sitemapTitle}</h4>
            <ul className="space-y-3">
              {NAV_SECTIONS.map((section) => (
                <li key={section}>
                  <Link
                    href={`/${lang}${NAV_HASH_MAP[section]}`}
                    className={STYLES.footerLink}
                  >
                    {navigation[section]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* IDIOMA / PREFERÊNCIAS */}
          <div>
            <h4 className={STYLES.footerTitle}>{footer.languageTitle}</h4>
            <div className="max-w-[200px]">
               <LanguageSwitcher currentLang={lang} />
            </div>
          </div>

          {/* CONTATO DIRETO */}
          <div className="space-y-6">
            <h4 className={STYLES.footerTitle}>{footer.emailLabel}</h4>
            <a 
              href={`mailto:${email}`} 
              className="group block space-y-3"
            >
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-blue-600 transition-colors font-bold text-sm">
                <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg group-hover:border-blue-600/30 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span>Email</span>
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-400 break-all bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 group-hover:border-blue-500/20 transition-all">
                {email}
              </p>
            </a>
          </div>
        </div>

        {/* 🔒 BARRA DE DIREITOS E CRÉDITOS */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center md:text-left">
            © {currentYear} • {footer.rights}
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
              {footer.builtBy}
            </div>
          </div>

          <div className="flex items-center gap-3 text-[9px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
            <Blocks className="w-3.5 h-3.5 text-blue-600" />
            {footer.stackLabel}
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * COMPONENTES AUXILIARES
 */

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-600/30 hover:-translate-y-1 transition-all flex items-center gap-2"
    >
      {children}
      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
    </a>
  )
}

/**
 * ESTILOS CONSTANTES (Tailwind Shortcuts)
 */
const STYLES = {
  footerTitle: 'font-black uppercase tracking-[0.2em] text-[10px] mb-6 text-slate-400 dark:text-slate-500',
  footerLink: 'font-bold text-sm text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all inline-block',
}
