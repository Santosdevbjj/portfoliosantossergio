// src/app/[lang]/page.tsx
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
import FeaturedProjectsSection from '@/components/featured/FeaturedProjectsSection';

import { getDictionary } from '@/lib/get-dictionary';
import { getGitHubProjects } from '@/lib/github';
import { i18n, type Locale } from '@/i18n-config';

/** Tipagem de Props para Next.js 16 */
interface PageProps {
  params: Promise<{ lang: string }>;
}

/** * Tipagem Flexível do Dicionário 
 * Adicionamos chaves opcionais para 'nav' e 'common' para bater com o que a Navbar exige
 */
interface Dictionary {
  role: string;
  headline: string;
  nav?: any;
  common?: any;
  [key: string]: any;
}

function normalizeDictionary(d: any): Dictionary {
  return {
    ...d, // Espalha primeiro o dicionário real para preservar 'nav', 'common', etc.
    role: d?.role ?? 'Data & Systems Specialist',
    headline: d?.headline ?? 'Especialista em Dados e Engenharia de Software.',
  };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const lang = (i18n.locales.includes(rawLang as any) ? rawLang : i18n.defaultLocale) as Locale;

  const dict = normalizeDictionary(await getDictionary(lang));
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app').replace(/\/$/, '');

  return {
    title: `Sérgio Santos | ${dict.role}`,
    description: dict.headline,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: { 
        pt: `${baseUrl}/pt`, 
        en: `${baseUrl}/en`, 
        es: `${baseUrl}/es`, 
        'x-default': `${baseUrl}/pt` 
      },
    },
    openGraph: {
      title: `Sérgio Santos | ${dict.role}`,
      description: dict.headline,
      url: `${baseUrl}/${lang}`,
      locale: lang === 'pt' ? 'pt_BR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'profile',
      images: [`/og-image-${lang}.png`],
    },
  };
}

export default async function Page(props: PageProps) {
  const { lang: rawLang } = await props.params;
  
  if (!i18n.locales.includes(rawLang as any)) notFound();
  const lang = rawLang as Locale;

  const [dictRaw, projects] = await Promise.all([
    getDictionary(lang),
    getGitHubProjects(lang),
  ]);

  const dict = normalizeDictionary(dictRaw);

  return (
    <PageWrapper lang={lang}>
      <Navbar lang={lang} dict={dict} />
      
      <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        <HeroSection lang={lang} dict={dict} />
        
        <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12">
          <AboutSection lang={lang} dict={dict} />
        </section>

        <section id="experience" className="mt-24 scroll-mt-24 bg-slate-50/40 py-24 dark:bg-slate-900/20 lg:scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dict} />
          </div>
        </section>

        <section id="projects" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
          <FeaturedProjectsSection lang={lang} />
        </section>

        <section className="py-12 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ProjectSection projects={projects} lang={lang} dict={dict} />
          </div>
        </section>

        <section id="articles" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
          <FeaturedArticleSection lang={lang} dict={dict} />
        </section>

        <section id="contact" className="mx-auto mb-24 w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12">
          <ContactSection lang={lang} dict={dict} />
        </section>
      </main>

      <Footer lang={lang} dict={dict} />
    </PageWrapper>
  );
}
