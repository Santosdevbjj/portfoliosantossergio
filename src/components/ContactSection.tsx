/**
 * src/components/ContactSection.tsx
 * Versão: Abril de 2026
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2 | Node 24
 * Status: 100% COMPATÍVEL | MULTILÍNGUE (PT, EN, ES-ES, ES-AR, ES-MX) | RESPONSIVO
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
// Lucide v1.7.0+: Nomes padronizados para Linkedin e Github (PascalCase sem camelCase interno)
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
  
  // Tratamento robusto para Turbopack (Next.js 16.2.2)
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
      .catch((err) => console.error('Failed to copy:', err));
  }, [email]);

  // Suporte total a PT, EN, ES-ES, ES-AR, ES-MX
  const copiedLabel = useMemo<string>(() => {
    const labels: Record<string, string> = {
      'pt-BR': 'Copiado!',
      'en-US': 'Copied!',
      'es-ES': '¡Copiado!',
      'es-AR': '¡Copiado!',
      'es-MX': '¡Copiado!',
    };
    return labels[locale] || (locale.startsWith('es') ? '¡Copiado!' : 'Copied!');
  }, [locale]);

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-20 dark:bg-[#020617] lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-blue-600 p-8 shadow-2xl dark:bg-blue-700 md:rounded-[4rem] md:p-16 lg:p-20">
          
          {/* Tailwind 4.2: Utility-first background glow */}
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
                {/* CTA EMAIL */}
                <a
                  href={`mailto:${email}?subject=Contact from ${origin}`}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-black text-blue-600 shadow-lg transition-all hover:scale-105 active:scale-95 sm:w-auto"
                >
                  <Mail className="size-6" />
                  {contact.cta}
                </a>

                {/* BOTÃO COPIAR */}
                <button
                  onClick={copyToClipboard}
                  aria-label="Copy email to clipboard"
                  className={`flex w-full items-center justify-center gap-3 rounded-2xl border px-6 py-4 text-base font-bold transition-all active:scale-95 sm:w-auto cursor-pointer ${
                    copied 
                    ? 'bg-emerald-500 border-emerald-400 text-white' 
                    : 'bg-blue-800/40 border-white/20 text-white hover:bg-blue-800/60 shadow-inner'
                  }`}
                >
                  {copied ? <Check className="size-5" /> : <Copy className="size-5 opacity-70" />}
                  {copied ? copiedLabel : contact.emailLabel}
                </button>

                {/* LINK RESUME */}
                <Link
                  href={`/${locale}/resume`}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"
                >
                  <FileText className="size-5" />
                  {contact.cvLabel}
                </Link>
              </div>

              {/* DOWNLOAD PDF DINÂMICO */}
              <div className="mt-8 flex justify-center lg:justify-start">
                 <a
                  href={`/pdf/cv-sergio-santos-${locale}.pdf`}
                  download
                  className="group text-white/70 hover:text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-colors"
                >
                  <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <span>Download CV ({locale})</span>
                </a>
              </div>
            </div>

            {/* REDES SOCIAIS - Utilizando Linkedin e Github (v1.7.0) */}
            <div className="flex flex-row gap-4 lg:flex-col lg:gap-6">
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group rounded-2xl bg-white p-5 text-blue-600 shadow-xl hover:-translate-y-2 transition-all duration-300 hover:shadow-blue-400/20"
              >
                <Linkedin className="size-8 md:size-10 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group rounded-2xl bg-slate-900 p-5 text-white shadow-xl hover:-translate-y-2 transition-all duration-300 hover:shadow-black/40"
              >
                <Github className="size-8 md:size-10 group-hover:scale-110 transition-transform" />
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
