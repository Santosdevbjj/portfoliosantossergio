import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle'; // Importe aqui

function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/g).length;
  return Math.ceil(words / wordsPerMinute);
}

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

export default async function RemoteArticlePage(props: PageProps) {
  const { slug } = await props.params;
  const fullPath = slug.join('/');

  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/${fullPath}.md`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) return notFound();

    const source = await response.text();
    const readingTime = getReadingTime(source);
    
    // Extrai o título (primeiro H1) do Markdown para o compartilhamento
    const titleMatch = source.match(/^#\s+(.*)$/m);
    const articleTitle = titleMatch ? titleMatch[1] : "Artigo Técnico";

    return (
      <MdxLayout>
        {/* Metadados */}
        <div className="flex items-center gap-4 mb-8 text-xs font-black uppercase tracking-widest text-slate-400 not-prose">
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime} min de leitura
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span>Fonte: GitHub</span>
        </div>

        {/* Conteúdo do Artigo */}
        <MDXRemote source={source} />

        {/* Botão de Compartilhar ao final */}
        <ShareArticle title={articleTitle} />
      </MdxLayout>
    );
  } catch (error) {
    return notFound();
  }
}
