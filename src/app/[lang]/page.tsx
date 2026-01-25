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

import { getDictionary } from '@/lib/get-dictionary'
import { getGitHubProjects } from '@/lib/github'

/** ISR — revalida a cada 1 hora */
export const revalidate = 3600

type SupportedLangs = 'pt' | 'en' | 'es'

interface PageProps {
  params: Promise<{ lang: string }>
}

/** Tipagem mínima segura do dicionário */
interface Dictionary {
  role: string
  headline: string
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

/** Metadata SEO multilíngue */
export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const currentLang: SupportedLangs = ['pt', 'en', 'es'].includes(lang)
    ? (lang as SupportedLangs)
    : 'pt'

  const dict = normalizeDictionary(await getDictionary(currentLang))

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'
  ).replace(/\/$/, '')

  return {
    title: `Sérgio Santos | ${dict.role}`,
    description: dict.headline,
    alternates: {
      canonical: `${baseUrl}/${currentLang}`,
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
      url: `${baseUrl}/${currentLang}`,
      siteName: 'Sérgio Santos Portfolio',
      locale:
        currentLang === 'pt'
          ? 'pt_BR'
          : currentLang === 'es'
          ? 'es_ES'
          : 'en_US',
      type: 'profile',
      images: [`/og-image-${currentLang}.png`]
    }
  }
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params

  if (!['pt', 'en', 'es'].includes(lang)) notFound()
  const currentLang = lang as SupportedLangs

  /** Fetch paralelo → performance máxima */
  const [dictRaw, projects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects(currentLang)
  ])

  const dict = normalizeDictionary(dictRaw)

  /** Schema.org — ProfilePage + Person */
  const schemaProfile = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Sérgio Santos',
      jobTitle: dict.role,
      description: dict.headline,
      url: 'https://portfoliosantossergio.vercel.app',
      sameAs: [
        'https://www.linkedin.com/in/sergiosantos',
        'https://github.com/sergiosantos'
      ]
    }
  }

  return (
    <PageWrapper>
      {/* Schema.org JSON-LD — zero impacto em performance */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProfile) }}
      />

      {/* Navbar pronta para ScrollSpy global */}
      <Navbar lang={currentLang} dict={dict} />

      <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased transition-colors duration-500">
        {/* HERO */}
        <HeroSection lang={currentLang} dict={dict} />

        {/* ABOUT */}
        <section
          id="about"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:scroll-mt-32 lg:px-12"
        >
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* EXPERIENCE */}
        <section
          id="experience"
          className="mt-24 scroll-mt-24 bg-slate-50/40 py-24 dark:bg-slate-900/20 lg:scroll-mt-32"
        >
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ExperienceSection lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* ARTICLES */}
        <section
          id="articles"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:scroll-mt-32 lg:px-12"
        >
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="scroll-mt-24 py-12 lg:scroll-mt-32 lg:py-24"
        >
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ProjectSection
              projects={projects}
              lang={currentLang}
              dict={dict}
            />
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="mx-auto mb-24 w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:scroll-mt-32 lg:px-12"
        >
          <ContactSection lang={currentLang} dict={dict} />
        </section>
      </main>

      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  )
}
