export async function getGitHubProjects() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
  const token = process.env.GITHUB_ACCESS_TOKEN;

  // Se não tiver username, retorna vazio. 
  // O token é opcional para repos públicos, mas recomendável para evitar limites de taxa.
  if (!username) return [];

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers: {
          ...(token && { Authorization: `token ${token}` }),
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 }, // Cache de 1 hora
      }
    );

    if (!response.ok) {
      console.error(`GitHub API retornou erro: ${response.status}`);
      return [];
    }

    const repos = await response.json();

    // Filtra repositórios que tenham a tag 'portfolio' nos tópicos
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
    console.error("Erro na conexão com GitHub:", error);
    return [];
  }
}
