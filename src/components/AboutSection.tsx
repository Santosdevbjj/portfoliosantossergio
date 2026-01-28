'use client';

/**
 * ABOUT SECTION — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - 100% Responsivo (Mobile-First)
 * - Totalmente Multilingue (Integração Direta com JSON)
 * - SEO Otimizado com JSON-LD (Schema.org)
 * - Compatível com Next.js 16 (React 19)
 */

import Image from 'next/image';
import Script from 'next/script';
import { CheckCircle2 } from 'lucide-react';
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
          
          {/* COLUNA 1: CONTEÚDO TEXTUAL (Ordem 2 no mobile para a imagem vir primeiro) */}
          <div className="space-y-12 order-2 lg:order-1">
            <header className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-blue-600" />
                <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">
                  {about.title}
                </span>
              </div>

              <h2 id="about-heading" className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.95]">
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

            {/* HIGHLIGHTS (Mapeamento dinâmico do JSON) */}
            <div className="grid gap-4">
              {about.highlights.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-transform hover:scale-[1.01]"
                >
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-sm md:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUNA 2: IMAGEM E STATS (Ordem 1 no mobile) */}
          <div className="relative order-1 lg:order-2 lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <Image
                src="/images/sergio-santos-profile.png"
                alt="Sérgio Santos"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              {/* Overlay sutil para garantir leitura dos stats brancos */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

              {/* STATS OVERLAY — Conectado 100% ao Dicionário */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[2rem] p-6 shadow-2xl">
                <div className="grid grid-cols-3 gap-2">
                   <div className="text-center">
                      <span className="block text-xl md:text-2xl font-black text-blue-600 leading-none">
                        {about.stats.experience.split(' ')[0]}
                      </span>
                      <span className="text-[7px] md:text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block mt-1">
                        {lang === 'pt' ? 'Experiência' : lang === 'en' ? 'Experience' : 'Experiencia'}
                      </span>
                   </div>
                   
                   <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-auto self-center" />
                   
                   <div className="text-center">
                      <span className="block text-xl md:text-2xl font-black text-blue-600 leading-none">
                        {about.stats.availability.split(' ')[0]}
                      </span>
                      <span className="text-[7px] md:text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block mt-1">
                        Uptime
                      </span>
                   </div>
                </div>
                
                {/* Rodapé do card de Stats */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                   <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                     {about.stats.automation}
                   </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
