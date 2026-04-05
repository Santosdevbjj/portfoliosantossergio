/**
 * src/components/TableOfContents.tsx
 * Versão: Abril de 2026
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2 | Node 24
 * Status: COMPATÍVEL COM .MD/.MDX | MULTILÍNGUE (PT, EN, ES-ES, ES-AR, ES-MX)
 */

"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import type { Dictionary, Locale } from "@/types/dictionary";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  readonly dict: Dictionary;
  readonly lang: Locale; // Adicionado para suporte regional
}

export default function TableOfContents({ dict, lang }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  /**
   * I18N REGIONAL (TS 6.0 Safe):
   * Define o título do sumário baseado no idioma e variante.
   */
  const tocTitle = useMemo(() => {
    const isPt = lang.startsWith("pt");
    const isEn = lang.startsWith("en");
    
    if (isPt) return "Índice do Artigo";
    if (isEn) return "Table of Contents";
    
    // Variantes de Espanhol
    if (lang === "es-AR") return "Contenido del Artículo";
    return "Índice de Contenidos"; // es-ES, es-MX fallback
  }, [lang]);

  /**
   * MOTOR DE EXTRAÇÃO DE HEADINGS:
   * Compatível com a renderização do motor MDX do Next.js 16.2.
   */
  const extractHeadings = useCallback(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h2, h3")).map((elem) => {
      const text = elem.textContent || "";
      
      // Gerador de ID resiliente (Slugify 2026)
      const id = elem.id || text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      
      if (!elem.id) elem.id = id;
      
      return { 
        id, 
        text, 
        level: Number(elem.tagName.charAt(1)) 
      };
    });

    setHeadings(elements);
  }, []);

  useEffect(() => {
    // Pequeno delay para garantir que o Turbopack finalizou a hidratação do MDX
    const timer = setTimeout(extractHeadings, 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: "-100px 0% -60% 0%", 
        threshold: 1.0 
      }
    );

    document.querySelectorAll("article h2, article h3").forEach((h) => observer.observe(h));
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [extractHeadings]);

  if (headings.length === 0) return null;

  return (
    <nav className="w-full lg:w-72 not-prose" aria-label={tocTitle}>
      {/* MOBILE: Accordion Minimalista (Tailwind 4.2) */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex flex-col gap-1 p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl transition-transform active:scale-95"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
              {tocTitle}
            </span>
            <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 truncate w-full text-left">
            {headings.find(h => h.id === activeId)?.text || dict.states.loading}
          </span>
        </button>
      </div>

      {/* DESKTOP: Sidebar List (Sticky) */}
      <div className={`
        ${isOpen ? 'max-h-[80vh] opacity-100 mb-10' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'} 
        overflow-y-auto lg:overflow-visible transition-all duration-700
        lg:border-l lg:border-zinc-200 lg:dark:border-zinc-800 lg:pl-8
      `}>
        <h4 className="hidden lg:block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600 mb-8">
          {tocTitle}
        </h4>
        
        <ul className="space-y-5">
          {headings.map((h) => (
            <li 
              key={h.id} 
              style={{ paddingLeft: h.level > 2 ? '1.25rem' : '0' }}
              className="relative"
            >
              <a 
                href={`#${h.id}`}
                onClick={(e) => {
                  setIsOpen(false);
                  // Smooth scroll manual para evitar saltos bruscos no React 19
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`
                  text-sm font-bold block leading-snug transition-all duration-300
                  ${activeId === h.id 
                    ? "text-blue-600 dark:text-blue-400 translate-x-2" 
                    : "text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200"
                  }
                `}
              >
                {activeId === h.id && (
                  <span className="absolute -left-8 lg:-left-[33px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                )}
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
