/**
 * src/lib/github/types.ts
 * Definições de tipos para a API do GitHub - TS 6 & React 19 compatível.
 */

export interface GitHubItem {
  name: string;
  path: string;
  url: string;
  type: 'file' | 'dir';
  download_url: string | null;
  category: string; 
}

/**
 * Interface para a resposta bruta da API antes de injetar a categoria.
 */
export interface GitHubRawItem {
  name: string;
  path: string;
  url: string;
  type: 'file' | 'dir';
  download_url: string | null;
}
