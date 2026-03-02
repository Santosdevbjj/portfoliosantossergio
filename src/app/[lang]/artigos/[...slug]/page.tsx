// src/app/[lang]/artigos/[...slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';
import { Suspense } from 'react';

// Tipagem rigorosa para TypeScript 6.0
interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * Calcula o tempo de leitura (200 ppm)
 */
function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/g).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Sanitização de caminho para compatibilidade com URLs do GitHub
 */
function sanitizePath(path: string): string {
  return decodeURIComponent(path)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); 
}

// Forçamos a revalidação para garantir que novos commits no GitHub apareçam
export const revalidate = 3600; 

export default async function RemoteArticlePage(props: PageProps) {
  // Resolução da Promise de params (Padrão Next.js 16)
  const { slug } = await props.params;
  
  if (!slug || slug.length === 0) {
    notFound();
  }

  const safeSlug = slug.map(sanitizePath);
  const fullPath = safeSlug.join('/');

  try {
    const githubUrl = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/${fullPath}.md`;
    
    // Fetch com tratamento de erro de rede e cache
    const response = await fetch(githubUrl, { 
      next: { revalidate: 3600 },
      headers: { 
        'Accept': 'text/plain',
        'User-Agent': 'Portfolio-Next-16' 
      }
    });

    if (!response.ok) {
      console.warn(`[404] Artigo ausente: ${githubUrl}`);
      notFound();
    }

    const source = await response.text();
    
    // Extração de metadados simples
    const readingTime = getReadingTime(source);
    const titleMatch = source.match(/^#\s+(.*)$/m);
    const articleTitle = titleMatch?.[1]?.trim() ?? "Artigo Técnico";

    return (
      <MdxLayout>
        {/* Cabeçalho do Artigo */}
        <header className="mb-8 not-prose">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min de leitura
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800" />
            <span className="font-bold">GitHub Source</span>
          </div>
        </header>

        {/* Renderização MDX com Tailwind 4.2 Typography */}
        <article className="prose dark:prose-invert max-w-none 
          prose-headings:tracking-tighter prose-headings:font-black 
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 
          prose-img:rounded-3xl prose-img:shadow-2xl">
          <Suspense fallback={<div className="h-96 w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
            <MDXRemote source={source} />
          </Suspense>
        </article>

        {/* Footer de Compartilhamento */}
        <footer className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
          <ShareArticle title={articleTitle} />
        </footer>
      </MdxLayout>
    );
  } catch (error) {
    // Erros de DNS ou conexão caem aqui
    console.error("Erro de conexão com GitHub:", error);
    notFound();
  }
}
