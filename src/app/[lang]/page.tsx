import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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

import { getDictionarySync, type SupportedLocale } from '@/dictionaries';
import { i18n } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Metadata Dinâmica: Blindada contra erros de params e timeout
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lang = (i18n.locales.includes(params.lang as any) ? params.lang : i18n.defaultLocale) as SupportedLocale;
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
        'x-default': `${siteUrl}/pt` 
      },
    },
    openGraph: {
      title: dict.seo.siteName,
      description: dict.seo.description,
      locale: lang,
      type: 'website',
    }
  };
}

/**
 * Componente de Página Principal (Server Component)
 */
export default async function Page(props: PageProps) {
  // 1. Resolução segura dos parâmetros da URL
  const params = await props.params;
  const rawLang = params.lang;
  
  // 2. Validação estrita de Idioma para evitar 404s desnecessários
  if (!i18n.locales.includes(rawLang as any)) {
    notFound();
  }
  
  const lang = rawLang as SupportedLocale;
  const dict = getDictionarySync(lang);
  
  // 3. Busca de projetos com proteção contra Timeout
  // A função getGitHubProjects deve ter o AbortController para não travar a Vercel
  const projects = await getGitHubProjects(lang) || [];

  // IDs para controle de navegação e ScrollSpy
  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact'];

  return (
    <PageWrapper lang={lang} sectionIds={sectionIds}>
      {/* Navbar fixa no topo */}
      <Navbar lang={lang} dict={dict} />
      
      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        
        {/* HERO SECTION */}
        <section id="hero" className="scroll-mt-0">
          <HeroSection lang={lang} dict={dict} />
        </section>
        
        {/* ABOUT SECTION */}
        <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12 py-12 md:py-24">
          <AboutSection lang={lang} dict={dict} />
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="scroll-mt-24 bg-slate-50/40 py-24 dark:bg-slate-900/10">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dict} />
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
          {/* Projetos em destaque (Client Component) */}
          <FeaturedProjectsSection lang={lang} />
          
          <div className="mt-12 md:mt-20">
             {/* Renderização da lista vinda do GitHub - Fallback para [] garantido acima */}
             <ProjectSection projects={projects} lang={lang} dict={dict} />
          </div>
        </section>

        {/* ARTICLES SECTION */}
        <section id="articles" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12 bg-slate-50/30 dark:bg-transparent rounded-[3rem]">
          <FeaturedArticleSection lang={lang} dict={dict} />
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="mx-auto mb-24 w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
          <ContactSection lang={lang} dict={dict} />
        </section>

      </main>

      {/* FOOTER */}
      <Footer lang={lang} dict={dict} />
    </PageWrapper>
  );
}
