// src/components/error-display.tsx
import { BaseError } from "@/lib/errors";

interface ErrorDisplayProps {
  error: Error & { digest?: string; statusCode?: number; action?: string; errorId?: string };
  reset: () => void;
}

export function ErrorDisplay({ error, reset }: ErrorDisplayProps) {
  const isBaseError = error instanceof BaseError || 'errorId' in error;

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-2">
        {error.name || "Ops! Algo deu errado"}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
        {error.message}
      </p>
      
      {isBaseError && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 text-sm">
          <p className="font-semibold text-gray-700 dark:text-gray-300">O que fazer?</p>
          <p className="mb-2">{error.action || "Tente recarregar a página."}</p>
          <p className="text-xs text-gray-500">ID do Erro: {error.errorId}</p>
        </div>
      )}

      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}
