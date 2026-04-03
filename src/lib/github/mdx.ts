/**
 * src/lib/github/mdx.ts
 * Renderizador de MDX para artigos do GitHub
 */
import { Octokit } from "octokit";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

const GITHUB_TOKEN = process.env["GITHUB_ACCESS_TOKEN"]?.trim();

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const OWNER = "Santosdevbjj";
const REPO = "myArticles";

/**
 * Busca o conteúdo bruto de um arquivo MDX/Markdown no GitHub
 * e compila para ser renderizado com React.
 */
export async function getMdxContent(path: string) {
  if (!GITHUB_TOKEN) {
    throw new Error("Token GitHub não encontrado nas variáveis de ambiente.");
  }

  const response = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path,
    headers: {
      "X-GitHub-Api-Version": "2026-03-10",
    },
  });

  if (!("content" in response.data)) {
    throw new Error("Arquivo inválido ou não encontrado.");
  }

  // Decodifica Base64
  const rawMd = Buffer.from(response.data.content, "base64").toString("utf-8");

  // Extrai frontmatter
  const { content, data } = matter(rawMd);

  // Compila para MDX
  const mdxSource = await serialize(content, {
    scope: data,
  });

  return {
    frontmatter: data,
    mdxSource,
  };
}
