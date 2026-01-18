// src/app/[lang]/page.tsx
import { getGitHubProjects } from '@/lib/github';
import { translations } from '@/constants/translations';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { PageWrapper } from '@/components/PageWrapper';

// Revalida os dados do GitHub a cada 1 hora
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * PAGE PRINCIPAL
 * Esta página compõe todas as seções do portfólio utilizando os componentes
 * modulares que seguem a estratégia de autoridade e impacto.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  
  // Validação de Idioma Seguro
  const validLangs = ['pt', 'en', 'es'] as const;
  const currentLang = (validLangs.includes(lang as any) ? lang : 'pt') as keyof typeof translations;

  // Carrega as traduções
  const t = translations[currentLang];
  if (!t) return notFound();

  // Busca projetos do GitHub com filtro de tópicos integrado na lib
  const allProjects = await getGitHubProjects();

  return (
    <PageWrapper>
      {/* Navegação Global */}
      <Navbar lang={currentLang} />

      <main className="flex flex-col w-full">
        {/* 1. Hero: Impacto Imediato e Headline Luiz Café */}
        <HeroSection lang={currentLang} />

        {/* 2. Sobre: Narrativa de 15 anos e Framework Meigarom */}
        <div id="about">
          <AboutSection lang={currentLang} />
        </div>

        {/* 3. Destaque: Artigo Premiado (Autoridade Técnica) */}
        <FeaturedArticleSection lang={currentLang} />

        {/* 4. Grid de Projetos: O motor de busca e ordenação 1 a 17 */}
        <PortfolioGrid projects={allProjects} lang={currentLang} />

        {/* 5. Contato: Conversão de Recrutadores */}
        <ContactSection lang={currentLang} />
      </main>

      {/* Rodapé Profissional */}
      <Footer lang={currentLang} />
    </PageWrapper>
  );
}
