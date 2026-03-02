import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import MdxLayout from "@/components/mdx-layout";
import ShareArticle from "@/components/ShareArticle";

interface PageProps {
  params: { slug: string[]; lang: string };
}

async function fetchGithubContent(fullPath: string) {
  const extensions = [".md", ".mdx"];
  const baseUrl = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main`;

  for (const ext of extensions) {
    try {
      const res = await fetch(`${baseUrl}/${fullPath}${ext}`, {
        next: { revalidate: 3600 },
        headers: {
          Accept: "text/plain; charset=utf-8",
          "User-Agent": "Vercel-Deploy-Bot",
        },
      });
      if (res.ok) return await res.text();
    } catch {
      continue;
    }
  }
  return null;
}

export default async function RemoteArticlePage({ params }: PageProps) {
  const { slug } = params;
  const fullPath = slug.join("/");
  const source = await fetchGithubContent(fullPath);

  if (!source) return notFound();

  try {
    const titleMatch = source.match(/^#\s+(.*)$/m);
    const articleTitle = titleMatch?.[1]?.trim() ?? "Artigo Técnico";

    return (
      <MdxLayout>
        <article className="prose dark:prose-invert max-w-none prose-img:rounded-3xl">
          <MDXRemote
            source={source}
            options={{
              mdxOptions: {
                remarkPlugins: [],
                rehypePlugins: [],
              },
            }}
          />
        </article>
        <footer className="mt-12 pt-8 border-t border-slate-800">
          <ShareArticle title={articleTitle} />
        </footer>
      </MdxLayout>
    );
  } catch {
    return (
      <MdxLayout>
        <pre className="whitespace-pre-wrap font-sans leading-relaxed">
          {source}
        </pre>
      </MdxLayout>
    );
  }
}
