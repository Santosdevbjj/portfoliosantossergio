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

// Revalida os dados do GitHub a cada 1 hora (ISR)
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * PÁGINA PRINCIPAL - NEXT.JS 15
 * Implementação dinâmica multilingue (PT, EN, ES) com foco em
 * performance de carregamento e SEO de missão crítica.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  // Validação de Idioma Seguro para evitar rotas inexistentes
  const validLangs: Locale[] = ['pt', 'en', 'es'];
  if (!validLangs.includes(lang as Locale)) {
    return notFound();
  }

  const currentLang = lang as Locale;

  /** * CARREGAMENTO DO DICIONÁRIO DINÂMICO
   * Aqui injetamos os textos de "Sobre Mim" e outros metadados
   * definidos nos arquivos JSON (pt.json, en.json, es.json).
   */
  const dict = await getDictionary(currentLang);

  // Busca assíncrona dos projetos do GitHub (Engenharia de Dados)
  const allProjects = await getGitHubProjects();

  return (
    <PageWrapper>
      {/* Navegação Global com injeção de idioma */}
      <Navbar lang={currentLang} />

      <main className="flex flex-col w-full">
        {/* 1. Hero: Impacto Imediato e Identidade Visual */}
        <HeroSection lang={currentLang} dict={dict} />

        {/* 2. Sobre: Narrativa de 15 anos de Bradesco e Data Science */}
        <div id="about">
          {/* Passamos o 'dict' para que o componente Sobre acesse os novos textos */}
          <AboutSection lang={currentLang} dict={dict} />
        </div>

        {/* 3. Destaque: Autoridade Técnica (Artigos e Papers) */}
        <FeaturedArticleSection lang={currentLang} dict={dict} />

        {/* 4. Portfolio: Grid dinâmica de projetos reais */}
        <PortfolioGrid projects={allProjects} lang={currentLang} dict={dict} />

        {/* 5. Contato: Foco em conversão de leads e parcerias */}
        <ContactSection lang={currentLang} dict={dict} />
      </main>

      {/* Rodapé Corporativo */}
      <Footer lang={currentLang} dict={dict} />
    </PageWrapper>
  );
}
