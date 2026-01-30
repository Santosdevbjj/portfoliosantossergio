'use client';

/**
 * HERO SECTION: Impacto Inicial e Proposta de Valor Sérgio Santos
 * -----------------------------------------------------------------------------
 * - UI: Tipografia de alta escala e grid dinâmico.
 * - I18n: Totalmente integrado aos dicionários de idiomas (PT, EN, ES).
 * - Responsividade: Fluid typography com limites seguros para mobile.
 */

import { ArrowRight, Database, ShieldCheck, FileText, BarChart3, Sparkles } from 'lucide-react';
import type { SupportedLocale } from '@/dictionaries';
import type { Dictionary } from '@/types/dictionary';

interface HeroSectionProps {
  readonly lang: SupportedLocale;
  readonly dict: Dictionary;
}

export function HeroSection({ dict, lang }: HeroSectionProps) {
  const { hero, contact, projects } = dict;
  
  // Caminho dinâmico para o currículo conforme o idioma selecionado
  const cvPath = `/cv-sergio-santos-${lang}.pdf`;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-white pt-32 pb-20 transition-colors dark:bg-[#020617] lg:pt-48 lg:pb-36 antialiased"
    >
      {/* BACKGROUND DECORATIVO: Grid de Missão Crítica */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
          style={{ backgroundImage: `radial-gradient(#2563eb 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          
          {/* BADGE: Status e Saudação */}
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 dark:border-blue-900/30 dark:bg-blue-900/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700 dark:text-blue-300 md:text-xs">
              {hero.greeting}
            </span>
          </div>

          {/* H1: Nome com escala fluida para garantir responsividade */}
          <h1 
            id="hero-title" 
            className="mb-8 text-[15vw] font-black leading-[0.85] tracking-tighter text-slate-900 dark:text-white sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[10rem]"
          >
            Sérgio <br className="hidden sm:block" />
            <span className="text-blue-600 inline-block">Santos</span>
          </h1>

          {/* H2: Título Profissional Dinâmico */}
          <h2 className="mb-6 max-w-3xl text-2xl font-bold text-slate-800 dark:text-slate-200 md:text-4xl lg:text-5xl tracking-tight leading-tight">
            {hero.title} <span className="text-blue-600">{hero.subtitle}</span>
          </h2>

          {/* PARÁGRAFO: Headline de Autoridade */}
          <p className="mb-4 max-w-2xl text-lg font-bold text-slate-700 dark:text-slate-300 md:text-xl">
             {hero.role}
          </p>
          <p className="mb-12 max-w-2xl text-lg font-medium text-slate-600 dark:text-slate-400 md:text-xl leading-relaxed">
            {hero.headline}
          </p>

          {/* AÇÕES (CTAs) */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a 
              href="#projects" 
              className="group flex min-w-[200px] items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-5 text-lg font-black text-white transition-all hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95"
            >
              {hero.ctaPrimary}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </a>

            <a 
              href={cvPath} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex min-w-[200px] items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-8 py-5 text-lg font-bold text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-800 transition-all hover:border-blue-600/50 hover:shadow-lg active:scale-95"
            >
              <FileText className="h-5 w-5 text-blue-600" />
              {contact.cvLabel}
            </a>
          </div>

          {/* STACK TECNOLÓGICA (Sincronizada com dicionário) */}
          <div className="mt-20 flex flex-wrap gap-x-12 gap-y-6 border-t border-slate-200/60 pt-12 dark:border-slate-800/60">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <Database className="h-4 w-4 text-blue-600" />
              {projects.categories.cloud}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              {projects.categories.dataScience}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              {projects.categories.security}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
