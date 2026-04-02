/**
 * src/lib/github/types.ts
 * Tipagens para o ecossistema GitHub API v2026
 */

export interface GitHubItem {
  name: string;
  path: string;
  url: string;
  type: 'file' | 'dir';
  download_url: string | null;
  category: string; 
}

// Representa o item bruto vindo da API antes do processamento de categoria
export interface GitHubRawItem {
  name: string;
  path: string;
  url: string;
  type: string;
  download_url: string | null;
  sha: string;
} 
