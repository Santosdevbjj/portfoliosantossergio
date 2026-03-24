/**
 * src/lib/github/types.ts
 */

export interface GitHubItem {
  name: string;
  path: string;
  url: string;
  type: 'file' | 'dir';
  download_url: string | null;
  category: string; 
}

export interface GitHubRawItem {
  name: string;
  path: string;
  url: string;
  type: 'file' | 'dir';
  download_url: string | null;
} 
