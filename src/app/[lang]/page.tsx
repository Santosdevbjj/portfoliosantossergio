// src/app/[lang]/page.tsx
import { getGitHubProjects } from '@/lib/github';
import { getDictionary } from '@/lib/get-dictionary';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { PortfolioGrid } from '@/components/PortfolioGrid'; // Ou ProjectSection conforme revisado
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { PageWrapper } from '@/components/PageWrapper';
import { i18n, type Locale } from '@/i18n-config';

// Revalida os dados do GitHub a cada 1 hora (ISR - Incremental Static Regeneration)
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * METADADOS DINÂMICOS (SEO Sênior)
 * Garante que o Google e Redes Sociais leiam o título correto por idioma.
 */
export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
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
 * PÁGINA PRINCIPAL
 * Renderizada no Servidor (Server Component) para SEO e Performance máxima.
 */
export default async function Page({ params }: PageProps) {
  // No Next.js 15, params deve ser aguardado (awaited)
  const { lang } = await params;
  
  // Proteção de rota contra idiomas não suportados
  if (!i18n.locales.includes(lang as Locale)) {
    notFound();
  }

  const currentLang = lang as Locale;

  /** * DATA FETCHING (Paralelizado para velocidade)
   * Buscamos o dicionário e os projetos do GitHub simultaneamente.
   */
  const [dict, allProjects] = await Promise.all([
    getDictionary(currentLang),
    getGitHubProjects()
  ]);

  return (
    <PageWrapper>
      {/* NAVBAR: Fornece navegação global. 
        O dicionário permite que "Sobre" vire "About" ou "Sobre Mí" instantaneamente.
      */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="flex flex-col w-full overflow-x-hidden min-h-screen">
        
        {/* 1. HERO: Impacto visual e proposta de valor imediata */}
        <section id="hero" className="relative">
          <HeroSection lang={currentLang} dict={dict} />
        </section>

        {/* 2. ABOUT: Prova social e trajetória (Bradesco + Tech) */}
        <section id="about" className="scroll-mt-24">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* 3. ARTICLES: Autoridade técnica e Thought Leadership */}
        <section id="articles" className="scroll-mt-24">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* 4. PROJECTS: Vitrine técnica com dados reais do GitHub */}
        <section id="projects" className="scroll-mt-24">
          <PortfolioGrid projects={allProjects} lang={currentLang} dict={dict} />
        </section>

        {/* 5. CONTACT: Call to Action final para recrutadores e parceiros */}
        <section id="contact" className="scroll-mt-24 pb-20">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* FOOTER: Encerramento com stack tecnológica e copyright */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
