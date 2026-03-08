"use client";

import { useEffect, useState, useMemo } from "react";
import type { Dictionary } from "@/types/dictionary";

/**
 * TABLE OF CONTENTS COMPONENT
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Tailwind 4.2, Next.js 16
 * ✔ I18n: Suporte PT/EN/ES via Dictionary
 * ✔ Responsivo: Sidebar em Desktop, Menu expansível em Mobile
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
  const [isOpen, setIsOpen] = useState(false); // Para controle mobile

  const labels = dict.projects; // Usando contexto de projetos/artigos do dicionário

  useEffect(() => {
    // Busca dentro do elemento 'article' definido no MdxLayout
    const article = document.querySelector("article");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h2, h3")).map((elem) => {
      const text = elem.textContent || "";
      const id = elem.id || text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: "-10% 0% -70% 0%", // Precisão melhorada para scroll
        threshold: 1.0 
      }
    );

    article.querySelectorAll("h2, h3").forEach((h) => observer.observe(h));
    
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav 
      className="group flex flex-col w-full lg:w-64"
      aria-label={dict.common.navigation}
    >
      {/* Versão Mobile: Botão/Header Expansível */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {/* Fallback para "Neste Artigo" caso não haja chave específica */}
            {dict.seo.pages.articles.title}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Conteúdo do Sumário */}
      <div className={`
        ${isOpen ? 'block' : 'hidden'} 
        lg:block sticky top-32 self-start 
        bg-white dark:bg-transparent lg:border-l lg:border-slate-200 lg:dark:border-slate-800 lg:pl-8
      `}>
        <h4 className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
          {dict.seo.pages.articles.title}
        </h4>
        
        <ul className="space-y-4">
          {headings.map((h) => (
            <li 
              key={h.id} 
              style={{ paddingLeft: `${(h.level - 2) * 16}px` }}
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
                {/* Indicador visual ativo */}
                {activeId === h.id && (
                  <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)] lg:-left-12" />
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
