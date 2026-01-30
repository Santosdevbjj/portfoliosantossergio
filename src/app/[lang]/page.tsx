/**
 * HOME PAGE - ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - Framework: Next.js 16.1.5 (Estável)
 * - I18n: Multilíngue (PT, EN, ES) integrado ao dicionário.
 * - Responsividade: Implementada via Viewport API (Padrão 2026).
 * - SEO: Integração com API post-og dinâmica para Cards Sociais.
 */

import { Metadata, Viewport } from 'next'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'
import ProxyPage from '@/proxy'

interface PageProps {
  params: Promise<{ lang: string }>
}

/**
 * CONFIGURAÇÃO DE VIEWPORT (API DEDICADA)
 * Essencial para responsividade total e eliminação de warnings na Vercel.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

/**
 * SEO DINÂMICO
 * Extrai dados do src/dictionaries/[lang].json para autoridade máxima.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const currentLang = (i18n.locales.includes(lang as any) ? lang : i18n.defaultLocale) as SupportedLocale
  
  const dict = getDictionarySync(currentLang)

  const title = dict.seo.siteName
  const description = dict.seo.description
  const siteUrl = 'https://portfoliosantossergio.vercel.app'

  // Geração da URL da imagem OG usando nossa API dinâmica integrada
  // Concatenamos Title + Subtitle para um card visualmente rico
  const ogImageUrl = `${siteUrl}/api/post-og?title=${encodeURIComponent(dict.hero.title + ' ' + dict.hero.subtitle)}&description=${encodeURIComponent(dict.hero.headline)}&author=Sérgio Santos`

  return {
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description,
    keywords: dict.seo.keywords,
    alternates: {
      canonical: `${siteUrl}/${currentLang}`,
      languages: {
        'pt-BR': '/pt',
        'en-US': '/en',
        'es-ES': '/es',
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${currentLang}`,
      siteName: title,
      locale: currentLang,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  }
}

/**
 * GERAÇÃO ESTÁTICA (SSG)
 * Define as rotas válidas no momento do build.
 */
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale,
  }))
}

/**
 * COMPONENTE PRINCIPAL (SERVER COMPONENT)
 */
export default async function HomePage({ params }: PageProps) {
  const { lang } = await params

  // Validação rigorosa de localidade
  const currentLang = (i18n.locales.includes(lang as any) 
    ? lang 
    : i18n.defaultLocale) as SupportedLocale

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617]">
      {/* ProxyPage cuidará da orquestração das seções (About, Projects, etc) */}
      <ProxyPage params={Promise.resolve({ lang: currentLang })} />
    </main>
  )
}
