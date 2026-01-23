import 'server-only';
import type { Locale } from '@/i18n-config';

/**
 * MOTOR DE DICIONÁRIOS — INFRAESTRUTURA DE DADOS
 * Gerencia o carregamento assíncrono e a segurança estrutural das traduções.
 */

interface DictionaryShape {
  nav: {
    about: string;
    experience: string;
    articles: string;
    projects: string;
    contact: string;
    [key: string]: any;
  };
  common: {
    viewProject: string;
    liveDemo: string;
    [key: string]: any;
  };
  about: {
    sections: {
      metrics: {
        title: string;
        subtitle: string;
        availabilityValue: string;
        availabilityLabel: string;
        automationValue: string;
        automationLabel: string;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
  articles: {
    featured: any;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Estrutura Base de Segurança (Last Line of Defense)
 * Evita erros de "undefined" se chaves específicas faltarem no JSON.
 */
const BASE_DICTIONARY: Partial<DictionaryShape> = {
  nav: {
    about: "About",
    experience: "Experience",
    articles: "Articles",
    projects: "Projects",
    contact: "Contact"
  },
  common: {
    viewProject: "GitHub",
    liveDemo: "Live Demo"
  },
  about: {
    sections: {
      metrics: {
        title: "Impact",
        subtitle: "KPIs",
        availabilityValue: "100%",
        availabilityLabel: "Uptime",
        automationValue: "0",
        automationLabel: "Hours"
      }
    }
  }
};

/**
 * Loader de Dicionários - Otimizado para Next.js 16
 */
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import('../dictionaries/pt.json').then((m) => m.default),
  en: () => import('../dictionaries/en.json').then((m) => m.default),
  es: () => import('../dictionaries/es.json').then((m) => m.default),
};

/**
 * Função de Normalização Profunda
 */
function normalize(raw: any): DictionaryShape {
  return {
    ...BASE_DICTIONARY,
    ...raw,
    nav: { ...BASE_DICTIONARY.nav, ...(raw?.nav || {}) },
    common: { ...BASE_DICTIONARY.common, ...(raw?.common || {}) },
    about: {
      ...raw?.about,
      sections: {
        ...(raw?.about?.sections || {}),
        metrics: { 
          ...BASE_DICTIONARY.about?.sections?.metrics, 
          ...(raw?.about?.sections?.metrics || {}) 
        }
      }
    },
    articles: { ...raw?.articles }
  } as DictionaryShape;
}

export const getDictionary = async (locale: Locale): Promise<DictionaryShape> => {
  try {
    const loadLanguage = dictionaries[locale] || dictionaries.pt;
    const content = await loadLanguage();
    return normalize(content);
  } catch (error) {
    console.error(`[i18n] Erro crítico ao carregar dicionário (${locale}):`, error);
    try {
      const fallback = await dictionaries.pt();
      return normalize(fallback);
    } catch {
      return BASE_DICTIONARY as DictionaryShape;
    }
  }
};

export type Dictionary = DictionaryShape;
