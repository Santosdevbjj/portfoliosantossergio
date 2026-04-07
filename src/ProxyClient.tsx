'use client'

import { notFound } from "next/navigation";
import type { JSX } from "react";
import type { Locale, Dictionary } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

import PageWrapper from "@/components/PageWrapper";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import FeaturedProjectsSection from "@/components/featured/FeaturedProjectsSection";
import ProjectSection from "@/components/ProjectSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

/**
 * PROXY CLIENT COMPONENT - VERSÃO 2026
 * -----------------------------------------------------------------------------
 * ✔ Suporte: React 19, TS 6.0, Next.js 16 (Turbopack)
 * ✔ Fix: Passagem da prop 'contact' para o Navbar (Resolução do erro de Build)
 * ✔ Fix: Validação estrita de locale
 */

interface ProxyClientProps {
  readonly lang: Locale;
  readonly initialProjects: readonly ProjectDomain[];
  readonly dictionary: Dictionary;
}

export default function ProxyClient({
  lang,
  initialProjects,
  dictionary,
}: ProxyClientProps): JSX.Element {
  
  // 1. Validação de segurança dos dados do dicionário
  if (!dictionary?.meta?.locale) {
    notFound();
  }

  const locale = dictionary.meta.locale;

  // 2. Garante que o conteúdo carregado corresponde à URL
  if (locale !== lang) {
    notFound();
  }

  return (
    <PageWrapper common={dictionary.common}>
      {/* CORREÇÃO CRÍTICA: 
          Adicionado 'contact={dictionary.contact}' para satisfazer a interface NavbarProps 
      */}
      <Navbar 
        lang={locale} 
        common={dictionary.common} 
        contact={dictionary.contact} 
      />

      <main 
        id="main-content" 
        className="relative flex w-full flex-col overflow-x-hidden bg-white antialiased dark:bg-[#020617]"
      >
        <HeroSection dictionary={dictionary} />
        
        <AboutSection dict={dictionary.about} lang={locale} />
        
        <ExperienceSection experience={dictionary.experience} />
        
        <FeaturedProjectsSection lang={locale} dict={dictionary} />
        
        <ProjectSection 
          projects={initialProjects} 
          lang={locale} 
          dict={dictionary} 
        />
        
        <FeaturedArticleSection 
          articles={dictionary.articles} 
          common={dictionary.common} 
        />
        
        <ContactSection 
          contact={dictionary.contact} 
          common={dictionary.common} 
          locale={locale} 
        />
      </main>

      <Footer 
        lang={locale} 
        common={dictionary.common} 
        contact={dictionary.contact} 
        articles={dictionary.articles} 
      />
    </PageWrapper>
  );
}
