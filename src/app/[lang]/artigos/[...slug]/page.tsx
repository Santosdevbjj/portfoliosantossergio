import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';
import { getServerDictionary } from '@/lib/getServerDictionary';
import { normalizeLocale } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * FETCH GITHUB CONTENT - NODE 24 OPTIMIZED
 * Busca o conteúdo Markdown/MDX diretamente do repositório.
 */
async function fetchGithubContent(fullPath: string) {
  const extensions = ['.md', '.mdx'];
  const baseUrl = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main`;

  for (const ext of extensions) {
    try {
      const res = await fetch(`${baseUrl}/${fullPath}${ext}`, {
        next: { revalidate: 3600 }, // Cache de 1 hora
        headers: { 
          'Accept': 'text/plain; charset=utf-8',
          'User-Agent': 'Vercel-Deploy-Bot'
        }
      });
      
      if (res.ok) return await res.text();
    } catch (e) {
      continue;
    }
  }
  return null;
}

export default async function RemoteArticlePage(props: PageProps) {
  // Next.js 16: params e searchParams são Promises
  const { slug, lang: rawLang } = await props.params;
  
  // Correção do Erro de Build: Normalização do tipo para Locale
  const lang = normalizeLocale(rawLang) as Locale;
  
  const dict = await getServerDictionary(lang);
  const fullPath = slug.join('/');

  const source = await fetchGithubContent(fullPath);

  // 404 limpo caso o arquivo não exista no GitHub
  if (!source) return notFound();

  // Extração do título para o componente de compartilhamento
  const titleMatch = source.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? dict.articles.title;

  try {
    return (
      <MdxLayout lang={lang} dict={dict}>
        <article className="prose prose-slate dark:prose-invert max-w-none 
          prose-img:rounded-3xl prose-headings:scroll-mt-32">
          <MDXRemote 
            source={source} 
            options={{ 
              mdxOptions: { 
                remarkPlugins: [], 
                rehypePlugins: [] 
              } 
            }} 
          />
        </article>
        
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
        </footer>
      </MdxLayout>
    );
  } catch (err) {
    // Fallback: Se o MDX falhar (Syntax Error), renderiza como texto puro
    return (
      <MdxLayout lang={lang} dict={dict}>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
            {source}
          </pre>
        </div>
      </MdxLayout>
    );
  }
}
