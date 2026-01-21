import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { ProjectSection } from '@/components/ProjectSection';
import { getDictionary, isValidLocale, type Locale } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

/**
 * ISR (Incremental Static Regeneration)
 * Otimização: Revalida o conteúdo a cada 1 hora para manter os projetos do GitHub atualizados.
 */
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO Internacional)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const currentLang = lang as Locale;
  const dict = await getDictionary(currentLang);
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app').replace(/\/$/, '');
  
  const pageTitle = dict.about?.headline || 'Data & Critical Systems Specialist';
  const pageDesc = dict.about?.bio?.substring(0, 160) || 'Portfólio Profissional de Sérgio Santos';
  
  return {
    title: `Sérgio Santos | ${pageTitle}`,
    description: pageDesc,
    alternates: {
      canonical: `${baseUrl}/${currentLang}`,
      languages: {
        'pt': `${baseUrl}/pt`,
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
      },
    },
    openGraph: {
      title: `Sérgio Santos | ${pageTitle}`,
      description: pageDesc,
      url: `${baseUrl}/${currentLang}`,
      siteName: 'Sérgio Santos Portfolio',
      locale: currentLang === 'pt' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image-${currentLang}.png`,
          width: 1200,
          height: 630,
          alt: `Sérgio Santos | ${pageTitle}`,
        },
      ],
    },
  };
}

/**
 * PÁGINA PRINCIPAL - NEXT.JS 15 SERVER COMPONENT
 * Orquestra a composição da SPA com injeção de i18n e dados do GitHub.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  // FETCH PARALELO: Carrega o dicionário e os projetos do GitHub simultaneamente
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects()
  ]);

  return (
    <PageWrapper>
      <Navbar dict={dict} lang={currentLang} />

      <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white antialiased transition-colors duration-500 dark:bg-[#020617]">
        
        {/* HERO SECTION */}
        <HeroSection lang={currentLang} dict={dict} />

        {/* ABOUT SECTION */}
        <section id="about" className="mx-auto w-full max-w-7xl px-4 scroll-mt-20 sm:px-6 lg:px-8 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="scroll-mt-20 bg-slate-50/50 py-12 dark:bg-slate-900/10 lg:py-24 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <ExperienceSection lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* FEATURED ARTICLES */}
        <section id="featured" className="mx-auto w-full max-w-7xl px-4 scroll-mt-20 sm:px-6 lg:px-8 lg:scroll-mt-32">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-12 scroll-mt-20 lg:py-24 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <ProjectSection projects={allProjects} lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="mx-auto mb-12 w-full max-w-7xl px-4 scroll-mt-20 sm:px-6 lg:mb-24 lg:px-8 lg:scroll-mt-32">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
