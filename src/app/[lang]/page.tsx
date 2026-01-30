/**
 * HOME PAGE - ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - Framework: Next.js 16.1.5 (Estável)
 * - I18n: Multilíngue (PT, EN, ES) integrado ao dicionário.
 * - Responsividade: Viewport e Layout blindados para Mobile.
 * - SEO: Integração com API post-og dinâmica.
 */

import { Metadata } from 'next'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'
import ProxyPage from '@/proxy'

interface PageProps {
  params: Promise<{ lang: string }>
}

/**
 * SEO DINÂMICO & RESPONSIVIDADE
 * Extrai dados do contrato único src/types/dictionary.ts
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const currentLang = (i18n.locales.includes(lang as any) ? lang : i18n.defaultLocale) as SupportedLocale
  
  const dict = getDictionarySync(currentLang)

  const title = dict.seo.siteName
  const description = dict.seo.description
  const siteUrl = 'https://portfoliosantossergio.vercel.app'

  // Geração da URL da imagem OG usando nossa API dinâmica
  const ogImageUrl = `${siteUrl}/api/post-og?title=${encodeURIComponent(dict.hero.title + ' ' + dict.hero.subtitle)}&description=${encodeURIComponent(dict.hero.headline)}&author=Sérgio Santos`

  return {
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description,
    keywords: dict.seo.keywords,
    // Responsividade máxima para Chrome no Celular
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5', 
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
 * Garante que as rotas /pt, /en e /es existam fisicamente no build da Vercel.
 */
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale,
  }))
}

/**
 * COMPONENTE PRINCIPAL (SERVER COMPONENT)
 * Entrega a estrutura para o ProxyPage renderizar as seções.
 */
export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params
  const { lang } = resolvedParams

  // Validação de segurança para garantir que o lang seja suportado
  const currentLang = (i18n.locales.includes(lang as any) 
    ? lang 
    : i18n.defaultLocale) as SupportedLocale

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617]">
      {/* O ProxyPage recebe a lang resolvida e renderiza o conteúdo 
          extraído do dicionário correspondente.
      */}
      <ProxyPage params={Promise.resolve({ lang: currentLang })} />
    </main>
  )
}
