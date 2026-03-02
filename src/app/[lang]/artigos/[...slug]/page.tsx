import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';
import { Suspense } from 'react';

/**
 * UTILS - NEXT.JS 16 + TS 6.0 STRICT
 * -----------------------------------------------------------------------------
 */

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

function getReadingTime(text: string): number {
  const wordsPerMinute = 225; // Ajustado para leitura técnica
  const words = text.trim().split(/\s+/g).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Tenta buscar o conteúdo no GitHub testando .md e .mdx
 */
async function fetchGithubContent(fullPath: string) {
  const extensions = ['.md', '.mdx'];
  const baseUrl = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main`;

  for (const ext of extensions) {
    const url = `${baseUrl}/${fullPath}${ext}`;
    try {
      const res = await fetch(url, { 
        next: { revalidate: 3600 },
        headers: { 'Accept': 'text/plain' }
      });
      if (res.ok) return await res.text();
    } catch (e) {
      continue;
    }
  }
  return null;
}

/**
 * COMPONENTE PRINCIPAL
 * -----------------------------------------------------------------------------
 */
export default async function RemoteArticlePage(props: PageProps) {
  // Padrão Next 16: params é uma Promise
  const { slug } = await props.params;
  
  // Reconstrói o caminho (ex: artigos/aws/aws-em-colapso)
  const fullPath = slug.join('/');

  // Busca o conteúdo (suporta .md e .mdx automaticamente)
  const source = await fetchGithubContent(fullPath);

  if (!source) {
    console.error(`[404] Artigo não encontrado no GitHub: ${fullPath}`);
    return notFound();
  }

  const readingTime = getReadingTime(source);
  
  // Extração inteligente do título para o ShareArticle
  const titleMatch = source.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? "Artigo Técnico";

  return (
    <MdxLayout>
      {/* Meta Header - Tailwind 4.2 Utility Classes */}
      <header className="mb-12 not-prose">
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
          <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime} min de leitura
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800" />
          <span className="font-bold border-b-2 border-slate-200 dark:border-slate-800 pb-0.5">
            Sincronizado via GitHub OSS
          </span>
        </div>
      </header>

      {/* Content Area - Typography 4.2 Optimized */}
      <article className="prose dark:prose-invert max-w-none 
        prose-headings:tracking-tighter prose-headings:font-black
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-2xl
        prose-img:rounded-[2rem] prose-img:shadow-2xl prose-img:border prose-img:border-slate-100 dark:prose-img:border-slate-800">
        
        <Suspense fallback={
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 w-3/4 rounded-lg" />
            <div className="h-4 bg-slate-100 dark:bg-slate-900 w-full rounded-lg" />
            <div className="h-4 bg-slate-100 dark:bg-slate-900 w-5/6 rounded-lg" />
          </div>
        }>
          <MDXRemote source={source} />
        </Suspense>
      </article>

      {/* Footer Actions */}
      <footer className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
        <ShareArticle title={articleTitle} />
      </footer>
    </MdxLayout>
  );
}
