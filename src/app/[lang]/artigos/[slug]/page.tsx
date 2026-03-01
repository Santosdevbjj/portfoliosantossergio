import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

/**
 * Esta página busca e renderiza dinamicamente arquivos Markdown (.md)
 * do seu repositório GitHub 'myArticles'.
 */
export default async function RemoteArticlePage(props: PageProps) {
  // No Next.js 16+, 'params' deve ser aguardado (await)
  const { slug } = await props.params;

  try {
    // 1. Busca o conteúdo bruto (RAW) do seu GitHub
    const response = await fetch(
      `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/${slug}.md`,
      { 
        next: { revalidate: 3600 } // Cache de 1 hora para performance
      }
    );

    // Se o arquivo não existir no GitHub, retorna 404
    if (!response.ok) {
      return notFound();
    }

    const source = await response.text();

    return (
      <MdxLayout>
        <div className="prose dark:prose-invert max-w-none">
          {/* Removido o @ts-expect-error: MDXRemote agora é compatível com tipos async no React 19 */}
          <MDXRemote source={source} />
        </div>
      </MdxLayout>
    );
  } catch (error) {
    console.error("Erro ao buscar artigo remoto:", error);
    return notFound();
  }
}

// Opcional: Gera caminhos estáticos para os artigos mais comuns durante o build
export async function generateStaticParams() {
  // Você pode listar os slugs que quer pré-renderizar aqui
  return [{ slug: 'README' }];
}
