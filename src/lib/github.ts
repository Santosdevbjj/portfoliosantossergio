export async function getGitHubProjects() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
  const token = process.env.GITHUB_ACCESS_TOKEN;

  if (!username) return [];

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 }, // Cache de 1 hora
      }
    );

    if (!response.ok) return [];

    const repos = await response.json();

    // Filtra apenas repositórios com o tópico 'portfolio'
    // E retorna os dados limpos para o frontend
    return repos
      .filter((repo: any) => repo.topics?.includes("portfolio"))
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
      }));
    
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    return [];
  }
}
