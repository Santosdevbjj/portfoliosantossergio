'use client';

/**
 * CAREER HIGHLIGHTS: Prova Social e Métricas de Impacto
 * -----------------------------------------------------------------------------
 * - UI: Cards com micro-interações de hover e banner de KPIs de alta visibilidade.
 * - I18n: Consome dicionário estruturado para suporte a PT, EN e ES.
 * - A11y: Semântica de lista e regiões de ARIA devidamente configuradas.
 */

import React from 'react';
import {
  ShieldCheck,
  BarChart3,
  Clock,
  Server,
  Activity,
  Trophy,
  Zap,
  TrendingUp,
} from 'lucide-react';
import type { Dictionary } from '@/types/Dictionary';

interface CareerHighlightsProps {
  readonly dict: Dictionary;
}

// Mapeamento de ícones para garantir que o visual combine com o contexto do dado
const ICON_MAP: Record<string, React.ElementType> = {
  availability: Clock,
  infrastructure: Server,
  security: ShieldCheck,
  efficiency: Zap,
  growth: TrendingUp,
  default: Trophy,
};

export const CareerHighlights = ({ dict }: CareerHighlightsProps) => {
  const highlights = dict?.about?.sections?.highlights;
  const metrics = dict?.about?.sections?.metrics;

  const items = highlights?.items ?? [];

  return (
    <section
      aria-labelledby="career-highlights-title"
      className="mt-14 md:mt-20 space-y-12 md:space-y-20 antialiased"
    >
      {/* 🟦 TÍTULO DA SUBSEÇÃO */}
      <header className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="h-8 w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full shrink-0"
        />
        <h4
          id="career-highlights-title"
          className="text-xl md:text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white"
        >
          {highlights?.title}
        </h4>
      </header>

      {/* 🗂️ GRID DE DESTAQUES (Cards de conquistas) */}
      <div
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((item, index) => {
          // Tenta associar um ícone baseado no index ou slug, fallback para Trophy
          const Icon = index === 0 ? Clock : index === 1 ? Server : index === 2 ? ShieldCheck : Trophy;

          return (
            <article
              key={`highlight-${index}`}
              role="listitem"
              className="group relative p-7 md:p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/40
                         border border-slate-200/60 dark:border-slate-800/60
                         hover:border-blue-500/50 transition-all duration-500
                         flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
            >
              {/* Efeito de Glow no Hover */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-[2.5rem]
                           bg-gradient-to-br from-blue-600/[0.04] to-transparent
                           opacity-0 group-hover:opacity-100 transition-opacity
                           pointer-events-none"
              />

              <div className="relative z-10 flex flex-col h-full">
                <div
                  className="mb-6 inline-flex w-fit p-4 rounded-2xl
                             bg-white dark:bg-slate-800
                             text-blue-600 dark:text-blue-400 shadow-sm
                             group-hover:bg-blue-600 group-hover:text-white
                             transition-colors duration-500"
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h5 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-3">
                  {item.label}
                </h5>

                <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* 📊 BANNER DE KPIs (Métricas de Engenharia/Dados) */}
      <div
        role="region"
        aria-label={metrics?.title ?? 'Key performance indicators'}
        className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem]
                   bg-blue-600 dark:bg-blue-700
                   p-8 md:p-14 text-white
                   shadow-2xl shadow-blue-600/20"
      >
        {/* Ícone de fundo decorativo */}
        <Activity
          aria-hidden="true"
          className="absolute -right-12 -top-12 w-48 h-48 md:w-72 md:h-72
                     text-white/10 rotate-12 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* LADO ESQUERDO: TÍTULOS */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div
              className="p-5 bg-white/10 rounded-3xl backdrop-blur-md
                         border border-white/20 shrink-0"
            >
              <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>

            <div className="max-w-xs">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.25em] mb-2">
                {metrics?.subtitle}
              </p>
              <h4 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                {metrics?.title}
              </h4>
            </div>
          </div>

          {/* DIVISOR (Desktop apenas) */}
          <div
            aria-hidden="true"
            className="hidden lg:block h-16 w-px bg-white/20"
          />

          {/* LADO DIREITO: NÚMEROS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 w-full lg:w-auto">
            <div className="text-center">
              <span className="block text-5xl md:text-7xl font-black tracking-tighter tabular-nums mb-2">
                {metrics?.availabilityValue}
              </span>
              <span className="block text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-90">
                {metrics?.availabilityLabel}
              </span>
            </div>

            <div className="text-center sm:border-l border-white/10 sm:pl-12">
              <span className="block text-5xl md:text-7xl font-black tracking-tighter tabular-nums mb-2">
                {metrics?.automationValue}
              </span>
              <span className="block text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-90">
                {metrics?.automationLabel}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
