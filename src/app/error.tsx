// src/app/error.tsx
'use client'

import { useEffect, useMemo } from 'react'
import { ErrorDisplay } from '@/components/error-display'
import type { ErrorDictionary } from '@/types/error-dictionary'

import ptBR from '@/dictionaries/errors/pt-BR.json'
import enUS from '@/dictionaries/errors/en-US.json'
import esES from '@/dictionaries/errors/es-ES.json'
import esAR from '@/dictionaries/errors/es-AR.json'
import esMX from '@/dictionaries/errors/es-MX.json'

type ErrorDictionaryFile = {
  errors: ErrorDictionary
}

const dictionaries = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
  'es-AR': esAR,
  'es-MX': esMX,
} satisfies Record<string, ErrorDictionaryFile>

type SupportedLocale = keyof typeof dictionaries

type AppError = Error & {
  name: keyof ErrorDictionary
  title?: string
  action?: string
  errorId?: string
  digest?: string
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale: SupportedLocale = useMemo(() => {
    if (typeof window === 'undefined') return 'pt-BR'

    const lang = navigator.language

    if (lang === 'es-AR') return 'es-AR'
    if (lang === 'es-MX') return 'es-MX'
    if (lang.startsWith('es')) return 'es-ES'
    if (lang.startsWith('en')) return 'en-US'

    return 'pt-BR'
  }, [])

  const dictionary = dictionaries[locale]

  const errorKey: keyof ErrorDictionary =
    error.name && error.name in dictionary.errors
      ? (error.name as keyof ErrorDictionary)
      : 'InternalServerError'

  const translatedError: AppError = {
    name: errorKey,
    message: dictionary.errors[errorKey].message,
    title: dictionary.errors[errorKey].title,
    action: dictionary.errors[errorKey].action,
    ...(error.digest && { errorId: error.digest, digest: error.digest }),
  }

  useEffect(() => {
    console.error('CriticalErrorBoundary', translatedError)
  }, [translatedError])

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-slate-950">
      <ErrorDisplay
        error={translatedError}
        reset={reset}
        dictionary={dictionary}
      />
    </main>
  )
}
