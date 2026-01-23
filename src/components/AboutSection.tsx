'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { CareerHighlights } from './CareerHighlights';
import type { Dictionary } from '@/lib/get-dictionary';

interface AboutSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: Dictionary;
}

/**
 * SEÇÃO SOBRE — AUTORIDADE, GOVERNANÇA E IMPACTO
 * Totalmente responsiva, tipada e multilingue (PT / EN / ES)
 */
export const AboutSection = ({ dict, lang }: AboutSectionProps) => {
  const about = dict.about;
  const sections = about?.sections;

  const experienceLabel =
    dict?.common?.governance ||
    (lang === 'pt'
      ? 'Anos de Impacto'
      : lang === 'es'
      ? 'Años de Impacto'
      : 'Years of Impact');

  const imageAlt =
    lang === 'pt'
      ? 'Foto de perfil de Sérgio Santos'
      : lang === 'es'
      ? 'Foto de perfil de Sérgio Santos'
      : 'Sérgio Santos profile photo';

  return (
    <section
      id="about"
      className="py-20 lg:py-32 bg-white dark:bg-[#020617] overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* COLUNA TEXTO */}
          <div className="flex flex-col space-y-10 order-2 lg:order-1">
            <header>
              <span className="inline-block text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] mb-5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                {about?.title}
              </span>

              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tighter">
                {about?.headline}
              </h3>

              <div className="relative pl-6 border-l-4 border-blue-600 dark:border-blue-500">
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
                  “{about?.bio}”
                </p>
              </div>
            </header>

            {/* KPIs */}
            <CareerHighlights dict={dict} />

            {/* DIFERENCIAIS */}
            <div className="space-y-6">
              <h4 className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.2em]">
                <ShieldCheck className="text-blue-600 w-5 h-5" />
                {sections?.highlights?.title}
              </h4>

              <div className="grid gap-4">
                {(sections?.highlights?.items || []).map((item, i) => (
                  <div
                    key={`highlight-${lang}-${i}`}
                    className="group flex gap-5 items-start p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 hover:border-blue-500/50 transition-all"
                  >
                    <div className="mt-1 p-2 bg-emerald-500/10 rounded-lg">
                      <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                    </div>

                    <div>
                      <h5 className="text-slate-900 dark:text-white font-bold text-lg mb-1">
                        {item.label}
                      </h5>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STACK */}
            <div className="space-y-6 pt-4">
              <h4 className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.2em]">
                <Database className="text-blue-600 w-5 h-5" />
                {sections?.stack?.title}
              </h4>

              <div className="flex flex-wrap gap-2">
                {(sections?.stack?.items || []).map((item, i) => (
                  <div
                    key={`stack-${lang}-${i}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all"
                  >
                    <span className="text-slate-800 dark:text-slate-200 text-[11px] font-bold">
                      {item.label}:{' '}
                      <span className="text-blue-600 dark:text-blue-400 ml-1 font-extrabold">
                        {item.description}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA IMAGEM */}
          <div className="relative group lg:sticky lg:top-32 order-1 lg:order-2 mb-12 lg:mb-0">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 rounded-[3rem] blur-3xl opacity-30" />

            <div className="relative bg-slate-100 dark:bg-slate-900 rounded-[3rem] overflow-hidden border aspect-[4/5] shadow-2xl">
              <Image
                src="/images/sergio-santos-profile.png"
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 40vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              <div className="absolute bottom-4 left-4 right-4 p-6 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-[2.5rem]">
                <div className="flex items-baseline gap-1">
                  <span className="text-blue-600 font-black text-5xl">20</span>
                  <span className="text-blue-600 font-bold text-2xl">+</span>
                </div>
                <p className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                  {experienceLabel}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
