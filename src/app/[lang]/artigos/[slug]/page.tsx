import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export default async function RemoteArticlePage(props: PageProps) {
  const { slug } = await props.params;

  // 1. Busca o conteúdo RAW do seu GitHub
  // Substitua 'Santosdevbjj/myArticles' pelo seu repo e 'main' pela sua branch
  const response = await fetch(
    `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/${slug}.md`,
    { next: { revalidate: 3600 } } // Cache de 1 hora
  );

  if (!response.ok) {
    return notFound();
  }

  const source = await response.text();

  return (
    <MdxLayout>
      <div className="prose dark:prose-invert max-w-none">
        {/* @ts-expect-error Server Component */}
        <MDXRemote source={source} />
      </div>
    </MdxLayout>
  );
}
