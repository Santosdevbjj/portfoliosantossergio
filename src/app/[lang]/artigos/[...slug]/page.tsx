import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * Função de busca ultra-resiliente
 */
async function fetchGithubContent(slugArray: string[]) {
  // 1. Normalização do Slug: remove 'artigos' e partes vazias
  const cleanSlug = slugArray.filter(part => part !== 'artigos' && part !== '');
  
  // 2. Se não sobrar nada no slug, o usuário clicou em "Documentação (README)"
  const isReadmeRequest = cleanSlug.length === 0;
  
  const GITHUB_BASE = "https://raw.githubusercontent.com/Santosdevbjj/myArticles/main";
  const urlsToTry: string[] = [];

  if (isReadmeRequest) {
    // Tenta o README em todos os locais possíveis
    urlsToTry.push(`${GITHUB_BASE}/artigos/README.md`);
    urlsToTry.push(`${GITHUB_BASE}/README.md`);
  } else {
    const path = cleanSlug.join('/');
    // Tenta extensões comuns e caminhos relativos
    urlsToTry.push(`${GITHUB_BASE}/artigos/${path}.md`);
    urlsToTry.push(`${GITHUB_BASE}/artigos/${path}.mdx`);
    // Caso especial para pastas que contêm index ou readme interno
    urlsToTry.push(`${GITHUB_BASE}/artigos/${path}/README.md`);
  }

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, { 
        next: { revalidate: 60 }, // Revalidação mais rápida para testes
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (res.ok) {
        const text = await res.text();
        if (text.trim().length > 0) return text;
      }
    } catch (e) {
      continue;
    }
  }
  return null;
}

export default async function RemoteArticlePage(props: PageProps) {
  const { slug } = await props.params;
  
  const source = await fetchGithubContent(slug);

  // Se não encontrar nada, retorna 404 em vez de deixar o Next.js quebrar com Erro 500
  if (!source) {
    return notFound();
  }

  // Extração do título para o ShareArticle
  const titleMatch = source.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? "Documentação";

  return (
    <MdxLayout>
      <header className="mb-10 not-prose">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 w-fit px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          GitHub Live Sync
        </div>
      </header>

      <article className="prose dark:prose-invert max-w-none 
        prose-headings:tracking-tighter prose-headings:font-black
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-3xl
        prose-img:rounded-[2.5rem] prose-img:shadow-2xl">
        
        <Suspense fallback={
          <div className="space-y-4 w-full animate-pulse">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4"></div>
            <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-3xl w-full"></div>
          </div>
        }>
          <MDXRemote source={source} />
        </Suspense>
      </article>

      <footer className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
        <ShareArticle title={articleTitle} />
      </footer>
    </MdxLayout>
  );
}
