

Vamos fazer agora uma revisão muito especial.

Vamos entender a logica dessa
Pasta src/components/featured 

E dos arquivos nela contidos
Ela só vai mostrar três projetos do Github 
Aliás foi você que deu a ideia:
Se quiser, no próximo passo posso:
alinhar isso com o SEO dinâmico
integrar com ScrollSpy
ou adaptar para Grid Masonry / Featured layout


src/
 ├─ components/
 │   ├─ featured/
 │   │   ├─ FeaturedProjectsSection.tsx
 │   │   ├─ FeaturedGrid.tsx
 │   │   ├─ ProjectCard.tsx
 │   │   └─ projects.data.ts
 │   └─ hooks/
 │       └─ useScrollSpy.ts 


FeaturedGrid em Masonry / Bento layout
**focar no Menu de Navegação para garantir que o ScrollSpy funcione visualmente**


Ela mostra esses três projetos nessa ordem:

1) [https://github.com/Santosdevbjj/analiseRiscosAtrasoObras](https://github.com/Santosdevbjj/analiseRiscosAtrasoObras)

2)
[https://github.com/Santosdevbjj/analiseDadosNaPratica](https://github.com/Santosdevbjj/analiseDadosNaPratica)

3)
[https://github.com/Santosdevbjj/genAIpipeETLPython](https://github.com/Santosdevbjj/genAIpipeETLPython)



Revise os arquivos:
src/components/featured/FeaturedGrid.tsx


src/components/featured/FeaturedProjectsSection.tsx



src/components/featured/ProjectCard.tsx


src/components/featured/projects.data.ts

E também 

src/components/projects/ProjectsGrid.tsx


src/components/projects/ProjectCategoryBadge.tsx


E também 
src/hooks/useScrollSpy.ts


O arquivo src/components/featured/FeaturedGrid.tsx

Está com esse conteúdo 

'use client'

import ProjectCard from './ProjectCard'
import type { FeaturedProject } from './projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedGridProps {
  readonly projects: readonly FeaturedProject[]
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export default function FeaturedGrid({ projects, lang, dict }: FeaturedGridProps) {
  if (!projects.length) return null

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          lang={lang}
          dict={dict}
          featured={index === 0} // O primeiro projeto (prioridade 1) ganha destaque
        />
      ))}
    </div>
  )
} 






O arquivo src/components/featured/FeaturedProjectsSection.tsx

Está com esse conteúdo 

import FeaturedGrid from './FeaturedGrid'
import { featuredProjects, type FeaturedProject } from './projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedProjectsSectionProps {
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export default function FeaturedProjectsSection({ lang, dict }: FeaturedProjectsSectionProps) {
  const projects = [...featuredProjects].sort((a, b) => a.priority - b.priority).slice(0, 3)

  return (
    <section id="featured-projects" className="relative border-y border-slate-100 bg-white py-24 dark:border-slate-900 dark:bg-[#020617]/50 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {dict.projects.featuredLabel}
          </span>
          <h2 className="mb-6 text-4xl font-black tracking-tight dark:text-white sm:text-5xl">
            {dict.projects.title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {dict.seo.pages.projects.description}
          </p>
        </div>

        <FeaturedGrid projects={projects} lang={lang} dict={dict} />
      </div>
    </section>
  )
} 






O arquivo 
src/components/featured/ProjectCard.tsx


Está com esse conteúdo 

'use client'

import type { FeaturedProject } from './projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface ProjectCardProps {
  readonly project: FeaturedProject
  readonly lang: SupportedLocale
  readonly dict: Dictionary
  readonly featured?: boolean
}

export default function ProjectCard({ project, lang, dict, featured = false }: ProjectCardProps) {
  const projectUrl = `/${lang}/projects#${project.id}`

  return (
    <article
      id={project.id}
      className={`
        relative flex flex-col justify-between rounded-2xl border border-slate-200 
        bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
        dark:border-slate-800 dark:bg-slate-900
        ${featured ? 'lg:col-span-2 lg:row-span-2' : 'col-span-1'}
      `}
    >
      <div>
        <h3 className={`${featured ? 'text-3xl' : 'text-xl'} mb-4 font-bold text-slate-900 dark:text-white`}>
          {project.name}
        </h3>
        <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {project.description[lang]}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {dict.projects.viewProject} 
          <span className="ml-2">→</span>
        </a>
      </div>
    </article>
  )
} 





O arquivo src/components/featured/projects.data.ts


Está com esse conteúdo 


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








O arquivo src/components/projects/ProjectsGrid.tsx


Está com esse conteúdo 


'use client'

import type { FeaturedProject } from '@/components/featured/projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'
import { ProjectCategoryBadge } from './ProjectCategoryBadge'

interface ProjectsGridProps {
  readonly projects: readonly FeaturedProject[]
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export function ProjectsGrid({ projects, lang, dict }: ProjectsGridProps) {
  if (!projects.length) return null

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
      {projects.map((project) => (
        <article key={project.id} className="flex flex-col justify-between rounded-2xl border border-neutral-200 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{project.description[lang]}</p>
            <div className="flex flex-wrap gap-2">
              {project.categories.map((cat) => (
                <ProjectCategoryBadge key={cat} label={dict.projects.categories[cat as keyof typeof dict.projects.categories]} />
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
} 







O arquivo 
src/components/projects/ProjectCategoryBadge.tsx


Está com esse conteúdo 

interface Props {
  readonly label: string
}

export function ProjectCategoryBadge({ label }: Props) {
  if (!label) return null

  return (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 transition-colors dark:bg-blue-900/30 dark:text-blue-300">
      {label}
    </span>
  )
} 






O arquivo 
src/hooks/useScrollSpy.ts
Está com esse conteúdo 


'use client'

import { useEffect, useState } from 'react'

export function useScrollSpy(sectionIds: readonly string[], offset: number = 100): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `-${offset}px 0px -50% 0px`, threshold: 0.1 }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds, offset])

  return activeId
}





Os dicionários 




O dicionários para análise conjunta.
De acordo com as regras do Next.js 16
E das novas regras do Typescript 6.0





src/dictionaries/pt-BR.json


{
  "meta": {
    "version": "1.0.0",
    "locale": "pt-BR",
    "direction": "ltr",
    "lastUpdated": "2026-02-03T19:10:00Z",
    "author": "Sérgio Santos",
    "source": "manual",
    "contentVersion": "2026.02.03",
    "contentHash": "i18n-ptbr-2026-02-03",
    "sourceType": "curated-manual"
  },
  "hero": {
    "greeting": "Disponível para Projetos Críticos",
    "title": "Analista de Ciência de Dados",
    "subtitle": "Dados e Resiliência",
    "headline": "Especialista em transformar infraestruturas complexas em sistemas de alta disponibilidade e pipelines de dados escaláveis.",
    "ctaPrimary": "Ver Projetos"
  },
  "about": {
    "title": "Sobre Mim",
    "differentialTitle": "Engenharia de Dados com Foco em Missão Crítica",
    "description": "Analista de Ciência de Dados com base sólida em sistemas críticos bancários e foco em transformar dados em decisões, redução de custos e eficiência operacional.",
    "differentialContent": "Atuei por mais de 15 anos no Banco Bradesco em ambientes regulados de missão crítica. Atualmente direciono minha atuação para Ciência de Dados e IA, aplicando o rigor de sistemas críticos à criação de modelos preditivos.",
    "highlights": ["15+ anos em Bancos", "Especialista Cloud", "Data Science & IA"],
    "stats": {
      "experienceValue": "+15",
      "experienceLabel": "Anos",
      "availabilityValue": "99.9%",
      "availabilityLabel": "Uptime",
      "automation": "Sistemas 100% Automatizados"
    }
  },
  "contact": {
    "title": "Vamos Conversar?",
    "subtitle": "Busco oportunidades em projetos de governança e modernização.",
    "cta": "Enviar Email",
    "emailLabel": "Copiar Email",
    "cvLabel": "Ver CV",
    "linkedinLabel": "LinkedIn"
  },
  "experience": {
    "title": "Experiência Profissional",
    "items": [
      {
        "company": "Consultor Autônomo / Transição",
        "period": "2008 - Atual",
        "role": "Especialista em Sistemas Críticos",
        "description": "Arquitetura e manutenção de pipelines de dados e infraestrutura resiliente. Foco em Ciência de Dados e automação inteligente."
      }
    ]
  },
  "articles": {
    "title": "Artigos Técnicos",
    "mediumProfile": "Ver perfil no Medium",
    "readMore": "Ler artigo completo",
    "publishedAt": "Publicado em",
    "bestOfMonth": "Destaque do Mês",
    "awardWinner": "Artigo Premiado",
    "items": [
      {
        "title": "A Era dos Dados em Sistemas Críticos",
        "description": "Como a governança de dados transforma sistemas legados em ativos estratégicos.",
        "date": "2025",
        "category": "Data Strategy",
        "isAward": true,
        "link": "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e"
      }
    ]
  },
  "projects": {
    "title": "Projetos e Soluções",
    "featuredLabel": "Destaque Técnico",
    "firstLabel": "Desafio e Arquitetura",
    "impactLabel": "Impacto e Resultado",
    "viewProject": "Repositório GitHub",
    "viewDemo": "Visualizar Demo",
    "viewAll": "Ver Todos",
    "categories": {
      "dataScience": "Ciência de Dados",
      "cloud": "Azure Databricks",
      "graphs": "Neo4J",
      "analysis": "Power BI & Análise",
      "excel": "Excel",
      "database": "Banco de Dados",
      "dev": "Desenvolvimento (Python/C#/Java)",
      "security": "Segurança"
    }
  },
  "common": {
    "navigation": "Navegação principal",
    "role": "Analista de Ciência de Dados | Python | SQL | Azure",
    "footer": "© 2026 Sérgio Santos. Todos os direitos reservados.",
    "rights": "Todos os direitos reservados",
    "builtWith": "Desenvolvido com Next.js 16 & TypeScript",
    "loading": "Carregando...",
    "error": "Algo deu errado.",
    "socialLinks": "Abrir perfil de {platform}",
    "skipToContent": "Pular para o conteúdo",
   "languageSwitcher": "Alterar idioma",
    "errorBoundary": {
      "title": "Ops! Erro inesperado.",
      "description": "Entre em contato se o problema persistir.",
      "actions": { "retry": "Tentar novamente", "home": "Início" }
    },
    "notFound": {
      "title": "Página não encontrada",
      "description": "O link pode estar quebrado.",
      "button": "Voltar"
    },
    "externalLinks": {
      "linkedin": "https://www.linkedin.com/in/santossergioluiz",
      "github": "https://github.com/Santosdevbjj",
      "medium": "https://medium.com/@sergiosantosluiz",
      "email": "santossergiorealbjj@outlook.com"
    },
    "menu": { "open": "Abrir", "close": "Fechar", "aria": { "open": "Abrir menu", "close": "Fechar menu" } }
  },
  "intl": {
    "locale": "pt-BR",
    "fallbackLocale": "pt",
    "currency": "BRL",
    "timezone": "America/Sao_Paulo",
    "unitDisplay": "short",
    "numberFormat": "pt-BR"
  },
  "states": {
    "loading": "Carregando...",
    "empty": "Sem dados.",
    "error": "Erro ao carregar.",
    "emptyProjects": { "title": "Nenhum projeto", "description": "Em breve.", "cta": "Voltar" },
    "emptyExperience": "Sem registros.",
    "errorArticles": "Erro nos artigos."
  },
  "cookie": {
    "title": "Cookies",
    "description": "Melhoramos sua experiência.",
    "necessary": "Necessários",
    "alwaysActive": "Ativo",
    "analytics": "Analíticos",
    "acceptAll": "Aceitar",
    "savePreferences": "Salvar"
  },
  "seo": {
    "siteName": "Sérgio Santos | Portfolio",
    "description": "Ciência de Dados & Sistemas Críticos",
    "keywords": ["python", "databricks", "sql", "neo4j", "data science"],
    "pages": {
      "home": { "title": "Início", "description": "Portfólio de Sérgio Santos" },
      "projects": { "title": "Projetos", "description": "Soluções de dados" },
      "articles": { "title": "Artigos", "description": "Conteúdo técnico" }
    }
  },
  "metrics": {
    "availability": "99,5%",
    "availabilityNormalized": { "value": 99.5, "unit": "%" }
  }
}








src/dictionaries/en-US.json




{
  "meta": {
    "version": "1.0.0",
    "locale": "en-US",
    "direction": "ltr",
    "lastUpdated": "2026-02-03T19:10:00Z",
    "author": "Sérgio Santos",
    "source": "manual",
    "contentVersion": "2026.02.03",
    "contentHash": "i18n-enus-2026-02-03",
    "sourceType": "curated-manual"
  },
  "hero": {
    "greeting": "Available for Mission-Critical Projects",
    "title": "Data Science Analyst",
    "subtitle": "Data & Resilience",
    "headline": "Specialist in transforming complex infrastructures into high-availability systems and scalable data pipelines.",
    "ctaPrimary": "View Projects"
  },
  "about": {
    "title": "About Me",
    "differentialTitle": "Data Engineering with a Mission-Critical Focus",
    "description": "Data Science Analyst with a solid background in critical banking systems, focusing on transforming data into decisions, cost reduction, and operational efficiency.",
    "differentialContent": "I served for over 15 years at Banco Bradesco in regulated mission-critical environments. Currently, I focus my work on Data Science and AI, applying the rigor of critical systems to the creation of predictive models.",
    "highlights": ["15+ Years in Banking", "Cloud Specialist", "Data Science & AI"],
    "stats": {
      "experienceValue": "+15",
      "experienceLabel": "Years",
      "availabilityValue": "99.9%",
      "availabilityLabel": "Uptime",
      "automation": "100% Automated Systems"
    }
  },
  "contact": {
    "title": "Let's Talk?",
    "subtitle": "Seeking opportunities in governance and modernization projects.",
    "cta": "Send Email",
    "emailLabel": "Copy Email",
    "cvLabel": "View CV",
    "linkedinLabel": "LinkedIn"
  },
  "experience": {
    "title": "Professional Experience",
    "items": [
      {
        "company": "Freelance Consultant / Transition",
        "period": "2008 - Present",
        "role": "Critical Systems Specialist",
        "description": "Architecture and maintenance of resilient data pipelines and infrastructure. Focus on Data Science and intelligent automation."
      }
    ]
  },
  "articles": {
    "title": "Technical Articles",
    "mediumProfile": "View Medium Profile",
    "readMore": "Read full article",
    "publishedAt": "Published on",
    "bestOfMonth": "Highlight of the Month",
    "awardWinner": "Award-Winning Article",
    "items": [
      {
        "title": "The Era of Data in Critical Systems",
        "description": "How data governance transforms legacy systems into strategic assets.",
        "date": "2025",
        "category": "Data Strategy",
        "isAward": true,
        "link": "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e"
      }
    ]
  },
  "projects": {
    "title": "Projects and Solutions",
    "featuredLabel": "Technical Highlight",
    "firstLabel": "Challenge & Architecture",
    "impactLabel": "Impact & Results",
    "viewProject": "GitHub Repository",
    "viewDemo": "View Demo",
    "viewAll": "View All",
    "categories": {
      "dataScience": "Data Science",
      "cloud": "Azure Databricks",
      "graphs": "Neo4J",
      "analysis": "Power BI & Analysis",
      "excel": "Excel",
      "database": "Database",
      "dev": "Development (Python/C#/Java)",
      "security": "Security"
    }
  },
  "common": {
    "navigation": "Main navigation",
    "role": "Data Science Analyst | Python | SQL | Azure",
    "footer": "© 2026 Sérgio Santos. All rights reserved.",
    "rights": "All rights reserved",
    "builtWith": "Built with Next.js 16 & TypeScript",
    "loading": "Loading...",
    "error": "Something went wrong.",
    "socialLinks": "Open {platform} profile",
    "skipToContent": "Skip to content",
  "languageSwitcher": "Change language",
    "errorBoundary": {
      "title": "Oops! Unexpected error.",
      "description": "Please contact me if the problem persists.",
      "actions": { "retry": "Try again", "home": "Home" }
    },
    "notFound": {
      "title": "Page not found",
      "description": "The link may be broken.",
      "button": "Go Back"
    },
    "externalLinks": {
      "linkedin": "https://www.linkedin.com/in/santossergioluiz",
      "github": "https://github.com/Santosdevbjj",
      "medium": "https://medium.com/@sergiosantosluiz",
      "email": "santossergiorealbjj@outlook.com"
    },
    "menu": { "open": "Open", "close": "Close", "aria": { "open": "Open menu", "close": "Close menu" } }
  },
  "intl": {
    "locale": "en-US",
    "fallbackLocale": "en",
    "currency": "USD",
    "timezone": "America/New_York",
    "unitDisplay": "short",
    "numberFormat": "en-US"
  },
  "states": {
    "loading": "Loading...",
    "empty": "No data.",
    "error": "Error loading.",
    "emptyProjects": { "title": "No projects", "description": "Coming soon.", "cta": "Go Back" },
    "emptyExperience": "No records found.",
    "errorArticles": "Error loading articles."
  },
  "cookie": {
    "title": "Cookies",
    "description": "We improve your experience.",
    "necessary": "Necessary",
    "alwaysActive": "Always Active",
    "analytics": "Analytics",
    "acceptAll": "Accept All",
    "savePreferences": "Save"
  },
  "seo": {
    "siteName": "Sérgio Santos | Portfolio",
    "description": "Data Science & Critical Systems",
    "keywords": ["python", "databricks", "sql", "neo4j", "data science"],
    "pages": {
      "home": { "title": "Home", "description": "Portfolio of Sérgio Santos" },
      "projects": { "title": "Projects", "description": "Data solutions" },
      "articles": { "title": "Articles", "description": "Technical content" }
    }
  },
  "metrics": {
    "availability": "99.5%",
    "availabilityNormalized": { "value": 99.5, "unit": "%" }
  }
} 











src/dictionaries/es-ES.json


{
  "meta": {
    "version": "1.0.0",
    "locale": "es-ES",
    "direction": "ltr",
    "lastUpdated": "2026-02-03T19:10:00Z",
    "author": "Sérgio Santos",
    "source": "manual",
    "contentVersion": "2026.02.03",
    "contentHash": "i18n-eses-2026-02-03",
    "sourceType": "curated-manual"
  },
  "hero": {
    "greeting": "Disponible para Proyectos Críticos",
    "title": "Analista de Ciencia de Datos",
    "subtitle": "Datos y Resiliencia",
    "headline": "Especialista en transformar infraestructuras complejas en sistemas de alta disponibilidad y pipelines de datos escalables.",
    "ctaPrimary": "Ver Proyectos"
  },
  "about": {
    "title": "Sobre Mí",
    "differentialTitle": "Ingeniería de Datos con Enfoque en Misión Crítica",
    "description": "Analista de Ciencia de Datos con una base sólida en sistemas críticos bancarios y enfoque en transformar datos en decisiones, reducción de costes y eficiencia operativa.",
    "differentialContent": "Trabajé durante más de 15 años en Banco Bradesco en entornos regulados de misión crítica. Actualmente dirijo mi actividad hacia la Ciencia de Datos e IA, aplicando el rigor de los sistemas críticos a la creación de modelos predictivos.",
    "highlights": ["15+ años en Banca", "Especialista Cloud", "Data Science e IA"],
    "stats": {
      "experienceValue": "+15",
      "experienceLabel": "Años",
      "availabilityValue": "99,9%",
      "availabilityLabel": "Uptime",
      "automation": "Sistemas 100% Automatizados"
    }
  },
  "contact": {
    "title": "¿Hablamos?",
    "subtitle": "Busco oportunidades en proyectos de gobernanza y modernización.",
    "cta": "Enviar Correo",
    "emailLabel": "Copiar Correo",
    "cvLabel": "Ver CV",
    "linkedinLabel": "LinkedIn"
  },
  "experience": {
    "title": "Experiencia Profesional",
    "items": [
      {
        "company": "Consultor Autónomo / Transición",
        "period": "2008 - Actualidad",
        "role": "Especialista en Sistemas Críticos",
        "description": "Arquitectura y mantenimiento de pipelines de datos e infraestructura resiliente. Enfoque en Ciencia de Datos y automatización inteligente."
      }
    ]
  },
  "articles": {
    "title": "Artículos Técnicos",
    "mediumProfile": "Ver perfil en Medium",
    "readMore": "Leer artículo completo",
    "publishedAt": "Publicado el",
    "bestOfMonth": "Destacado del Mes",
    "awardWinner": "Artículo Premiado",
    "items": [
      {
        "title": "La Era de los Datos en Sistemas Críticos",
        "description": "Cómo el gobierno de datos transforma sistemas legados en activos estratégicos.",
        "date": "2025",
        "category": "Data Strategy",
        "isAward": true,
        "link": "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e"
      }
    ]
  },
  "projects": {
    "title": "Proyectos y Soluciones",
    "featuredLabel": "Destacado Técnico",
    "firstLabel": "Desafío y Arquitectura",
    "impactLabel": "Impacto y Resultado",
    "viewProject": "Repositorio GitHub",
    "viewDemo": "Visualizar Demo",
    "viewAll": "Ver Todos",
    "categories": {
      "dataScience": "Ciencia de Datos",
      "cloud": "Azure Databricks",
      "graphs": "Neo4J",
      "analysis": "Power BI y Análisis",
      "excel": "Excel",
      "database": "Base de Datos",
      "dev": "Desarrollo (Python/C#/Java)",
      "security": "Seguridad"
    }
  },
  "common": {
    "navigation": "Navegación principal",
    "role": "Analista de Ciencia de Datos | Python | SQL | Azure",
    "footer": "© 2026 Sérgio Santos. Todos los derechos reservados.",
    "rights": "Todos los derechos reservados",
    "builtWith": "Desarrollado con Next.js 16 y TypeScript",
    "loading": "Cargando...",
    "error": "Algo ha salido mal.",
    "socialLinks": "Abrir perfil de {platform}",
    "skipToContent": "Saltar al contenido",
   "languageSwitcher": "Cambiar idioma",
    "errorBoundary": {
      "title": "¡Ops! Error inesperado.",
      "description": "Contacte con nosotros si el problema persiste.",
      "actions": { "retry": "Reintentar", "home": "Inicio" }
    },
    "notFound": {
      "title": "Página no encontrada",
      "description": "Es posible que el enlace esté roto.",
      "button": "Volver"
    },
    "externalLinks": {
      "linkedin": "https://www.linkedin.com/in/santossergioluiz",
      "github": "https://github.com/Santosdevbjj",
      "medium": "https://medium.com/@sergiosantosluiz",
      "email": "santossergiorealbjj@outlook.com"
    },
    "menu": { "open": "Abrir", "close": "Cerrar", "aria": { "open": "Abrir menú", "close": "Cerrar menú" } }
  },
  "intl": {
    "locale": "es-ES",
    "fallbackLocale": "es",
    "currency": "EUR",
    "timezone": "Europe/Madrid",
    "unitDisplay": "short",
    "numberFormat": "es-ES"
  },
  "states": {
    "loading": "Cargando...",
    "empty": "Sin datos.",
    "error": "Error al cargar.",
    "emptyProjects": { "title": "Ningún proyecto", "description": "Próximamente.", "cta": "Volver" },
    "emptyExperience": "Sin registros.",
    "errorArticles": "Error en los artículos."
  },
  "cookie": {
    "title": "Cookies",
    "description": "Mejoramos tu experiencia.",
    "necessary": "Necesarias",
    "alwaysActive": "Activa",
    "analytics": "Analíticas",
    "acceptAll": "Aceptar",
    "savePreferences": "Guardar"
  },
  "seo": {
    "siteName": "Sérgio Santos | Portfolio",
    "description": "Ciencia de Datos y Sistemas Críticos",
    "keywords": ["python", "databricks", "sql", "neo4j", "data science"],
    "pages": {
      "home": { "title": "Inicio", "description": "Portfolio de Sérgio Santos" },
      "projects": { "title": "Proyectos", "description": "Soluciones de datos" },
      "articles": { "title": "Artículos", "description": "Contenido técnico" }
    }
  },
  "metrics": {
    "availability": "99,5%",
    "availabilityNormalized": { "value": 99.5, "unit": "%" }
  }
} 










src/dictionaries/es-AR.json


{
  "meta": {
    "version": "1.0.0",
    "locale": "es-AR",
    "direction": "ltr",
    "lastUpdated": "2026-02-03T19:10:00Z",
    "author": "Sérgio Santos",
    "source": "manual",
    "contentVersion": "2026.02.03",
    "contentHash": "i18n-esar-2026-02-03",
    "sourceType": "curated-manual"
  },
  "hero": {
    "greeting": "Disponible para Proyectos Críticos",
    "title": "Analista de Ciencia de Datos",
    "subtitle": "Datos y Resiliencia",
    "headline": "Especialista en transformar infraestructuras complejas en sistemas de alta disponibilidad y pipelines de datos escalables.",
    "ctaPrimary": "Ver Proyectos"
  },
  "about": {
    "title": "Sobre Mí",
    "differentialTitle": "Ingeniería de Datos con Foco en Misión Crítica",
    "description": "Analista de Ciencia de Datos con base sólida en sistemas críticos bancarios y foco en transformar datos en decisiones, reducción de costos y eficiencia operativa.",
    "differentialContent": "Laburé por más de 15 años en el Banco Bradesco en ambientes regulados de misión crítica. Actualmente direcciono mi actividad hacia la Ciencia de Datos e IA, aplicando el rigor de sistemas críticos a la creación de modelos predictivos.",
    "highlights": ["15+ años en Bancos", "Especialista Cloud", "Data Science e IA"],
    "stats": {
      "experienceValue": "+15",
      "experienceLabel": "Años",
      "availabilityValue": "99,9%",
      "availabilityLabel": "Uptime",
      "automation": "Sistemas 100% Automatizados"
    }
  },
  "contact": {
    "title": "¿Charlamos?",
    "subtitle": "Busco oportunidades en proyectos de gobernanza y modernización.",
    "cta": "Enviar Email",
    "emailLabel": "Copiar Email",
    "cvLabel": "Ver CV",
    "linkedinLabel": "LinkedIn"
  },
  "experience": {
    "title": "Experiencia Profesional",
    "items": [
      {
        "company": "Consultor Autónomo / Transición",
        "period": "2008 - Actualidad",
        "role": "Especialista en Sistemas Críticos",
        "description": "Arquitectura y mantenimiento de pipelines de datos e infraestructura resiliente. Foco en Ciencia de Datos y automatización inteligente."
      }
    ]
  },
  "articles": {
    "title": "Artículos Técnicos",
    "mediumProfile": "Ver perfil en Medium",
    "readMore": "Leer artículo completo",
    "publishedAt": "Publicado el",
    "bestOfMonth": "Destacado del Mes",
    "awardWinner": "Artículo Premiado",
    "items": [
      {
        "title": "La Era de los Datos en Sistemas Críticos",
        "description": "Cómo el gobierno de datos transforma sistemas legados en activos estratégicos.",
        "date": "2025",
        "category": "Data Strategy",
        "isAward": true,
        "link": "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e"
      }
    ]
  },
  "projects": {
    "title": "Proyectos y Soluciones",
    "featuredLabel": "Destacado Técnico",
    "firstLabel": "Desafío y Arquitectura",
    "impactLabel": "Impacto y Resultado",
    "viewProject": "Repositorio GitHub",
    "viewDemo": "Visualizar Demo",
    "viewAll": "Ver Todos",
    "categories": {
      "dataScience": "Ciencia de Datos",
      "cloud": "Azure Databricks",
      "graphs": "Neo4J",
      "analysis": "Power BI y Análisis",
      "excel": "Excel",
      "database": "Base de Datos",
      "dev": "Desarrollo (Python/C#/Java)",
      "security": "Seguridad"
    }
  },
  "common": {
    "navigation": "Navegación principal",
    "role": "Analista de Ciencia de Datos | Python | SQL | Azure",
    "footer": "© 2026 Sérgio Santos. Todos los derechos reservados.",
    "rights": "Todos los derechos reservados",
    "builtWith": "Desarrollado con Next.js 16 y TypeScript",
    "loading": "Cargando...",
    "error": "Algo salió mal.",
    "socialLinks": "Abrir perfil de {platform}",
    "skipToContent": "Ir al contenido",
  "languageSwitcher": "Cambiar idioma",
    "errorBoundary": {
      "title": "¡Upa! Error inesperado.",
      "description": "Ponete en contacto si el problema persiste.",
      "actions": { "retry": "Reintentar", "home": "Inicio" }
    },
    "notFound": {
      "title": "Página no encontrada",
      "description": "El link puede estar roto.",
      "button": "Volver"
    },
    "externalLinks": {
      "linkedin": "https://www.linkedin.com/in/santossergioluiz",
      "github": "https://github.com/Santosdevbjj",
      "medium": "https://medium.com/@sergiosantosluiz",
      "email": "santossergiorealbjj@outlook.com"
    },
    "menu": { "open": "Abrir", "close": "Cerrar", "aria": { "open": "Abrir menú", "close": "Cerrar menú" } }
  },
  "intl": {
    "locale": "es-AR",
    "fallbackLocale": "es",
    "currency": "ARS",
    "timezone": "America/Argentina/Buenos_Aires",
    "unitDisplay": "short",
    "numberFormat": "es-AR"
  },
  "states": {
    "loading": "Cargando...",
    "empty": "Sin datos.",
    "error": "Error al cargar.",
    "emptyProjects": { "title": "Ningún proyecto", "description": "Próximamente.", "cta": "Volver" },
    "emptyExperience": "Sin registros.",
    "errorArticles": "Error en los artículos."
  },
  "cookie": {
    "title": "Cookies",
    "description": "Mejoramos tu experiencia.",
    "necessary": "Necesarias",
    "alwaysActive": "Activo",
    "analytics": "Analíticas",
    "acceptAll": "Aceptar",
    "savePreferences": "Guardar"
  },
  "seo": {
    "siteName": "Sérgio Santos | Portfolio",
    "description": "Ciencia de Datos y Sistemas Críticos",
    "keywords": ["python", "databricks", "sql", "neo4j", "data science"],
    "pages": {
      "home": { "title": "Inicio", "description": "Portfolio de Sérgio Santos" },
      "projects": { "title": "Proyectos", "description": "Soluciones de datos" },
      "articles": { "title": "Artículos", "description": "Contenido técnico" }
    }
  },
  "metrics": {
    "availability": "99,5%",
    "availabilityNormalized": { "value": 99.5, "unit": "%" }
  }
} 









src/dictionaries/es-MX.json




{
  "meta": {
    "version": "1.0.0",
    "locale": "es-MX",
    "direction": "ltr",
    "lastUpdated": "2026-02-03T19:10:00Z",
    "author": "Sérgio Santos",
    "source": "manual",
    "contentVersion": "2026.02.03",
    "contentHash": "i18n-esmx-2026-02-03",
    "sourceType": "curated-manual"
  },
  "hero": {
    "greeting": "Disponible para Proyectos Críticos",
    "title": "Analista de Ciencia de Datos",
    "subtitle": "Datos y Resiliencia",
    "headline": "Especialista en transformar infraestructuras complejas en sistemas de alta disponibilidad y pipelines de datos escalables.",
    "ctaPrimary": "Ver Proyectos"
  },
  "about": {
    "title": "Sobre Mí",
    "differentialTitle": "Ingeniería de Datos con Enfoque en Misión Crítica",
    "description": "Analista de Ciencia de Datos con una base sólida en sistemas críticos bancarios y enfoque en transformar datos en decisiones, reducción de costos y eficiencia operativa.",
    "differentialContent": "Colaboré por más de 15 años en Banco Bradesco en entornos regulados de misión crítica. Actualmente enfoco mi labor en Ciencia de Datos e IA, aplicando el rigor de sistemas críticos a la creación de modelos predictivos.",
    "highlights": ["15+ años en Bancos", "Especialista Cloud", "Data Science e IA"],
    "stats": {
      "experienceValue": "+15",
      "experienceLabel": "Años",
      "availabilityValue": "99.9%",
      "availabilityLabel": "Uptime",
      "automation": "Sistemas 100% Automatizados"
    }
  },
  "contact": {
    "title": "¿Platicamos?",
    "subtitle": "Busco oportunidades en proyectos de gobernanza y modernización.",
    "cta": "Enviar Correo",
    "emailLabel": "Copiar Correo",
    "cvLabel": "Ver CV",
    "linkedinLabel": "LinkedIn"
  },
  "experience": {
    "title": "Experiencia Profesional",
    "items": [
      {
        "company": "Consultor Autónomo / Transición",
        "period": "2008 - Actualidad",
        "role": "Especialista en Sistemas Críticos",
        "description": "Arquitectura y mantenimiento de pipelines de datos e infraestructura resiliente. Enfoque en Ciencia de Datos y automatización inteligente."
      }
    ]
  },
  "articles": {
    "title": "Artículos Técnicos",
    "mediumProfile": "Ver perfil en Medium",
    "readMore": "Leer artículo completo",
    "publishedAt": "Publicado el",
    "bestOfMonth": "Destacado del Mes",
    "awardWinner": "Artículo Premiado",
    "items": [
      {
        "title": "La Era de los Datos en Sistemas Críticos",
        "description": "Cómo la gobernanza de datos transforma sistemas legados en activos estratégicos.",
        "date": "2025",
        "category": "Data Strategy",
        "isAward": true,
        "link": "https://medium.com/@sergiosantosluiz/low-code-na-sa%C3%BAde-como-criar-apps-m%C3%A9dicos-em-semanas-1c6f05c2c89e"
      }
    ]
  },
  "projects": {
    "title": "Proyectos y Soluciones",
    "featuredLabel": "Destacado Técnico",
    "firstLabel": "Desafío y Arquitectura",
    "impactLabel": "Impacto y Resultado",
    "viewProject": "Repositorio GitHub",
    "viewDemo": "Visualizar Demo",
    "viewAll": "Ver Todos",
    "categories": {
      "dataScience": "Ciencia de Datos",
      "cloud": "Azure Databricks",
      "graphs": "Neo4J",
      "analysis": "Power BI y Análisis",
      "excel": "Excel",
      "database": "Base de Datos",
      "dev": "Desarrollo (Python/C#/Java)",
      "security": "Seguridad"
    }
  },
  "common": {
    "navigation": "Navegación principal",
    "role": "Analista de Ciencia de Datos | Python | SQL | Azure",
    "footer": "© 2026 Sérgio Santos. Todos los derechos reservados.",
    "rights": "Todos los derechos reservados",
    "builtWith": "Desarrollado con Next.js 16 y TypeScript",
    "loading": "Cargando...",
    "error": "Algo salió mal.",
    "socialLinks": "Abrir perfil de {platform}",
    "skipToContent": "Brincar al contenido",
  "languageSwitcher": "Cambiar idioma",
    "errorBoundary": {
      "title": "¡Ups! Error inesperado.",
      "description": "Ponte en contacto si el problema persiste.",
      "actions": { "retry": "Reintentar", "home": "Inicio" }
    },
    "notFound": {
      "title": "Página no encontrada",
      "description": "El enlace podría estar roto.",
      "button": "Volver"
    },
    "externalLinks": {
      "linkedin": "https://www.linkedin.com/in/santossergioluiz",
      "github": "https://github.com/Santosdevbjj",
      "medium": "https://medium.com/@sergiosantosluiz",
      "email": "santossergiorealbjj@outlook.com"
    },
    "menu": { "open": "Abrir", "close": "Cerrar", "aria": { "open": "Abrir menú", "close": "Cerrar menú" } }
  },
  "intl": {
    "locale": "es-MX",
    "fallbackLocale": "es",
    "currency": "MXN",
    "timezone": "America/Mexico_City",
    "unitDisplay": "short",
    "numberFormat": "es-MX"
  },
  "states": {
    "loading": "Cargando...",
    "empty": "Sin datos.",
    "error": "Error al cargar.",
    "emptyProjects": { "title": "Ningún proyecto", "description": "Próximamente.", "cta": "Volver" },
    "emptyExperience": "Sin registros.",
    "errorArticles": "Error en los artículos."
  },
  "cookie": {
    "title": "Cookies",
    "description": "Mejoramos tu experiencia.",
    "necessary": "Necesarias",
    "alwaysActive": "Activo",
    "analytics": "Analíticos",
    "acceptAll": "Aceptar",
    "savePreferences": "Guardar"
  },
  "seo": {
    "siteName": "Sérgio Santos | Portfolio",
    "description": "Ciencia de Datos y Sistemas Críticos",
    "keywords": ["python", "databricks", "sql", "neo4j", "data science"],
    "pages": {
      "home": { "title": "Inicio", "description": "Portafolio de Sérgio Santos" },
      "projects": { "title": "Proyectos", "description": "Soluciones de datos" },
      "articles": { "title": "Artículos", "description": "Contenido técnico" }
    }
  },
  "metrics": {
    "availability": "99,5%",
    "availabilityNormalized": { "value": 99.5, "unit": "%" }
  }
} 










src/dictionaries/index.ts


// src/dictionaries/index.ts
import type { Dictionary } from "@/types/dictionary";
import {
  DEFAULT_LOCALE,
  normalizeLocale,
  type SupportedLocale,
} from "./locales";

const loaders: Record<
  SupportedLocale,
  () => Promise<Dictionary>
> = {
  "pt-BR": () => import("./pt-BR.json").then(m => m.default),
  "en-US": () => import("./en-US.json").then(m => m.default),
  "es-ES": () => import("./es-ES.json").then(m => m.default),
  "es-AR": () => import("./es-AR.json").then(m => m.default),
  "es-MX": () => import("./es-MX.json").then(m => m.default),
};

export const getDictionary = async (
  locale?: string,
): Promise<Dictionary> => {
  const normalized = normalizeLocale(locale);
  const loader = loaders[normalized] ?? loaders[DEFAULT_LOCALE];
  return loader();
};







src/dictionaries/locales.ts


// src/dictionaries/locales.ts

/**
 * Lista oficial de locales suportados.
 * Usado por:
 * - getDictionary
 * - generateStaticParams
 * - validação de rota
 */
export const SUPPORTED_LOCALES = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX",
] as const;

/**
 * Tipo derivado automaticamente da constante.
 * ✔ 100% seguro
 * ✔ Compatível com TS 6
 */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Locale padrão do sistema.
 */
export const DEFAULT_LOCALE: SupportedLocale = "pt-BR";

/**
 * Verifica se um valor é um locale suportado.
 * Type guard seguro para TS 6.
 */
export function isValidLocale(
  locale?: string,
): locale is SupportedLocale {
  if (!locale) return false;
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Normaliza qualquer entrada (URL, cookie, header)
 * para um locale suportado.
 *
 * Exemplos:
 *  pt   -> pt-BR
 *  en   -> en-US
 *  es   -> es-ES
 *  null -> DEFAULT_LOCALE
 */
export function normalizeLocale(
  locale?: string,
): SupportedLocale {
  if (!locale) return DEFAULT_LOCALE;

  // Normalização curta (ISO base)
  if (locale === "pt") return "pt-BR";
  if (locale === "en") return "en-US";
  if (locale === "es") return "es-ES";

  // Se já for suportado
  if (isValidLocale(locale)) {
    return locale;
  }

  return DEFAULT_LOCALE;
}













src/types/dictionary.ts


// src/types/dictionary.ts

import type { SupportedLocale } from "@/dictionaries/locales";

/**
 * Fonte única de verdade para Locale.
 * ✔ Elimina duplicação
 * ✔ Evita drift entre dicionários e domínio
 * ✔ TS 6 compliant
 */
export type Locale = SupportedLocale;

/* -------------------------------------------------------------------------- */
/*                                   META                                     */
/* -------------------------------------------------------------------------- */

export interface DictionaryMeta {
  version: string;
  locale: Locale;
  direction: "ltr" | "rtl";
  lastUpdated: string;
  author: string;
  source: string;
  contentVersion?: string;
  contentHash?: string;
  sourceType?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   HERO                                     */
/* -------------------------------------------------------------------------- */

export interface HeroDictionary {
  greeting: string;
  title: string;
  subtitle: string;
  headline: string;
  ctaPrimary: string;
}

/* -------------------------------------------------------------------------- */
/*                                   ABOUT                                    */
/* -------------------------------------------------------------------------- */

export interface AboutDictionary {
  title: string;
  differentialTitle: string;
  description: string;
  differentialContent: string;
  highlights: string[];
  stats: {
    experienceValue: string;
    experienceLabel: string;
    availabilityValue: string;
    availabilityLabel: string;
    automation: string;
  };
}

/* -------------------------------------------------------------------------- */
/*                                  CONTACT                                   */
/* -------------------------------------------------------------------------- */

export interface ContactDictionary {
  title: string;
  subtitle: string;
  cta: string;
  emailLabel: string;
  cvLabel: string;
  linkedinLabel: string;
}

/* -------------------------------------------------------------------------- */
/*                                EXPERIENCE                                  */
/* -------------------------------------------------------------------------- */

export interface ExperienceItem {
  company: string;
  period: string;
  role: string;
  description: string;
}

export interface ExperienceDictionary {
  title: string;
  items: ExperienceItem[];
}

/* -------------------------------------------------------------------------- */
/*                                  ARTICLES                                  */
/* -------------------------------------------------------------------------- */

export interface ArticleItem {
  title: string;
  description: string;
  date: string;
  category: string;
  isAward: boolean;
  link: string;
}

export interface ArticlesSectionDictionary {
  title: string;
  mediumProfile: string;
  readMore: string;
  publishedAt: string;
  bestOfMonth: string;
  awardWinner: string;
  items: ArticleItem[];
}

/* -------------------------------------------------------------------------- */
/*                                  PROJECTS                                  */
/* -------------------------------------------------------------------------- */

export interface ProjectCategories {
  dataScience: string;
  cloud: string;
  graphs: string;
  analysis: string;
  excel: string;
  database: string;
  dev: string;
  security: string;
}

export interface ProjectsSectionDictionary {
  title: string;
  featuredLabel: string;
  firstLabel: string;
  impactLabel: string;
  viewProject: string;
  viewDemo: string;
  viewAll: string;
  categories: ProjectCategories;
}

/* -------------------------------------------------------------------------- */
/*                                   COMMON                                   */
/* -------------------------------------------------------------------------- */

export interface CommonDictionary {
  navigation: string;
  role: string;
  footer: string;
  rights: string;
  builtWith: string;
  loading: string;
  error: string;
  socialLinks: string;
  skipToContent: string;
  languageSwitcher: string;

  errorBoundary: {
    title: string;
    description: string;
    actions: {
      retry: string;
      home: string;
    };
  };

  notFound: {
    title: string;
    description: string;
    button: string;
  };

  externalLinks: {
    linkedin: string;
    github: string;
    medium: string;
    email: string;
  };

  menu: {
    open: string;
    close: string;
    aria: {
      open: string;
      close: string;
    };
  };
}

/* -------------------------------------------------------------------------- */
/*                                   STATES                                   */
/* -------------------------------------------------------------------------- */

export interface StateDictionary {
  loading: string;
  empty: string;
  error: string;
  emptyProjects: {
    title: string;
    description: string;
    cta: string;
  };
  emptyExperience: string;
  errorArticles: string;
}

/* -------------------------------------------------------------------------- */
/*                                 ROOT TYPE                                  */
/* -------------------------------------------------------------------------- */

export interface Dictionary {
  meta: DictionaryMeta;

  hero: HeroDictionary;
  about: AboutDictionary;
  contact: ContactDictionary;
  experience: ExperienceDictionary;
  articles: ArticlesSectionDictionary;
  projects: ProjectsSectionDictionary;
  common: CommonDictionary;

  intl: {
    locale: Locale;
    fallbackLocale: string;
    currency: string;
    timezone: string;
    unitDisplay: string;
    numberFormat: string;
  };

  states: StateDictionary;

  cookie: {
    title: string;
    description: string;
    necessary: string;
    alwaysActive: string;
    analytics: string;
    acceptAll: string;
    savePreferences: string;
  };

  seo: {
    siteName: string;
    description: string;
    keywords: string[];
    pages: Record<
      string,
      {
        title: string;
        description: string;
      }
    >;
  };

  metrics: {
    availability: string;
    availabilityNormalized: {
      value: number;
      unit: string;
    };
  };
} 



















src/types/project.ts


// src/types/project.ts

import { Locale } from "./dictionary";

export type ProjectLocaleContent = {
  title: string;
  description: string;
  summary?: string;
};

export interface ProjectSEO {
  title: string;
  description: string;
  keywords?: string[];
}

export interface ProjectLinks {
  repository?: string;
  demo?: string;
  article?: string;
}

export interface Project {
  id: string;
  slug: string;
  category: string;
  featured: boolean;
  order: number;
  status: "active" | "archived" | "draft";

  /**
   * Conteúdo localizado do projeto.
   * 'pt-BR' é obrigatório, os demais são opcionais.
   */
  content: {
    "pt-BR": ProjectLocaleContent;
  } & Partial<Record<Exclude<Locale, "pt-BR">, ProjectLocaleContent>>;

  /**
   * SEO localizado do projeto.
   */
  seo: {
    "pt-BR": ProjectSEO;
  } & Partial<Record<Exclude<Locale, "pt-BR">, ProjectSEO>>;

  stack: string[];
  links?: ProjectLinks;
  createdAt: string;
  updatedAt?: string;
} 











src/domain/career.ts



// src/domain/career.ts

export enum CareerRole {
  DATA_SPECIALIST = 'data_specialist',
  SYSTEMS_EXPERT = 'systems_expert',
  STRATEGIC_LEAD = 'strategic_lead',
}

export interface CareerExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  // Achievements podem vir de uma lista complementar ou metadados
  achievements?: string[]; 
}  











src/domain/navigation.ts


// src/domain/navigation.ts

/**
 * Seções lógicas da navegação.
 * NÃO dependem de idioma.
 */
export enum NavSection {
  ABOUT = 'about',
  EXPERIENCE = 'experience',
  PROJECTS = 'projects',
  ARTICLES = 'articles',
  CONTACT = 'contact',
}

/**
 * Ordem canônica das seções.
 * Usada por Navbar, ScrollSpy e PageWrapper.
 */
export const NAV_SECTIONS: readonly NavSection[] = [
  NavSection.ABOUT,
  NavSection.EXPERIENCE,
  NavSection.PROJECTS,
  NavSection.ARTICLES,
  NavSection.CONTACT,
] as const;

/**
 * Mapeia cada seção para um hash HTML estável.
 * ❗ Nunca deve ser traduzido.
 * ❗ Nunca depende de i18n.
 */
export const NAV_HASH_MAP: Readonly<
  Record<NavSection, `#${NavSection}`>
> = {
  [NavSection.ABOUT]: '#about',
  [NavSection.EXPERIENCE]: '#experience',
  [NavSection.PROJECTS]: '#projects',
  [NavSection.ARTICLES]: '#articles',
  [NavSection.CONTACT]: '#contact',
} as const;

/**
 * Retorna o hash (#section)
 */
export const getNavHash = (
  section: NavSection,
): `#${NavSection}` => NAV_HASH_MAP[section];

/**
 * Retorna o ID puro da seção (sem #)
 * Usado em <section id="..." />
 */
export const getSectionId = (
  section: NavSection,
): NavSection => section;












src/domain/projects.ts



// src/domain/projects.ts

import type { ProjectCategories } from "@/types/dictionary";

export enum ProjectCoreTag {
  PORTFOLIO = "portfolio",
  FEATURED = "featured",
  DESTAQUE = "destaque",
  PRIMEIRO = "primeiro",
}

export enum ProjectTechnology {
  DATA_SCIENCE = "data-science",
  AZURE_DATABRICKS = "azure-databricks",
  NEO4J = "neo4j",
  POWER_BI = "power-bi",
  EXCEL = "excel",
  DATABASE = "database",
  PYTHON = "python",
  DOTNET = "dotnet",
  JAVA = "java",
  MACHINE_LEARNING = "machine-learning",
  ARTIFICIAL_INTELLIGENCE = "artificial-intelligence",
  AWS = "aws",
  CYBERSECURITY = "cybersecurity",
  SECURITY = "security",
  PROGRAMMING_LOGIC = "programming-logic",
  HTML = "html",
  NODE_REACT = "node-react",
}

export const PROJECT_TECHNOLOGY_ORDER: readonly ProjectTechnology[] =
  Object.values(ProjectTechnology);

export interface ProjectDomain {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly htmlUrl: string;
  readonly homepage?: string | null;
  readonly topics: readonly string[];
  readonly technology: {
    id: ProjectTechnology;
    labelKey: keyof ProjectCategories;
  };
  readonly isPortfolio: boolean;
  readonly isFeatured: boolean;
  readonly isFirst: boolean;
}

const TECHNOLOGY_CATEGORY_MAP: Record<
  ProjectTechnology,
  keyof ProjectCategories
> = {
  [ProjectTechnology.DATA_SCIENCE]: "dataScience",
  [ProjectTechnology.AZURE_DATABRICKS]: "cloud",
  [ProjectTechnology.NEO4J]: "graphs",
  [ProjectTechnology.POWER_BI]: "analysis",
  [ProjectTechnology.EXCEL]: "excel",
  [ProjectTechnology.DATABASE]: "database",
  [ProjectTechnology.PYTHON]: "dev",
  [ProjectTechnology.DOTNET]: "dev",
  [ProjectTechnology.JAVA]: "dev",
  [ProjectTechnology.MACHINE_LEARNING]: "dataScience",
  [ProjectTechnology.ARTIFICIAL_INTELLIGENCE]: "dataScience",
  [ProjectTechnology.AWS]: "cloud",
  [ProjectTechnology.CYBERSECURITY]: "security",
  [ProjectTechnology.SECURITY]: "security",
  [ProjectTechnology.PROGRAMMING_LOGIC]: "dev",
  [ProjectTechnology.HTML]: "dev",
  [ProjectTechnology.NODE_REACT]: "dev",
};

export const resolveProjectTechnology = (
  topics: readonly string[],
): ProjectDomain["technology"] => {
  const normalized = topics.map(t => t.toLowerCase());

  const tech =
    PROJECT_TECHNOLOGY_ORDER.find(t => normalized.includes(t)) ??
    ProjectTechnology.DATA_SCIENCE;

  return {
    id: tech,
    labelKey: TECHNOLOGY_CATEGORY_MAP[tech],
  };
};

export const resolveProjectFlags = (topics: readonly string[]) => {
  const normalized = topics.map(t => t.toLowerCase());

  return {
    isPortfolio: normalized.includes(ProjectCoreTag.PORTFOLIO),
    isFeatured:
      normalized.includes(ProjectCoreTag.FEATURED) ||
      normalized.includes(ProjectCoreTag.DESTAQUE),
    isFirst: normalized.includes(ProjectCoreTag.PRIMEIRO),
  };
}; 












src/dictionaries/validator.ts


// src/dictionaries/validator.ts

import { Dictionary } from "@/types/dictionary";

export function validateDictionary(
  dictionary: Dictionary
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // --- Função Auxiliar: Validação de SEO ---
  const validateSeo = (seo: any) => {
    if (!seo) {
      errors.push("Missing seo section");
      return;
    }
    if (!seo.siteName) errors.push("Missing seo.siteName");
    if (!Array.isArray(seo.keywords)) errors.push("seo.keywords must be an array");
    
    const requiredPages = ['home', 'projects', 'articles'];
    requiredPages.forEach(page => {
      if (!seo.pages?.[page]?.title) errors.push(`Missing seo.pages.${page}.title`);
      if (!seo.pages?.[page]?.description) errors.push(`Missing seo.pages.${page}.description`);
    });
  };

  // --- 1. Validação de Meta e Internacionalização ---
  if (!dictionary?.meta?.locale) {
    errors.push("Missing meta.locale");
  }
  if (!dictionary?.intl?.currency) {
    errors.push("Missing intl section or currency");
  }

  // --- 2. Validação de SEO ---
  validateSeo(dictionary.seo);

  // --- 3. Validação da Seção Hero ---
  if (!dictionary?.hero) {
    errors.push("Missing hero section");
  } else {
    if (!dictionary.hero.title) errors.push("Missing hero.title");
    if (!dictionary.hero.ctaPrimary) errors.push("Missing hero.ctaPrimary");
  }

  // --- 4. Validação de Experiência Profissional ---
  if (!dictionary?.experience) {
    errors.push("Missing experience section");
  } else {
    if (!dictionary.experience.title) errors.push("Missing experience.title");
    if (!Array.isArray(dictionary.experience.items) || dictionary.experience.items.length === 0) {
      errors.push("experience.items must be a non-empty array");
    } else {
      dictionary.experience.items.forEach((item, index) => {
        if (!item.company) errors.push(`Missing experience.items[${index}].company`);
        if (!item.role) errors.push(`Missing experience.items[${index}].role`);
      });
    }
  }

  // --- 5. Validação de Artigos ---
  if (!dictionary?.articles) {
    errors.push("Missing articles section");
  } else {
    const { articles } = dictionary;
    if (!articles.title) errors.push("Missing articles.title");
    if (!Array.isArray(articles.items)) {
      errors.push("articles.items must be an array");
    } else {
      articles.items.forEach((article, index) => {
        if (!article.title) errors.push(`Missing articles.items[${index}].title`);
        if (!article.link) errors.push(`Missing articles.items[${index}].link`);
        if (typeof article.isAward !== 'boolean') {
          errors.push(`articles.items[${index}].isAward must be a boolean`);
        }
      });
    }
  }

  // --- 6. Validação de Projetos e Categorias ---
  if (!dictionary?.projects?.categories) {
    errors.push("Missing projects.categories section");
  }

  // --- 7. Validação de Contato e Erros ---
  if (!dictionary?.contact?.cta) errors.push("Missing contact.cta");
  
  if (!dictionary?.common?.errorBoundary?.actions?.retry) {
    errors.push("Missing common.errorBoundary.actions.retry");
  }

  // --- 8. Validação de Estados de UI (Empty States) ---
  if (!dictionary?.states?.emptyProjects?.title) {
    errors.push("Missing states.emptyProjects.title");
  }

  // --- 9. Validação de Métricas (Normalização) ---
  if (dictionary?.metrics?.availabilityNormalized) {
    const { value, unit } = dictionary.metrics.availabilityNormalized;
    if (typeof value !== "number") {
      errors.push("metrics.availabilityNormalized.value must be a number");
    }
    if (unit !== "%") {
      errors.push("metrics.availabilityNormalized.unit must be '%'");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
} 



















src/dictionaries/validateAllLocales.ts



// src/dictionaries/validateAllLocales.ts

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";
import esAR from "./es-AR.json";
import esMX from "./es-MX.json";

import { validateCrossLocale } from "./validateCrossLocale";
import { Dictionary } from "@/types/dictionary";

/**
 * Valida a consistência estrutural entre todos os dicionários.
 * Garante que chaves presentes no idioma principal (pt-BR) existam nos outros.
 */
export function validateAllLocales() {
  // Cast para Dictionary para garantir que estamos validando contra o contrato correto
  const base = ptBR as Dictionary;
  
  const targets = [
    { data: enUS as Dictionary, code: "en-US" },
    { data: esES as Dictionary, code: "es-ES" },
    { data: esAR as Dictionary, code: "es-AR" },
    { data: esMX as Dictionary, code: "es-MX" }
  ];

  const errors: string[] = [];

  // Executa a validação cruzada para cada idioma contra o pt-BR
  targets.forEach(target => {
    errors.push(...validateCrossLocale(base, target.data, "pt-BR", target.code));
  });

  if (errors.length > 0) {
    console.error("\n❌ i18n validation failed (Alignment Errors):\n");
    errors.forEach(err => console.error(`  - ${err}`));
    
    // Interrompe o build ou execução se houver erro de alinhamento
    if (process.env.NODE_ENV !== "development") {
      throw new Error("i18n validation failed");
    }
  } else {
    console.log("✅ i18n dictionaries are fully aligned (5 locales).");
  }
} 

















src/dictionaries/validateCrossLocale.ts



// src/dictionaries/validateCrossLocale.ts

import { Dictionary } from "@/types/dictionary";

/**
 * Função recursiva para extrair todos os caminhos (dots) de um dicionário.
 * Ex: "common.errorBoundary.actions.retry"
 */
function getAllPaths(obj: any, prefix = ""): string[] {
  if (!obj || typeof obj !== "object") return [];

  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    // Continua a recursão se for um objeto, mas ignora arrays (como intl.contract.requiredFields)
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return getAllPaths(value, path);
    }

    return [path];
  });
}

/**
 * Compara o dicionário base (pt-BR) com um dicionário alvo para encontrar 
 * chaves faltantes ou chaves extras não traduzidas.
 */
export function validateCrossLocale(
  base: Dictionary,
  target: Dictionary,
  baseName: string,
  targetName: string
): string[] {
  const basePaths = new Set(getAllPaths(base));
  const targetPaths = new Set(getAllPaths(target));

  const missingInTarget = [...basePaths].filter(p => !targetPaths.has(p));
  const extraInTarget = [...targetPaths].filter(p => !basePaths.has(p));

  const errors: string[] = [];

  if (missingInTarget.length > 0) {
    errors.push(
      `[${targetName}] Faltando chaves presentes em ${baseName}:\n    ${missingInTarget.join("\n    ")}`
    );
  }

  if (extraInTarget.length > 0) {
    errors.push(
      `[${targetName}] Chaves extras que não existem em ${baseName}:\n    ${extraInTarget.join("\n    ")}`
    );
  }

  return errors;
} 








src/lib/getServerDictionary.ts



// src/lib/getServerDictionary.ts
import { cache } from "react";

import { getDictionary } from "@/dictionaries";
import type { Locale, Dictionary } from "@/types/dictionary";

/**
 * Carrega e cacheia o dicionário por locale.
 * ✔ Server-only
 * ✔ Compatível com Next.js 16
 * ✔ TS 6 friendly (tipagem explícita)
 */
export const getServerDictionary = cache(
  async (locale: Locale): Promise<Dictionary> => {
    return getDictionary(locale);
  }
);















src/mappers/projectMapper.ts

// src/mappers/projectMapper.ts
import type { GitHubRepo } from "@/services/githubService";
import type { ProjectDomain } from "@/domain/projects";
import {
  resolveProjectTechnology,
  resolveProjectFlags,
} from "@/domain/projects";

export function mapGitHubRepoToProject(
  repo: GitHubRepo,
): ProjectDomain {
  const technology = resolveProjectTechnology(repo.topics ?? []);
  const flags = resolveProjectFlags(repo.topics ?? []);

  return {
    id: String(repo.id),
    name: repo.name,
    description: repo.description ?? "",
    htmlUrl: repo.html_url,
    homepage: repo.homepage ?? null,
    topics: repo.topics ?? [],
    technology,
    ...flags,
  };
} 















src/services/githubService.ts


// src/services/githubService.ts

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics?: string[];
}

const GITHUB_API_URL = "https://api.github.com";

export async function fetchUserRepos(
  username: string,
): Promise<GitHubRepo[]> {
  const response = await fetch(
    `${GITHUB_API_URL}/users/${username}/repos`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return (await response.json()) as GitHubRepo[];
}

// ✅ Alias explícito para compatibilidade
export { fetchUserRepos as getGitHubProjects }; 

























tests/i18n.spec.ts


import { Dictionary } from "../src/types/dictionary";
import { validateCrossLocale } from "../src/dictionaries/validateCrossLocale";

// Imports corretos conforme os nomes dos arquivos físicos
import ptBR from "../src/dictionaries/pt-BR.json";
import enUS from "../src/dictionaries/en-US.json";
import esES from "../src/dictionaries/es-ES.json";
import esAR from "../src/dictionaries/es-AR.json";
import esMX from "../src/dictionaries/es-MX.json";

describe("i18n dictionaries consistency", () => {
  const base = ptBR as Dictionary;

  it("pt-BR ↔ en-US should have identical structure", () => {
    const errors = validateCrossLocale(base, enUS as Dictionary, "pt-BR", "en-US");
    expect(errors).toHaveLength(0);
  });

  it("pt-BR ↔ es-ES should have identical structure", () => {
    const errors = validateCrossLocale(base, esES as Dictionary, "pt-BR", "es-ES");
    expect(errors).toHaveLength(0);
  });

  it("pt-BR ↔ es-AR should have identical structure", () => {
    const errors = validateCrossLocale(base, esAR as Dictionary, "pt-BR", "es-AR");
    expect(errors).toHaveLength(0);
  });

  it("pt-BR ↔ es-MX should have identical structure", () => {
    const errors = validateCrossLocale(base, esMX as Dictionary, "pt-BR", "es-MX");
    expect(errors).toHaveLength(0);
  });
}); 










Estão todos consistentes e alinhados com typescript 6.0 ?





