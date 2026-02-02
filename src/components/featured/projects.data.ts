import type { SupportedLocale } from '@/dictionaries'

/**
 * Modelo de projeto SEO-first
 * Estável para Next 17 / TS 7
 */
export interface FeaturedProject {
  /** ID semântico e estável (âncora, scroll, SEO) */
  id: string

  /** Nome público do projeto */
  name: string

  /** Descrição por idioma */
  description: Record<SupportedLocale, string>

  /** URL do repositório */
  repoUrl: string

  /** Categorias semânticas (alinhadas ao dicionário) */
  categories: Array<
    | 'dataScience'
    | 'analysis'
    | 'data'
    | 'dev'
    | 'backend'
    | 'cloud'
    | 'devops'
  >

  /** Prioridade editorial / SEO */
  priority: number
}

/**
 * PROJETOS EM DESTAQUE (CURADORIA MANUAL)
 * Ordem = prioridade editorial + SEO
 */
export const featuredProjects: readonly FeaturedProject[] = [
  {
    id: 'analise-riscos-atraso-obras',
    name: 'Análise de Riscos de Atraso em Obras',
    repoUrl:
      'https://github.com/Santosdevbjj/analiseRiscosAtrasoObras',
    priority: 1,
    categories: ['dataScience', 'analysis', 'data'],
    description: {
      pt: 'Projeto de ciência de dados para análise preditiva de riscos de atraso em obras, combinando dados históricos, clima e fornecedores.',
      en: 'Data science project focused on predictive risk analysis for construction delays using historical, weather and supplier data.',
      es: 'Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras usando datos históricos, clima y proveedores.',
    },
  },
  {
    id: 'analise-dados-na-pratica',
    name: 'Análise de Dados na Prática',
    repoUrl:
      'https://github.com/Santosdevbjj/analiseDadosNaPratica',
    priority: 2,
    categories: ['dataScience', 'analysis', 'dev'],
    description: {
      pt: 'Coleção prática de estudos de análise de dados aplicada a problemas reais, com foco em clareza, métricas e storytelling.',
      en: 'Practical collection of data analysis studies applied to real-world problems, focusing on clarity, metrics and storytelling.',
      es: 'Colección práctica de estudios de análisis de datos aplicados a problemas reales, con enfoque en claridad, métricas y storytelling.',
    },
  },
  {
    id: 'genai-pipeline-etl-python',
    name: 'GenAI Pipeline ETL em Python',
    repoUrl:
      'https://github.com/Santosdevbjj/genAIpipeETLPython',
    priority: 3,
    categories: ['dataScience', 'backend', 'cloud', 'devops'],
    description: {
      pt: 'Pipeline ETL moderno em Python com integração de IA generativa, automação e boas práticas de engenharia de dados.',
      en: 'Modern Python ETL pipeline with generative AI integration, automation and data engineering best practices.',
      es: 'Pipeline ETL moderno en Python con integración de IA generativa, automatización y buenas prácticas de ingeniería de datos.',
    },
  },
] as const
