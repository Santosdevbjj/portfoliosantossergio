'use client';

import React from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { Database, Award, CheckCircle2 } from 'lucide-react';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/types/dictionary';

interface AboutSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export const AboutSection = ({ dict, lang }: AboutSectionProps) => {
  const { about } = dict;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    inLanguage: lang,
    mainEntity: {
      '@type': 'Person',
      name: 'Sérgio Santos',
      jobTitle: dict.hero.role,
      description: about.description,
      sameAs: [
        'https://www.linkedin.com/in/santossergioluiz',
        'https://github.com/Santosdevbjj'
      ],
    },
  };

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-24 lg:py-40 bg-white dark:bg-[#020617] transition-colors overflow-hidden"
    >
      <Script
        id="schema-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* COLUNA 1: CONTEÚDO TEXTUAL */}
          <div className="space-y-12 order-2 lg:order-1">
            <header className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-blue-600" />
                <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">
                  {about.title}
                </span>
              </div>

              <h2 id="about-heading" className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.95]">
                {about.differentialTitle}
              </h2>

              <div className="space-y-6">
                <p className="text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {about.description}
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {about.differentialContent}
                </p>
              </div>
            </header>

            {/* HIGHLIGHTS (Puxando do Array do JSON) */}
            <div className="grid gap-4">
              {about.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <span className="font-bold text-slate-700 dark:text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUNA 2: IMAGEM E STATS */}
          <div className="relative order-1 lg:order-2 lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/sergio-santos-profile.png"
                alt="Sérgio Santos"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

              {/* STATS OVERLAY (Puxando do Objeto Stats do JSON) */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[2rem] p-6 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between">
                   <div className="text-center">
                      <span className="block text-2xl font-black text-blue-600 leading-none">20+</span>
                      <span className="text-[8px] uppercase font-bold text-slate-500">Anos</span>
                   </div>
                   <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                   <div className="text-center">
                      <span className="block text-2xl font-black text-blue-600 leading-none">99%</span>
                      <span className="text-[8px] uppercase font-bold text-slate-500">Uptime</span>
                   </div>
                   <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                   <div className="text-center">
                      <span className="block text-2xl font-black text-blue-600 leading-none">2.9k</span>
                      <span className="text-[8px] uppercase font-bold text-slate-500">Horas/Auto</span>
                   </div>
                </div>
                <p className="text-center text-[10px] font-black uppercase tracking-widest text-blue-600">
                  {about.stats.experience}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
