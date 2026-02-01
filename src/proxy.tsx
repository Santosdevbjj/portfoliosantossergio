// src/proxy.tsx - Versão Otimizada para Build Estável Next.js 16
import { notFound } from 'next/navigation';
import ProxyClient from './ProxyClient';
import type { SupportedLocale } from '@/dictionaries';

/**
 * PROXY PAGE: Gerenciador de Roteamento Dinâmico
 * -----------------------------------------------------------------------------
 * - Removido import não utilizado 'getDictionarySync' para evitar erro de build.
 * - Adicionado suporte seguro para acesso a params dinâmicos.
 */

interface ProxyPageProps {
  readonly params: any; // Mantido any para flexibilidade com a Promise de roteamento
}

export default function ProxyPage({ params }: ProxyPageProps) {
  // Lista de idiomas suportados pelo sistema
  const supported: SupportedLocale[] = ['pt', 'en', 'es'];

  // Extração segura do idioma
  const lang = params?.lang as SupportedLocale;

  // Validação de segurança para rotas inexistentes
  if (!lang) {
    return <ProxyClient lang="pt" />;
  }

  if (!supported.includes(lang)) {
    return notFound();
  }

  return <ProxyClient lang={lang} />;
}
