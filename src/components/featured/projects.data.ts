// src/components/featured/projects.data.ts
// -----------------------------------------
// DATA LAYER — Featured Projects
// - Estrutura centralizada para Projetos em Destaque
// - Suporte nativo para i18n (PT / EN / ES)
// - Metadados para SEO e Narrativa de Engenharia
// -----------------------------------------

export type Locale = 'pt' | 'en' | 'es';

export type Project = {
  id: string;
  repo: string;
  featured: boolean;
  size: 'lg' | 'md'; // 'lg' ocupa 2 colunas, 'md' ocupa 1 no grid desktop

  /** Chave técnica para o sistema de filtros (slug) */
  filterCategory: 'data-science' | 'data-engineering' | 'data-analysis' | 'gen-ai';

  /** Nome da categoria exibida na UI */
  category: Record<Locale, string>;

  /** Tags técnicas (Skills) */
  tags: Record<Locale, string[]>;

  /** Título do Projeto */
  title: Record<Locale, string>;

  /** Descrição Curta (SEO) */
  description: Record<Locale, string>;

  /** Narrativa do Case (Opcional - Usado em FeaturedProject) */
  details?: {
    problem: Record<Locale, string>;
    solution: Record<Locale, string>;
    impact: Record<Locale, string>;
  };
};

export const projects: Project[] = [
  {
    id: 'analise-riscos-obras',
    repo: 'https://github.com/Santosdevbjj/analiseRiscosAtrasoObras',
    featured: true,
    size: 'lg',
    filterCategory: 'data-science',
    category: {
      pt: 'Ciência de Dados',
      en: 'Data Science',
      es: 'Ciencia de Datos',
    },
    tags: {
      pt: ['Python', 'Scikit-Learn', 'Pandas', 'Análise de Risco'],
      en: ['Python', 'Scikit-Learn', 'Pandas', 'Risk Analysis'],
      es: ['Python', 'Scikit-Learn', 'Pandas', 'Análisis de Riesgo'],
    },
    title: {
      pt: 'Análise de Riscos de Atraso em Obras',
      en: 'Construction Delay Risk Analysis',
      es: 'Análisis de Riesgos de Retraso en Obras',
    },
    description: {
      pt: 'Modelo preditivo para antecipar atrasos em cronogramas de construção civil.',
      en: 'Predictive model to anticipate delays in civil construction schedules.',
      es: 'Modelo predictivo para anticipar retrasos en cronogramas de construcción civil.',
    },
    details: {
      problem: {
        pt: 'Atrasos em obras geram prejuízos milionários e falhas contratuais.',
        en: 'Construction delays lead to million-dollar losses and contractual failures.',
        es: 'Los retrasos en las obras generan pérdidas millonarias y fallas contractuales.',
      },
      solution: {
        pt: 'Desenvolvimento de um modelo de ML integrando dados climáticos e histórico de fornecedores.',
        en: 'Development of an ML model integrating climate data and supplier history.',
        es: 'Desarrollo de un modelo de ML que integra datos climáticos e histórico de proveedores.',
      },
      impact: {
        pt: 'Redução de 15% na incerteza do cronograma e melhor gestão de stakeholders.',
        en: '15% reduction in schedule uncertainty and improved stakeholder management.',
        es: 'Reducción del 15% en la incertidumbre del cronograma y mejor gestión de stakeholders.',
      }
    }
  },
  {
    id: 'genai-etl',
    repo: 'https://github.com/Santosdevbjj/genAIpipeETLPython',
    featured: true,
    size: 'md',
    filterCategory: 'gen-ai',
    category: {
      pt: 'Engenharia de Dados',
      en: 'Data Engineering',
      es: 'Ingeniería de Datos',
    },
    tags: {
      pt: ['GenAI', 'Python', 'ETL', 'OpenAI API'],
      en: ['GenAI', 'Python', 'ETL', 'OpenAI API'],
      es: ['GenAI', 'ETL', 'Python', 'OpenAI API'],
    },
    title: {
      pt: 'Pipeline ETL com GenAI',
      en: 'GenAI-powered ETL Pipeline',
      es: 'Pipeline ETL con GenAI',
    },
    description: {
      pt: 'Automação de processos de extração e transformação usando IA Generativa.',
      en: 'Automation of extraction and transformation processes using Generative AI.',
      es: 'Automatización de procesos de extracción y transformación usando IA Generativa.',
    },
    details: {
      problem: {
        pt: 'Dados não estruturados exigiam limpeza manual exaustiva.',
        en: 'Unstructured data required exhaustive manual cleaning.',
        es: 'Los datos no estructurados requerían una limpieza manual exhaustiva.',
      },
      solution: {
        pt: 'Uso de LLMs para normalização de dados complexos em tempo real.',
        en: 'Using LLMs for complex data normalization in real-time.',
        es: 'Uso de LLM para la normalización de datos complejos en tiempo real.',
      },
      impact: {
        pt: 'Aumento de 40% na velocidade de processamento de novos datasets.',
        en: '40% increase in processing speed for new datasets.',
        es: 'Aumento del 40% en la velocidad de procesamiento de nuevos conjuntos de datos.',
      }
    }
  },
  {
    id: 'analise-dados-pratica',
    repo: 'https://github.com/Santosdevbjj/analiseDadosNaPratica',
    featured: true,
    size: 'md',
    filterCategory: 'data-analysis',
    category: {
      pt: 'Análise de Dados',
      en: 'Data Analysis',
      es: 'Análisis de Datos',
    },
    tags: {
      pt: ['EDA', 'Matplotlib', 'Seaborn', 'Python'],
      en: ['EDA', 'Matplotlib', 'Seaborn', 'Python'],
      es: ['EDA', 'Matplotlib', 'Seaborn', 'Python'],
    },
    title: {
      pt: 'Análise de Dados na Prática',
      en: 'Hands-on Data Analysis',
      es: 'Análisis de Dados en la Práctica',
    },
    description: {
      pt: 'Estudos aprofundados de análise exploratória em datasets reais.',
      en: 'In-depth exploratory analysis studies on real-world datasets.',
      es: 'Estudios profundos de análisis exploratorio en conjuntos de datos reales.',
    }
  },
];
