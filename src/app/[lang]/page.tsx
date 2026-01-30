/**
 * HOME PAGE - REVISÃO FINAL SÊNIOR
 * -----------------------------------------------------------------------------
 * - Responsividade: Herdada via PageWrapper e Proxy.
 * - I18n: Suporte total a PT, EN, ES via dicionários JSON.
 * - SEO: Metadados dinâmicos baseados no idioma da URL.
 */

import { Metadata } from 'next'
import { getDictionarySync } from '@/dictionaries'
import { i18n, type Locale } from '@/i18n-config'
import PageContent from '@/proxy' // Este é o componente que contém a lógica que revisamos

interface PageProps {
  params: Promise<{ lang: string }>
}

/**
 * SEO Dinâmico: Alinha as meta tags com o seu dicionário seo.json
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = getDictionarySync(lang as any)

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
      locale: lang,
    }
  }
}

/**
 * Gera os caminhos estáticos para performance na Vercel
 */
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale,
  }))
}

export default async function HomePage({ params }: PageProps) {
  // Simplesmente validamos o idioma e passamos para o PageContent (Proxy)
  // O PageContent cuidará da hidratação, tema escuro e busca no GitHub.
  const { lang } = await params
  
  // Fallback de segurança para o idioma
  const currentLang = i18n.locales.includes(lang as Locale) 
    ? (lang as Locale) 
    : i18n.defaultLocale

  return <PageContent params={{ lang: currentLang }} />
}
