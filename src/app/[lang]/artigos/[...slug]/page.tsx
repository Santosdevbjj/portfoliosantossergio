import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * Função de busca resiliente no GitHub
 * Tenta encontrar o arquivo com diferentes extensões para evitar erro 404/500
 */
async function fetchGithubContent(slugArray: string[]) {
  // Remove 'artigos' se ele vier duplicado no início do array
  const cleanSlug = slugArray.filter(part => part !== 'artigos');
  const fullPath = cleanSlug.join('/');
  
  const extensions = ['.md', '.mdx'];
  const baseUrl = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos`;

  for (const ext of extensions) {
    try {
      const url = `${baseUrl}/${fullPath}${ext}`;
      const res = await fetch(url, { 
        next: { revalidate: 3600 },
        headers: { 'Accept': 'text/plain; charset=utf-8' }
      });
      
      if (res.ok) return await res.text();
    } catch (e) {
      continue;
    }
  }
  return null;
}

export default async function RemoteArticlePage(props: PageProps) {
  // Next.js 16 exige o await no params
  const { slug } = await props.params;
  
  // Busca o conteúdo com suporte a .md e .mdx
  const source = await fetchGithubContent(slug);

  // Se o conteúdo não existir no GitHub, mostramos 404 em vez de Erro Interno
  if (!source) {
    return notFound();
  }

  // Extração segura do título (primeiro H1 do markdown)
  const titleMatch = source.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? "Artigo Técnico";

  return (
    <MdxLayout>
      <header className="mb-10 not-prose">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 w-fit px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Sincronizado via GitHub OSS
        </div>
      </header>

      {/* Renderização do MDX com Fallback de Carregamento */}
      <article className="prose dark:prose-invert max-w-none 
        prose-headings:tracking-tighter prose-headings:font-black
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-3xl
        prose-img:rounded-[2.5rem] prose-img:shadow-2xl">
        
        <Suspense fallback={<div className="h-screen w-full animate-pulse bg-slate-50 dark:bg-slate-900/50 rounded-3xl" />}>
          <MDXRemote source={source} />
        </Suspense>
      </article>

      <footer className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
        <ShareArticle title={articleTitle} />
      </footer>
    </MdxLayout>
  );
}
