import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/HeroSection'
import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { ProjectSection } from '@/components/ProjectSection'
import FeaturedProjectsSection from '@/components/featured/FeaturedProjectsSection'

import { getDictionary } from '@/lib/get-dictionary'
import { getGitHubProjects } from '@/lib/github'
import { i18n, type Locale } from '@/i18n-config'

/** ISR — revalida a cada 1 hora */
export const revalidate = 3600

interface PageProps {
  params: Promise<{ lang: Locale }>
}

/** Tipagem mínima segura do dicionário */
interface Dictionary {
  role: string
  headline: string
  home?: any
  navigation?: any
  [key: string]: any
}

/** Fallback resiliente */
function normalizeDictionary(d: any): Dictionary {
  return {
    role: d?.role ?? 'Data & Systems Specialist',
    headline:
      d?.headline ??
      'Especialista em Dados, Engenharia de Software e Arquitetura de Sistemas.',
    ...d
  }
}

/** ============================
 * Metadata SEO multilíngue
 * ============================ */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { lang } = await params

  if (!i18n.locales.includes(lang)) notFound()

  const dict = normalizeDictionary(await getDictionary(lang))

  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL ??
      'https://portfoliosantossergio.vercel.app'
    ).replace(/\/$/, '')

  return {
    title: `Sérgio Santos | ${dict.role}`,
    description: dict.headline,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        pt: `${baseUrl}/pt`,
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        'x-default': `${baseUrl}/pt`
      }
    },
    openGraph: {
      title: `Sérgio Santos | ${dict.role}`,
      description: dict.headline,
      url: `${baseUrl}/${lang}`,
      siteName: 'Sérgio Santos Portfolio',
      locale:
        lang === 'pt'
          ? 'pt_BR'
          : lang === 'es'
          ? 'es_ES'
          : 'en_US',
      type: 'profile',
      images: [`/og-image-${lang}.png`]
    }
  }
}

/** ============================
 * Home Page
 * ============================ */
export default async function Page({ params }: PageProps) {
  const { lang } = await params

  if (!i18n.locales.includes(lang)) notFound()

  /** Fetch paralelo → performance máxima */
  const [dictRaw, projects] = await Promise.all([
    getDictionary(lang),
    getGitHubProjects(lang)
  ])

  const dict = normalizeDictionary(dictRaw)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'

  /** ============================
   * Schema.org — ProfilePage + Person
   * ============================ */
  const schemaProfilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${siteUrl}/${lang}#profile`,
    mainEntity: {
      '@type': 'Person',
      name: 'Sérgio Santos',
      jobTitle: dict.role,
      description: dict.headline,
      url: siteUrl,
      sameAs: [
        'https://www.linkedin.com/in/sergiosantos',
        'https://github.com/sergiosantos'
      ],
      knowsAbout: [
        'Data Architecture',
        'Cloud Computing',
        'Azure',
        'Python',
        'System Design',
        'Governance'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Professional inquiries',
        availableLanguage: ['Portuguese', 'English', 'Spanish']
      }
    }
  }

  /** ============================
   * Schema.org — WebPage + BreadcrumbList
   * ============================ */
  const schemaWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/${lang}#webpage`,
    url: `${siteUrl}/${lang}`,
    name: dict?.home?.seo?.title ?? `Sérgio Santos | ${dict.role}`,
    description: dict?.home?.seo?.description ?? dict.headline,
    inLanguage: lang,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      name: 'Sérgio Santos Portfolio',
      url: siteUrl
    },
    breadcrumb: {
      '@id': `${siteUrl}/${lang}#breadcrumb`
    }
  }

  const schemaBreadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${siteUrl}/${lang}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict?.navigation?.home ?? 'Home',
        item: `${siteUrl}/${lang}`
      }
    ]
  }

  return (
    <PageWrapper>
      {/* ============================
          Schema.org JSON-LD (SSR real)
         ============================ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaProfilePage)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaWebPage)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaBreadcrumbList)
        }}
      />

      <Navbar lang={lang} dict={dict} />

      <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased transition-colors duration-500">
        <HeroSection lang={lang} dict={dict} />

        <section
          id="about"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:scroll-mt-32 lg:px-12"
        >
          <AboutSection lang={lang} dict={dict} />
        </section>

        <section
          id="experience"
          className="mt-24 scroll-mt-24 bg-slate-50/40 py-24 dark:bg-slate-900/20 lg:scroll-mt-32"
        >
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dict} />
          </div>
        </section>

        {/* 🔥 FEATURED PROJECTS — Masonry + Editorial */}
        <section
          id="projects"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:scroll-mt-32 lg:px-12"
        >
          <FeaturedProjectsSection lang={lang} />
        </section>

        {/* 📦 Projetos completos (lista tradicional) */}
        <section className="py-12 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ProjectSection
              projects={projects}
              lang={lang}
              dict={dict}
            />
          </div>
        </section>

        <section
          id="articles"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:scroll-mt-32 lg:px-12"
        >
          <FeaturedArticleSection lang={lang} dict={dict} />
        </section>

        <section
          id="contact"
          className="mx-auto mb-24 w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:scroll-mt-32 lg:px-12"
        >
          <ContactSection lang={lang} dict={dict} />
        </section>
      </main>

      <Footer lang={lang} dict={dict} />
    </PageWrapper>
  )
}
