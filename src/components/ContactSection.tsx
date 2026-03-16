'use client';

import { useState, useCallback, useMemo } from 'react';
import { Mail, Linkedin, Github, Copy, Check, FileText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import type { Locale, ContactDictionary, CommonDictionary } from '@/types/dictionary';

interface ContactSectionProps {
  readonly contact: ContactDictionary;
  readonly common: CommonDictionary;
  readonly locale: Locale;
}

export default function ContactSection({ contact, common, locale }: ContactSectionProps) {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const email = common.externalLinks.email;
  const linkedinUrl = common.externalLinks.linkedin;
  const githubUrl = common.externalLinks.github;
  const origin = searchParams?.get('utm_source') ?? 'portfolio_direct';

  const copyToClipboard = useCallback((): void => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  const copiedLabel = useMemo<Record<Locale, string>>(() => ({
    'pt-BR': 'Copiado!',
    'en-US': 'Copied!',
    'es-ES': '¡Copiado!',
    'es-AR': '¡Copiado!',
    'es-MX': '¡Copiado!',
  }), [])[locale];

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-20 dark:bg-[#020617] lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-blue-600 p-8 shadow-2xl dark:bg-blue-700 md:rounded-[4rem] md:p-16 lg:p-20">
          
          <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="mb-6 text-3xl font-black leading-tight tracking-tighter text-white md:text-5xl lg:text-7xl">
                {contact.title}
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-base font-medium leading-relaxed text-blue-50 opacity-90 md:text-xl lg:mx-0">
                {contact.subtitle}
              </p>

              <div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row lg:justify-start">
                {/* CTA PRINCIPAL */}
                <a
                  href={`mailto:${email}?subject=Contact from ${origin}`}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-black text-blue-600 shadow-lg transition-all hover:scale-105 active:scale-95 sm:w-auto"
                >
                  <Mail className="h-6 w-6" />
                  {contact.cta}
                </a>

                {/* BOTÃO PARA PÁGINA DE RESUME (NOVO) */}
                <Link
                  href={`/${locale}/resume`}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
                >
                  <FileText className="h-5 w-5" />
                  {contact.cvLabel}
                </Link>

                {/* DOWNLOAD DIRETO (PATH CORRIGIDO) */}
                <a
                  href={`/pdf/cv-sergio-santos-${locale}.pdf`}
                  download
                  className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  PDF
                </a>
              </div>
            </div>

            {/* SOCIAL */}
            <div className="flex flex-row gap-4 lg:flex-col">
              <a href={linkedinUrl} target="_blank" className="rounded-2xl bg-white p-5 text-blue-600 shadow-xl hover:-translate-y-2 transition-transform">
                <Linkedin className="h-8 w-8" />
              </a>
              <a href={githubUrl} target="_blank" className="rounded-2xl bg-slate-900 p-5 text-white shadow-xl hover:-translate-y-2 transition-transform">
                <Github className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            {common.footer}
          </p>
        </footer>
      </div>
    </section>
  );
}
