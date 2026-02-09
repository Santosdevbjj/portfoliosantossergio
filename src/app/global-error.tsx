// src/app/global-error.tsx
'use client';

import { ErrorDisplay } from '@/components/error-display';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string; errorId?: string; action?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <main className="flex h-screen w-screen items-center justify-center">
          <ErrorDisplay error={error} reset={reset} />
        </main>
      </body>
    </html>
  );
}
