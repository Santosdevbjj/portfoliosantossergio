import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import MdxLayout from '@/components/mdx-layout';
import ShareArticle from '@/components/ShareArticle';

/**
 * Calcula o tempo de leitura (200 ppm)
 */
function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/g).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Limpa o caminho para garantir compatibilidade com a URL do GitHub.
 * Decodifica caracteres da URL e remove acentos se existirem.
 */
function sanitizePath(path: string) {
  return decodeURIComponent(path)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); 
}

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

export default async function RemoteArticlePage(props: PageProps) {
  // No Next.js 16, params é uma Promise que deve ser aguardada
  const resolvedParams = await props.params;
  const { slug } = resolvedParams;
  
  // O slug chega como um array. Ex: ["artigos", "aws", "aws-em-colapso"]
  // O join('/') transforma em: "artigos/aws/aws-em-colapso"
  const safeSlug = slug.map(part => sanitizePath(part));
  const fullPath = safeSlug.join('/');

  try {
    // Monta a URL final para buscar o conteúdo bruto (.md) no GitHub
    const githubUrl = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/${fullPath}.md`;
    
    const response = await fetch(githubUrl, { 
      next: { revalidate: 3600 }, // Cache de 1 hora
      headers: { 'Accept': 'text/plain' }
    });

    // Se o GitHub retornar 404, acionamos a página notFound do Next.js
    if (!response.ok) {
      console.error(`Artigo não encontrado no GitHub: ${githubUrl}`);
      return notFound();
    }

    const source = await response.text();
    const readingTime = getReadingTime(source);
    
    // Tenta extrair o título do H1 do Markdown (# Título)
    const titleMatch = source.match(/^#\s+(.*)$/m);
    const articleTitle: string = (titleMatch && titleMatch[1]) ? titleMatch[1].trim() : "Artigo Técnico";

    return (
      <MdxLayout>
        {/* Metadados do Artigo */}
        <div className="flex items-center gap-4 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 not-prose">
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime} min de leitura
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800" />
          <span className="uppercase font-bold hover:text-blue-500 transition-colors cursor-default">
            Fonte: GitHub Open Source
          </span>
        </div>

        {/* Renderização do MDX */}
        <article className="prose dark:prose-invert max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-img:rounded-3xl">
          <MDXRemote source={source} />
        </article>

        {/* Rodapé com botão de compartilhamento */}
        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
          <ShareArticle title={articleTitle} />
        </div>
      </MdxLayout>
    );
  } catch (error) {
    console.error("Erro crítico na renderização remota:", error);
    return notFound();
  }
}
