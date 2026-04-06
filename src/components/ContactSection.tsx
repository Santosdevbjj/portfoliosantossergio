/**
 * src/components/ContactSection.tsx
 * Versão: 6 de Abril de 2026
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2 | Node 24
 * Status: FIX TS UNUSED VARIABLE | MULTILÍNGUE | RESPONSIVO
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
/**
 * CORREÇÃO TS: Removido 'ExternalLink' que causava erro de build por não ser utilizado.
 * Mantemos apenas o que é estritamente necessário para o componente.
 */
import { Mail, Copy, Check, FileText } from 'lucide-react';
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
  
  // Memoização do UTM Source para performance no Turbopack
  const origin = useMemo(() => {
    try {
      return searchParams?.get('utm_source') ?? 'portfolio_direct';
    } catch {
      return 'portfolio_direct';
    }
  }, [searchParams]);

  const copyToClipboard = useCallback((): void => {
    if (typeof window === 'undefined' || !navigator?.clipboard) return;
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  const copiedLabel = useMemo(() => {
    const labels: Record<string, string> = {
      'pt-BR': 'Copiado!', 
      'en-US': 'Copied!', 
      'es-ES': '¡Copiado!', 
      'es-AR': '¡Copiado!', 
      'es-MX': '¡Copiado!'
    };
    return labels[locale] || 'Copied!';
  }, [locale]);

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-20 dark:bg-[#020617] lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-blue-600 p-8 shadow-2xl dark:bg-blue-700 md:rounded-[4rem] md:p-16 lg:p-20">
          
          {/* Tailwind 4.2 Utility-first Background Glow */}
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
                  className={`flex w-full items-center justify-center gap-3 rounded-2xl border px-6 py-4 text-base font-bold transition-all active:scale-95 sm:w-auto cursor-pointer ${copied ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-blue-800/40 border-white/20 text-white hover:bg-blue-800/60'}`}
                >
                  {copied ? <Check className="size-5" /> : <Copy className="size-5 opacity-70" />}
                  {copied ? copiedLabel : contact.emailLabel}
                </button>

                {/* LINK RESUMO */}
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
                  <span>Download CV ({locale.toUpperCase()})</span>
                </a>
              </div>
            </div>

            {/* REDES SOCIAIS: Usando SVGs Oficiais para marcas (Conforme documentação 2026) */}
            <div className="flex flex-row gap-4 lg:flex-col lg:gap-6">
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                className="group rounded-2xl bg-white p-5 text-blue-600 shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <svg className="size-8 md:size-10 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub" 
                className="group rounded-2xl bg-slate-900 p-5 text-white shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <svg className="size-8 md:size-10 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
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
