'use client';

import React, { useState, useCallback } from 'react';
import { Mail, Linkedin, Github, Copy, Check } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/types/dictionary';

interface ContactSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export const ContactSection = ({ lang, dict }: ContactSectionProps) => {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const { contact, common } = dict;

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

  return (
    <section id="contact" className="py-24 lg:py-40 bg-white dark:bg-[#020617] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative group bg-blue-600 dark:bg-blue-700 rounded-[3rem] p-10 md:p-16 lg:p-24 shadow-2xl border border-white/10 overflow-hidden">
          
          {/* DECORAÇÃO */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
                {contact.title}
              </h2>

              <p className="text-xl text-blue-100 mb-12 font-medium opacity-90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {contact.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <a
                  href={`mailto:${email}?subject=Contact from ${origin}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                >
                  <Mail className="w-6 h-6" />
                  {contact.cta}
                </a>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg border transition-all active:scale-95 backdrop-blur-md ${
                    copied 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                      : 'bg-blue-800/30 border-white/20 text-white hover:bg-blue-800/50'
                  }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 opacity-70" />}
                  {copied ? "Copiado!" : contact.emailLabel}
                </button>
              </div>
            </div>

            {/* REDES SOCIAIS */}
            <div className="flex flex-row lg:flex-col gap-6">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-6 bg-white text-blue-600 rounded-2xl hover:-translate-y-2 transition-all shadow-lg">
                <Linkedin className="w-8 h-8" />
              </a>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="p-6 bg-slate-900 text-white rounded-2xl hover:-translate-y-2 transition-all shadow-lg">
                <Github className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER DO CONTATO */}
        <div className="mt-16 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            {common.footer}
          </span>
        </div>
      </div>
    </section>
  );
};
