"use client";

import { useEffect, useState } from "react";

export default function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    // Busca todos os H2 e H3 dentro do artigo
    const elements = Array.from(document.querySelectorAll("article h2, article h3"))
      .map((elem) => ({
        id: elem.id || elem.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
        text: elem.textContent || "",
        level: Number(elem.tagName.charAt(1)),
      }));
    
    // Atribui IDs aos elementos caso não tenham (para o scroll funcionar)
    document.querySelectorAll("article h2, article h3").forEach((elem) => {
      if (!elem.id) elem.id = elem.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
    });

    setHeadings(elements);
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-32 self-start w-64 ml-8 p-6 border-l border-slate-200 dark:border-slate-800">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Neste Artigo</h4>
      <ul className="space-y-3">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 1rem}` }}>
            <a 
              href={`#${h.id}`} 
              className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block leading-tight"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
