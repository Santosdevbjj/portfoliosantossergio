"use client";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h2, h3")).map(
      (elem) => {
        const text = elem.textContent || "";
        const id =
          elem.id ||
          text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
        if (!elem.id) elem.id = id;
        return { id, text, level: Number(elem.tagName.charAt(1)) };
      }
    );

    setHeadings(elements);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    article.querySelectorAll("h2, h3").forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-32 self-start w-64 ml-8 p-6 border-l border-slate-200 dark:border-slate-800">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
        Neste Artigo
      </h4>
      <ul className="space-y-3">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 16}px` }}>
            <a
              href={`#${h.id}`}
              className={`text-sm font-medium transition-all duration-300 block leading-tight ${
                activeId === h.id
                  ? "text-blue-600 dark:text-blue-400 translate-x-1"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
