import { Octokit } from "octokit";
import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

const OWNER = "Santosdevbjj";
const REPO = "myArticles";

/**
 * Busca o conteúdo bruto de um arquivo Markdown no GitHub
 * e converte para HTML renderizável.
 */
export async function getMarkdownContent(path: string) {
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
