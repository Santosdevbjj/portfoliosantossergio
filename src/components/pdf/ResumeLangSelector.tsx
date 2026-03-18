
"use client";

import { useRouter, usePathname, useParams } from "next/navigation";
import { locales, type SupportedLocale } from "@/lib/i18n/locales";

/**
 * RESUME LANGUAGE SELECTOR - VERSÃO 2026
 * -----------------------------------------------------------------------------
 * ✔ Suporte: Next.js 16.1.7, React 19, TS 6.0, Node 24, Tailwind 4.2
 * ✔ Integração: Sincronizado com os dicionários e RESUME_PDF_MAP
 * ✔ Regra: Uso de useRouter para navegação limpa (sem refresh de estado)
 */

const languageDisplay = {
  "pt-BR": { label: "Português", flag: "🇧🇷" },
  "en-US": { label: "English", flag: "🇺🇸" },
  "es-ES": { label: "España", flag: "🇪🇸" },
  "es-AR": { label: "Argentina", flag: "🇦🇷" },
  "es-MX": { label: "México", flag: "🇲🇽" },
} as const;

export default function ResumeLangSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // Identifica o idioma atual via URL params de forma segura para TS 6.0
  const currentLang = (params?.lang as string) || "pt-BR";

  /**
   * Lógica de troca de idioma (PASSO 4 CORRIGIDO)
   * Preserva a rota atual (ex: /resume) trocando apenas o segmento do idioma.
   */
  const changeLanguage = (newLang: SupportedLocale) => {
    if (newLang === currentLang) return;

    const segments = pathname.split("/");
    // segments[0] é vazio antes da primeira barra
    // segments[1] é o código do idioma (ex: pt-BR)
    segments[1] = newLang;
    
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <div 
      className="flex flex-wrap justify-center items-center gap-3 mb-12 animate-in fade-in zoom-in duration-700" 
      aria-label="Seleção de idioma"
    >
      {locales.map((lang) => {
        const isActive = currentLang === lang;
        const info = languageDisplay[lang as SupportedLocale];

        return (
          <button
            key={lang}
            onClick={() => changeLanguage(lang as SupportedLocale)}
            disabled={isActive}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full border 
              transition-all duration-300 active:scale-95 text-sm font-bold tracking-tight
              ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 cursor-default"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 cursor-pointer"
              }
            `}
          >
            <span className="text-xl shrink-0" role="img" aria-label={`Bandeira ${info.label}`}>
              {info.flag}
            </span>
            <span className="whitespace-nowrap">
              {info.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
