// src/types/github.ts

/**
 * Estrutura mínima de um repositório retornado pela API do GitHub
 * usada pelo serviço de portfólio.
 */
export interface GitHubRepo {
  id: number

  name: string

  description: string | null

  html_url: string

  homepage: string | null

  /**
   * Topics podem vir undefined dependendo da API.
   */
  topics?: readonly string[]

  /**
   * Necessário para filtrar forks.
   */
  fork: boolean

  owner: {
    login: string
  }
}

/**
 * Estrutura final consumida pelos componentes React.
 */
export interface ProcessedProject {
  id: number

  /**
   * Nome formatado para UI
   */
  name: string

  /**
   * URL do repositório
   */
  url: string

  /**
   * URL da aplicação online
   */
  liveUrl: string | null

  /**
   * Estrutura narrativa usada no portfólio
   */
  problem: string

  solution: string

  impact: string

  /**
   * Flags de destaque
   */
  isFeatured: boolean

  isHead: boolean

  /**
   * Categoria principal
   */
  category: string

  /**
   * Tecnologias detectadas via topics
   */
  technologies: string[]
}
