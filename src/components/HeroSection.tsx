'use client';

/**
 * HERO SECTION — SÉRGIO SANTOS
 *
 * ✔ Next.js 16 (App Router)
 * ✔ TypeScript 6 strict safe
 * ✔ 100% tipado
 * ✔ Multilingue (pt-BR | en-US | es-*)
 * ✔ Totalmente responsivo
 * ✔ Arquitetura desacoplada
 */

import type { Dictionary } from "@/types/dictionary"
import { getSectionId, NavSection } from "@/domain/navigation"

interface HeroSectionProps {
  readonly dictionary: Pick<
    Dictionary,
    "hero" | "contact" | "about" | "metrics" | "meta"
  >
}

export default function HeroSection({
  dictionary,
}: HeroSectionProps): React.JSX.Element {

  const { hero, contact, about, metrics, meta } = dictionary

  const projectsHash = `#${getSectionId(NavSection.PROJECTS)}`
  const cvPath = `/cv-sergio-santos-${meta.locale}.pdf`

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-[95vh] w-full items-center justify-center overflow-hidden
                 bg-slate-50 px-6 py-20 dark:bg-slate-950"
    >
      <div className="container relative z-10 mx-auto flex flex-col items-center text-center">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center rounded-full border border-blue-200
                        bg-blue-50/50 px-4 py-1.5 dark:border-blue-800/50 dark:bg-blue-900/20">
          <span className="text-[10px] font-black uppercase tracking-[0.25em]
                           text-blue-700 dark:text-blue-300 md:text-xs">
            {hero.greeting}
          </span>
        </div>

        {/* Title */}
        <h1
          id="hero-title"
          className="mb-6 max-w-4xl text-4xl font-extrabold tracking-tight
                     text-slate-900 dark:text-white
                     sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {hero.title}{" "}
          <span className="block bg-gradient-to-r from-blue-600 to-cyan-500
                           bg-clip-text text-transparent sm:inline">
            {hero.subtitle}
          </span>
        </h1>

        {/* Headline */}
        <p className="mb-12 max-w-2xl text-lg font-medium leading-relaxed
                      text-slate-600 dark:text-slate-400 md:text-xl">
          {hero.headline}
        </p>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:gap-6">

          <a
            href={projectsHash}
            className="inline-flex h-14 items-center justify-center rounded-xl
                       bg-blue-600 px-8 text-base font-bold text-white
                       transition-all hover:bg-blue-700 hover:shadow-lg
                       hover:shadow-blue-500/25 active:scale-95"
          >
            {hero.ctaPrimary}
          </a>

          <a
            href={cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center rounded-xl
                       border border-slate-200 bg-white px-8 text-base font-bold
                       text-slate-700 transition-all hover:bg-slate-50
                       dark:border-slate-800 dark:bg-slate-900
                       dark:text-slate-200 dark:hover:bg-slate-800
                       active:scale-95"
          >
            {contact.cvLabel}
          </a>

        </div>

        {/* Availability Indicator */}
        <div className="mt-16 flex items-center gap-2 text-sm font-medium
                        text-slate-500 dark:text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping
                             rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full
                             bg-green-500" />
          </span>

          <span>
            {about.stats.availabilityLabel}:{" "}
            <b className="text-slate-700 dark:text-slate-300">
              {metrics.availability}
            </b>
          </span>
        </div>

      </div>

      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px]
                   -translate-x-1/2 -translate-y-1/2
                   opacity-10 blur-[120px] dark:opacity-[0.05]"
      >
        <div className="h-full w-full rounded-full bg-blue-600" />
      </div>

    </section>
  )
}
