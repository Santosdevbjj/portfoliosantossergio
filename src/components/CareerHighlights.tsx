'use client';

/**
 * CAREER HIGHLIGHTS: Prova Social e Métricas de Impacto
 * -----------------------------------------------------------------------------
 * ✔ Totalmente alinhado com dict.about
 * ✔ Multilíngue (PT / EN / ES)
 * ✔ Responsivo (mobile-first)
 * ✔ Acessível (ARIA + semântica)
 * ✔ Compatível com TypeScript 6
 * ✔ Compatível com Next.js 16
 */

import {
  ShieldCheck,
  BarChart3,
  Zap,
  Activity,
  Trophy,
  CheckCircle2,
} from 'lucide-react';

import type { Dictionary } from '@/types/dictionary';

interface CareerHighlightsProps {
  readonly dict: Dictionary;
}

export function CareerHighlights({ dict }: CareerHighlightsProps) {
  const { about } = dict;

  const { highlights, stats, differentialTitle, title } = about;

  /**
   * Ícones associados aos destaques.
   * Mapeamento estável (índice previsível)
   */
  const highlightIconMap = [
    Activity,
    Zap,
    BarChart3,
  ] as const;

  return (
    <section
      aria-labelledby="career-highlights-title"
      className="mt-14 md:mt-20 space-y-12 md:space-y-20 antialiased"
    >
      {/* ───────────────── Header ───────────────── */}
      <header className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="h-8 w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full shrink-0"
        />
        <h4
          id="career-highlights-title"
          className="text-xl md:text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white"
        >
          {differentialTitle}
        </h4>
      </header>

      {/* ───────────────── Highlights Grid ───────────────── */}
      <div
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {highlights.map((text, index) => {
          const Icon =
            highlightIconMap[index] ?? Trophy;

          return (
            <article
              key={`highlight-${index}`}
              role="listitem"
              className="group relative p-7 md:p-8 rounded-[2.5rem]
                         bg-slate-50 dark:bg-slate-900/40
                         border border-slate-200/60 dark:border-slate-800/60
                         hover:border-blue-500/50 transition-all duration-500
                         flex flex-col h-full
                         shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div
                  className="mb-6 inline-flex w-fit p-4 rounded-2xl
                             bg-white dark:bg-slate-800
                             text-blue-600 dark:text-blue-400
                             shadow-sm
                             group-hover:bg-blue-600
                             group-hover:text-white
                             transition-colors duration-500"
                >
                  <Icon className="w-6 h-6" />
                </div>

                <p className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
                  {text}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* ───────────────── KPI Banner ───────────────── */}
      <div
        role="region"
        aria-label="Key performance indicators"
        className="relative overflow-hidden
                   rounded-[2.5rem] md:rounded-[3.5rem]
                   bg-blue-600 dark:bg-blue-700
                   p-8 md:p-14 text-white
                   shadow-2xl shadow-blue-600/20"
      >
        <ShieldCheck
          aria-hidden="true"
          className="absolute -right-12 -top-12
                     w-48 h-48 md:w-72 md:h-72
                     text-white/10 rotate-12
                     pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20">
              <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>

            <div className="max-w-xs">
              <h4 className="text-2xl md:text-3xl font-black tracking-tight leading-tight uppercase">
                {title}
              </h4>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hidden lg:block h-16 w-px bg-white/20"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full lg:w-auto">
            <StatItem
              value={stats.experienceValue}
              label={stats.experienceLabel}
            />

            <StatItem
              value={stats.availabilityValue}
              label={stats.availabilityLabel}
              bordered
            />

            <StatItem
              fullText={stats.automation}
              bordered
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    KPI                                     */
/* -------------------------------------------------------------------------- */

interface StatItemBase {
  bordered?: boolean;
}

interface StatItemValue extends StatItemBase {
  value: string;
  label: string;
  fullText?: never;
}

interface StatItemFullText extends StatItemBase {
  fullText: string;
  value?: never;
  label?: never;
}

type StatItemProps = StatItemValue | StatItemFullText;

function StatItem(props: StatItemProps) {
  let value: string;
  let label: string;

  if ('fullText' in props) {
    const tokens = props.fullText.trim().split(/\s+/);
    value = tokens[0];
    label = tokens.slice(1).join(' ');
  } else {
    value = props.value;
    label = props.label;
  }

  return (
    <div
      className={`text-center ${
        props.bordered
          ? 'sm:border-l border-white/10 sm:pl-8'
          : ''
      }`}
    >
      <span className="block text-4xl md:text-5xl font-black tracking-tighter tabular-nums mb-1">
        {value}
      </span>
      <span className="block text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-90 max-w-[120px] mx-auto leading-relaxed">
        {label}
      </span>
    </div>
  );
}
