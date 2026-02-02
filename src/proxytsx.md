// src/proxy.tsx
import { notFound } from 'next/navigation';
import ProxyClient from './ProxyClient';
import type { SupportedLocale } from '@/dictionaries';

interface ProxyPageProps {
  readonly params?: {
    lang?: SupportedLocale;
  };
}

export default function ProxyPage({ params }: ProxyPageProps) {
  const supported: readonly SupportedLocale[] = ['pt', 'en', 'es'];

  const lang = params?.lang ?? 'pt';

  if (!supported.includes(lang)) {
    notFound();
  }

  return <ProxyClient lang={lang} />;
}
