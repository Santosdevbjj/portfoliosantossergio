'use client';

import React from 'react';
import {
  ShieldCheck,
  BarChart3,
  Clock,
  Server,
  Activity,
  Trophy,
} from 'lucide-react';
import type { Dictionary } from '@/lib/get-dictionary';

interface CareerHighlightsProps {
  dict: Dictionary;
}

/**
 * CAREER HIGHLIGHTS
 * Métricas de impacto e governança
 * ✔ Responsivo (mobile-first)
 * ✔ Multilingue (PT / EN / ES)
 * ✔ Seguro para App Router + Streaming
 */
export const CareerHighlights = ({ dict }: CareerHighlightsProps) => {
  const highlights = dict?.about?.sections?.highlights;
  const metrics = dict?.about?.sections?.metrics;

  const items = highlights?.items ?? [];

  const icons = [
    Clock,
    Server,
    ShieldCheck,
  ];

  return (
    <section
      aria-labelledby="career-highlights-title"
      className="mt-14 md:mt-20 space-y-12 md:space-y-20 antialiased"
    >
      {/* TÍTULO */}
      <header className="flex items-center gap-4">
        <span className="h-8 w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full shrink-0" />
        <h4
          id="career-highlights-title"
          className="text-xl md:text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white"
        >
          {highlights?.title ?? ''}
        </h4>
      </header>

      {/* GRID DE DESTAQUES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const Icon = icons[index] ?? Trophy;

          return (
            <article
              key={`highlight-${index}`}
              className="group relative p-7 md:p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full shadow-sm"
            >
              <span className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-600/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 inline-flex w-fit p-4 rounded-2xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                  <Icon className="w-6 h-6" aria-hidden />
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

      {/* BANNER DE KPIs */}
      <div className="relative overflow-hidden rounded-[3rem] bg-blue-600 dark:bg-blue-700 p-8 md:p-12 text-white shadow-2xl shadow-blue-600/20">
        <Activity
          className="absolute -right-16 -top-16 w-56 h-56 md:w-72 md:h-72 text-white/10 rotate-12 pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* TEXTO */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shrink-0">
              <BarChart3 className="w-9 h-9 md:w-10 md:h-10" aria-hidden />
            </div>

            <div className="max-w-sm">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-90">
                {metrics?.subtitle ?? ''}
              </p>
              <h4 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                {metrics?.title ?? ''}
              </h4>
            </div>
          </div>

          {/* DIVISOR */}
          <div className="hidden lg:block h-16 w-px bg-white/20" />

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-14 w-full lg:w-auto">
            <div className="text-center">
              <span className="block text-5xl md:text-6xl font-black tracking-tighter tabular-nums mb-1">
                {metrics?.availabilityValue ?? ''}
              </span>
              <span className="block text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-80 whitespace-nowrap">
                {metrics?.availabilityLabel ?? ''}
              </span>
            </div>

            <div className="text-center sm:border-l border-white/10 sm:pl-12">
              <span className="block text-5xl md:text-6xl font-black tracking-tighter tabular-nums mb-1">
                {metrics?.automationValue ?? ''}
              </span>
              <span className="block text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-80 whitespace-nowrap">
                {metrics?.automationLabel ?? ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
