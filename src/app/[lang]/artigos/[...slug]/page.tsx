import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

export default async function RemoteArticlePage(props: PageProps) {
  // TypeScript 6.0: Removemos 'lang' da desestruturação pois não é utilizado, 
  // evitando o erro "value is never read".
  const { slug } = await props.params;

  // 1. Limpa o slug: remove "artigos" se ele vier duplicado na URL para evitar 404
  const cleanSlugParts = slug.filter(part => part !== 'artigos');
  
  // 2. Reconstrói o caminho exato para o repositório GitHub
  const githubPath = `artigos/${cleanSlugParts.join('/')}`;

  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/${githubPath}.md`,
      { 
        next: { revalidate: 3600 },
        headers: { 'Accept': 'text/plain; charset=utf-8' }
      }
    );

    if (!response.ok) {
      console.error("Artigo não encontrado no GitHub:", githubPath);
      return notFound();
    }

    const source = await response.text();
    
    // SEO e Metadados: Extração do título para o componente de compartilhamento
    const titleMatch = source.match(/^#\s+(.*)$/m);
    const articleTitle = titleMatch?.[1]?.trim() ?? "Artigo Técnico";

    return (
      <MdxLayout>
        {/* UI: Tailwind CSS 4.2 - Badge de status dinâmico */}
        <header className="mb-8 not-prose">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 w-fit px-4 py-1.5 rounded-full border border-blue-100/50 dark:border-blue-900/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Sincronizado via GitHub
          </div>
        </header>

        {/* React 19: Melhor tratamento de renderização assíncrona com MDX */}
        <article className="prose dark:prose-invert max-w-none 
          prose-headings:tracking-tighter prose-headings:font-black
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-2xl
          prose-img:rounded-[2.5rem] prose-img:shadow-2xl">
          <Suspense fallback={<div className="h-96 w-full animate-pulse bg-slate-100 dark:bg-slate-900 rounded-3xl" />}>
            <MDXRemote source={source} />
          </Suspense>
        </article>

        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} />
        </footer>
      </MdxLayout>
    );
  } catch (error) {
    console.error("Erro crítico na busca do artigo:", error);
    return notFound();
  }
}
