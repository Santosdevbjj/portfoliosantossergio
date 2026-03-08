"use client";

import { useEffect, useState, useMemo } from "react";
import type { Dictionary } from "@/types/dictionary";

/**
 * TABLE OF CONTENTS COMPONENT
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Tailwind 4.2, Next.js 16
 * ✔ I18n: Suporte PT/EN/ES via Dictionary (Chaves: dict.seo.pages.articles.title)
 * ✔ Responsivo: Sidebar em Desktop (sticky), Accordion em Mobile
 * ✔ Alinhamento: Consumindo IDs gerados no MdxLayout
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

  // Título dinâmico vindo do dicionário (Ex: "Artigos", "Articles", "Artículos")
  const tocTitle = dict.seo.pages.articles.title;

  useEffect(() => {
    // Busca dentro do elemento 'article' definido no MdxLayout
    const article = document.querySelector("article");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h2, h3")).map((elem) => {
      const text = elem.textContent || "";
      // Gera ID caso não exista (fallback de segurança)
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

    // Observer para detectar qual seção está visível no viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: "-10% 0% -75% 0%", // Ativa quando o título está no topo da tela
        threshold: 1.0 
      }
    );

    article.querySelectorAll("h2, h3").forEach((h) => observer.observe(h));
    
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav 
      className="w-full lg:w-64 flex flex-col"
      aria-label={dict.common.navigation}
    >
      {/* VERSÃO MOBILE: Botão Expansível */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="toc-list-mobile"
          className="flex items-center justify-between w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-all active:scale-[0.98]"
        >
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              {tocTitle}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {headings.find(h => h.id === activeId)?.text || dict.states.loading}
            </span>
          </div>
          <svg 
            className={`w-5 h-5 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* CONTEÚDO DO SUMÁRIO */}
      <div 
        id="toc-list-mobile"
        className={`
          ${isOpen ? 'max-h-[1000px] opacity-100 mb-8' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'} 
          overflow-hidden lg:block sticky lg:top-32 transition-all duration-500 ease-in-out
          bg-white dark:bg-transparent lg:border-l lg:border-slate-200 lg:dark:border-slate-800 lg:pl-8
        `}
      >
        {/* Título Desktop */}
        <h4 className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
          {tocTitle}
        </h4>
        
        <ul className="space-y-5">
          {headings.map((h) => (
            <li 
              key={h.id} 
              style={{ paddingLeft: h.level > 2 ? `${(h.level - 2) * 16}px` : '0px' }}
              className="relative"
            >
              <a 
                href={`#${h.id}`}
                onClick={() => setIsOpen(false)}
                className={`
                  text-sm font-bold transition-all duration-300 block leading-tight
                  ${activeId === h.id 
                    ? "text-blue-600 dark:text-blue-400 translate-x-2" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:translate-x-1"
                  }
                `}
              >
                {/* Indicador visual de item ativo (Bolinha flutuante) */}
                {activeId === h.id && (
                  <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)] lg:-left-12" />
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
