'use client';

import React, { useState, useCallback } from 'react';
import { Mail, Linkedin, Github, Copy, Check } from 'lucide-react';
import type { Locale } from '@/i18n-config';

interface ContactDictionary {
  title: string;
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

/**
 * CONTACT SECTION — MOBILE-FIRST • MULTILÍNGUE • PRODUÇÃO
 */
export const ContactSection = ({ lang, dict }: ContactSectionProps) => {
  const [copied, setCopied] = useState(false);

  const email = 'santossergiorealbjj@outlook.com';
  const linkedinUrl = 'https://www.linkedin.com/in/santossergioluiz';
  const githubUrl = 'https://github.com/Santosdevbjj';

  const contact = dict?.contact ?? {};
  const common = dict?.common ?? {};

  /** Fallbacks multilíngues seguros */
  const t = {
    title: contact.title ?? (lang === 'pt' ? 'Contato' : lang === 'es' ? 'Contacto' : 'Contact'),
    subtitle:
      contact.subtitle ??
      (lang === 'pt'
        ? 'Vamos conversar sobre seu próximo projeto'
        : lang === 'es'
        ? 'Hablemos sobre tu próximo proyecto'
        : 'Let’s talk about your next project'),
    emailBtn:
      contact.emailBtn ??
      (lang === 'pt' ? 'Enviar Email' : lang === 'es' ? 'Enviar Email' : 'Send Email'),
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
      (lang === 'pt' ? 'Copiado!' : lang === 'es' ? '¡Copiado!' : 'Copied!')
  };

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  return (
    <section
      id="contact"
      className="py-24 lg:py-32 bg-white dark:bg-[#020617] transition-colors overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* CARD PRINCIPAL */}
        <div className="bg-blue-600 dark:bg-blue-700 rounded-[3rem] lg:rounded-[4.5rem] p-10 sm:p-14 lg:p-24 shadow-2xl flex flex-col lg:flex-row gap-16 relative overflow-hidden border border-white/10">
          {/* Glow decorativo */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-950/40 rounded-full blur-[100px]" />

          {/* TEXTO */}
          <div className="max-w-xl text-center lg:text-left relative z-10">
            <h2 className="text-5xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
              {t.title}
            </h2>

            <p className="text-lg md:text-xl text-blue-50 mb-12 font-medium opacity-90 max-w-md mx-auto lg:mx-0">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* EMAIL */}
              <a
                href={`mailto:${email}`}
                className="group flex items-center justify-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all active:scale-95 shadow-2xl shadow-blue-900/30"
              >
                <Mail className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
                {t.emailBtn}
              </a>

              {/* COPY */}
              <button
                onClick={copyToClipboard}
                aria-live="polite"
                title={t.copy}
                className="group flex items-center justify-center gap-3 bg-blue-800/30 text-white border border-white/20 px-8 py-5 rounded-2xl font-bold hover:bg-blue-800/50 transition-all backdrop-blur-md active:scale-95 min-w-[200px]"
              >
                {copied ? (
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Check className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      {t.copied}
                    </span>
                  </div>
                ) : (
                  <>
                    <Copy className="w-5 h-5 opacity-70" />
                    <span className="text-xs font-mono truncate">
                      {email.split('@')[0]}…
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SOCIAIS */}
          <div className="w-full lg:w-auto relative z-10">
            <div className="bg-white/5 backdrop-blur-xl p-10 lg:p-14 rounded-[3rem] border border-white/10 shadow-inner">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-center opacity-60">
                {t.socialLabel}
              </p>

              <div className="flex justify-center gap-8">
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="group p-6 md:p-8 bg-white text-blue-600 hover:text-white hover:bg-blue-600 rounded-[2rem] transition-all hover:-translate-y-2 shadow-xl"
                >
                  <Linkedin className="w-10 h-10" fill="currentColor" />
                </a>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="group p-6 md:p-8 bg-slate-900 text-white hover:bg-black rounded-[2rem] transition-all hover:-translate-y-2 shadow-xl"
                >
                  <Github className="w-10 h-10" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">
              {t.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
