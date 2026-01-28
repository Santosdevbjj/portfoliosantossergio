import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';

// UI Components
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { ProjectSection } from '@/components/ProjectSection';
import FeaturedProjectsSection from '@/components/featured/FeaturedProjectsSection';

// Logic & Data
import { getDictionarySync, type SupportedLocale } from '@/dictionaries';
import { i18n } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Metadata Dinâmica: Utiliza o dicionário tipado para SEO robusto.
 * O uso de 'await props.params' é obrigatório no Next.js 16.
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lang = (i18n.locales.includes(params.lang as any) 
    ? params.lang 
    : i18n.defaultLocale) as SupportedLocale;
  
  const dict = getDictionarySync(lang);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app').replace(/\/$/, '');

  return {
    title: dict.seo.siteName,
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        pt: `${siteUrl}/pt`,
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        'x-default': `${siteUrl}/pt`,
      },
    },
    openGraph: {
      title: dict.seo.siteName,
      description: dict.seo.description,
      locale: lang,
      type: 'website',
      url: `${siteUrl}/${lang}`,
      siteName: dict.seo.siteName,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Page Component: Server Component robusto com tratamento de erro e performance.
 */
export default async function Page(props: PageProps) {
  const params = await props.params;
  const rawLang = params.lang;

  // 1. Validação de Localidade
  if (!i18n.locales.includes(rawLang as any)) {
    notFound();
  }

  const lang = rawLang as SupportedLocale;
  const dict = getDictionarySync(lang);

  /**
   * 2. Busca de Projetos (GitHub)
   * Otimizado para não travar a renderização total em caso de falha na API externa.
   */
  const projects = await getGitHubProjects(lang).catch((err) => {
    console.error("[Page] Erro ao buscar projetos do GitHub:", err);
    return [];
  }) || [];

  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact'];

  return (
    <PageWrapper lang={lang} sectionIds={sectionIds}>
      {/* Navbar injeta o dicionário síncrono para renderização imediata */}
      <Navbar lang={lang} dict={dict} />

      <main 
        className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased"
        suppressHydrationWarning // Escape hatch para pequenas variações de extensões de browser
      >
        {/* HERO - Prioridade Máxima (LCP) */}
        <section id="hero" className="scroll-mt-0">
          <HeroSection lang={lang} dict={dict} />
        </section>

        {/* ABOUT - Rigor Bancário e Trajetória */}
        <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12 py-12 md:py-24">
          <AboutSection lang={lang} dict={dict} />
        </section>

        {/* EXPERIENCE - Histórico Bradesco & Consultoria */}
        <section id="experience" className="scroll-mt-24 bg-slate-50/40 py-24 dark:bg-slate-900/10">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dict} />
          </div>
        </section>

        {/* PROJECTS - Grid de Tecnologia Resolvido pelo Domínio */}
        <section id="projects" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
          <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />}>
            <FeaturedProjectsSection lang={lang} />
          </Suspense>

          <div className="mt-12 md:mt-20">
            {/* ProjectSection recebe os dados já filtrados e resolvidos pelo domain/projects */}
            <ProjectSection projects={projects} lang={lang} dict={dict} />
          </div>
        </section>

        {/* ARTICLES - DIO & Medium Insights */}
        <section id="articles" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12 bg-slate-50/30 dark:bg-transparent rounded-[3rem]">
          <FeaturedArticleSection lang={lang} dict={dict} />
        </section>

        {/* CONTACT - Conversão e Networking */}
        <section id="contact" className="mx-auto mb-24 w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
          <ContactSection lang={lang} dict={dict} />
        </section>
      </main>

      <Footer lang={lang} dict={dict} />
    </PageWrapper>
  );
}
