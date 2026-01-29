/**
 * HOME PAGE - NEXT.JS 16
 * -----------------------------------------------------------------------------
 * - Ajustado para os padrões de Route Segment Config que você enviou.
 * - Tratamento de params como Promise (Obrigatório no Next 16).
 */

import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n, type Locale } from '@/i18n-config'
import { PageWrapper } from '@/components/PageWrapper'
import { Navbar } from '@/components/Navbar'

// Importação dos seus componentes existentes
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Experience } from '@/components/Experience'
import { Projects } from '@/components/Projects'
import { Articles } from '@/components/Articles'
import { Contact } from '@/components/Contact'

// Configurações de Segmento para estabilidade na Vercel
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

/**
 * Gera os parâmetros estáticos para os idiomas suportados
 */
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale,
  }))
}

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function HomePage({ params }: PageProps) {
  // 1. Aguarda a resolução dos parâmetros da URL
  const { lang } = await params

  // 2. Garante que o idioma é válido
  const currentLang = (i18n.locales.includes(lang as Locale) 
    ? lang 
    : i18n.defaultLocale) as SupportedLocale

  // 3. Carrega o dicionário correspondente
  const dict = getDictionarySync(currentLang)

  // 4. IDs das seções para o funcionamento do scroll/navegação
  const sectionIds = ['about', 'experience', 'projects', 'articles', 'contact']

  return (
    <PageWrapper lang={currentLang} sectionIds={sectionIds}>
      {/* Navbar com suporte a tradução */}
      <Navbar lang={currentLang as Locale} dict={dict} />

      <main className="flex flex-col w-full">
        {/* Hero Section */}
        <Hero lang={currentLang} dict={dict.hero} />
        
        {/* Seções com IDs para navegação via Navbar */}
        <section id="about">
          <About dict={dict.about} />
        </section>

        <section id="experience">
          <Experience dict={dict.experience} />
        </section>

        <section id="projects">
          <Projects lang={currentLang} dict={dict.projects} />
        </section>

        <section id="articles">
          <Articles dict={dict.articles} />
        </section>

        <section id="contact">
          <Contact dict={dict.contact} />
        </section>
      </main>
      
      {/* Rodapé utilizando dados do dicionário common */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {dict.common.footer}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {dict.common.builtWith}
          </p>
        </div>
      </footer>
    </PageWrapper>
  )
}
