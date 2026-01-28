/**
 * DATA LAYER — Featured Projects Enrichment
 * -----------------------------------------------------------------------------
 * Este arquivo enriquece os dados vindos da API do GitHub.
 * As traduções reais (títulos e descrições) devem ser movidas para o dicionário JSON
 * para manter a consistência com o restante do sistema.
 */

import { SupportedLocale } from '@/dictionaries'

export type ProjectSize = 'lg' | 'md'

export interface ProjectEnrichment {
  readonly id: string // Deve ser exatamente o nome do repositório no GitHub
  readonly size: ProjectSize
  readonly featured: boolean
  
  /** * Detalhes narrativos (Opcional)
   * As chaves apontam para o caminho no dicionário JSON: projects.details.[id].problem
   */
  readonly hasExtendedDetails: boolean
}

/**
 * CONFIGURAÇÃO DOS TOP 3 PROJETOS
 * Aqui definimos apenas a estrutura visual e quais IDs são elite.
 */
export const featuredConfig: ProjectEnrichment[] = [
  {
    id: 'analiseRiscosAtrasoObras',
    size: 'lg',
    featured: true,
    hasExtendedDetails: true
  },
  {
    id: 'genAIpipeETLPython',
    size: 'md',
    featured: true,
    hasExtendedDetails: true
  },
  {
    id: 'analiseDadosNaPratica',
    size: 'md',
    featured: true,
    hasExtendedDetails: false
  }
]

/**
 * Helper para verificar se um projeto vindo do GitHub é um dos nossos escolhidos
 */
export const getProjectConfig = (repoName: string): ProjectEnrichment | undefined => {
  return featuredConfig.find(config => config.id === repoName)
}
