import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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
import { getDictionarySync, type SupportedLocale } from '@/dictionaries';
import { i18n, type Locale } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const lang = (i18n.locales.includes(rawLang as Locale) ? rawLang : i18n.defaultLocale) as SupportedLocale;
  const dict = getDictionarySync(lang); 
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app').replace(/\/$/, '');

  return {
    title: dict.seo.siteName,
    description: dict.seo.description,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: { pt: `${siteUrl}/pt`, en: `${siteUrl}/en`, es: `${siteUrl}/es`, 'x-default': `${siteUrl}/pt` },
    },
  };
}

export default async function Page(props: PageProps) {
  const { lang: rawLang } = await props.params;
  if (!i18n.locales.includes(rawLang as Locale)) notFound();
  
  const lang = rawLang as SupportedLocale;
  const dict = getDictionarySync(lang);
  const projects = await getGitHubProjects(lang);

  return (
    <PageWrapper lang={lang}>
      <Navbar lang={lang} dict={dict} />
      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        <HeroSection lang={lang} dict={dict} />
        
        <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12">
          <AboutSection lang={lang} dict={dict} />
        </section>

        <section id="experience" className="mt-24 scroll-mt-24 bg-slate-50/40 py-24 dark:bg-slate-900/10">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dict} />
          </div>
        </section>

        <section id="projects" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
          <FeaturedProjectsSection lang={lang} />
          <div className="mt-12">
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
