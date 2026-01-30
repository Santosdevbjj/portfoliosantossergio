/**
 * HOME PAGE - ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - Framework: Next.js 16.1.5 (Estável)
 * - I18n: Multilíngue (PT, EN, ES) integrado ao dicionário.
 * - Responsividade: Viewport configurada via Metadata.
 */

import { Metadata } from 'next'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n, type Locale } from '@/i18n-config'
import ProxyPage from '@/proxy'

interface PageProps {
  params: Promise<{ lang: string }>
}

/**
 * SEO DINÂMICO & RESPONSIVIDADE
 * Extrai dados do src/dictionaries/[lang].json para garantir autoridade máxima.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const currentLang = (i18n.locales.includes(lang as any) ? lang : i18n.defaultLocale) as SupportedLocale
  
  const dict = getDictionarySync(currentLang)

  // Título e descrição vindos do contrato único src/types/dictionary.ts
  const title = dict.seo.siteName
  const description = dict.seo.description

  return {
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description,
    keywords: dict.seo.keywords,
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5', // Garante responsividade
    alternates: {
      canonical: `/${currentLang}`,
      languages: {
        'pt-BR': '/pt',
        'en-US': '/en',
        'es-ES': '/es',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://portfoliosantossergio.vercel.app/${currentLang}`,
      siteName: title,
      locale: currentLang,
      type: 'website',
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
 * Define as rotas válidas (PT, EN, ES) no momento do build.
 */
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale,
  }))
}

/**
 * COMPONENTE PRINCIPAL (SERVER COMPONENT)
 * Sem importação de React conforme solicitado.
 */
export default async function HomePage({ params }: PageProps) {
  // Unwrapping params obrigatório no Next.js 16
  const resolvedParams = await params
  const { lang } = resolvedParams

  // Validação rigorosa de localidade
  const currentLang = (i18n.locales.includes(lang as Locale) 
    ? lang 
    : i18n.defaultLocale) as SupportedLocale

  return (
    <main className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-white dark:bg-[#020617]">
      {/* Passamos a Promise resolvida para o ProxyPage. 
          O ProxyPage (Client Component) cuidará da renderização das seções 
          multilíngues e responsivas.
      */}
      <ProxyPage params={Promise.resolve({ lang: currentLang })} />
    </main>
  )
}
