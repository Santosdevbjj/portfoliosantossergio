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
// Importação alinhada com a nova arquitetura de dicionários
import { getDictionary, type Dictionary } from '@/lib/get-dictionary';
import { getGitHubProjects } from '@/lib/github';

/**
 * ISR (Incremental Static Regeneration)
 * Revalida o cache a cada 1 hora.
 */
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

type SupportedLangs = 'pt' | 'en' | 'es';

/**
 * GENERATE METADATA
 * SEO dinâmico otimizado para autoridade internacional.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (['pt', 'en', 'es'].includes(lang) ? lang : 'pt') as SupportedLangs;
  const dict = await getDictionary(currentLang);
  
  const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://portfoliosantossergio.vercel.app').replace(/\/$/, '');
  
  return {
    title: `Sérgio Santos | ${dict.role || 'Data Specialist'}`,
    description: dict.headline || 'Especialista em Dados e Engenharia de Sistemas.',
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
      title: `Sérgio Santos | ${dict.role}`,
      description: dict.headline,
      url: `${baseUrl}/${currentLang}`,
      siteName: 'Sérgio Santos Portfolio',
      locale: currentLang === 'pt' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [`/og-image-${currentLang}.png`],
    },
  };
}

/**
 * PÁGINA PRINCIPAL
 * Renderiza a arquitetura de autoridade baseada no Método Meigarom.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  if (!['pt', 'en', 'es'].includes(lang)) {
    notFound();
  }

  const currentLang = lang as SupportedLangs;

  // Busca paralela para máxima performance no Edge
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects(currentLang) 
  ]);

  return (
    <PageWrapper>
      {/* Navbar recebe o dicionário tipado */}
      <Navbar dict={dict as Dictionary} lang={currentLang} />

      <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] transition-colors duration-500 antialiased">
        
        {/* HERO: Badge de Especialista e CTA principal */}
        <HeroSection lang={currentLang} dict={dict} />

        {/* SOBRE: Métricas de Impacto (2.920h salvas) */}
        <section id="about" className="mx-auto w-full max-w-7xl px-6 sm:px-10 scroll-mt-24 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* TRAJETÓRIA: Foco em disponibilidade bancária 99.5% */}
        <section id="experience" className="mt-24 scroll-mt-24 bg-slate-50/40 dark:bg-slate-900/20 py-24 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
            <ExperienceSection lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* ARTIGOS: Prova social (Melhor do mês DIO) */}
        <section id="articles" className="mx-auto w-full max-w-7xl px-6 sm:px-10 scroll-mt-24 py-24 lg:scroll-mt-32">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* PORTFÓLIO: Grid técnico com filtragem por stack */}
        <section id="projects" className="scroll-mt-24 py-12 lg:py-24 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
            <ProjectSection projects={allProjects} lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* CONTATO: Lead gen para consultoria e parcerias */}
        <section id="contact" className="mx-auto mb-24 w-full max-w-7xl px-6 sm:px-10 scroll-mt-24 lg:scroll-mt-32">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
