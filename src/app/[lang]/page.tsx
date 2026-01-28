'use client'; // Aplicando a Solution 1: Controle total via Client Side para evitar mismatch

import { useState, useEffect, Suspense } from 'react';
import { notFound } from 'next/navigation';

// Componentes (Importados normalmente, mas o controle de render é via isClient)
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { ProjectSection } from '@/components/ProjectSection';
import FeaturedProjectsSection from '@/components/featured/FeaturedProjectsSection';

// Logic & i18n
import { getDictionarySync, type SupportedLocale } from '@/dictionaries';
import { i18n } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';
import type { Project } from '@/domain/projects';

interface PageProps {
  params: { lang: string }; // No 'use client', params é passado de forma direta ou via use()
}

export default function Page({ params }: PageProps) {
  // Solução 1 da sua documentação: Estado de hidratação
  const [isClient, setIsClient] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const lang = params.lang as SupportedLocale;

  useEffect(() => {
    // Marca que a hidratação terminou
    setIsClient(true);

    // Solução para FUNCTION_INVOCATION_TIMEOUT: Busca dados no cliente
    // Isso evita que a Vercel trave esperando o GitHub no servidor
    async function loadData() {
      try {
        const data = await getGitHubProjects(lang);
        setProjects(data || []);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
      }
    }
    loadData();
  }, [lang]);

  // Validação de segurança para o idioma
  if (!i18n.locales.includes(lang as any)) {
    notFound();
  }

  const dict = getDictionarySync(lang);
  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact'];

  // Enquanto não hidratou, renderizamos uma casca estática idêntica (ou null)
  // Isso mata o erro de "Text content does not match"
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#020617]" />
    );
  }

  return (
    <div suppressHydrationWarning>
      <PageWrapper lang={lang} sectionIds={sectionIds}>
        <Navbar lang={lang} dict={dict} />
        
        <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
          
          {/* Hero: Conteúdo Crítico */}
          <section id="hero" className="scroll-mt-0">
            <HeroSection lang={lang} dict={dict} />
          </section>
          
          {/* About: Trajetória */}
          <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12 py-12 md:py-24">
            <AboutSection lang={lang} dict={dict} />
          </section>

          {/* Experience: Bradesco & Consultoria */}
          <section id="experience" className="scroll-mt-24 bg-slate-50/40 py-24 dark:bg-slate-900/10">
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
              <ExperienceSection lang={lang} dict={dict} />
            </div>
          </section>

          {/* Projects: Onde o Timeout e o Mismatch aconteciam */}
          <section id="projects" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
            <Suspense fallback={<div className="h-64 animate-pulse bg-slate-100" />}>
              <FeaturedProjectsSection lang={lang} />
            </Suspense>
            
            <div className="mt-12 md:mt-20">
               <ProjectSection projects={projects} lang={lang} dict={dict} />
            </div>
          </section>

          {/* Articles */}
          <section id="articles" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12 bg-slate-50/30 dark:bg-transparent rounded-[3rem]">
            <FeaturedArticleSection lang={lang} dict={dict} />
          </section>

          {/* Contact */}
          <section id="contact" className="mx-auto mb-24 w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
            <ContactSection lang={lang} dict={dict} />
          </section>

        </main>

        <Footer lang={lang} dict={dict} />
      </PageWrapper>
    </div>
  );
}
