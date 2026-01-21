import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectSection } from '@/components/ProjectSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { getDictionary, isValidLocale, type Locale } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

/**
 * ISR (Incremental Static Regeneration)
 * Otimização: Revalida o conteúdo a cada 1 hora para manter os projetos do GitHub atualizados
 * sem onerar o tempo de carregamento para o usuário.
 */
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO Internacional de Alta Autoridade)
 * Implementa lógica para extrair títulos dinâmicos baseados no dicionário carregado.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const currentLang = lang as Locale;
  const dict = await getDictionary(currentLang);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app';
  
  // Extrai o headline do dicionário para compor o título SEO
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
          url: `${baseUrl}/og-image-${currentLang}.png`, // Puxa a OG Image específica do idioma
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
 * Orquestra a composição da Single Page Application (SPA) com injeção de i18n.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  // Segurança: Validação de idioma na borda
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /** * FETCH PARALELO (Optimization)
   * Carrega simultaneamente o dicionário local e os dados da API do GitHub.
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects()
  ]);

  return (
    <PageWrapper>
      {/* Navegação Global com injeção de Dicionário */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="flex min-h-screen w-full flex-col overflow-x-hidden relative bg-white dark:bg-[#020617] transition-colors duration-500 antialiased">
        
        {/* HERO SECTION - Landing de Impacto com suporte a i18n */}
        <HeroSection lang={currentLang} dict={dict} />

        {/* ESTRUTURA DE SEÇÕES COM SUPORTE A ANCORAGEM (Scroll Margin)
            O scroll-mt garante que ao clicar no menu, a Navbar não cubra o título da seção.
        */}
        <section id="about" className="scroll-mt-20 lg:scroll-mt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        <section id="experience" className="scroll-mt-20 lg:scroll-mt-32 bg-slate-50/50 dark:bg-slate-900/10 py-12 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <ExperienceSection lang={currentLang} dict={dict} />
          </div>
        </section>

        <section id="featured" className="scroll-mt-20 lg:scroll-mt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        <section id="projects" className="scroll-mt-20 lg:scroll-mt-32 py-12 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <ProjectSection projects={allProjects} lang={currentLang} dict={dict} />
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 lg:scroll-mt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-12 lg:mb-24">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* FOOTER - Injeção dinâmica para consistência global */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
