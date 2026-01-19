// src/app/[lang]/page.tsx
import { getGitHubProjects } from '@/lib/github';
import { getDictionary } from '@/i18n-config'; // Caminho corrigido para consistência
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { PageWrapper } from '@/components/PageWrapper';
import { i18n, type Locale, isValidLocale } from '@/i18n-config';

// ISR: Revalida os dados do GitHub a cada 1 hora sem precisar de novo deploy
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO Sênior)
 * Ajusta o título na aba do navegador conforme o idioma selecionado.
 */
export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const dict = await getDictionary(lang as Locale);
  
  return {
    title: `Sérgio Santos | ${dict.about.headline.split('.')[0]}`,
    description: dict.about.bio.substring(0, 160),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'pt-BR': '/pt',
        'en-US': '/en',
        'es-ES': '/es',
      },
    },
  };
}

/**
 * PÁGINA PRINCIPAL - SERVER COMPONENT
 * Renderização de alto desempenho para SEO e acessibilidade.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  // Proteção de rota para idiomas não suportados
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /** * DATA FETCHING PARALELIZADO
   * Buscamos o dicionário local e os projetos remotos ao mesmo tempo.
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects()
  ]);

  return (
    <PageWrapper>
      {/* NAVBAR: Passa o dicionário para traduzir os links do menu */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="flex flex-col w-full overflow-x-hidden min-h-screen">
        
        {/* 1. HERO: Primeira impressão e Proposta de Valor */}
        <section id="hero" className="relative">
          <HeroSection lang={currentLang} dict={dict} />
        </section>

        {/* 2. ABOUT: Trajetória e Especialidades (Bradesco + Data Science) */}
        <section id="about" className="scroll-mt-24 lg:scroll-mt-32">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* 3. ARTICLES: Seção de autoridade (LinkedIn / Medium) */}
        <section id="articles" className="scroll-mt-24 lg:scroll-mt-32">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* 4. PROJECTS: Vitrine filtrável com dados reais do GitHub */}
        <section id="projects" className="scroll-mt-24 lg:scroll-mt-32">
          <PortfolioGrid projects={allProjects} lang={currentLang} dict={dict} />
        </section>

        {/* 5. CONTACT: Conversão final para o recrutador */}
        <section id="contact" className="scroll-mt-24 lg:scroll-mt-32 pb-20">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* FOOTER: Identidade final e links sociais */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
