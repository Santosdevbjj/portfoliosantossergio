/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 * Stack: Next.js 16.2.2, React 19, TS 6.0.2, Tailwind 4.2
 * Renderiza artigos em Markdown (.md) e MDX (.mdx) diretamente do GitHub
 */
import { getMarkdownContent } from "@/lib/github/markdown";
import { getMdxContent } from "@/lib/github/mdx";
import MdxLayout from "@/components/mdx-layout";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { MDXRemote } from "next-mdx-remote/rsc";
import { MDXProvider } from "@mdx-js/react";
import { headers } from "next/headers";
import type { Locale } from "@/types/dictionary";

interface PageProps {
  params: { lang: string; slug: string[] };
}

export default async function ArticlePage({ params }: PageProps) {
  const locale = params.lang as Locale;
  const slugPath = params.slug.join("/");
  const filePath = `artigos/${slugPath}`;

  // Workaround Next.js 16.2 para garantir contexto dinâmico
  try {
    await headers();
  } catch {
    /* build-time fallback */
  }

  // Carrega dicionário multilíngue
  const dict = await getServerDictionary(locale);

  // Verifica extensão do arquivo
  const isMdx = filePath.endsWith(".mdx");
  const isMd = filePath.endsWith(".md");

  try {
    if (isMdx) {
      // Renderização MDX
      const { frontmatter, mdxSource } = await getMdxContent(filePath);

      return (
        <MdxLayout lang={locale} dict={dict}>
          <article className="prose prose-lg dark:prose-invert mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">
              {frontmatter.title ?? slugPath}
            </h1>
            <MDXProvider components={{}}>
              <MDXRemote {...mdxSource} />
            </MDXProvider>
          </article>
        </MdxLayout>
      );
    } else if (isMd) {
      // Renderização Markdown
      const { frontmatter, contentHtml } = await getMarkdownContent(filePath);

      return (
        <MdxLayout lang={locale} dict={dict}>
          <article className="prose prose-lg dark:prose-invert mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">
              {frontmatter.title ?? slugPath}
            </h1>
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </article>
        </MdxLayout>
      );
    }

    // Caso não seja .md ou .mdx
    return (
      <MdxLayout lang={locale} dict={dict}>
        <div className="text-center text-zinc-500 dark:text-zinc-400 mt-20">
          {dict.states.errorArticles}
        </div>
      </MdxLayout>
    );
  } catch (error) {
    console.error("Erro ao renderizar artigo:", error);
    return (
      <MdxLayout lang={locale} dict={dict}>
        <div className="text-center text-zinc-500 dark:text-zinc-400 mt-20">
          {dict.states.errorArticles}
        </div>
      </MdxLayout>
    );
  }
}
