'use client';

/**
 * NEXT.JS 16 GLOBAL ERROR HANDLER
 * Substitui o Root Layout em caso de erro crítico na aplicação.
 */

import { ErrorBoundaryView } from '@/components/error/ErrorBoundaryView';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <ErrorBoundaryView
      error={error}
      reset={reset}
      withHtmlWrapper={true}
    />
  );
}
