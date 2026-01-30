/**
 * HOME PAGE - ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - Responsividade: Garantida via PageContent (Proxy) e Layout.
 * - I18n: Suporte total a PT, EN, ES integrado aos dicionários.
 * - SEO: Meta-tags dinâmicas para autoridade em Engenharia de Dados.
 */

import { Metadata } from 'next'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n, type Locale } from '@/i18n-config'
import PageContent from '@/proxy'

interface PageProps {
  params: Promise<{ lang: string }>
}

/**
 * SEO Dinâmico: Gera metadados otimizados para cada idioma
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.lang as SupportedLocale
  
  // Obtém o dicionário de forma síncrona para o servidor
  const dict = getDictionarySync(lang)

  return {
    title: dict.seo.siteName || dict.hero.role,
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'pt': '/pt',
        'en': '/en',
        'es': '/es',
      },
    },
    openGraph: {
      title: dict.seo.siteName,
      description: dict.seo.description,
      url: `https://sergiosantos.com/${lang}`, // Substitua pelo seu domínio real
      siteName: 'Sérgio Santos Portfolio',
      locale: lang,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    }
  }
}

/**
 * Geração Estática (SSG): Garante performance máxima na Vercel
 */
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale,
  }))
}

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params
  const { lang } = resolvedParams

  // Validação rigorosa do idioma para evitar 404s ou erros de hidratação
  const currentLang = i18n.locales.includes(lang as Locale) 
    ? (lang as Locale) 
    : i18n.defaultLocale

  return (
    <main className="min-h-screen">
      {/* O PageContent atua como um Proxy para componentes Client-side,
          mantendo o page.tsx limpo para processamento no servidor (SSR).
      */}
      <PageContent params={{ lang: currentLang }} />
    </main>
  )
}
