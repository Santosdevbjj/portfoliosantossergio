/**
 * SRC/PROXY.TSX - Baseline 2026.1
 * Este é um Server Component. Ele valida a rota e delega a renderização
 * para o ProxyClient (Client Component).
 */

import { notFound } from 'next/navigation'
import ProxyClient from './ProxyClient'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { Metadata } from 'next'

interface ProxyProps {
  params: {
    lang: SupportedLocale
  }
}

/**
 * Geração de Metadados Dinâmicos (SEO Multilingue)
 * Alinhado estritamente com seus dicionários JSON
 */
export async function generateMetadata({ params }: { params: { lang: SupportedLocale } }): Promise<Metadata> {
  const dict = getDictionarySync(params.lang)
  
  return {
    title: dict.seo.siteName,
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    alternates: {
      languages: {
        'pt-BR': '/pt',
        'en-US': '/en',
        'es-ES': '/es',
      },
    },
    openGraph: {
      title: dict.seo.siteName,
      description: dict.seo.description,
      type: 'website',
      locale: params.lang,
    }
  }
}

/**
 * Componente Proxy Principal
 */
export default function ProxyPage({ params }: ProxyProps) {
  const { lang } = params

  // 1. Validação de Segurança (Whitelist de Idiomas 2026)
  const supported: SupportedLocale[] = ['pt', 'en', 'es']
  
  if (!supported.includes(lang)) {
    notFound()
  }

  // 2. Renderização do Cliente
  // O ProxyClient cuidará da hidratação e interatividade responsiva
  return <ProxyClient lang={lang} />
}
