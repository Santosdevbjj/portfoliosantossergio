'use client';

/**
 * ABOUT SECTION: A Proposta de Valor e Autoridade
 * -----------------------------------------------------------------------------
 * - Dinâmica: Altera headline/bio com base em parâmetros (utm_source, role, company).
 * - SEO: Injeta Schema.org JSON-LD para ProfilePage.
 * - Design: Layout assimétrico com imagem sticky e stack tecnológica.
 */

import React from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Database, Award } from 'lucide-react';

import { CareerHighlights } from './CareerHighlights';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/types/Dictionary';

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type Role = 'tech-lead' | 'staff' | 'principal';
type Company = 'google' | 'amazon' | 'nubank' | 'mercadolivre' | 'default';
type Source = 'linkedin' | 'github' | 'direct';

interface AboutSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
  readonly roleProp?: Role;
}

/* -------------------------------------------------------------------------- */
/* RESOLVERS (Inteligência de Personalização)                                 */
/* -------------------------------------------------------------------------- */

function resolveRole(param: string | null, fallback?: Role): Role {
  if (fallback) return fallback;
  if (param === 'staff' || param === 'principal') return param;
  return 'tech-lead';
}

function resolveCompany(param: string | null): Company {
  const validCompanies: Company[] = ['google', 'amazon', 'nubank', 'mercadolivre'];
  return validCompanies.includes(param as Company) ? (param as Company) : 'default';
}

function resolveSource(param: string | null): Source {
  if (param === 'linkedin' || param === 'github') return param;
  return 'direct';
}

function pickDeterministic(items: string[], seed: string) {
  const hash = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  return items[hash % items.length];
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export const AboutSection = ({ dict, lang, roleProp }: AboutSectionProps) => {
  const pathname = usePathname();
  const params = useSearchParams();

  const isHome = pathname === `/${lang}`;
  const linkedinUrl = 'https://www.linkedin.com/in/santossergioluiz';
  const githubUrl = 'https://github.com/Santosdevbjj';

  // Resolução de contexto para personalização dinâmica
  const role = resolveRole(params.get('role'), roleProp);
  const company = resolveCompany(params.get('company'));
  const source = resolveSource(params.get('utm_source'));

  const { about } = dict;
  const sections = about?.sections;

  /* ------------------------------ COPY LOGIC ------------------------------ */

  const roleCopy = about?.roles?.[role];
  const companyCopy = roleCopy?.companies?.[company];
  const sourceCopy = companyCopy?.sources?.[source];

  const headline = sourceCopy?.headlines
    ? pickDeterministic(sourceCopy.headlines, `${lang}-${company}-${source}`)
    : roleCopy?.headline ?? about?.headline;

  const bio = sourceCopy?.bio ?? companyCopy?.bio ?? roleCopy?.bio ?? about?.bio;

  /* ------------------------------ TRANSLATIONS ---------------------------- */

  const jobTitleMap = {
    principal: { pt: 'Engenheiro Principal', es: 'Ingeniero Principal', en: 'Principal Engineer' },
    staff: { pt: 'Engenheiro Staff', es: 'Ingeniero Staff', en: 'Staff Engineer' },
    'tech-lead': { pt: 'Tech Lead', es: 'Líder Técnico', en: 'Tech Lead' },
  };

  const experienceLabel = dict.common?.yearsOfImpact ?? (
    lang === 'en' ? 'Years of Impact' : lang === 'es' ? 'Años de Impacto' : 'Anos de Impacto'
  );

  /* ------------------------------ SCHEMA.ORG ------------------------------ */

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    inLanguage: lang,
    mainEntity: {
      '@type': 'Person',
      name: 'Sérgio Santos',
      jobTitle: jobTitleMap[role][lang],
      description: bio,
      knowsAbout: sections?.stack?.items?.map((i) => i.label) ?? [],
      sameAs: [linkedinUrl, githubUrl],
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
                  {about?.title}
                </span>
              </div>

              <h2 id="about-heading" className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.95]">
                {headline}
              </h2>

              <blockquote className="border-l-4 border-blue-600 pl-6 py-2">
                <p className="text-xl md:text-2xl font-medium italic text-slate-700 dark:text-slate-300 leading-relaxed">
                  “{bio}”
                </p>
              </blockquote>
            </header>

            {/* DESTAQUES DE CARREIRA */}
            <CareerHighlights dict={dict} />

            {/* STACK TECNOLÓGICA */}
            <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
              <h3 className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-slate-400">
                <Database className="w-4 h-4 text-blue-600" />
                {sections?.stack?.title}
              </h3>

              <div className="flex flex-wrap gap-2.5">
                {sections?.stack?.items?.map((item, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-500/30 transition-colors"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA 2: IMAGEM E STATS (STICKY) */}
          <div className="relative order-1 lg:order-2 lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-blue-900/10">
              <Image
                src="/images/sergio-santos-profile.png"
                alt={schema.mainEntity.name}
                fill
                priority={isHome}
                loading={isHome ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              
              {/* Overlay de proteção para o badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

              {/* BADGE DE EXPERIÊNCIA */}
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[2rem] p-6 md:p-8 flex items-center gap-6 shadow-xl">
                <div className="flex flex-col">
                  <span className="text-4xl md:text-5xl font-black text-blue-600 leading-none">20+</span>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500 mt-2">
                    {experienceLabel}
                  </p>
                </div>
                <div className="h-12 w-px bg-slate-200 dark:bg-slate-700" />
                <Award className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </div>
            
            {/* Elemento Decorativo */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
          </div>

        </div>
      </div>
    </section>
  );
};
