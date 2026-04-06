'use client';

import { useState, useCallback, useMemo } from 'react';
import * as Icons from 'lucide-react';

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

  // ✅ fallback seguro (evita quebra se nome mudar no pacote)
  const MailIcon = Icons.Mail;
  const CopyIcon = Icons.Copy;
  const CheckIcon = Icons.Check;
  const FileTextIcon = Icons.FileText;

  // ⚠️ nomes inconsistentes tratados com fallback
  const LinkedinIcon = Icons.Linkedin ?? Icons.Link ?? Icons.Share2;
  const GithubIcon = Icons.Github ?? Icons.GitBranch ?? Icons.Code;

  const origin = useMemo(() => {
    try {
      return searchParams?.get('utm_source') ?? 'portfolio_direct';
    } catch {
      return 'portfolio_direct';
    }
  }, [searchParams]);

  const copyToClipboard = useCallback((): void => {
    if (typeof window === 'undefined' || !navigator?.clipboard) return;

    navigator.clipboard.writeText(email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
      });
  }, [email]);

  const copiedLabel = useMemo<string>(() => {
    const labels: Record<string, string> = {
      'pt-BR': 'Copiado!',
      'en-US': 'Copied!',
      'es-ES': '¡Copiado!',
      'es-AR': '¡Copiado!',
      'es-MX': '¡Copiado!',
    };
    return labels[locale] || 'Copied!';
  }, [locale]);

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-20 dark:bg-[#020617] lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-blue-600 p-8 shadow-2xl dark:bg-blue-700 md:rounded-[4rem] md:p-16 lg:p-20">

          <div className="absolute -top-24 -right-24 size-96 bg-white/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="mb-6 text-3xl font-black leading-tight tracking-tighter text-white md:text-5xl lg:text-7xl uppercase italic">
                {contact.title}
              </h2>

              <p className="mx-auto mb-10 max-w-xl text-base font-medium leading-relaxed text-blue-50 opacity-90 md:text-xl lg:mx-0">
                {contact.subtitle}
              </p>

              <div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row lg:justify-start">

                <a
                  href={`mailto:${email}?subject=Contact from ${origin}`}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-black text-blue-600 shadow-lg transition-all hover:scale-105 active:scale-95 sm:w-auto"
                >
                  <MailIcon className="size-6" />
                  {contact.cta}
                </a>

                <button
                  onClick={copyToClipboard}
                  aria-label="Copy email"
                  className={`flex w-full items-center justify-center gap-3 rounded-2xl border px-6 py-4 text-base font-bold transition-all active:scale-95 sm:w-auto cursor-pointer ${
                    copied 
                      ? 'bg-emerald-500 border-emerald-400 text-white' 
                      : 'bg-blue-800/40 border-white/20 text-white hover:bg-blue-800/60'
                  }`}
                >
                  {copied 
                    ? <CheckIcon className="size-5" /> 
                    : <CopyIcon className="size-5 opacity-70" />
                  }
                  {copied ? copiedLabel : contact.emailLabel}
                </button>

                <Link
                  href={`/${locale}/resume`}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"
                >
                  <FileTextIcon className="size-5" />
                  {contact.cvLabel}
                </Link>
              </div>

              <div className="mt-8 flex justify-center lg:justify-start">
                <a
                  href={`/pdf/cv-sergio-santos-${locale}.pdf`}
                  download
                  className="group text-white/70 hover:text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-colors"
                >
                  <span>Download CV ({locale.toUpperCase()})</span>
                </a>
              </div>
            </div>

            <div className="flex flex-row gap-4 lg:flex-col lg:gap-6">
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group rounded-2xl bg-white p-5 text-blue-600 shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <LinkedinIcon className="size-8 md:size-10 group-hover:scale-110 transition-transform" />
              </a>

              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group rounded-2xl bg-slate-900 p-5 text-white shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <GithubIcon className="size-8 md:size-10 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500/60">
            {common.footer}
          </p>
        </footer>
      </div>
    </section>
  );
}
