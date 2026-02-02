import type { SupportedLocale } from '@/dictionaries'
import type { ProjectCategory } from '@/types/project'

export interface FeaturedProject {
  /** ID semântico (SEO, âncora, scroll) */
  id: string

  /** Nome público */
  name: string

  /** Descrição multilíngue */
  description: Record<SupportedLocale, string>

  /** Repositório */
  repoUrl: string

  /** Categorias SEMÂNTICAS alinhadas ao dicionário */
  categories: readonly ProjectCategory[]

  /** Ordem editorial / SEO */
  priority: number
}

export const featuredProjects = [
  {
    id: 'analise-riscos-atraso-obras',
    name: 'Análise de Riscos de Atraso em Obras',
    repoUrl:
      'https://github.com/Santosdevbjj/analiseRiscosAtrasoObras',
    priority: 1,
    categories: ['dataScience', 'analysis', 'data'],
    description: {
      pt: 'Projeto de ciência de dados para análise preditiva de riscos de atraso em obras.',
      en: 'Data science project focused on predictive risk analysis for construction delays.',
      es: 'Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.',
    },
  },

  {
    id: 'analise-dados-na-pratica',
    name: 'Análise de Dados na Prática',
    repoUrl:
      'https://github.com/Santosdevbjj/analiseDadosNaPratica',
    priority: 2,
    categories: ['dataScience', 'analysis', 'graphs'],
    description: {
      pt: 'Projeto prático focado em análise exploratória de dados, visualizações e insights.',
      en: 'Hands-on project focused on exploratory data analysis, visualizations and insights.',
      es: 'Proyecto práctico centrado en análisis exploratorio de datos, visualizaciones e insights.',
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
      pt: 'Pipeline ETL moderno em Python com integração de IA generativa.',
      en: 'Modern Python ETL pipeline with generative AI integration.',
      es: 'Pipeline ETL moderno en Python con integración de IA generativa.',
    },
  },
] as const satisfies readonly FeaturedProject[]
