// src/types/github.ts

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[]; // Aqui estão nossas tags: portfolio, destaque, etc.
  homepage: string | null;
}

export interface ProcessedProject {
  id: number;
  name: string;
  url: string;
  liveUrl: string | null;
  problem: string;
  solution: string;
  impact: string;
  isFeatured: boolean; // Tag 'destaque' ou 'featured'
  isHead: boolean;     // Tag 'primeiro'
  category: string;
  technologies: string[];
}
