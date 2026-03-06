import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */
import type { Locale, Dictionary } from "@/types/dictionary";

/* -------------------------------------------------------------------------- */
/* SERVICES                                                                   */
/* -------------------------------------------------------------------------- */
import { getServerDictionary } from "@/lib/getServerDictionary";
import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales";

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */
import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedProjectsSection from "@/components/featured/FeaturedProjectsSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";

/* -------------------------------------------------------------------------- */
/* INTERFACES                                                                 */
/* -------------------------------------------------------------------------- */
interface PageProps {
  params: Promise<{ lang: string }>;
}

/* -------------------------------------------------------------------------- */
/* PERFORMANCE CONFIG                                                          */
/* -------------------------------------------------------------------------- */
export const dynamic = "force-static";
export const revalidate = 60;

/* -------------------------------------------------------------------------- */
/* STATIC PARAMS                                                              */
/* -------------------------------------------------------------------------- */
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

/* -------------------------------------------------------------------------- */
/* VIEWPORT                                                                   */
/* -------------------------------------------------------------------------- */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

/* -------------------------------------------------------------------------- */
/* METADATA                                                                   */
/* -------------------------------------------------------------------------- */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang;

  if (!lang || !isValidLocale(lang)) {
    return {};
  }

  try {
    const dict: Dictionary = await getServerDictionary(lang as Locale);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

    return {
      title: dict.seo.pages.home.title,
      description: dict.seo.pages.home.description,
      verification: {
        google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0",
      },
      alternates: {
        canonical: `${siteUrl}/${lang}`,
        languages: {
          "pt-BR": `${siteUrl}/pt-BR`,
          "en-US": `${siteUrl}/en-US`,
          "es-ES": `${siteUrl}/es-ES`,
          "es-AR": `${siteUrl}/es-AR`,
          "es-MX": `${siteUrl}/es-MX`,
        },
      },
    };
  } catch {
    return {
      title: "Sérgio Santos",
    };
  }
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */
export default async function HomePage(props: PageProps) {
  const params = await props.params;
  const rawLang = params.lang;

  // Validação do Idioma
  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;

  // Carregamento do Dicionário
  const dict = await getServerDictionary(lang).catch((error) => {
    console.error("Critical: Error loading dictionary:", error);
    return null;
  });

  if (!dict) {
    notFound();
  }

  // Garantia de segurança para iteração de projetos (evita erro "is not iterable")
  const featuredProjects = Array.isArray(dict.projects?.featuredProjects) 
    ? dict.projects.featuredProjects 
    : [];

  return (
    <ProxyPage lang={lang}>
      <main className="flex flex-col min-h-screen">
        
        {/* HERO */}
        <HeroSection dictionary={dict} />

        {/* ABOUT */}
        <AboutSection dict={dict.about} />

        {/* FEATURED PROJECTS */}
        {featuredProjects.length > 0 ? (
          <FeaturedProjectsSection lang={lang} dict={dict} />
        ) : (
          <section className="py-20 text-center bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-xl mx-auto px-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {dict.states.emptyProjects.title}
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {dict.states.emptyProjects.description}
              </p>
            </div>
          </section>
        )}

        {/* ARTICLES */}
        <FeaturedArticleSection articles={dict.articles} common={dict.common} />

        {/* FINAL CTA - Banner de Alta Conversão */}
        <section className="py-28 px-6 text-center bg-slate-950 relative overflow-hidden">
          {/* Efeito visual de fundo */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase italic leading-[0.9]">
              {dict.contact.ctaTitle || "Vamos construir algo juntos?"}
            </h2>

            <p className="text-lg text-slate-400 font-medium">
              {dict.contact.subtitle}
            </p>

            <div className="pt-4">
              <a
                href={`mailto:${dict.common.email}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  bg-white
                  text-slate-950
                  px-12
                  py-5
                  rounded-xl
                  font-black
                  uppercase
                  tracking-widest
                  text-xs
                  hover:bg-blue-50
                  hover:scale-105
                  transition-all
                  active:scale-95
                  shadow-[0_20px_50px_rgba(255,255,255,0.1)]
                "
              >
                {dict.contact.buttonText || "Entrar em Contato"}
              </a>
            </div>
            
            {/* Meta info discreta */}
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold">
              {dict.meta.description}
            </p>
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
