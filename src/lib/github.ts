import { Locale } from '@/i18n-config';
import { Project, ProjectCoreTag, resolveProjectFlags, resolveProjectTechnology } from '@/domain/projects';

const TECH_ORDER = ['data-science', 'azure-databricks', 'neo4j', 'power-bi', 'excel', 'database', 'python', 'dotnet', 'java', 'machine-learning', 'artificial-intelligence', 'aws', 'cybersecurity', 'programming-logic', 'html', 'node-react'];

export async function getGitHubProjects(lang: Locale): Promise<Project[]> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const url = `https://api.github.com/users/Santosdevbjj/repos?per_page=100&sort=updated`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json', ...(token && { Authorization: `Bearer ${token}` }) },
      next: { revalidate: 3600 }
    });

    if (!res.ok) return [];
    const repos = await res.json();

    return repos
      .filter((r: any) => !r.fork && r.topics?.includes(ProjectCoreTag.PORTFOLIO))
      .map((repo: any) => {
        const topics = repo.topics || [];
        const tech = resolveProjectTechnology(topics);
        if (!tech) return null;

        return {
          id: String(repo.id),
          name: repo.name.replace(/[-_]/g, ' '),
          description: repo.description?.split('|')[lang === 'pt' ? 0 : lang === 'en' ? 1 : 2] || '',
          htmlUrl: repo.html_url,
          homepage: repo.homepage,
          topics,
          technology: tech,
          ...resolveProjectFlags(topics)
        };
      })
      .filter((p: any) => p !== null)
      .sort((a: any, b: any) => {
        if (a.isFirst) return -1;
        if (b.isFirst) return 1;
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return TECH_ORDER.indexOf(a.technology.id) - TECH_ORDER.indexOf(b.technology.id);
      });
  } catch (e) {
    return [];
  }
}
