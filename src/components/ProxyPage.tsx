// src/components/ProxyPage.tsx
import { ReactNode } from "react";
import { getDictionary } from "@/dictionaries";
import { Locale, Dictionary } from "@/types/dictionary";
import { notFound } from "next/navigation";

interface ProxyPageProps {
  lang: Locale;
  children: (dictionary: Dictionary) => ReactNode;
}

/**
 * ProxyPage (Server Component)
 * Responsável apenas por:
 * - validar locale
 * - carregar dicionário
 * - injetar o dicionário corretamente
 */
export default async function ProxyPage({ lang, children }: ProxyPageProps) {
  const supportedLocales: Locale[] = [
    "pt-BR",
    "en-US",
    "es-ES",
    "es-AR",
    "es-MX",
  ];

  if (!supportedLocales.includes(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <>{children(dictionary)}</>;
}
