import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';

/**
 * Calcula o tempo de leitura estimado (200 ppm).
 */
function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/g).length;
  return Math.ceil(words / wordsPerMinute);
}

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

export default async function RemoteArticlePage(props: PageProps) {
  // No Next.js 16, params deve ser aguardado.
  const resolvedParams = await props.params;
  
  // Extraímos apenas o slug. O 'lang' foi removido para evitar erro de variável não utilizada.
  const { slug } = resolvedParams;
  
  // Reconstrói o caminho do arquivo no GitHub.
  const fullPath = slug.join('/');

  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/${fullPath}.md`,
      { 
        next: { revalidate: 3600 },
        headers: { 'Accept': 'text/plain' }
      }
    );

    if (!response.ok) return notFound();

    const source = await response.text();
    const readingTime = getReadingTime(source);
    
    // Extraímos o título para o componente de compartilhamento.
    const titleMatch = source.match(/^#\s+(.*)$/m);
    const articleTitle: string = (titleMatch && titleMatch[1]) ? titleMatch[1].trim() : "Artigo Técnico";

    return (
      <MdxLayout>
        {/* Cabeçalho de Metadados - Tailwind 4.2 */}
        <div className="flex items-center gap-4 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 not-prose">
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime} min de leitura
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800" />
          <span className="hover:text-blue-600 transition-colors cursor-default uppercase">Fonte: GitHub</span>
        </div>

        {/* Renderizador de MDX */}
        <div className="relative">
          <MDXRemote source={source} />
        </div>

        {/* Botão de Compartilhar */}
        <ShareArticle title={articleTitle} />
      </MdxLayout>
    );
  } catch (error) {
    console.error("Erro na busca do artigo remoto:", error);
    return notFound();
  }
}
