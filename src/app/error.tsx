'use client';

/**
 * NEXT.JS 16 ERROR HANDLER
 * Captura erros de páginas e componentes filhos.
 */

import { ErrorBoundaryView } from '@/components/error/ErrorBoundaryView';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <div className="container mx-auto px-4">
      <ErrorBoundaryView error={error} reset={reset} />
    </div>
  );
}
