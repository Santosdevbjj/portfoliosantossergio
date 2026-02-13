// src/components/error-display.tsx
'use client'

import { BaseError } from '@/lib/errors'
import type { ErrorDictionary } from '@/types/error-dictionary'

interface ErrorDisplayProps {
  error: Error & {
    name?: keyof ErrorDictionary
    errorId?: string
  }
  reset: () => void
  dictionary: {
    errors: ErrorDictionary
  }
}

export function ErrorDisplay({
  error,
  reset,
  dictionary,
}: ErrorDisplayProps) {
  const isBaseError = error instanceof BaseError

  const errorKey: keyof ErrorDictionary =
    error.name && error.name in dictionary.errors
      ? error.name
      : 'InternalServerError'

  const errorData = dictionary.errors[errorKey]

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <h2 className="mb-3 text-2xl font-bold text-red-600 dark:text-red-500 md:text-3xl">
        {errorData.title}
      </h2>

      <p className="mb-6 max-w-lg leading-relaxed text-gray-600 dark:text-gray-400">
        {errorData.message}
      </p>

      {isBaseError && (
        <div className="mb-8 w-full max-w-md rounded-xl border border-gray-200 bg-gray-100 p-5 text-sm dark:border-slate-700 dark:bg-slate-800/50">
          <p className="mb-2 font-bold text-gray-800 dark:text-gray-200">
            {errorData.action}
          </p>

          {error.errorId && (
            <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
              <code className="text-[10px] uppercase tracking-wider text-gray-500">
                ID: {error.errorId}
              </code>
            </div>
          )}
        </div>
      )}

      <button
        onClick={reset}
        className="min-w-[160px] rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95 sm:w-auto w-full"
      >
        Tentar novamente
      </button>
    </div>
  )
}
