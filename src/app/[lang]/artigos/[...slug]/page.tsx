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
