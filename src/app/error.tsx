'use client'

import { useEffect, useMemo } from 'react'
import { ErrorDisplay } from '@/components/error-display'
import type { ErrorDictionary } from '@/types/error-dictionary'

import ptBR from '@/dictionaries/errors/pt-BR.json'
import enUS from '@/dictionaries/errors/en-US.json'
import esES from '@/dictionaries/errors/es-ES.json'
import esAR from '@/dictionaries/errors/es-AR.json'
import esMX from '@/dictionaries/errors/es-MX.json'

const dictionaries = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
  'es-AR': esAR,
  'es-MX': esMX,
} as const

type SupportedLocale = keyof typeof dictionaries

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale: SupportedLocale = useMemo(() => {
    if (typeof window === 'undefined') return 'pt-BR'

    const lang = navigator.language

    if (lang in dictionaries) return lang as SupportedLocale
    if (lang.startsWith('en')) return 'en-US'
    if (lang.startsWith('es')) {
      if (lang.includes('AR')) return 'es-AR'
      if (lang.includes('MX')) return 'es-MX'
      return 'es-ES'
    }

    return 'pt-BR'
  }, [])

  // ✅ Cast seguro garantindo que acessamos o objeto de erros
  const dictionary = (dictionaries[locale] as any).errors as ErrorDictionary

  const errorKey = useMemo((): keyof ErrorDictionary => {
    if (error.name in dictionary) {
      return error.name as keyof ErrorDictionary
    }
    return 'InternalServerError'
  }, [error.name, dictionary])

  useEffect(() => {
    console.error('APP_ERROR_BOUNDARY', {
      name: error.name,
      digest: error.digest,
    })
  }, [error])

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white p-4 dark:bg-slate-950">
      <ErrorDisplay
        errorKey={errorKey}
        // ✅ CORREÇÃO DO TS: Garante que passe string ou trate o opcional
        errorId={error.digest ?? ''} 
        dictionary={dictionary}
        reset={reset}
      />
    </main>
  )
}
