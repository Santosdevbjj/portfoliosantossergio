/**
 * TIPO CANÔNICO DO DICIONÁRIO
 * 
 * Qualquer JSON de idioma (pt/en/es) DEVE obedecer a esta estrutura.
 * Se faltar ou sobrar chave → erro de build.
 */

export interface Dictionary {
  common: {
    language: string
    contact: string
    viewProject: string
    liveDemo: string
    repoTitle: string
    portfolioTitle: string
    governance: string
    backToTop: string

    menu_aria: string
    close_aria: string
    scroll_top_aria: string

    loading: string
    error: string
    close: string

    articlesTitle: string
    readMore: string

    cvButton: string
    cvLink: string
  }

  nav: {
    about: string
    experience: string
    articles: string
    projects: string
    contact: string
    changeLang: string

    theme: {
      light: string
      dark: string
      system: string
    }
  }

  hero: {
    badge: string
    title: string
    titleAccent: string
    description: string
    cta_primary: string
    cta_secondary: string
  }

  about: {
    title: string
    headline: string
    bio: string

    sections: {
      highlights: {
        title: string
        items: {
          label: string
          description: string
        }[]
      }

      metrics: {
        title: string
        subtitle: string
        availabilityValue: string
        availabilityLabel: string
        automationValue: string
        automationLabel: string
      }

      stack: {
        title: string
        items: {
          label: string
          description: string
        }[]
      }
    }
  }

  articles: {
    title: string
    subtitle: string
    loading: string
    comingSoon: string
    followPrompt: string
    badge: string

    featured: {
      title: string
      description: string
      date: string
      rank: string
      link: string
    }
  }

  portfolio: {
    title: string
    description: string
    all: string
    mainCaseLabel: string
    resultsLabel: string

    projectLabels: {
      problem: string
      solution: string
      impact: string
    }

    categories: {
      [key: string]: string
    }
  }
}
