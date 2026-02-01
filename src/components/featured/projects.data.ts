/**
 * DATA LAYER — Featured Projects Configuration
 * -----------------------------------------------------------------------------
 * Fonte única de verdade dos projetos em destaque.
 *
 * PRINCÍPIOS:
 * - Apenas 3 projetos (curadoria estratégica)
 * - Ordem explícita (define hierarquia visual e narrativa)
 * - Agnóstico de UI, i18n e ScrollSpy
 * - IDs DEVEM corresponder exatamente aos nomes dos repositórios no GitHub
 */

export type ProjectSize = 'lg' | 'md'

export interface ProjectEnrichment {
  /**
   * ID do repositório no GitHub
   * ⚠️ Deve ser EXATAMENTE igual ao nome do repo
   */
  readonly id: string

  /**
   * Tamanho visual no Featured Grid
   * - lg → destaque principal
   * - md → destaque secundário
   */
  readonly size: ProjectSize

  /**
   * Indica se o projeto é destacado
   * Mantido por extensibilidade futura (ex: filtros, animações, SEO)
   */
  readonly featured: boolean

  /**
   * Indica se existe (ou existirá) uma página interna de detalhes
   * false → apenas link externo (GitHub)
   */
  readonly hasExtendedDetails: boolean
}

/**
 * CONFIGURAÇÃO DOS 3 PROJETOS EM DESTAQUE
 * -----------------------------------------------------------------------------
 * ORDEM = ORDEM DE EXIBIÇÃO + IMPORTÂNCIA SEMÂNTICA
 *
 * 1️⃣ Projeto principal (impacto máximo)
 * 2️⃣ Projeto secundário
 * 3️⃣ Projeto secundário
 */
export const featuredConfig: readonly ProjectEnrichment[] = [
  {
    id: 'analiseRiscosAtrasoObras',
    size: 'lg',
    featured: true,
    hasExtendedDetails: true,
  },
  {
    id: 'analiseDadosNaPratica',
    size: 'md',
    featured: true,
    hasExtendedDetails: false,
  },
  {
    id: 'genAIpipeETLPython',
    size: 'md',
    featured: true,
    hasExtendedDetails: false,
  },
] as const

/**
 * HELPER — getProjectConfig
 * -----------------------------------------------------------------------------
 * Retorna a configuração visual de um repositório específico.
 * Utilizado pelo FeaturedGrid / ProjectCard.
 */
export function getProjectConfig(
  repoName: string,
): ProjectEnrichment | undefined {
  return featuredConfig.find(
    config => config.id === repoName,
  )
}
