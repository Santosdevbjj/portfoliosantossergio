// src/types/github.ts

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  homepage: string | null;
  fork: boolean; // Essencial para filtrar o 'beer_api'
  owner: {
    login: string;
  };
}

export interface ProcessedProject {
  id: number;
  name: string;
  url: string;
  liveUrl: string | null;
  problem: string;
  solution: string;
  impact: string;
  isFeatured: boolean;
  isHead: boolean;
  category: string;
  technologies: string[];
}
