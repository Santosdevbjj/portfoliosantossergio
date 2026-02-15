'use client';

import type { ErrorDictionary } from '@/types/error-dictionary';
import {
  AlertCircle,
  RefreshCcw,
  ShieldAlert,
  Info,
  XCircle,
} from 'lucide-react';

interface ErrorBoxProps {
  errorKey: keyof ErrorDictionary;
  dictionary: ErrorDictionary;
  errorId?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorBox({
  errorKey,
  dictionary,
  errorId,
  onRetry,
  retryLabel = 'Tentar novamente',
}: ErrorBoxProps) {
  const details = dictionary[errorKey] ?? dictionary.InternalServerError;

  const getIcon = () => {
    switch (errorKey) {
      case 'ValidationError':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'ForbiddenError':
      case 'UnauthorizedError':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'TooManyRequestsError':
        return <RefreshCcw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex-shrink-0 p-2 rounded-full bg-slate-50 dark:bg-slate-800">
        {getIcon()}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
          {details.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {details.message}
        </p>

        <div className="flex items-center gap-2 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Info className="w-3 h-3" />
          <span>{details.action}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
          {errorId && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded">
              ID: {errorId}
            </span>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-slate-900 dark:bg-blue-600 rounded-lg hover:opacity-90 transition active:scale-95"
            >
              <RefreshCcw className="w-4 h-4" />
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
