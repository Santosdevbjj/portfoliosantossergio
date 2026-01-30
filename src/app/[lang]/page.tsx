/**
 * HOME PAGE - ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - Framework: Next.js 16 (Turbopack)
 * - I18n: SSR-Safe com suporte a PT, EN, ES.
 * - Fix: Resolvido erro de chamada de Client Component no Servidor.
 */

import { Metadata } from 'next'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n, type Locale } from '@/i18n-config'
import ProxyPage from '@/proxy'

interface PageProps {
  params: Promise<{ lang: string }>
}

/**
 * SEO Dinâmico: Metadados extraídos diretamente dos dicionários JSON
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const currentLang = lang as SupportedLocale
  
  // Obtém o dicionário de forma síncrona no servidor
  const dict = getDictionarySync(currentLang)

  // Fallback seguro para o título
  const title = dict.seo?.siteName || dict.hero?.role || "Sérgio Santos | Portfólio"

  return {
    title,
    description: dict.seo?.description,
    keywords: dict.seo?.keywords,
    alternates: {
      canonical: `/${currentLang}`,
      languages: {
        'pt': '/pt',
        'en': '/en',
        'es': '/es',
      },
    },
    openGraph: {
      title,
      description: dict.seo?.description,
      url: `https://portfoliosantossergio.vercel.app/${currentLang}`,
      siteName: 'Sérgio Santos Portfolio',
      locale: currentLang,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    }
  }
}

/**
 * Geração Estática (SSG): Define as rotas válidas no build
 */
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale,
  }))
}

/**
 * Componente Principal (Server Component)
 */
export default async function HomePage({ params }: PageProps) {
  // No Next.js 16, params deve ser aguardado (await)
  const resolvedParams = await params
  const { lang } = resolvedParams

  // Validação de segurança para o idioma
  const currentLang = i18n.locales.includes(lang as Locale) 
    ? (lang as Locale) 
    : i18n.defaultLocale

  return (
    <main className="min-h-screen">
      {/* O ProxyPage (Client Component) recebe a Promise do params.
          Isso resolve o erro "Attempted to call from server but it's on client".
      */}
      <ProxyPage params={Promise.resolve({ lang: currentLang })} />
    </main>
  )
}
