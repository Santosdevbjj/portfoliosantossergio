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
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface PageProps {
  params: { lang: string };
}

/* -------------------------------------------------------------------------- */
/* PERFORMANCE CONFIG                                                         */
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

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {

  const lang = params.lang;

  if (!lang || !isValidLocale(lang)) {
    return {};
  }

  try {

    const dict: Dictionary = await getServerDictionary(lang as Locale);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://portfoliosantossergio.vercel.app";

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

export default async function HomePage({ params }: PageProps) {

  const rawLang = params.lang;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;

  const dict = await getServerDictionary(lang).catch((error) => {

    console.error("Critical: Error loading dictionary:", error);
    return null;

  });

  if (!dict) {
    notFound();
  }

  const featuredProjects = dict.projects?.featuredProjects ?? [];

  return (

    <ProxyPage lang={lang}>

      <main className="flex flex-col">

        {/* HERO */}
        <HeroSection dictionary={dict} />

        {/* ABOUT */}
        <AboutSection dict={dict} />

        {/* FEATURED PROJECTS */}
        {featuredProjects.length > 0 ? (

          <FeaturedProjectsSection
            lang={lang}
            dict={dict}
          />

        ) : (

          <section className="py-20 text-center">

            <h2 className="text-xl font-semibold">
              {dict.states.emptyProjects.title}
            </h2>

            <p className="opacity-70">
              {dict.states.emptyProjects.description}
            </p>

          </section>

        )}

        {/* ARTICLES */}
        <FeaturedArticleSection dict={dict} />

        {/* FINAL CTA */}
        <section className="py-28 px-6 text-center bg-gradient-to-b from-slate-950 to-black">

          <div className="max-w-3xl mx-auto space-y-8">

            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {dict.contact.ctaTitle ?? "Vamos Conversar?"}
            </h2>

            <p className="text-slate-300">
              {dict.contact.subtitle}
            </p>

            <a
              href={`mailto:${dict.common.email}`}
              className="
                inline-flex
                items-center
                justify-center
                bg-white
                text-slate-950
                px-10
                py-5
                rounded-xl
                font-black
                uppercase
                tracking-widest
                text-[11px]
                hover:bg-slate-100
                transition-transform
                active:scale-95
                shadow-xl
              "
            >
              {dict.contact.buttonText ?? "Entrar em Contato"}
            </a>

          </div>

        </section>

      </main>

    </ProxyPage>

  );

}
