"use client";

import { useEffect, useState, useMemo } from "react";
import type { Dictionary, Locale } from "@/types/dictionary";

/**
 * SHARE ARTICLE COMPONENT - SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2: Client-side URL hydration safety
 * ✔ React 19: useMemo para lógica de tradução regionalizada
 * ✔ TS 6.0: Verificação de prefixo de Locale (PT, EN, ES)
 * ✔ Multilíngue: Suporte PT-BR, EN-US, ES-ES, ES-AR, ES-MX
 */

interface ShareArticleProps {
  readonly title: string;
  readonly dict: Dictionary;
  readonly lang: Locale;
}

export default function ShareArticle({ title, dict, lang }: ShareArticleProps) {
  const [shareUrl, setShareUrl] = useState<string>("");

  // Garante que a URL seja capturada apenas no navegador (Client Side)
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  /**
   * LÓGICA DE TRADUÇÃO REGIONALIZADA (I18N)
   * Abrange Português, Inglês e as variações de Espanhol (Espanha, Argentina e México)
   */
  const labels = useMemo(() => {
    const isPt = lang.startsWith("pt");
    const isEn = lang.startsWith("en");
    const isEs = lang.startsWith("es");

    return {
      question: isPt 
        ? "Gostou do conteúdo?" 
        : isEn 
          ? "Enjoyed the content?" 
          : isEs 
            ? "¿Te gustó el contenido?" // Espanhol (Universal)
            : "Gostou do conteúdo?", // Fallback
      button: isPt 
        ? "Compartilhar no LinkedIn" 
        : isEn 
          ? "Share on LinkedIn" 
          : isEs 
            ? "Compartir en LinkedIn" // Espanhol (Universal)
            : "Compartilhar no LinkedIn"
    };
  }, [lang]);

  const linkedinUrl = useMemo(() => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  }, [shareUrl]);

  return (
    <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800/60 not-prose">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        
        {/* TEXTO INFORMATIVO */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            {labels.question}
          </h3>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md">
            {dict.contact.subtitle}
          </p>
        </div>

        {/* BOTÃO DE COMPARTILHAMENTO */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${labels.button}: ${title}`}
          className="group relative inline-flex items-center justify-center gap-4 bg-[#0077b5] hover:bg-[#005582] text-white px-8 py-4 rounded-[1.25rem] font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/10 hover:shadow-blue-600/20"
        >
          {/* ÍCONE LINKEDIN */}
          <svg 
            className="w-5 h-5 fill-current transition-transform duration-500 group-hover:rotate-[360deg]" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          
          <span className="text-sm md:text-base tracking-tight">
            {labels.button}
          </span>

          {/* EFEITO DE GLOW DISCRETO NO HOVER */}
          <div className="absolute inset-0 rounded-[1.25rem] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        </a>
      </div>
    </section>
  );
}
