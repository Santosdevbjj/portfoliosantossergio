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
import { getDictionary, type Locale } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

/**
 * ISR (Incremental Static Regeneration)
 * Revalida o cache a cada 1 hora para refletir novos commits/projetos do GitHub.
 */
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * GENERATE METADATA
 * SEO dinâmico que adapta a "vitrine" do site para cada idioma.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  
  // Fallback seguro se o idioma for inválido
  const currentLang = (['pt', 'en', 'es'].includes(lang) ? lang : 'pt') as Locale;
  const dict = await getDictionary(currentLang);
  
  const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://portfoliosantossergio.vercel.app').replace(/\/$/, '');
  
  // Título dinâmico baseado no cargo definido no dicionário
  const pageTitle = dict.role || 'Data Specialist';
  const pageDesc = dict.headline || 'Especialista em Dados e Engenharia de Sistemas.';

  return {
    title: `Sérgio Santos | ${pageTitle}`,
    description: pageDesc,
    alternates: {
      canonical: `${baseUrl}/${currentLang}`,
      languages: {
        'pt': `${baseUrl}/pt`,
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'x-default': `${baseUrl}/pt`,
      },
    },
    openGraph: {
      title: `Sérgio Santos | ${pageTitle}`,
      description: pageDesc,
      url: `${baseUrl}/${currentLang}`,
      siteName: 'Sérgio Santos Portfolio',
      locale: currentLang === 'pt' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [`/og-image-${currentLang}.png`],
    },
  };
}

/**
 * PÁGINA PRINCIPAL (Server Component)
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  // Validação rigorosa de localidade
  if (!['pt', 'en', 'es'].includes(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /**
   * DATA PIPELINE
   * Busca paralela: Dicionário Local + API do GitHub.
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects(currentLang) 
  ]);

  return (
    <PageWrapper>
      {/* Navegação de Alta Fidelidade */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] transition-colors duration-500 antialiased">
        
        {/* HERO: O primeiro contato visual */}
        <HeroSection lang={currentLang} dict={dict} />

        {/* SOBRE: Storytelling e Autoridade Técnica */}
        <section id="about" className="mx-auto w-full max-w-7xl px-6 sm:px-10 scroll-mt-24 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* EXPERIÊNCIA: A prova real da senioridade bancária */}
        <section id="experience" className="mt-24 scroll-mt-24 bg-slate-50/40 dark:bg-slate-900/20 py-24 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
            <ExperienceSection lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* ARTIGOS: Liderança de pensamento (Winner DIO) */}
        <section id="featured" className="mx-auto w-full max-w-7xl px-6 sm:px-10 scroll-mt-24 py-24 lg:scroll-mt-32">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* PORTFÓLIO: Grid de projetos dinâmicos via GitHub API */}
        <section id="projects" className="scroll-mt-24 py-12 lg:py-24 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
            <ProjectSection projects={allProjects} lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* CONTATO: A conversão e links sociais */}
        <section id="contact" className="mx-auto mb-24 w-full max-w-7xl px-6 sm:px-10 scroll-mt-24 lg:scroll-mt-32">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* Footer com Sincronia de Idioma */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
