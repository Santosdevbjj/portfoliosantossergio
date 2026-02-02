'use client';

import { useEffect, useMemo, useState } from 'react';
import { notFound } from 'next/navigation';

// UI
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { ProjectSection } from '@/components/ProjectSection';
import { FeaturedProjectsSection } from '@/components/featured/FeaturedProjectsSection';

// Infra
import { getDictionarySync, type SupportedLocale } from '@/dictionaries';
import { getGitHubProjects } from '@/lib/github';
import type { Project } from '@/domain/projects';

interface ProxyClientProps {
  readonly lang: SupportedLocale;
}

export default function ProxyClient({ lang }: ProxyClientProps) {
  const supportedLocales: readonly SupportedLocale[] = ['pt', 'en', 'es'];

  if (!supportedLocales.includes(lang)) {
    notFound();
  }

  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const dict = useMemo(() => getDictionarySync(lang), [lang]);

  useEffect(() => {
    setMounted(true);

    async function loadData() {
      try {
        const data = await getGitHubProjects(lang);
        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
      }
    }

    loadData();
  }, [lang]);

  if (!mounted) {
    return (
      <div className="min-h-screen w-full animate-pulse bg-white dark:bg-[#020617]" />
    );
  }

  const sectionIds = [
    'hero',
    'about',
    'experience',
    'projects',
    'articles',
    'contact',
  ] as const;

  return (
    <PageWrapper lang={lang} sectionIds={sectionIds}>
      <Navbar lang={lang} dict={dict} />

      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        <section id="hero">
          <HeroSection lang={lang} dict={dict} />
        </section>

        <section
          id="about"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-10 lg:px-12"
        >
          <AboutSection lang={lang} dict={dict} />
        </section>

        <section
          id="experience"
          className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dict} />
          </div>
        </section>

        <section
          id="projects"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12"
        >
          {/* Projetos curados (editorial / SEO) */}
          <FeaturedProjectsSection lang={lang} dict={dict} />

          {/* Projetos dinâmicos (GitHub) */}
          <div className="mt-12 border-t pt-12 dark:border-slate-800">
            <ProjectSection
              projects={projects}
              lang={lang}
              dict={dict}
            />
          </div>
        </section>

        <section
          id="articles"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12"
        >
          <FeaturedArticleSection lang={lang} dict={dict} />
        </section>

        <section
          id="contact"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12"
        >
          <ContactSection lang={lang} dict={dict} />
        </section>
      </main>

      <Footer lang={lang} dict={dict} />
    </PageWrapper>
  );
}
