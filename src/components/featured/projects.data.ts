/**
 * DATA LAYER — Featured Projects Configuration
 * -----------------------------------------------------------------------------
 * Este arquivo define quais repositórios do GitHub serão destacados no Bento Grid.
 * * FOCO:
 * - Mantém a lógica de exibir apenas 3 projetos de elite.
 * - Alinhado com o dicionário: As chaves de tradução são resolvidas no componente.
 * - Sem erros de build: Removidos imports não utilizados.
 */

export type ProjectSize = 'lg' | 'md'

export interface ProjectEnrichment {
  /** * ID: Deve ser exatamente o nome do repositório no GitHub 
   * Ex: 'analise-riscos'
   */
  readonly id: string 
  readonly size: ProjectSize
  readonly featured: boolean
  
  /** * SEO & UX: Indica se o projeto deve ter uma página de detalhes expandida
   * ou se apenas o card com link para o GitHub é suficiente.
   */
  readonly hasExtendedDetails: boolean
}

/**
 * CONFIGURAÇÃO DOS TOP 3 PROJETOS
 * -----------------------------------------------------------------------------
 * Seleção estratégica para o Bento Grid:
 * 1. Ocupa 2 colunas (lg) - O projeto de maior impacto.
 * 2. Ocupa 1 coluna (md)  - Segundo projeto.
 * 3. Ocupa 1 coluna (md)  - Terceiro projeto.
 */
export const featuredConfig: ProjectEnrichment[] = [
  {
    id: 'portfoliosantossergio', // Nome exato do repositório principal
    size: 'lg',
    featured: true,
    hasExtendedDetails: true
  },
  {
    id: 'genAIpipeETLPython', 
    size: 'md',
    featured: true,
    hasExtendedDetails: false
  },
  {
    id: 'analiseDadosNaPratica',
    size: 'md',
    featured: true,
    hasExtendedDetails: false
  }
]

/**
 * HELPER: getProjectConfig
 * Filtra e retorna a configuração visual para um repositório específico.
 */
export const getProjectConfig = (repoName: string): ProjectEnrichment | undefined => {
  return featuredConfig.find(config => config.id === repoName)
}
