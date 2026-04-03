/**
 * src/lib/github/markdown.ts
 * Renderizador de Markdown para artigos do GitHub
 * STACK: Next.js 16.2.2, React 19, TS 6.0.2, Node 24
 */
import { Octokit } from "octokit";
import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";

// CORREÇÃO: acesso seguro à variável de ambiente
const GITHUB_TOKEN = process.env["GITHUB_ACCESS_TOKEN"]?.trim();

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const OWNER = "Santosdevbjj";
const REPO = "myArticles";

/**
 * Busca o conteúdo bruto de um arquivo Markdown no GitHub
 * e converte para HTML renderizável.
 */
export async function getMarkdownContent(path: string) {
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

  // Extrai frontmatter (metadados)
  const { content, data } = matter(rawMd);

  // Converte Markdown para HTML
  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    frontmatter: data,
    contentHtml,
  };
}
