/**
 * src/components/ShareArticle.tsx
 * Versão: Abril de 2026
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2 | Node 24
 * Status: COMPATÍVEL COM .MD/.MDX | MULTILÍNGUE (PT, EN, ES-ES, ES-AR, ES-MX)
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import type { Dictionary, Locale } from "@/types/dictionary";

interface ShareArticleProps {
  readonly title: string;
  readonly dict: Dictionary;
  readonly lang: Locale;
}

export default function ShareArticle({ title, dict, lang }: ShareArticleProps) {
  const [shareUrl, setShareUrl] = useState<string>("");

  // Hidratação segura da URL no lado do cliente (Node 24 Runtime ready)
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  /**
   * LÓGICA DE TRADUÇÃO REGIONALIZADA (I18N) - TS 6.0 Strict
   * Diferencia nuances entre as variantes de espanhol e português.
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
          : lang === "es-AR"
            ? "¿Te ha gustado o servido o contenido?" // Nuance argentina
            : isEs 
              ? "¿Te gustó el contenido?" // Espanha e México
              : "Gostou do conteúdo?",
      button: isPt 
        ? "Compartilhar no LinkedIn" 
        : isEn 
          ? "Share on LinkedIn" 
          : isEs 
            ? "Compartir en LinkedIn"
            : "Compartilhar no LinkedIn"
    };
  }, [lang]);

  // Memorização da URL de compartilhamento para evitar recálculos no React 19
  const linkedinUrl = useMemo(() => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  }, [shareUrl]);

  return (
    <section className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800/60 not-prose animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        
        {/* TEXTO INFORMATIVO - RESPONSIVO E ACESSÍVEL */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 bg-blue-600 rounded-full" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
              {labels.question}
            </h3>
          </div>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium max-w-sm leading-relaxed">
            {dict.contact.subtitle}
          </p>
        </div>

        {/* BOTÃO DE COMPARTILHAMENTO - TAILWIND 4.2 ENGINE */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${labels.button}: ${title}`}
          className="group relative inline-flex items-center justify-center gap-4 bg-[#0077b5] hover:bg-[#005c8d] text-white px-10 py-5 rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-500 hover:scale-[1.03] active:scale-95 shadow-2xl shadow-blue-500/20"
        >
          {/* ÍCONE LINKEDIN COM ANIMAÇÃO TURBOPACK */}
          <svg 
            className="w-5 h-5 fill-current transition-transform duration-700 group-hover:rotate-12" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          
          <span className="relative z-10">
            {labels.button}
          </span>

          {/* EFEITO VISUAL 2026: GLASSMORPHISM OVERLAY */}
          <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </a>
      </div>
    </section>
  );
}
