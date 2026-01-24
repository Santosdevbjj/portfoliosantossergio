'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Mail, Linkedin, Github, Copy, Check } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import type { Locale } from '@/i18n-config';

/* =====================================================
 * TYPES
 * ===================================================== */
interface ContactDictionary {
  titleA: string;
  titleB: string;
  subtitle: string;
  emailBtn: string;
  socialLabel: string;
  status: string;
}

interface CommonDictionary {
  copy: string;
  copied: string;
}

interface ContactSectionProps {
  lang: Locale;
  dict: {
    contact?: Partial<ContactDictionary>;
    common?: Partial<CommonDictionary>;
  };
}

/* =====================================================
 * COMPONENT
 * ===================================================== */
export const ContactSection = ({ lang, dict }: ContactSectionProps) => {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [headlineVariant, setHeadlineVariant] = useState<'A' | 'B'>('A');

  /* =====================================================
   * CONSTANTS
   * ===================================================== */
  const email = 'santossergiorealbjj@outlook.com';
  const linkedinUrl = 'https://www.linkedin.com/in/santossergioluiz';
  const githubUrl = 'https://github.com/Santosdevbjj';

  /* =====================================================
   * ORIGIN TRACKING
   * ===================================================== */
  const origin = searchParams.get('utm_source') ?? 'direct';
  const role = searchParams.get('role') ?? 'lead';

  /* =====================================================
   * A/B TEST (persistente)
   * ===================================================== */
  useEffect(() => {
    const stored = localStorage.getItem('contact-headline-variant');
    if (stored === 'A' || stored === 'B') {
      setHeadlineVariant(stored);
    } else {
      const variant = Math.random() > 0.5 ? 'A' : 'B';
      localStorage.setItem('contact-headline-variant', variant);
      setHeadlineVariant(variant);
    }
  }, []);

  /* =====================================================
   * COPY MULTILÍNGUE + CTA DINÂMICO
   * ===================================================== */
  const t = useMemo(() => {
    const contact = dict?.contact ?? {};
    const common = dict?.common ?? {};

    const ctaByRole = {
      lead:
        lang === 'pt'
          ? 'Vamos liderar sistemas'
          : lang === 'es'
          ? 'Lideremos sistemas'
          : 'Let’s lead systems',
      staff:
        lang === 'pt'
          ? 'Vamos escalar arquitetura'
          : lang === 'es'
          ? 'Escalemos arquitectura'
          : 'Let’s scale architecture',
      principal:
        lang === 'pt'
          ? 'Vamos definir estratégia'
          : lang === 'es'
          ? 'Definamos estrategia'
          : 'Let’s define strategy',
    };

    return {
      title:
        headlineVariant === 'A'
          ? contact.titleA ??
            (lang === 'pt'
              ? 'Vamos conversar'
              : lang === 'es'
              ? 'Hablemos'
              : 'Let’s talk')
          : contact.titleB ??
            (lang === 'pt'
              ? 'Construa algo robusto'
              : lang === 'es'
              ? 'Construye algo robusto'
              : 'Build something robust'),
      subtitle:
        contact.subtitle ??
        (lang === 'pt'
          ? 'Arquitetura, escala e impacto real'
          : lang === 'es'
          ? 'Arquitectura, escala e impacto real'
          : 'Architecture, scale and real impact'),
      emailBtn: ctaByRole[role as keyof typeof ctaByRole] ?? ctaByRole.lead,
      socialLabel:
        contact.socialLabel ??
        (lang === 'pt' ? 'Conexões' : lang === 'es' ? 'Conexiones' : 'Connections'),
      status:
        contact.status ??
        (lang === 'pt'
          ? 'Disponível para novos projetos'
          : lang === 'es'
          ? 'Disponible para nuevos proyectos'
          : 'Available for new projects'),
      copy: common.copy ?? (lang === 'pt' || lang === 'es' ? 'Copiar' : 'Copy'),
      copied:
        common.copied ??
        (lang === 'pt' ? 'Copiado!' : lang === 'es' ? '¡Copiado!' : 'Copied!'),
    };
  }, [dict, lang, role, headlineVariant]);

  /* =====================================================
   * CLIPBOARD
   * ===================================================== */
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  /* =====================================================
   * SCHEMA.ORG — ContactPoint
   * ===================================================== */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    contactType: 'Technical Consulting',
    email,
    url: linkedinUrl,
    availableLanguage: ['Portuguese', 'English', 'Spanish'],
  };

  /* =====================================================
   * RENDER
   * ===================================================== */
  return (
    <section
      id="contact"
      className="py-24 lg:py-32 bg-white dark:bg-[#020617] relative overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-blue-600 dark:bg-blue-700 rounded-[3rem] p-10 sm:p-14 lg:p-24 shadow-2xl flex flex-col lg:flex-row gap-16 border border-white/10">
          {/* TEXTO */}
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
              {t.title}
            </h2>

            <p className="text-lg text-blue-50 mb-12 opacity-90">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`mailto:${email}?subject=Contact from ${origin}`}
                className="flex items-center justify-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl font-black hover:bg-blue-50 transition-all"
              >
                <Mail className="w-6 h-6" />
                {t.emailBtn}
              </a>

              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-3 bg-blue-800/30 text-white border border-white/20 px-8 py-5 rounded-2xl backdrop-blur-md"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" />
                    {t.copied}
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 opacity-70" />
                    {t.copy}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SOCIAIS */}
          <div className="flex justify-center items-center gap-8">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-6 bg-white text-blue-600 rounded-2xl hover:-translate-y-1 transition"
            >
              <Linkedin className="w-8 h-8" />
            </a>

            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-6 bg-slate-900 text-white rounded-2xl hover:-translate-y-1 transition"
            >
              <Github className="w-8 h-8" />
            </a>
          </div>
        </div>

        {/* STATUS */}
        <div className="mt-16 flex justify-center">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t.status}
          </span>
        </div>
      </div>
    </section>
  );
};
