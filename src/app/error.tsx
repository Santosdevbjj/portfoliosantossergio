// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/error-display';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; errorId?: string; action?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aqui você integraria com Sentry ou LogRocket
    console.error("LOG_CRITICO:", {
      message: error.message,
      id: error.errorId,
      stack: error.stack
    });
  }, [error]);

  return <ErrorDisplay error={error} reset={reset} />;
}
