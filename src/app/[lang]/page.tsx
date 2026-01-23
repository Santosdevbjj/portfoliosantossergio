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
 * Revalida o conteúdo a cada 1 hora para capturar novos repositórios ou estrelas no GitHub.
 */
export const revalidate = 3600; 

/**
 * METADADOS DINÂMICOS (SEO Internacional 2026)
 * Alinhado com a Metadata API do Next.js 15.
 */
export async function generateMetadata(props: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isValidLocale(lang)) return {};

  const currentLang = lang as Locale;
  const dict = await getDictionary(currentLang);
  
  const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://portfoliosantossergio.vercel.app').replace(/\/$/, '');
  
  const pageTitle = dict.about?.headline ?? 'Data Engineering Specialist';
  // Limpeza de descrição para evitar caracteres especiais no HTML Head
  const pageDesc = (dict.about?.bio ?? 'Portfólio Profissional de Sérgio Santos').substring(0, 160).replace(/\n/g, ' ');
  
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
      images: [
        {
          url: `${baseUrl}/og-image-${currentLang}.png`,
          width: 1200,
          height: 630,
          alt: `Sérgio Santos | ${pageTitle}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Sérgio Santos | ${pageTitle}`,
      description: pageDesc,
    }
  };
}

/**
 * PÁGINA PRINCIPAL - SERVER COMPONENT
 * Implementa fetch de dados assíncrono e composição de seções.
 */
export default async function Page(props: PageProps<'/[lang]'>) {
  // Acesso assíncrono ao parâmetro de idioma (Next.js 15 Requirement)
  const { lang } = await props.params;
  
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /**
   * DATA FETCHING PARALELO
   * Executa a carga do dicionário e a API do GitHub simultaneamente.
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects(currentLang) 
  ]);

  return (
    <PageWrapper>
      <Navbar dict={dict} lang={currentLang} />

      {/* MAIN CONTAINER 
          overflow-x-hidden: Proteção crítica contra quebra de layout por animações laterais.
          antialiased: Melhora a renderização de fontes em telas de alta densidade (Retina).
      */}
      <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white antialiased transition-colors duration-500 dark:bg-[#020617]">
        
        {/* SEÇÃO HERO: Primeira dobra */}
        <HeroSection lang={currentLang} dict={dict} />

        {/* SEÇÃO SOBRE: Conteúdo centralizado */}
        <section id="about" className="mx-auto w-full max-w-7xl px-4 scroll-mt-20 sm:px-6 lg:px-8 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* SEÇÃO EXPERIÊNCIA: Fundo contrastante sutil para separar blocos */}
        <section id="experience" className="scroll-mt-20 bg-slate-50/50 py-12 dark:bg-slate-900/10 lg:py-24 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <ExperienceSection lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* ARTIGOS EM DESTAQUE: Autoridade técnica */}
        <section id="featured" className="mx-auto w-full max-w-7xl px-4 scroll-mt-20 sm:px-6 lg:px-8 lg:scroll-mt-32">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* PORTFÓLIO: Grid de projetos vindo do GitHub */}
        <section id="projects" className="py-12 scroll-mt-20 lg:py-24 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <ProjectSection projects={allProjects} lang={currentLang} dict={dict} />
          </div>
        </section>

        {/* CONTATO: Call to Action final */}
        <section id="contact" className="mx-auto mb-12 w-full max-w-7xl px-4 scroll-mt-20 sm:px-6 lg:mb-24 lg:px-8 lg:scroll-mt-32">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
