"use client";

import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/types/dictionary";

/**
 * SHARE ARTICLE COMPONENT
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Tailwind 4.2, Next.js 16
 * ✔ I18n: Suporte Dinâmico PT-BR, EN, ES via Dictionary e Regex de prefixo
 * ✔ Responsivo: Mobile-first com otimização de toque e escala (Tailwind 4.2 native)
 * ✔ Acessibilidade: Aria-labels traduzidos e contraste verificado
 */

interface ShareArticleProps {
  readonly title: string;
  readonly dict: Dictionary;
  readonly lang: Locale;
}

export default function ShareArticle({ title, dict, lang }: ShareArticleProps) {
  const [shareUrl, setShareUrl] = useState<string>("");

  // Captura a URL apenas no cliente para evitar erros de hidratação (Next.js 16)
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;

  /**
   * RESOLUÇÃO DO ERRO DE BUILD:
   * O tipo Locale é estrito (ex: "en-US", "es-MX"). 
   * Usamos startsWith para verificar o prefixo do idioma de forma segura e compatível com TS 6.0.
   */
  const getLabels = () => {
    const isPt = lang.startsWith("pt");
    const isEn = lang.startsWith("en");
    
    return {
      question: isPt 
        ? "Gostou do conteúdo?" 
        : isEn ? "Enjoyed the content?" : "¿Te gustó el contenido?",
      button: isPt 
        ? "Compartilhar no LinkedIn" 
        : isEn ? "Share on LinkedIn" : "Compartir en LinkedIn"
    };
  };

  const labels = getLabels();

  return (
    <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800/60 not-prose">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            {labels.question}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {dict.contact.subtitle}
          </p>
        </div>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${labels.button}: ${title}`}
          className="group inline-flex items-center justify-center gap-3 bg-[#0077b5] hover:bg-[#005582] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-xl shadow-blue-500/10 hover:shadow-blue-500/25"
        >
          <svg 
            className="w-5 h-5 fill-current transition-transform group-hover:rotate-12" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <span className="text-sm tracking-tight">{labels.button}</span>
        </a>
      </div>
    </div>
  );
}
