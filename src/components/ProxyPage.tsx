'use client';

// src/components/ProxyPage.tsx

import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import type { Locale } from "@/types/dictionary";
import { isValidLocale } from "@/dictionaries/locales";

interface ProxyPageProps {
  lang: Locale;
  children: ReactNode;
}

/**
 * ProxyPage (Server Component)
 * -----------------------------------------------------------------------------
 * Responsável por:
 * - Validar locale dinamicamente
 * - Servir como wrapper seguro para páginas multilíngues
 *
 * ✔ Next.js 16 App Router compliant
 * ✔ TypeScript 6 strict safe
 * ✔ Multilíngue (pt, en, es)
 * ✔ SSR safe
 * ✔ Sem render props (arquitetura moderna)
 */
export default function ProxyPage({
  lang,
  children,
}: ProxyPageProps) {
  if (!isValidLocale(lang)) {
    notFound();
  }

  return <>{children}</>;
}
