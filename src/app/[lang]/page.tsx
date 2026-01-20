// src/app/[lang]/page.tsx
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
 * ISR: Revalida os dados do GitHub a cada 1 hora (3600 segundos)
 * Isso garante que novos projetos ou estrelas no GitHub apareçam sem novo deploy.
 */
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO Internacional)
 * Crucial para que recrutadores te achem em qualquer idioma.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  
  if (!isValidLocale(lang)) return {};

  const currentLang = lang as Locale;
  const dict = await getDictionary(currentLang);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app';
  
  // Título dinâmico baseado no headline do dicionário
  const pageTitle = dict.about?.headline?.split('.')[0] || 'Data & Systems Specialist';
  
  return {
    title: `Sérgio Santos | ${pageTitle}`,
    description: dict.about?.bio?.substring(0, 160) || 'Portfólio de Especialista em Dados e Sistemas Críticos',
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
      description: dict.about?.bio?.substring(0, 160),
      url: `${baseUrl}/${currentLang}`,
      siteName: 'Sérgio Santos Portfolio',
      locale: currentLang === 'pt' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`, // Recomendado ter uma imagem de preview na pasta public
          width: 1200,
          height: 630,
          alt: `Sérgio Santos | ${pageTitle}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Sérgio Santos | ${pageTitle}`,
      description: dict.about?.bio?.substring(0, 160),
    },
  };
}

/**
 * PÁGINA PRINCIPAL - SERVER COMPONENT
 * Renderiza a estrutura completa injetando os dados de internacionalização.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  // Validação estrita de idioma (Segurança e SEO)
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /** * DATA FETCHING PARALELIZADO
   * Executa a busca do dicionário e projetos do GitHub simultaneamente para performance máxima.
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects()
  ]);

  return (
    <PageWrapper>
      {/* NAVBAR: Injeta dicionário para links de navegação traduzidos */}
      <Navbar dict={dict} lang={currentLang} />

      {/* Container Principal com proteção contra overflow lateral (comum em mobile) */}
      <main className="flex min-h-screen w-full flex-col overflow-x-hidden relative">
        
        {/* 1. HERO: Primeira dobra de impacto */}
        <section id="hero" className="w-full">
          <HeroSection lang={currentLang} dict={dict} />
        </section>

        {/* 2. ABOUT: Storytelling profissional */}
        <section id="about" className="scroll-mt-20 lg:scroll-mt-32 w-full">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* 3. EXPERIENCE: Seção de Autoridade (Métricas de Sucesso) */}
        <section id="experience" className="scroll-mt-20 lg:scroll-mt-32 w-full">
          <ExperienceSection lang={currentLang} dict={dict} />
        </section>

        {/* 4. ARTICLES: Publicações Técnicas e Prêmios */}
        <section id="articles" className="scroll-mt-20 lg:scroll-mt-32 w-full">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* 5. PROJECTS: Galeria de Projetos via GitHub API */}
        <section id="projects" className="scroll-mt-20 lg:scroll-mt-32 w-full">
          <ProjectSection projects={allProjects} lang={currentLang} dict={dict} />
        </section>

        {/* 6. CONTACT: Conversão Final */}
        <section id="contact" className="scroll-mt-20 pb-20 lg:scroll-mt-32 w-full">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* FOOTER: Rodapé com créditos e links sociais */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
