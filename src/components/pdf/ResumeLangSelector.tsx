'use client'

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

/**
 * RESUME LANGUAGE SELECTOR - VERSÃO 2026
 * -----------------------------------------------------------------------------
 * ✔ Suporte: Next.js 16, React 19, TS 6.0, Tailwind 4.2
 * ✔ Dinâmico: Detecta se está na Home ou na rota /resume
 * ✔ Responsivo: Layout adaptável para mobile e desktop
 */

const languages = [
  { id: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { id: 'en-US', label: 'English', flag: '🇺🇸' },
  { id: 'es-ES', label: 'España', flag: '🇪🇸' },
  { id: 'es-AR', label: 'Argentina', flag: '🇦🇷' },
  { id: 'es-MX', label: 'México', flag: '🇲🇽' },
];

export default function ResumeLangSelector() {
  const params = useParams();
  const pathname = usePathname();
  
  // Garante a tipagem segura para TypeScript 6.0
  const currentLang = (params?.lang as string) || 'pt-BR';

  /**
   * Lógica Dinâmica de Rota:
   * Se o usuário estiver em /pt-BR/resume, ao clicar em English vai para /en-US/resume
   * Se estiver em /pt-BR, ao clicar em English vai para /en-US
   */
  const getPath = (langId: string) => {
    return pathname.includes('/resume') ? `/${langId}/resume` : `/${langId}`;
  };

  return (
    <div 
      className="flex flex-wrap justify-center items-center gap-3 mb-12 animate-in fade-in zoom-in duration-700"
      aria-label="Seleção de idioma do currículo"
    >
      {languages.map((lang) => {
        const isActive = currentLang === lang.id;
        
        return (
          <Link
            key={lang.id}
            href={getPath(lang.id)}
            scroll={false} // Evita o "pulo" da página na troca
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 active:scale-95
              text-sm font-bold tracking-tight
              ${isActive 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 cursor-default pointer-events-none' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-slate-700/50'
              }
            `}
          >
            <span className="text-xl shrink-0" role="img" aria-label={`Bandeira ${lang.label}`}>
              {lang.flag}
            </span>
            <span className="whitespace-nowrap">
              {lang.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
