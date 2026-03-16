'use client'

import Link from "next/link";
import { useParams } from "next/navigation";

const languages = [
  { id: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { id: 'en-US', label: 'English', flag: '🇺🇸' },
  { id: 'es-ES', label: 'España', flag: '🇪🇸' },
  { id: 'es-AR', label: 'Argentina', flag: '🇦🇷' },
  { id: 'es-MX', label: 'México', flag: '🇲🇽' },
];

export default function ResumeLangSelector() {
  const params = useParams();
  const currentLang = params?.lang as string;

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12 animate-in fade-in zoom-in duration-700">
      {languages.map((lang) => {
        const isActive = currentLang === lang.id;
        
        return (
          <Link
            key={lang.id}
            href={`/${lang.id}/resume`}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 active:scale-95
              ${isActive 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-500'
              }
            `}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm font-bold tracking-tight">{lang.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
