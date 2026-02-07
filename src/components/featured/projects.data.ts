import type { SupportedLocale } from '@/dictionaries'
import type { ProjectCategory } from '@/types/project'

export interface FeaturedProject {
  id: string
  name: string
  description: Record<SupportedLocale, string>
  repoUrl: string
  categories: readonly ProjectCategory[]
  priority: number
}

export const featuredProjects = [
  {
    id: 'analise-riscos-atraso-obras',
    name: 'Análise de Riscos de Atraso em Obras',
    repoUrl: 'https://github.com/Santosdevbjj/analiseRiscosAtrasoObras',
    priority: 1,
    categories: ['dataScience', 'analysis'],
    description: {
      pt: 'Projeto de ciência de dados para análise preditiva de riscos de atraso em obras.',
      en: 'Data science project focused on predictive risk analysis for construction delays.',
      es: 'Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.',
      'es-ES': 'Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.',
      'es-AR': 'Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.',
      'es-MX': 'Proyecto de ciencia de datos para el análisis predictivo de riesgos de retraso en obras.',
      'pt-BR': 'Projeto de ciência de dados para análise preditiva de riscos de atraso em obras.',
      'en-US': 'Data science project focused on predictive risk analysis for construction delays.'
    },
  },
  {
    id: 'analise-dados-na-pratica',
    name: 'Análise de Dados na Prática',
    repoUrl: 'https://github.com/Santosdevbjj/analiseDadosNaPratica',
    priority: 2,
    categories: ['dataScience', 'graphs'],
    description: {
      pt: 'Projeto prático focado em análise exploratória de dados e insights.',
      en: 'Hands-on project focused on exploratory data analysis and insights.',
      es: 'Proyecto práctico centrado en análisis exploratorio de datos e insights.',
      'es-ES': 'Proyecto práctico centrado en análisis exploratorio de datos e insights.',
      'es-AR': 'Proyecto práctico centrado en análisis exploratorio de datos e insights.',
      'es-MX': 'Proyecto práctico centrado en análisis exploratorio de datos e insights.',
      'pt-BR': 'Projeto prático focado em análise exploratória de dados e insights.',
      'en-US': 'Hands-on project focused on exploratory data analysis and insights.'
    },
  },
  {
    id: 'genai-pipeline-etl-python',
    name: 'GenAI Pipeline ETL em Python',
    repoUrl: 'https://github.com/Santosdevbjj/genAIpipeETLPython',
    priority: 3,
    categories: ['dataScience', 'cloud'],
    description: {
      pt: 'Pipeline ETL moderno em Python com integração de IA generativa.',
      en: 'Modern Python ETL pipeline with generative AI integration.',
      es: 'Pipeline ETL moderno en Python con integración de IA generativa.',
      'es-ES': 'Pipeline ETL moderno en Python con integración de IA generativa.',
      'es-AR': 'Pipeline ETL moderno en Python con integración de IA generativa.',
      'es-MX': 'Pipeline ETL moderno en Python con integración de IA generativa.',
      'pt-BR': 'Pipeline ETL moderno em Python com integração de IA generativa.',
      'en-US': 'Modern Python ETL pipeline with generative AI integration.'
    },
  },
] as const satisfies readonly FeaturedProject[]

export type FeaturedProjectId = (typeof featuredProjects)[number]['id']
