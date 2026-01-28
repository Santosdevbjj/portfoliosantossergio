'use client';

/**
 * CONTACT SECTION: Conversão e Redes Sociais
 * -----------------------------------------------------------------------------
 * - UI: Card flutuante com gradiente e blur.
 * - I18n: Totalmente alinhado com dict.contact e dict.common.
 * - Fix: Removido import redundante de React para Next.js 16.
 */

import { useState, useCallback } from 'react';
import { Mail, Linkedin, Github, Copy, Check, FileText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import type { SupportedLocale } from '@/dictionaries';
import type { Dictionary } from '@/types/dictionary';

interface ContactSectionProps {
  readonly lang: SupportedLocale;
  readonly dict: Dictionary;
}

export const ContactSection = ({ lang, dict }: ContactSectionProps) => {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const { contact, common } = dict;

  // Dados de contato e links sociais
  const email = 'santossergiorealbjj@outlook.com';
  const linkedinUrl = 'https://www.linkedin.com/in/santossergioluiz';
  const githubUrl = 'https://github.com/Santosdevbjj';
  const origin = searchParams.get('utm_source') ?? 'portfolio_direct';

  const copyToClipboard = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  // Gerenciador de tradução para o estado do botão de cópia
  const getCopiedLabel = () => {
    const labels: Record<string, string> = {
      pt: 'Copiado!',
      en: 'Copied!',
      es: '¡Copiado!'
    };
    return labels[lang] || labels.pt;
  };

  return (
    <section id="contact" className="py-24 lg:py-40 bg-white dark:bg-[#020617] relative overflow-hidden antialiased">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative group bg-blue-600 dark:bg-blue-700 rounded-[3rem] p-8 md:p-16 lg:p-24 shadow-2xl border border-white/10 overflow-hidden">
          
          {/* DECORAÇÃO ABSTRATA */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
                {contact.title}
              </h2>

              <p className="text-lg md:text-xl text-blue-50 mb-10 font-medium opacity-90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {contact.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4">
                {/* CTA: EMAIL */}
                <a
                  href={`mailto:${email}?subject=Contact from ${origin}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                >
                  <Mail className="w-6 h-6" />
                  {contact.cta}
                </a>

                {/* AÇÃO: COPIAR */}
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base border transition-all active:scale-95 backdrop-blur-md ${
                    copied 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                      : 'bg-blue-800/30 border-white/20 text-white hover:bg-blue-800/50'
                  }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 opacity-70" />}
                  {copied ? getCopiedLabel() : contact.emailLabel}
                </button>

                {/* AÇÃO: CURRÍCULO (Sincronizado com o Dicionário) */}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base border border-white/10 bg-blue-900/20 text-white hover:bg-blue-900/40 transition-all"
                >
                  <FileText className="w-5 h-5 opacity-70" />
                  {contact.cvLabel}
                </a>
              </div>
            </div>

            {/* REDES SOCIAIS */}
            <div className="flex flex-row lg:flex-col gap-4 md:gap-6">
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                title={contact.linkedinLabel}
                className="p-5 md:p-6 bg-white text-blue-600 rounded-3xl hover:-translate-y-2 transition-all shadow-lg"
              >
                <Linkedin className="w-8 h-8 md:w-10 md:h-10" />
              </a>
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-5 md:p-6 bg-slate-900 text-white rounded-3xl hover:-translate-y-2 transition-all shadow-lg"
              >
                <Github className="w-8 h-8 md:w-10 md:h-10" />
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER DA SEÇÃO */}
        <footer className="mt-16 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            {common.footer}
          </p>
        </footer>
      </div>
    </section>
  );
};
