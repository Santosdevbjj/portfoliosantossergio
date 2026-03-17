'use client'

import Link from "next/link";
import { useParams } from "next/navigation";

/**
 * RESUME LANGUAGE SELECTOR - CORRIGIDO
 * -----------------------------------------------------------------------------
 * ✔ Fix: Navegação para a Home do idioma em vez de sub-rota inexistente
 * ✔ Feature: Troca o idioma global do site e do PDF simultaneamente
 * ✔ UX: Mantém a posição do scroll ao trocar de língua
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
  // Garante que pegamos o idioma atual da URL de forma segura
  const currentLang = params?.lang as string;

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12 animate-in fade-in zoom-in duration-700">
      {languages.map((lang) => {
        const isActive = currentLang === lang.id;
        
        return (
          <Link
            key={lang.id}
            // CORREÇÃO: Aponta para a Home do idioma específico
            href={`/${lang.id}`}
            // Impede que a página pule para o topo na troca
            scroll={false}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 active:scale-95
              ${isActive 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 cursor-default' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-500'
              }
            `}
          >
            <span className="text-xl" role="img" aria-label={lang.label}>
              {lang.flag}
            </span>
            <span className="text-sm font-bold tracking-tight">
              {lang.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
