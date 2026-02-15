'use client';

import type { ErrorDictionary } from '@/types/error-dictionary';

interface ErrorDisplayProps {
  errorKey: keyof ErrorDictionary;
  errorId?: string;
  dictionary: ErrorDictionary;
  reset: () => void;
}

export function ErrorDisplay({
  errorKey,
  errorId,
  dictionary,
  reset,
}: ErrorDisplayProps) {
  const errorData = dictionary[errorKey] ?? dictionary.InternalServerError;

  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {errorData.title}
      </h1>

      <p className="mb-6 text-gray-600 dark:text-gray-400">
        {errorData.message}
      </p>

      <div className="mb-8 rounded-xl border border-gray-200 bg-gray-100 p-5 text-sm dark:border-slate-700 dark:bg-slate-800/50">
        <p className="font-semibold">{errorData.action}</p>

        {errorId && (
          <div className="mt-3 border-t border-gray-200 pt-3 dark:border-slate-700">
            <code className="text-[10px] tracking-wider text-gray-500">
              ID: {errorId}
            </code>
          </div>
        )}
      </div>

      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition active:scale-95"
      >
        Tentar novamente
      </button>
    </div>
  );
}
