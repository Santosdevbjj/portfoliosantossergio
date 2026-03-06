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
  params: {
    lang: string;
  };
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

  const rawLang = params?.lang;

  if (!rawLang || !isValidLocale(rawLang)) {
    return {};
  }

  const lang = rawLang as Locale;

  try {

    const dict: Dictionary = await getServerDictionary(lang);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://portfoliosantossergio.vercel.app";

    const title =
      dict?.seo?.pages?.home?.title ??
      dict?.seo?.title ??
      "Sérgio Santos";

    const description =
      dict?.seo?.pages?.home?.description ??
      dict?.seo?.description ??
      "Portfolio";

    return {
      title,
      description,

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

  } catch (error) {

    console.error("Metadata generation failed:", error);

    return {
      title: "Sérgio Santos",
    };
  }
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default async function HomePage({ params }: PageProps) {

  const rawLang = params?.lang;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;

  const dict: Dictionary | null = await getServerDictionary(lang)
    .then((d) => d)
    .catch((error) => {
      console.error("Critical: Error loading dictionary:", error);
      return null;
    });

  if (!dict) {
    notFound();
  }

  /* ---------------------------------------------------------------------- */
  /* SAFE DATA EXTRACTION                                                   */
  /* ---------------------------------------------------------------------- */

  const featuredProjects =
    dict.projects?.featuredProjects ?? [];

  const articles =
    dict.articles ?? {
      title: "",
      mediumProfile: "",
      readMore: "",
      publishedAt: "",
      bestOfMonth: "",
      awardWinner: "",
      items: [],
    };

  const contactEmail =
    dict.common?.email ?? "contact@example.com";

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <ProxyPage lang={lang}>
      <main className="flex flex-col">

        {/* HERO */}

        <HeroSection dictionary={dict} />

        {/* ABOUT */}

        <AboutSection dict={dict.about} />

        {/* FEATURED PROJECTS */}

        {featuredProjects.length > 0 ? (

          <FeaturedProjectsSection
            lang={lang}
            dict={dict}
          />

        ) : (

          <section className="py-20 text-center">

            <h2 className="text-xl font-semibold">
              {dict.states?.emptyProjects?.title ?? "No projects"}
            </h2>

            <p className="opacity-70">
              {dict.states?.emptyProjects?.description ?? ""}
            </p>

          </section>

        )}

        {/* ARTICLES */}

        <FeaturedArticleSection
          articles={articles}
          common={dict.common}
        />

        {/* FINAL CTA */}

        <section className="py-28 px-6 text-center bg-gradient-to-b from-slate-950 to-black">

          <div className="max-w-3xl mx-auto space-y-8">

            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {dict.contact?.ctaTitle ?? "Let's build something together"}
            </h2>

            <p className="text-slate-300">
              {dict.contact?.subtitle ?? ""}
            </p>

            <a
              href={`mailto:${contactEmail}`}
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
              {dict.contact?.buttonText ?? "Contact"}
            </a>

          </div>

        </section>

      </main>
    </ProxyPage>
  );
}
