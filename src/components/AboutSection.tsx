'use client';

import Image from 'next/image';
import Script from 'next/script';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { NavSection, getSectionId } from '@/domain/navigation';

import type { Locale, Dictionary } from '@/types/dictionary';

/* ─────────────────────────────────────────────
 * Type aliases corretos (EVITA erro de parsing)
 * ───────────────────────────────────────────── */
type AboutContent = Dictionary['about'];
type MetricsContent = Dictionary['metrics'];
type CommonContent = Dictionary['common'];

interface AboutSectionProps {
  content: AboutContent;
  metrics: MetricsContent;
  common: CommonContent;
  lang: Locale;
}

export default function AboutSection({
  content,
  metrics,
  common,
  lang,
}: AboutSectionProps) {
  if (!content) return null;

  const sectionId = getSectionId(NavSection.ABOUT);

  /* ─────────────────────────────────────────────
   * SEO / Schema.org — consistente com i18n
   * ───────────────────────────────────────────── */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sérgio Santos',
    jobTitle: common.role,
    description: content.description,
    knowsAbout: content.highlights,
    url: 'https://seusite.com.br',
    address: {
      '@type': 'PostalAddress',
      addressCountry: lang.split('-')[1] ?? 'BR',
    },
  };

  return (
    <section
      id={sectionId}
      lang={lang}
      className="relative py-24 lg:py-40 bg-white dark:bg-[#020617] transition-colors overflow-hidden"
    >
      {/* SEO estruturado */}
      <Script
        id="schema-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ───────── VISUAL ───────── */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <Image
                src="/images/sergio-santos-profile.png"
                alt={`Sérgio Santos – ${common.role}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Stats */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="block text-3xl font-black text-blue-600">
                      {content.stats.experienceValue}
                    </span>
                    <span className="text-xs font-bold">
                      {content.stats.experienceLabel}
                    </span>
                  </div>

                  <div>
                    <span className="block text-3xl font-black text-blue-600">
                      {content.stats.availabilityValue}
                    </span>
                    <span className="text-xs font-bold">
                      {content.stats.availabilityLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-center items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold">
                    {content.stats.automation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ───────── TEXTO ───────── */}
          <div className="space-y-10 order-1 lg:order-2">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase">
                  {content.title}
                </span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black">
                {content.differentialTitle}
              </h2>
            </header>

            <p className="text-lg">{content.description}</p>
            <p className="text-base opacity-80">
              {content.differentialContent}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {content.highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
