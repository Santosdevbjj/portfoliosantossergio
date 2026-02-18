'use client';

/**
 * CONTACT SECTION — Conversão e Redes Sociais
 * ------------------------------------------------------------------
 * ✔ Alinhado com ContactDictionary e CommonDictionary
 * ✔ TS 6 strict-safe
 * ✔ Next.js 16 compatible
 * ✔ Totalmente responsivo
 * ✔ Multilíngue (pt / en / es)
 */

import { useState, useCallback, useMemo } from 'react';
import { Mail, Linkedin, Github, Copy, Check, FileText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import type { Locale, ContactDictionary, CommonDictionary } from '@/types/dictionary';

interface ContactSectionProps {
  readonly contact: ContactDictionary;
  readonly common: CommonDictionary;
  readonly locale: Locale;
}

export default function ContactSection({
  contact,
  common,
  locale,
}: ContactSectionProps) {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const email = common.externalLinks.email;
  const linkedinUrl = common.externalLinks.linkedin;
  const githubUrl = common.externalLinks.github;

  const origin =
    searchParams?.get('utm_source') ?? 'portfolio_direct';

  const copyToClipboard = useCallback((): void => {
    if (!navigator?.clipboard) return;

    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  const copiedLabel = useMemo<Record<Locale, string>>(
    () => ({
      'pt-BR': 'Copiado!',
      'en-US': 'Copied!',
      'es-ES': '¡Copiado!',
      'es-AR': '¡Copiado!',
      'es-MX': '¡Copiado!',
    }),
    [],
  )[locale];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-white py-20 antialiased dark:bg-[#020617] lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-blue-600 p-8 shadow-2xl dark:bg-blue-700 md:rounded-[4rem] md:p-16 lg:p-20">

          {/* Decorative background */}
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl md:h-96 md:w-96" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 translate-y-1/2 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
            {/* TEXT */}
            <div className="flex-1 text-center lg:text-left">
              <h2
                id="contact-title"
                className="mb-6 text-3xl font-black leading-tight tracking-tighter text-white md:text-5xl lg:text-7xl"
              >
                {contact.title}
              </h2>

              <p className="mx-auto mb-10 max-w-xl text-base font-medium leading-relaxed text-blue-50 opacity-90 md:text-xl lg:mx-0">
                {contact.subtitle}
              </p>

              <div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row lg:justify-start">
                {/* EMAIL CTA */}
                <a
                  href={`mailto:${email}?subject=Contact from ${origin}`}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-black text-blue-600 shadow-lg transition-all hover:bg-blue-50 active:scale-95 sm:w-auto"
                >
                  <Mail className="h-6 w-6" />
                  {contact.cta}
                </a>

                {/* COPY EMAIL */}
                <button
                  type="button"
                  onClick={copyToClipboard}
                  aria-label={contact.emailLabel}
                  className={`flex w-full items-center justify-center gap-3 rounded-2xl border px-6 py-4 text-base font-bold backdrop-blur-md transition-all active:scale-95 sm:w-auto ${
                    copied
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                      : 'border-white/20 bg-blue-800/30 text-white hover:bg-blue-800/50'
                  }`}
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5 opacity-70" />}
                  {copied ? copiedLabel : contact.emailLabel}
                </button>

                {/* CV */}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-blue-900/20 px-6 py-4 text-base font-bold text-white transition-all hover:bg-blue-900/40 sm:w-auto"
                >
                  <FileText className="h-5 w-5 opacity-70" />
                  {contact.cvLabel}
                </a>
              </div>
            </div>

            {/* SOCIAL */}
            <div className="flex flex-row gap-4 lg:flex-col">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={contact.linkedinLabel}
                className="rounded-2xl bg-white p-5 text-blue-600 shadow-xl transition-all hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-white/20 md:rounded-3xl md:p-6"
              >
                <Linkedin className="h-8 w-8 md:h-10 md:w-10" />
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={common.socialLinks.replace('{platform}', 'GitHub')}
                className="rounded-2xl bg-slate-900 p-5 text-white shadow-xl transition-all hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-slate-900/20 md:rounded-3xl md:p-6"
              >
                <Github className="h-8 w-8 md:h-10 md:w-10" />
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 md:text-xs">
            {common.footer}
          </p>
        </footer>
      </div>
    </section>
  );
}
