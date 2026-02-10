'use client';

/**
 * ABOUT SECTION — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - Sincronizado com Dictionary Interface v1.0.0
 * - Suporte total a Next.js 16 Turbopack
 * - Localização: pt-BR, en-US, es-ES, es-AR, es-MX
 */

import Image from 'next/image';
import Script from 'next/script';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { NavSection, getSectionId } from '@/domain/navigation';
import type { Locale, Dictionary } from '@/types/dictionary';

interface AboutSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default function AboutSection({ dict, lang }: AboutSectionProps) {
  // Desestruturação baseada rigorosamente no seu arquivo src/types/dictionary.ts
  const { about, common, metrics } = dict;
  const sectionId = getSectionId(NavSection.ABOUT);

  // Guard Clause de segurança
  if (!about) return null;

  // Schema.org para SEO Internacional
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sérgio Santos',
    jobTitle: common.role,
    description: about.description,
    url: 'https://seusite.com.br',
    knowsAbout: about.highlights,
    address: {
      '@type': 'PostalAddress',
      addressCountry: lang.split('-')[1] || 'BR'
    }
  };

  return (
    <section
      id={sectionId}
      lang={lang}
      className="relative py-24 lg:py-40 bg-white dark:bg-[#020617] transition-colors overflow-hidden"
    >
      <Script
        id="schema-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* COLUNA 1: VISUAL & METRICS */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
              <Image
                src="/images/sergio-santos-profile.png"
                alt={`Sérgio Santos - ${common.role}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
              
              {/* Overlay de Gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />

              {/* STATS FLOATING CARD - Alinhado com as chaves do seu JSON */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                   <div className="text-center border-r border-slate-200 dark:border-slate-800">
                      <span className="block text-3xl font-black text-blue-600">
                        {about.stats.experienceValue}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                        {about.stats.experienceLabel}
                      </span>
                   </div>
                   
                   <div className="text-center">
                      <span className="block text-3xl font-black text-blue-600">
                        {about.stats.availabilityValue}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                        {about.stats.availabilityLabel}
                      </span>
                   </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
                   <Zap className="w-3 h-3 text-blue-500 animate-pulse" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                     {about.stats.automation}
                   </p>
                </div>
              </div>
            </div>
            
            {/* Decoração de fundo */}
            <div className="absolute -z-10 -bottom-8 -left-8 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50" />
          </div>

          {/* COLUNA 2: CONTEÚDO TEXTUAL */}
          <div className="space-y-10 order-1 lg:order-2">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 dark:text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                  {about.title}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                {about.differentialTitle}
              </h2>
            </header>

            <div className="space-y-6">
              <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {about.description}
              </p>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {about.differentialContent}
              </p>
            </div>

            {/* HIGHLIGHTS DINÂMICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {about.highlights.map((highlight, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 group hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
