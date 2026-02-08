'use client';

/**
 * CONTACT SECTION: Conversão e Redes Sociais
 * -----------------------------------------------------------------------------
 * Ajustes realizados:
 * - Sincronização rigorosa com as chaves do dicionário (contact e common).
 * - Suporte nativo aos 5 locales definidos no tipo Locale.
 * - Refinamento de acessibilidade e segurança nos links.
 */

import { useState, useCallback, useMemo } from 'react';
import { Mail, Linkedin, Github, Copy, Check, FileText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import type { Locale, Dictionary } from '@/types/dictionary';

interface ContactSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export const ContactSection = ({ lang, dict }: ContactSectionProps) => {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  
  // Destruturação segura do dicionário para evitar erros de undefined
  const contact = dict?.contact;
  const common = dict?.common;

  // Dados de contato centralizados vindos do common.externalLinks
  const email = common?.externalLinks?.email ?? '';
  const linkedinUrl = common?.externalLinks?.linkedin ?? '#';
  const githubUrl = common?.externalLinks?.github ?? '#';
  
  // UTM tracking para identificar a origem do contato via URL
  const origin = searchParams.get('utm_source') ?? 'portfolio_direct';

  const copyToClipboard = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  /**
   * Gerenciador de etiquetas para o estado "Copiado".
   * Mapeia automaticamente com base nos 5 Locales suportados.
   */
  const copiedLabel = useMemo(() => {
    const labels: Record<Locale, string> = {
      'pt-BR': 'Copiado!',
      'en-US': 'Copied!',
      'es-ES': '¡Copiado!',
      'es-AR': '¡Copiado!',
      'es-MX': '¡Copiado!'
    };
    return labels[lang] || labels['pt-BR'];
  }, [lang]);

  return (
    <section 
      id="contact" 
      className="py-20 lg:py-32 bg-white dark:bg-[#020617] relative overflow-hidden antialiased"
      aria-labelledby="contact-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group bg-blue-600 dark:bg-blue-700 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 shadow-2xl border border-white/10 overflow-hidden">
          
          {/* BACKGROUND DECORATION - Elementos visuais abstratos */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h2 
                id="contact-title"
                className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-tight"
              >
                {contact?.title}
              </h2>

              <p className="text-base md:text-xl text-blue-50 mb-10 font-medium opacity-90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {contact?.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4">
                {/* CTA: EMAIL PRINCIPAL */}
                <a
                  href={`mailto:${email}?subject=Contact from ${origin}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-lg active:scale-95"
                >
                  <Mail className="w-6 h-6" aria-hidden="true" />
                  {contact?.cta}
                </a>

                {/* ACTION: COPIAR EMAIL */}
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base border transition-all active:scale-95 backdrop-blur-md ${
                    copied 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                      : 'bg-blue-800/30 border-white/20 text-white hover:bg-blue-800/50'
                  }`}
                  aria-label={contact?.emailLabel}
                >
                  {copied ? (
                    <Check className="w-5 h-5 animate-in zoom-in duration-300" />
                  ) : (
                    <Copy className="w-5 h-5 opacity-70" aria-hidden="true" />
                  )}
                  <span>{copied ? copiedLabel : contact?.emailLabel}</span>
                </button>

                {/* ACTION: CV / RESUME */}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base border border-white/10 bg-blue-900/20 text-white hover:bg-blue-900/40 transition-all"
                >
                  <FileText className="w-5 h-5 opacity-70" aria-hidden="true" />
                  {contact?.cvLabel}
                </a>
              </div>
            </div>

            {/* SOCIAL NETWORKS - Links Dinâmicos e Acessíveis */}
            <div className="flex flex-row lg:flex-col gap-4">
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={contact?.linkedinLabel || "LinkedIn"}
                className="p-5 md:p-6 bg-white text-blue-600 rounded-2xl md:rounded-3xl hover:-translate-y-2 transition-all shadow-xl focus:ring-4 focus:ring-white/20 outline-none"
              >
                <Linkedin className="w-8 h-8 md:w-10 md:h-10" />
              </a>
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={common?.socialLinks?.replace('{platform}', 'GitHub') || "GitHub"}
                className="p-5 md:p-6 bg-slate-900 text-white rounded-2xl md:rounded-3xl hover:-translate-y-2 transition-all shadow-xl focus:ring-4 focus:ring-slate-900/20 outline-none"
              >
                <Github className="w-8 h-8 md:w-10 md:h-10" />
              </a>
            </div>
          </div>
        </div>

        {/* SECTION FOOTER - Copyright Dinâmico */}
        <footer className="mt-16 text-center">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-4">
            {common?.footer}
          </p>
        </footer>
      </div>
    </section>
  );
};
