'use client';

import { ErrorBoundaryView } from '@/components/error/ErrorBoundaryView';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundaryView error={error} reset={reset} />;
}
