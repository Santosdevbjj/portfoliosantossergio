import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';

function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/g).length;
  return Math.ceil(words / wordsPerMinute);
}

// Função para limpar o caminho e evitar erros de caracteres especiais
function sanitizePath(path: string) {
  return decodeURIComponent(path)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, '-'); // Garante que espaços virem hífens
}

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

export default async function RemoteArticlePage(props: PageProps) {
  const resolvedParams = await props.params;
  const { slug } = resolvedParams;
  
  // Sanitiza cada parte do slug para garantir compatibilidade com a URL do GitHub
  const safeSlug = slug.map(part => sanitizePath(part));
  const fullPath = safeSlug.join('/');

  try {
    const githubUrl = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/${fullPath}.md`;
    
    const response = await fetch(githubUrl, { 
      next: { revalidate: 3600 },
      headers: { 'Accept': 'text/plain' }
    });

    if (!response.ok) {
      console.error(`Artigo não encontrado em: ${githubUrl}`);
      return notFound();
    }

    const source = await response.text();
    const readingTime = getReadingTime(source);
    
    const titleMatch = source.match(/^#\s+(.*)$/m);
    const articleTitle: string = (titleMatch && titleMatch[1]) ? titleMatch[1].trim() : "Artigo Técnico";

    return (
      <MdxLayout>
        <div className="flex items-center gap-4 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 not-prose">
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime} min de leitura
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800" />
          <span className="uppercase font-bold">Fonte: GitHub</span>
        </div>

        <article className="prose dark:prose-invert max-w-none">
          <MDXRemote source={source} />
        </article>

        <ShareArticle title={articleTitle} />
      </MdxLayout>
    );
  } catch (error) {
    console.error("Erro crítico ao renderizar MDX:", error);
    return notFound();
  }
}
