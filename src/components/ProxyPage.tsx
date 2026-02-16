// src/components/ProxyPage.tsx

import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import type { Locale, Dictionary } from "@/types/dictionary";
import { isValidLocale } from "@/dictionaries/locales";
import { getServerDictionary } from "@/lib/getServerDictionary";

interface ProxyPageProps {
  lang: Locale;
  children: (dictionary: Dictionary) => ReactNode;
}

/**
 * ProxyPage (Server Component)
 * -----------------------------------------------------------------------------
 * Responsável por:
 * - Validar locale com a fonte oficial (SUPPORTED_LOCALES)
 * - Carregar dicionário cacheado (React cache)
 * - Injetar Dictionary tipado no children
 *
 * ✔ Next.js 16 App Router compliant
 * ✔ TypeScript 6 strict safe
 * ✔ Multilíngue
 * ✔ SSR safe
 */
export default async function ProxyPage({
  lang,
  children,
}: ProxyPageProps) {
  // Validação robusta baseada na fonte oficial
  if (!isValidLocale(lang)) {
    notFound();
  }

  // Carregamento cacheado server-side
  const dictionary = await getServerDictionary(lang);

  return <>{children(dictionary)}</>;
}
