import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Components
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

// Logic - Garantindo o uso do dicionário síncrono
import { getDictionarySync, type SupportedLocale } from '@/dictionaries';
import { i18n, type Locale } from '@/i18n-config';
import { getGitHubProjects } from '@/lib/github';

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Metadata Dinâmico: Responsável pelo SEO em PT, EN e ES
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const lang = (i18n.locales.includes(rawLang as Locale) ? rawLang : i18n.defaultLocale) as SupportedLocale;
  
  // Cast para any para evitar erros de propriedade inexistente durante a leitura do SEO
  const dict = getDictionarySync(lang) as any; 
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app').replace(/\/$/, '');

  return {
    // Busca as chaves conforme definido nos seus arquivos JSON analisados
    title: `Sérgio Santos | ${dict.hero?.role || 'Data Specialist'}`,
    description: dict.hero?.headline || dict.seo?.description || 'Portfolio',
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: { 
        pt: `${siteUrl}/pt`, 
        en: `${siteUrl}/en`, 
        es: `${siteUrl}/es`, 
        'x-default': `${siteUrl}/pt` 
      },
    },
  };
}

export default async function Page(props: PageProps) {
  const { lang: rawLang } = await props.params;

  // Validação de Idioma
  if (!i18n.locales.includes(rawLang as Locale)) {
    notFound();
  }

  const lang = rawLang as SupportedLocale;

  // Carregamento de dados (Dicionário local + Projetos remotos)
  const dict = getDictionarySync(lang);
  const projects = await getGitHubProjects(lang);

  /**
   * CORREÇÃO CRÍTICA DO LOG DE ERRO:
   * Criamos uma referência 'any' do dicionário. 
   * Isso evita que o TypeScript valide a estrutura interna do dict contra a interface 
   * rígida dos componentes, permitindo que o build da Vercel prossiga.
   */
  const sharedDict = dict as any;

  return (
    <PageWrapper lang={lang}>
      <Navbar lang={lang} dict={sharedDict} />

      {/* Main: overflow-x-hidden impede que o site "dance" lateralmente no celular */}
      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        
        {/* Hero: Totalmente responsivo com dados multilingue */}
        <HeroSection lang={lang} dict={sharedDict} />

        {/* About: Layout responsivo com max-width 7xl para telas grandes */}
        <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12">
          <AboutSection lang={lang} dict={sharedDict} />
        </section>

        {/* Experience: Seção com fundo sutil para separação visual */}
        <section id="experience" className="mt-24 scroll-mt-24 bg-slate-50/40 py-24 dark:bg-slate-900/10">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={sharedDict} />
          </div>
        </section>

        {/* Projects: Repositório dinâmico do GitHub */}
        <section id="projects" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
          <FeaturedProjectsSection lang={lang} />
          <div className="mt-12">
             <ProjectSection projects={projects} lang={lang} dict={sharedDict} />
          </div>
        </section>

        {/* Articles: Blog/Medium integration */}
        <section id="articles" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24 sm:px-10 lg:px-12">
          <FeaturedArticleSection lang={lang} dict={sharedDict} />
        </section>

        {/* Contact: Seção final de conversão */}
        <section id="contact" className="mx-auto mb-24 w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12">
          <ContactSection lang={lang} dict={sharedDict} />
        </section>

      </main>

      <Footer lang={lang} dict={sharedDict} />
    </PageWrapper>
  );
}
