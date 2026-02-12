// src/components/AboutSection.tsx
import React from "react";
import type { Dictionary, Locale } from "@/types/dictionary";

// 1. Definição estrita de Props para TS 6.0
export interface AboutSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

// 2. Export default direto para resolver o erro de build da Vercel
export default function AboutSection({ dict }: AboutSectionProps) {
  // Destruturação segura do dicionário
  const { about } = dict;
  const {
    title,
    differentialTitle,
    description,
    differentialContent,
    highlights,
    stats,
  } = about;

  return (
    <section
      id="sobre"
      className="w-full py-16 px-4 md:px-8 lg:px-16 bg-background text-foreground"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header - Responsivo: Texto menor em mobile */}
        <header className="space-y-2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            {differentialTitle}
          </p>
        </header>

        {/* Description - Melhorado o line-height para legibilidade */}
        <div className="space-y-6 max-w-4xl">
          <p className="text-base md:text-lg leading-relaxed text-balance">
            {description}
          </p>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground text-balance">
            {differentialContent}
          </p>
        </div>

        {/* Highlights - Flex Wrap nativo para mobile */}
        {highlights && highlights.length > 0 && (
          <ul className="flex flex-wrap gap-2 md:gap-3 pt-4">
            {highlights.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="rounded-full border border-border bg-secondary/20 px-4 py-1.5 text-xs md:text-sm font-medium transition-colors hover:bg-secondary/40"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Stats - Grid Adaptável (1 col mobile -> 2 col tablet -> 4 col desktop) */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-8">
            <div className="flex flex-col items-center justify-center rounded-xl border border-border p-6 transition-all hover:shadow-md">
              <span className="text-3xl font-bold text-primary">
                {stats.experienceValue}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {stats.experienceLabel}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-border p-6 transition-all hover:shadow-md">
              <span className="text-3xl font-bold text-primary">
                {stats.availabilityValue}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {stats.availabilityLabel}
              </span>
            </div>

            {/* O item de automação ocupa 2 colunas no desktop para equilíbrio visual */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-6 sm:col-span-2">
              <span className="text-center font-medium text-foreground">
                {stats.automation}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
