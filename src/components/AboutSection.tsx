'use client';

/**
 * ABOUT SECTION — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - 100% Responsivo (Mobile-First)
 * - Totalmente Multilingue (Dicionários PT, EN, ES)
 * - Export Default para compatibilidade com Next.js 16/Turbopack
 */

import Image from 'next/image';
import Script from 'next/script';
import { CheckCircle2 } from 'lucide-react';
import { NavSection, getSectionId } from '@/domain/navigation';
import type { Locale, Dictionary } from '@/types/dictionary';

interface AboutSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default function AboutSection({ dict, lang }: AboutSectionProps) {
  // Desestruturação segura para evitar erros caso o dicionário mude
  const { about, common } = dict;
  
  const sectionId = getSectionId(NavSection.ABOUT);

  // Schema.org para SEO Técnico — Melhora visibilidade em múltiplos idiomas
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    inLanguage: lang,
    mainEntity: {
      '@type': 'Person',
      name: 'Sérgio Santos',
      jobTitle: common.role,
      description: about?.description,
      image: 'https://seusite.com.br/images/sergio-santos-profile.png',
      url: 'https://seusite.com.br',
      sameAs: [
        common.externalLinks.linkedin,
        common.externalLinks.github,
        common.externalLinks.medium
      ],
    },
  };

  // Guard Clause para evitar quebra se o dicionário estiver incompleto
  if (!about) return null;

  return (
    <section
      id={sectionId}
      lang={lang}
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
          
          {/* COLUNA 1: IMAGEM (Ordem 1 no mobile, 2 no desktop para layout moderno) */}
          <div className="relative order-1 lg:order-2 lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <Image
                src="/images/sergio-santos-profile.png"
                alt={`Sérgio Santos - ${common.role}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-70" />

              {/* STATS OVERLAY — Consistente com about.stats do dicionário */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-white/20">
                <div className="flex justify-around items-center gap-4">
                   <div className="text-center">
                      <span className="block text-2xl md:text-3xl font-black text-blue-600 leading-none">
                        {about.stats.experienceValue}
                      </span>
                      <span className="text-[8px] md:text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 block mt-1 tracking-widest">
                        {about.stats.experienceLabel}
                      </span>
                   </div>
                   
                   <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
                   
                   <div className="text-center">
                      <span className="block text-2xl md:text-3xl font-black text-blue-600 leading-none">
                        {about.stats.availabilityValue}
                      </span>
                      <span className="text-[8px] md:text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 block mt-1 tracking-widest">
                        {about.stats.availabilityLabel}
                      </span>
                   </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                   <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.25em] text-blue-600 animate-pulse">
                     {about.stats.automation}
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA 2: TEXTO (Ordem 2 no mobile, 1 no desktop) */}
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
                <p className="text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-4 border-blue-600 pl-6">
                  {about.description}
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {about.differentialContent}
                </p>
              </div>
            </header>

            {/* HIGHLIGHTS — Mapeado dinamicamente do dicionário */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {about.highlights.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-sm md:text-base">
                    {item}
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
