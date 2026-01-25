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

/** ISR — Revalida cache a cada 1 hora */
export const revalidate = 3600

type SupportedLangs = 'pt' | 'en' | 'es'

interface PageProps {
  params: {
    lang: SupportedLangs
  }
}

/** Tipagem mínima segura do dicionário */
interface Dictionary {
  role: string
  headline: string
  [key: string]: any
}

/** Normaliza o dicionário garantindo campos essenciais */
function normalizeDictionary(d: any): Dictionary {
  return {
    role: d?.role ?? 'Data Specialist',
    headline:
      d?.headline ??
      'Especialista em Dados, Engenharia de Sistemas e Arquitetura de Software.',
    ...d
  }
}

/** Metadata SEO dinâmico multilíngue */
export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { lang } = params
  const currentLang: SupportedLangs = ['pt', 'en', 'es'].includes(lang)
    ? lang
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
      type: 'website',
      images: [`/og-image-${currentLang}.png`]
    }
  }
}

/** Página principal — multilíngue, responsiva e SEO-ready */
export default async function Page({ params }: PageProps) {
  const { lang } = params

  if (!['pt', 'en', 'es'].includes(lang)) notFound()
  const currentLang = lang as SupportedLangs

  /** Busca paralela para máxima performance */
  const [dictRaw, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects(currentLang)
  ])

  const dict = normalizeDictionary(dictRaw)

  return (
    <PageWrapper>
      <Navbar lang={currentLang} dict={dict} />

      <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] transition-colors duration-500 antialiased">
        {/* HERO */}
        <HeroSection lang={currentLang} dict={dict} />

        {/* SOBRE */}
        <section
          id="about"
          className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12 scroll-mt-24 lg:scroll-mt-32"
        >
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* EXPERIÊNCIA */}
        <section
          id="experience"
          className="mt-24 scroll-mt-24 bg-slate-50/40 dark:bg-slate-900/20 py-24 lg:scroll-mt-32"
        >
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ExperienceSection lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* ARTIGOS */}
        <section
          id="articles"
          className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12 scroll-mt-24 py-24 lg:scroll-mt-32"
        >
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* PROJETOS */}
        <section
          id="projects"
          className="scroll-mt-24 py-12 lg:py-24 lg:scroll-mt-32"
        >
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ProjectSection
              projects={allProjects}
              lang={currentLang}
              dict={dict}
            />
          </div>
        </section>

        {/* CONTATO */}
        <section
          id="contact"
          className="mx-auto mb-24 w-full max-w-7xl px-6 sm:px-10 lg:px-12 scroll-mt-24 lg:scroll-mt-32"
        >
          <ContactSection lang={currentLang} dict={dict} />
        </section>
      </main>

      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  )
}
