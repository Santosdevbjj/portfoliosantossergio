'use client'

/**
 * HERO SECTION: O Impacto Estratégico
 * -----------------------------------------------------------------------------
 * - Design: Tipografia expressiva com foco em autoridade (Sênior).
 * - I18n: Lógica robusta de fallbacks para PT, EN e ES.
 * - Performance: Otimizado para LCP (Largest Contentful Paint).
 */

import React from 'react'
import {
  ArrowRight,
  Database,
  ShieldCheck,
  FileText,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import type { Locale } from '@/i18n-config'

/* =====================================================
 * TYPES
 * ===================================================== */
interface HeroSectionProps {
  readonly lang: Locale
  readonly dict?: {
    about?: {
      headline?: string
      bio?: string
      sections?: {
        highlights?: {
          title?: string
        }
      }
    }
    common?: {
      viewProjects?: string
      downloadCv?: string
      roleSenior?: string
    }
  }
}

/* =====================================================
 * COMPONENT
 * ===================================================== */
export function HeroSection({ dict, lang }: HeroSectionProps) {
  const about = dict?.about
  const common = dict?.common

  const cvPath = `/cv-sergio-santos-${lang}.pdf`

  /* Fallback strings para resiliência de tradução */
  const fallback = {
    badge: { pt: 'Especialista em Dados', en: 'Data Specialist', es: 'Especialista en Datos' },
    headline: { pt: 'Transformando dados em decisões estratégicas', en: 'Turning data into strategic decisions', es: 'Transformando datos en decisiones estratégicas' },
    bio: { pt: 'Especialista em arquitetura de dados e sistemas críticos, focado em transformar complexidade técnica em valor de negócio real.', en: 'Expert in data architecture and critical systems, focused on turning technical complexity into real business value.', es: 'Experto en arquitectura de datos y sistemas críticos, enfocado en convertir la complejidad técnica en valor comercial real.' },
    viewProjects: { pt: 'Ver Projetos', en: 'View Projects', es: 'Ver Proyectos' },
    downloadCv: { pt: 'Baixar CV', en: 'Download CV', es: 'Descargar CV' },
    stack: { 
      azure: 'Azure Databricks',
      data: { pt: 'Ciência de Dados', en: 'Data Science', es: 'Ciencia de Datos' },
      critical: { pt: 'Sistemas Críticos', en: 'Critical Systems', es: 'Sistemas Críticos' }
    }
  }

  const labels = {
    badge: about?.sections?.highlights?.title ?? fallback.badge[lang],
    headline: about?.headline ?? fallback.headline[lang],
    bio: about?.bio ?? fallback.bio[lang],
    viewProjects: common?.viewProjects ?? fallback.viewProjects[lang],
    downloadCv: common?.downloadCv ?? fallback.downloadCv[lang],
    stack: {
      azure: fallback.stack.azure,
      data: fallback.stack.data[lang],
      critical: fallback.stack.critical[lang],
    },
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-white pt-32 pb-20 transition-colors dark:bg-[#020617] lg:pt-48 lg:pb-36"
    >
      {/* 🏁 BACKGROUND DECORATIVO (GRID & GLOW) */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(#2563eb 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          
          {/* ✨ BADGE */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 dark:border-blue-900/30 dark:bg-blue-900/20 backdrop-blur-sm animate-fade-in">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700 dark:text-blue-300 md:text-xs">
              {labels.badge}
            </span>
          </div>

          {/* 🏷️ NAME (Impactful Typography) */}
          <h1
            id="hero-title"
            className="mb-8 text-[13vw] font-black leading-[0.85] tracking-tighter text-slate-900 dark:text-white sm:text-7xl md:text-8xl lg:text-[10rem] animate-fade-in-up"
          >
            Sérgio <br className="hidden sm:block" />
            <span className="text-blue-600 inline-block">Santos</span>
          </h1>

          {/* 📢 HEADLINE */}
          <h2 className="mb-8 max-w-3xl text-2xl font-bold text-slate-800 dark:text-slate-200 md:text-4xl lg:text-5xl tracking-tight leading-tight">
            {labels.headline}
          </h2>

          {/* 📖 BIO */}
          <p className="mb-12 max-w-2xl text-lg font-medium text-slate-600 dark:text-slate-400 md:text-xl leading-relaxed">
            {labels.bio}
          </p>

          {/* ⚡ CALL TO ACTION */}
          <div className="flex flex-col gap-5 sm:flex-row">
            <a
              href="#projects"
              className="group flex min-w-[220px] items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-5 text-lg font-black text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-95 shadow-xl shadow-blue-500/10"
            >
              {labels.viewProjects}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </a>

            <a
              href={cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-[220px] items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-8 py-5 text-lg font-bold text-slate-900 transition-all hover:border-blue-500/30 hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 shadow-sm"
            >
              <FileText className="h-5 w-5 text-blue-600" />
              {labels.downloadCv}
            </a>
          </div>

          {/* 🛠️ KEY STACK */}
          <div className="mt-20 flex flex-wrap gap-x-12 gap-y-6 border-t border-slate-200/60 pt-12 dark:border-slate-800/60 opacity-80">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <Database className="h-4 w-4 text-blue-600" />
              {labels.stack.azure}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              {labels.stack.data}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              {labels.stack.critical}
            </div>
          </div>
        </div>
      </div>

      {/* 🎨 FLOATING VISUAL (Data Pattern) */}
      <div className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 opacity-[0.03] dark:opacity-[0.07] xl:block">
        <div className="relative">
           <Database className="h-[600px] w-[600px] -rotate-12 text-blue-600" />
           <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#020617] to-transparent" />
        </div>
      </div>
    </section>
  )
}
