'use client';

import React from 'react';
import {
  ArrowRight,
  Database,
  ShieldCheck,
  FileText,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import type { Locale } from '@/i18n-config';

interface HeroSectionProps {
  lang: Locale;
  dict: {
    about?: {
      headline?: string;
      bio?: string;
      sections?: {
        highlights?: {
          title?: string;
        };
      };
    };
    common?: {
      viewProjects?: string;
      downloadCv?: string;
    };
    portfolio?: {
      title?: string;
    };
  };
}

/**
 * HERO SECTION — MULTILÍNGUE • RESPONSIVA • ALTA CONVERSÃO
 */
export const HeroSection = ({ dict, lang }: HeroSectionProps) => {
  const about = dict?.about ?? {};
  const common = dict?.common ?? {};
  const portfolio = dict?.portfolio ?? {};

  /** Caminho do CV por idioma */
  const cvPath = `/cv-sergio-santos-${lang}.pdf`;

  /** Fallbacks multilíngues seguros */
  const labels = {
    viewProjects:
      common.viewProjects ??
      portfolio.title ??
      {
        pt: 'Ver Projetos',
        en: 'View Projects',
        es: 'Ver Proyectos',
      }[lang],

    downloadCv:
      common.downloadCv ??
      {
        pt: 'Baixar CV',
        en: 'Download CV',
        es: 'Descargar CV',
      }[lang],

    badge:
      about.sections?.highlights?.title ??
      {
        pt: 'Especialista em Dados',
        en: 'Data Specialist',
        es: 'Especialista en Datos',
      }[lang],

    headline:
      about.headline ??
      {
        pt: 'Transformando dados em decisões estratégicas',
        en: 'Turning data into strategic decisions',
        es: 'Transformando datos en decisiones estratégicas',
      }[lang],

    bio:
      about.bio ??
      {
        pt: 'Atuação em sistemas críticos, engenharia de dados e ciência de dados com foco em impacto real no negócio.',
        en: 'Experience in critical systems, data engineering and data science focused on real business impact.',
        es: 'Experiencia en sistemas críticos, ingeniería de datos y ciencia de datos con enfoque en impacto real.',
      }[lang],

    stack: {
      azure: 'Azure Databricks',
      data:
        {
          pt: 'Ciência de Dados',
          en: 'Data Science',
          es: 'Ciencia de Datos',
        }[lang],
      critical:
        {
          pt: 'Sistemas Críticos',
          en: 'Critical Systems',
          es: 'Sistemas Críticos',
        }[lang],
    },
  };

  return (
    <section className="relative pt-24 pb-16 lg:pt-48 lg:pb-36 overflow-hidden bg-white dark:bg-[#020617] transition-colors">
      {/* GRID BACKGROUND */}
      <div
        className="absolute inset-0 -z-20 opacity-[0.04] dark:opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#2563eb 1.5px, transparent 1.5px), linear-gradient(90deg, #2563eb 1.5px, transparent 1.5px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* RADIAL LIGHT */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.05),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 mb-8">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-[10px] md:text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-[0.3em]">
              {labels.badge}
            </span>
          </div>

          {/* NAME */}
          <h1 className="text-[13vw] sm:text-7xl md:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.8]">
            Sérgio <br className="hidden sm:block" />
            <span className="text-blue-600 relative inline-block">
              Santos
            </span>
          </h1>

          {/* HEADLINE */}
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-8 max-w-3xl">
            {labels.headline}
          </h2>

          {/* BIO */}
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl font-medium">
            {labels.bio}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-5">
            <a
              href="#projects"
              className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all active:scale-95"
            >
              {labels.viewProjects}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>

            <a
              href={cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 px-10 py-5 rounded-2xl font-bold text-lg active:scale-95"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              {labels.downloadCv}
            </a>
          </div>

          {/* STACK */}
          <div className="mt-20 pt-10 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap gap-x-10 gap-y-6">
            <div className="flex items-center gap-2.5 font-black uppercase tracking-widest text-[10px]">
              <Database className="w-4 h-4 text-blue-600" />
              {labels.stack.azure}
            </div>
            <div className="flex items-center gap-2.5 font-black uppercase tracking-widest text-[10px]">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              {labels.stack.data}
            </div>
            <div className="flex items-center gap-2.5 font-black uppercase tracking-widest text-[10px]">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              {labels.stack.critical}
            </div>
          </div>
        </div>
      </div>

      {/* ELEMENTO VISUAL (DESKTOP XL) */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.08] hidden 2xl:block">
        <Database className="w-[700px] h-[700px] text-blue-600 -rotate-12" />
      </div>
    </section>
  );
};
