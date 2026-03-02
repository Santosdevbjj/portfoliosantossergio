import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

export default async function RemoteArticlePage(props: PageProps) {
  const { slug, lang } = await props.params;

  // 1. Limpa o slug: remove "artigos" se ele vier duplicado na URL
  const cleanSlugParts = slug.filter(part => part !== 'artigos');
  
  // 2. Reconstrói o caminho para o GitHub (Garante que começa com 'artigos/')
  const githubPath = `artigos/${cleanSlugParts.join('/')}`;

  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/${githubPath}.md`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error("Erro ao procurar no GitHub:", githubPath);
      return notFound();
    }

    const source = await response.text();
    const titleMatch = source.match(/^#\s+(.*)$/m);
    const articleTitle = titleMatch?.[1]?.trim() ?? "Artigo Técnico";

    return (
      <MdxLayout>
        <header className="mb-8 not-prose">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-950/30 w-fit px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live do GitHub
          </div>
        </header>

        <article className="prose dark:prose-invert max-w-none 
          prose-headings:text-slate-900 dark:prose-headings:text-white
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
          <MDXRemote source={source} />
        </article>

        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} />
        </footer>
      </MdxLayout>
    );
  } catch (error) {
    return notFound();
  }
}
