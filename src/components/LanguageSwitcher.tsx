'use client'

const currentLang = pathname?.split('/')[1] || 'pt'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const LanguageSwitcher = () => {
  const pathname = usePathname()
  
  // Lista de idiomas suportados
  const languages = [
    { code: 'pt', label: 'PT' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' }
  ]

  // Função para calcular a nova rota ao trocar de idioma
  const getNewPath = (lang: string) => {
    if (!pathname) return `/${lang}`
    const segments = pathname.split('/')
    segments[1] = lang
    return segments.join('/')
  }

  const currentLang = pathname.split('/')[1] || 'pt'

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 shadow-lg">
      {languages.map((lang) => (
        <Link
          key={lang.code}
          href={getNewPath(lang.code)}
          className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
            currentLang === lang.code
              ? 'bg-brand text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {lang.label}
        </Link>
      ))}
    </div>
  )
}
