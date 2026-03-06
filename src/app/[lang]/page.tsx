import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale, Dictionary } from "@/types/dictionary";

// Services & Helpers
import { getServerDictionary } from "@/lib/getServerDictionary";
import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales";

// Components
import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedProjectsSection from "@/components/featured/FeaturedProjectsSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = 60;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await props.params;

  if (!rawLang || !isValidLocale(rawLang)) return {};

  try {
    const dict: Dictionary = await getServerDictionary(rawLang as Locale);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

    return {
      title: dict?.seo?.pages?.home?.title ?? "Sérgio Santos",
      description: dict?.seo?.pages?.home?.description ?? "Portfolio",
      alternates: {
        canonical: `${siteUrl}/${rawLang}`,
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
    return { title: "Sérgio Santos" };
  }
}

export default async function HomePage(props: PageProps) {
  const { lang: rawLang } = await props.params;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  const dict = await getServerDictionary(lang).catch(() => null);

  if (!dict) {
    notFound();
  }

  return (
    <ProxyPage lang={lang}>
      <main className="flex flex-col min-h-screen bg-white dark:bg-[#020617]">
        
        {/* HERO */}
        <HeroSection dictionary={dict} />

        {/* ABOUT */}
        <AboutSection dict={dict.about} />

        {/* FEATURED PROJECTS - A lógica de proteção agora está dentro do componente */}
        <FeaturedProjectsSection lang={lang} dict={dict} />

        {/* ARTICLES */}
        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common} 
        />

        {/* FINAL CTA */}
        <section className="py-28 px-6 text-center bg-slate-950">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
              {dict.contact?.ctaTitle || "Vamos Conversar?"}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              {dict.contact?.subtitle}
            </p>
            <a
              href={`mailto:${dict.common.email}`}
              className="inline-flex items-center justify-center bg-white text-slate-950 px-10 py-5 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 transition-transform active:scale-95 shadow-xl"
            >
              {dict.contact?.buttonText || "Entrar em Contato"}
            </a>
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
