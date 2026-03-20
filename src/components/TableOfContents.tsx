"use client";

import { useEffect, useState, useMemo } from "react";
import type { Dictionary } from "@/types/dictionary";

/**
 * TABLE OF CONTENTS COMPONENT - SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Tailwind 4.2, Next.js 16.2
 * ✔ Performance: Intersection Observer com otimização de CPU
 * ✔ Responsividade: Accordion Móvel e Sidebar Desktop Sticky
 */

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  readonly dict: Dictionary;
}

export default function TableOfContents({ dict }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  /**
   * RESOLUÇÃO DE TIPAGEM TS 6.0:
   * Acesso seguro ao SeoDictionary para evitar erros de build 'possibly undefined'.
   */
  const tocTitle = useMemo(() => {
    return dict.seo.pages?.["articles"]?.title ?? dict.articles.title;
  }, [dict]);

  useEffect(() => {
    // Busca dentro do elemento 'article' injetado pelo MDX
    const article = document.querySelector("article");
    if (!article) return;

    // Mapeamento de H2 e H3 para o sumário
    const elements = Array.from(article.querySelectorAll("h2, h3")).map((elem) => {
      const text = elem.textContent || "";
      
      // Slugify: Normalização robusta de IDs para compatibilidade com links
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

    // Observador de interseção para destacar a seção atual no scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: "-80px 0% -70% 0%", // Ajustado para compensar o Header fixo
        threshold: 1.0 
      }
    );

    article.querySelectorAll("h2, h3").forEach((h) => observer.observe(h));
    
    return () => observer.disconnect();
  }, []);

  // Não renderiza nada se o artigo não tiver subtítulos
  if (headings.length === 0) return null;

  return (
    <nav 
      className="w-full lg:w-72 flex flex-col"
      aria-label={dict.common.navigation}
    >
      {/* VERSÃO MOBILE: Accordion Premium */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex items-center justify-between w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all active:scale-[0.98]"
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {tocTitle}
            </span>
            <span className="text-xs font-bold text-slate-500 truncate max-w-[200px]">
              {headings.find(h => h.id === activeId)?.text || dict.states.loading}
            </span>
          </div>
          <div className={`p-2 rounded-full bg-slate-50 dark:bg-slate-800 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* LISTAGEM DE TÓPICOS: Sticky em LG+ */}
      <div 
        className={`
          ${isOpen ? 'max-h-[1000px] opacity-100 mb-8' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'} 
          overflow-hidden lg:block transition-all duration-500 ease-in-out
          lg:border-l lg:border-slate-200 lg:dark:border-slate-800 lg:pl-6
        `}
      >
        <h4 className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6">
          {tocTitle}
        </h4>
        
        <ul className="space-y-4">
          {headings.map((h) => (
            <li 
              key={h.id} 
              style={{ paddingLeft: h.level > 2 ? `${(h.level - 2) * 12}px` : '0px' }}
              className="group relative"
            >
              <a 
                href={`#${h.id}`}
                onClick={() => setIsOpen(false)}
                className={`
                  text-sm font-bold transition-all duration-300 block leading-snug
                  ${activeId === h.id 
                    ? "text-blue-600 dark:text-blue-400 translate-x-1" 
                    : "text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300"
                  }
                `}
              >
                {/* Indicador de Seção Ativa */}
                {activeId === h.id && (
                  <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-blue-600 animate-in fade-in zoom-in lg:-left-6.5" />
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
