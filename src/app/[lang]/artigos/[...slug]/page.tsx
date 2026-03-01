import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';

export default async function RemoteArticlePage({ params }: { params: Promise<{ slug: string[], lang: string }> }) {
  const { slug } = await params;
  
  // Reconstrói o caminho da pasta: artigos/python/ide-pycharm-spyder
  const fullPath = slug.join('/');

  const response = await fetch(
    `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/${fullPath}.md`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) return notFound();
  const source = await response.text();

  return (
    <MdxLayout>
      <MDXRemote source={source} />
    </MdxLayout>
  );
} 

// Adicione esta função simples no final do arquivo
function getReadingTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/g).length;
  return Math.ceil(words / wordsPerMinute);
}

// Dentro do seu componente RemoteArticlePage, antes do return:
const readingTime = getReadingTime(source);

// No seu return, antes do <MDXRemote />, adicione:
<div className="flex items-center gap-4 mb-8 text-xs font-bold uppercase tracking-widest text-slate-400">
  <span>{readingTime} min de leitura</span>
  <span className="w-1 h-1 rounded-full bg-slate-300" />
  <span>Fonte: GitHub</span>
</div>
