'use client';

import { ErrorDisplay } from '@/components/error-display';
import type { ErrorDictionary } from '@/types/error-dictionary';

import ptBR from '@/dictionaries/errors/pt-BR.json';

export default function NotFound() {
  const dictionary = ptBR.errors as ErrorDictionary;

  return (
    <ErrorDisplay
      errorKey="NotFoundError"
      dictionary={dictionary}
      reset={() => window.location.reload()}
    />
  );
}
