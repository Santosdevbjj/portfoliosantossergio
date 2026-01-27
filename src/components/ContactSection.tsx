'use client';

/**
 * CONTACT SECTION: Conversão e Conexão Estratégica
 * -----------------------------------------------------------------------------
 * - A/B Testing: Headlines alternadas para otimizar conversão.
 * - Dynamic CTA: O texto do botão muda conforme o cargo do visitante (Staff, Principal, Lead).
 * - I18n: Suporte completo para PT, EN e ES com fallbacks inteligentes.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Mail, Linkedin, Github, Copy, Check, ExternalLink } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
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
  readonly lang: Locale;
  readonly dict: {
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

  const email = 'santossergiorealbjj@outlook.com';
  const linkedinUrl = 'https://www.linkedin.com/in/santossergioluiz';
  const githubUrl = 'https://github.com/Santosdevbjj';

  // Rastreamento de origem para o assunto do e-mail
  const origin = searchParams.get('utm_source') ?? 'portfolio_direct';
  const roleParam = searchParams.get('role');
  const role = roleParam === 'staff' || roleParam === 'principal' ? roleParam : 'lead';

  /* Teste A/B persistente no navegador */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('contact-headline-variant');
      if (stored === 'A' || stored === 'B') {
        setHeadlineVariant(stored);
      } else {
        const variant = Math.random() > 0.5 ? 'A' : 'B';
        localStorage.setItem('contact-headline-variant', variant);
        setHeadlineVariant(variant);
      }
    } catch {
      setHeadlineVariant('A');
    }
  }, []);

  const t = useMemo(() => {
    const contact = dict?.contact ?? {};
    const common = dict?.common ?? {};

    const ctaByRole = {
      lead: { pt: 'Vamos conversar', es: 'Hablemos', en: 'Let’s talk' },
      staff: { pt: 'Vamos escalar arquitetura', es: 'Escalemos arquitectura', en: 'Let’s scale architecture' },
      principal: { pt: 'Vamos definir estratégia', es: 'Definamos estrategia', en: 'Let’s define strategy' },
    };

    return {
      title: headlineVariant === 'A'
        ? contact.titleA ?? (lang === 'en' ? 'Let’s talk' : lang === 'es' ? 'Hablemos' : 'Vamos conversar')
        : contact.titleB ?? (lang === 'en' ? 'Build something robust' : lang === 'es' ? 'Construye algo robusto' : 'Construa algo robusto'),
      subtitle: contact.subtitle ?? (lang === 'en' ? 'Architecture, scale and real impact' : 'Arquitetura, escala e impacto real'),
      emailBtn: ctaByRole[role][lang],
      socialLabel: contact.socialLabel ?? (lang === 'en' ? 'Connections' : 'Conexões'),
      status: contact.status ?? (lang === 'en' ? 'Available for new projects' : 'Disponível para novos projetos'),
      copy: common.copy ?? (lang === 'en' ? 'Copy' : 'Copiar'),
      copied: common.copied ?? (lang === 'en' ? 'Copied!' : 'Copiado!'),
    };
  }, [dict, lang, role, headlineVariant]);

  const copyToClipboard = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    contactType: 'Technical Consulting',
    email,
    url: linkedinUrl,
    availableLanguage: ['Portuguese', 'English', 'Spanish'],
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 lg:py-40 bg-white dark:bg-[#020617] relative overflow-hidden transition-colors">
      <Script id="schema-contact" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative group bg-blue-600 dark:bg-blue-700 rounded-[3rem] p-10 md:p-16 lg:p-24 shadow-[0_32px_64px_-16px_rgba(37,99,235,0.3)] border border-white/10 overflow-hidden transition-all duration-500 hover:shadow-blue-500/40">
          
          {/* 🟦 DECORAÇÃO DE FUNDO */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16">
            
            {/* TEXTO E CTAs */}
            <div className="max-w-2xl text-center lg:text-left">
              <h2 id="contact-title" className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9] md:leading-[1]">
                {t.title}
              </h2>

              <p className="text-xl text-blue-100 mb-12 font-medium opacity-90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {t.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <a
                  href={`mailto:${email}?subject=Contact from ${origin}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 active:scale-95 transition-all shadow-xl"
                >
                  <Mail className="w-6 h-6" />
                  {t.emailBtn}
                </a>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg border transition-all active:scale-95 backdrop-blur-md
                    ${copied 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                      : 'bg-blue-800/30 border-white/20 text-white hover:bg-blue-800/50'
                    }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 opacity-70" />}
                  {copied ? t.copied : t.copy}
                </button>
              </div>
            </div>

            {/* SOCIAIS */}
            <nav aria-label={t.socialLabel} className="flex flex-row lg:flex-col gap-6 items-center">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-white text-blue-600 rounded-2xl hover:-translate-y-2 hover:rotate-3 transition-all duration-300 shadow-lg"
              >
                <Linkedin className="w-8 h-8" />
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-slate-900 text-white rounded-2xl hover:-translate-y-2 hover:-rotate-3 transition-all duration-300 shadow-lg"
              >
                <Github className="w-8 h-8" />
              </a>
              
              <div className="hidden lg:block h-20 w-px bg-white/20 mt-4" />
            </nav>
          </div>
        </div>

        {/* STATUS DISPONIBILIDADE */}
        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              {t.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
