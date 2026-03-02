import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

async function fetchGithubContent(slugArray: string[]) {
  // CORREÇÃO: Removemos possíveis duplicatas de "artigos" no início do array
  const cleanSlug = slugArray.filter(part => part !== 'artigos');
  const fullPath = cleanSlug.join('/');
  
  const extensions = ['.md', '.mdx'];
  const baseUrl = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main`;

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
  const { slug } = await props.params;
  
  // Busca resiliente
  const source = await fetchGithubContent(slug);

  if (!source) {
    console.error(`[404] Caminho tentado: ${slug.join('/')}`);
    return notFound();
  }

  // Extração segura de metadados
  const titleMatch = source.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? "Artigo Técnico";

  return (
    <MdxLayout>
      <header className="mb-12 not-prose">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span className="text-blue-600 dark:text-blue-400">GitHub Source</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800" />
          <span>Sincronizado via Main</span>
        </div>
      </header>

      <article className="prose dark:prose-invert max-w-none 
        prose-headings:tracking-tighter prose-headings:font-black
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-2xl">
        
        <Suspense fallback={<div className="h-96 w-full animate-pulse bg-slate-100 dark:bg-slate-900 rounded-3xl" />}>
          {/* Tratamento preventivo para erros de parser MDX */}
          <MDXRemote 
            source={source}
            options={{
              mdxOptions: {
                remarkPlugins: [],
                rehypePlugins: [],
              }
            }}
          />
        </Suspense>
      </article>

      <footer className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
        <ShareArticle title={articleTitle} />
      </footer>
    </MdxLayout>
  );
}
