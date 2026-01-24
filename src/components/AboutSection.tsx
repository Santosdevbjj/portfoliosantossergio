'use client';

import React from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { CheckCircle2, Database, ShieldCheck } from 'lucide-react';

import { CareerHighlights } from './CareerHighlights';
import type { Dictionary } from '@/lib/get-dictionary';

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type Role = 'tech-lead' | 'staff' | 'principal';
type Company = 'google' | 'amazon' | 'nubank' | 'mercadolivre' | 'default';
type Source = 'linkedin' | 'github' | 'direct';

interface AboutSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: Dictionary;
  role?: Role;
}

/* -------------------------------------------------------------------------- */
/* RESOLVERS                                                                  */
/* -------------------------------------------------------------------------- */

function resolveRole(param: string | null, fallback?: Role): Role {
  if (fallback) return fallback;
  if (param === 'staff' || param === 'principal') return param;
  return 'tech-lead';
}

function resolveCompany(param: string | null): Company {
  if (
    param === 'google' ||
    param === 'amazon' ||
    param === 'nubank' ||
    param === 'mercadolivre'
  ) {
    return param;
  }
  return 'default';
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

export const AboutSection = ({ dict, lang, role: roleProp }: AboutSectionProps) => {
  const pathname = usePathname();
  const params = useSearchParams();

  const isHome = pathname === `/${lang}`;

  const role = resolveRole(params.get('role'), roleProp);
  const company = resolveCompany(params.get('company'));
  const source = resolveSource(params.get('utm_source'));

  const about = dict.about;
  const sections = about?.sections;

  /* ------------------------------ COPY ----------------------------------- */

  const roleCopy = about?.roles?.[role];
  const companyCopy = roleCopy?.companies?.[company];
  const sourceCopy = companyCopy?.sources?.[source];

  const headline =
    sourceCopy?.headlines
      ? pickDeterministic(sourceCopy.headlines, `${lang}-${company}-${source}`)
      : roleCopy?.headline ?? about?.headline;

  const bio =
    sourceCopy?.bio ??
    companyCopy?.bio ??
    roleCopy?.bio ??
    about?.bio;

  /* ------------------------------ META ----------------------------------- */

  const jobTitle =
    role === 'principal'
      ? 'Principal Engineer'
      : role === 'staff'
      ? 'Staff Engineer'
      : 'Tech Lead';

  const experienceLabel =
    dict.common?.governance ??
    (lang === 'pt'
      ? 'Anos de Impacto'
      : lang === 'es'
      ? 'Años de Impacto'
      : 'Years of Impact');

  /* ------------------------------ SCHEMA --------------------------------- */

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    inLanguage: lang,
    mainEntity: {
      '@type': 'Person',
      name: 'Sérgio Santos',
      jobTitle,
      knowsAbout: sections?.stack?.items.map((i) => i.label),
      sameAs: [
        'https://www.linkedin.com/in/seu-linkedin',
        'https://github.com/seu-github'
      ]
    }
  };

  /* ------------------------------------------------------------------------ */

  return (
    <section id="about" className="py-20 lg:py-32 bg-white dark:bg-[#020617]">
      <Script
        id="schema-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* TEXT */}
          <div className="space-y-10 order-2 lg:order-1">
            <header>
              <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">
                {about?.title}
              </span>

              <h3 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black">
                {headline}
              </h3>

              <p className="mt-6 text-lg italic text-slate-700 dark:text-slate-300">
                “{bio}”
              </p>
            </header>

            <CareerHighlights dict={dict} />

            {/* STACK */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-black text-xs uppercase">
                <Database className="w-4 h-4 text-blue-600" />
                {sections?.stack?.title}
              </h4>

              <div className="flex flex-wrap gap-2">
                {sections?.stack?.items.map((item, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="relative order-1 lg:order-2 lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/sergio-santos-profile.png"
                alt="Sérgio Santos"
                fill
                priority={isHome}
                loading={isHome ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover"
              />

              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-950/90 rounded-2xl p-4">
                <span className="text-4xl font-black text-blue-600">20+</span>
                <p className="text-[10px] uppercase tracking-widest">
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
