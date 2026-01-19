// src/app/[lang]/page.tsx
import { getGitHubProjects } from '@/lib/github';
import { getDictionary } from '@/lib/get-dictionary';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { PageWrapper } from '@/components/PageWrapper';
import type { Locale } from '@/i18n-config';

// Revalida os dados do GitHub a cada 1 hora (Incremental Static Regeneration)
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * PÁGINA PRINCIPAL - NEXT.JS 15
 * Implementação dinâmica multilingue (PT, EN, ES) com foco em
 * performance de carregamento e governança de dados.
 */
export default async function Page({ params }: PageProps) {
  // No Next.js 15, params é uma Promise e deve ser aguardada
  const { lang } = await params;
  
  // Validação de Idioma Seguro
  const validLangs: Locale[] = ['pt', 'en', 'es'];
  if (!validLangs.includes(lang as Locale)) {
    return notFound();
  }

  const currentLang = lang as Locale;

  /** * CARREGAMENTO DOS DICIONÁRIOS
   * Injeta as traduções de alto nível para todos os componentes.
   */
  const dict = await getDictionary(currentLang);

  /**
   * CARREGAMENTO DE DADOS EXTERNOS
   * Busca projetos reais do GitHub para demonstrar atividade técnica.
   */
  const allProjects = await getGitHubProjects();

  return (
    <PageWrapper>
      {/* NAVBAR: Agora recebe o dicionário completo para tradução 
        automática dos itens de menu (Sobre, Projetos, etc.)
      */}
      <Navbar dict={dict} lang={currentLang} />

      <main className="flex flex-col w-full overflow-x-hidden">
        
        {/* 1. HERO SECTION: O primeiro contato do recrutador */}
        <section id="hero">
          <HeroSection lang={currentLang} dict={dict} />
        </section>

        {/* 2. ABOUT: Narrativa sênior (15+ anos Bradesco/Tech) */}
        <section id="about" className="scroll-mt-20">
          <AboutSection lang={currentLang} dict={dict} />
        </section>

        {/* 3. ARTICLES: Demonstração de autoridade e liderança técnica */}
        <section id="articles" className="scroll-mt-20">
          <FeaturedArticleSection lang={currentLang} dict={dict} />
        </section>

        {/* 4. PORTFOLIO: Vitrine de engenharia e ciência de dados */}
        <section id="projects" className="scroll-mt-20">
          <PortfolioGrid projects={allProjects} lang={currentLang} dict={dict} />
        </section>

        {/* 5. CONTACT: Conversão e parcerias estratégicas */}
        <section id="contact" className="scroll-mt-20">
          <ContactSection lang={currentLang} dict={dict} />
        </section>
        
      </main>

      {/* FOOTER: Rodapé institucional e links sociais */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
