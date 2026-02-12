// src/components/error-display.tsx
"use client";

import { BaseError } from "@/lib/errors";
import type { ErrorDictionary } from "@/types/error-dictionary";

interface ErrorDisplayProps {
  error: Error & {
    name?: keyof ErrorDictionary;
    errorId?: string;
  };
  reset: () => void;
  locale: keyof typeof import("@/dictionaries/errors/pt-BR.json");
  dictionary: {
    errors: ErrorDictionary;
  };
}

export function ErrorDisplay({
  error,
  reset,
  dictionary,
}: ErrorDisplayProps) {
  const isBaseError = error instanceof BaseError;
  const errorKey =
    (error.name as keyof ErrorDictionary) ?? "InternalServerError";

  const errorData =
    dictionary.errors[errorKey] ??
    dictionary.errors.InternalServerError;

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <h2 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-500 mb-3">
        {errorData.title}
      </h2>

      <p className="text-gray-600 dark:text-gray-400 max-w-lg mb-6 leading-relaxed">
        {errorData.message}
      </p>

      {isBaseError && (
        <div className="w-full max-w-md bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-5 rounded-xl mb-8 text-sm">
          <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">
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
        className="w-full sm:w-auto min-w-[160px] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
      >
        Tentar novamente
      </button>
    </div>
  );
}
