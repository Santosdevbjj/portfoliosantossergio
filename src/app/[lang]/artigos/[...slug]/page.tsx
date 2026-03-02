import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

async function fetchGithubContent(slugArray: string[]) {
  // 1. Limpeza radical: remove qualquer menção a 'artigos' no início para evitar duplicação
  const cleanSlug = slugArray.filter(part => part !== 'artigos');
  
  // 2. Se o caminho estiver vazio após a limpeza, o usuário quer o README
  const isReadme = cleanSlug.length === 0;
  const path = isReadme ? 'README' : cleanSlug.join('/');
  
  const extensions = ['.md', '.mdx'];
  const baseUrl = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos`;
  
  // Caso especial para o README que pode estar na raiz ou dentro de /artigos
  const urlsToTry = isReadme 
    ? [`https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/README.md`, `${baseUrl}/README.md`]
    : extensions.map(ext => `${baseUrl}/${path}${ext}`);

  for (const url of urlsToTry) {
    try {
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
  const { slug } = await props.params;
  
  const source = await fetchGithubContent(slug);

  // Evita o "Erro Interno" enviando para 404 se o conteúdo for nulo
  if (!source || source.trim() === "") {
    return notFound();
  }

  const titleMatch = source.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? "Documentação Técnica";

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

      <article className="prose dark:prose-invert max-w-none 
        prose-headings:tracking-tighter prose-headings:font-black
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-3xl
        prose-img:rounded-[2.5rem] prose-img:shadow-2xl">
        
        <Suspense fallback={<div className="h-96 w-full animate-pulse bg-slate-100 dark:bg-slate-900 rounded-3xl" />}>
          <MDXRemote source={source} />
        </Suspense>
      </article>

      <footer className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
        <ShareArticle title={articleTitle} />
      </footer>
    </MdxLayout>
  );
}
