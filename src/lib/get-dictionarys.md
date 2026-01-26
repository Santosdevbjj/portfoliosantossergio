import 'server-only';
import type { Locale } from '@/i18n-config';

/**
 * MOTOR DE DICIONÁRIOS — INFRAESTRUTURA DE DADOS
 * Gerencia carregamento assíncrono, fallback seguro e integridade estrutural.
 */

/* ===========================
 * TIPOS BASE
 * =========================== */

export interface DictionaryShape {
  nav: {
    about: string;
    experience: string;
    articles: string;
    projects: string;
    contact: string;
    changeLang?: string;
    theme?: {
      light?: string;
      dark?: string;
      system?: string;
    };
    [key: string]: unknown;
  };
  common: {
    viewProject: string;
    liveDemo: string;
    backToTop?: string;
    loading?: string;
    error?: string;
    [key: string]: unknown;
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
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  articles?: {
    featured?: unknown;
    [key: string]: unknown;
  };
  portfolio?: Record<string, unknown>;
  [key: string]: unknown;
}

/* ===========================
 * BASE DE SEGURANÇA (FALLBACK)
 * =========================== */

const BASE_DICTIONARY: DictionaryShape = {
  nav: {
    about: 'About',
    experience: 'Experience',
    articles: 'Articles',
    projects: 'Projects',
    contact: 'Contact',
  },
  common: {
    viewProject: 'GitHub',
    liveDemo: 'Live Demo',
    backToTop: 'Top',
    loading: 'Loading...',
    error: 'Unexpected error',
  },
  about: {
    sections: {
      metrics: {
        title: 'Impact',
        subtitle: 'KPIs',
        availabilityValue: '100%',
        availabilityLabel: 'Uptime',
        automationValue: '0',
        automationLabel: 'Hours',
      },
    },
  },
};

/* ===========================
 * LOADERS DE IDIOMA
 * =========================== */

const dictionaries: Record<Locale, () => Promise<unknown>> = {
  pt: async () => (await import('../dictionaries/pt.json')).default,
  en: async () => (await import('../dictionaries/en.json')).default,
  es: async () => (await import('../dictionaries/es.json')).default,
};

/* ===========================
 * NORMALIZAÇÃO PROFUNDA
 * =========================== */

function normalize(raw: any): DictionaryShape {
  return {
    ...BASE_DICTIONARY,
    ...raw,

    nav: {
      ...BASE_DICTIONARY.nav,
      ...(raw?.nav ?? {}),
    },

    common: {
      ...BASE_DICTIONARY.common,
      ...(raw?.common ?? {}),
    },

    about: {
      ...(raw?.about ?? {}),
      sections: {
        ...(raw?.about?.sections ?? {}),
        metrics: {
          ...BASE_DICTIONARY.about.sections.metrics,
          ...(raw?.about?.sections?.metrics ?? {}),
        },
      },
    },

    articles: raw?.articles ?? {},
    portfolio: raw?.portfolio ?? {},
  };
}

/* ===========================
 * API PÚBLICA
 * =========================== */

export async function getDictionary(locale: Locale): Promise<DictionaryShape> {
  try {
    const loader = dictionaries[locale] ?? dictionaries.pt;
    const content = await loader();
    return normalize(content);
  } catch (error) {
    console.error(`[i18n] Erro ao carregar dicionário (${locale})`, error);

    try {
      const fallback = await dictionaries.pt();
      return normalize(fallback);
    } catch {
      return BASE_DICTIONARY;
    }
  }
}

export type Dictionary = DictionaryShape;
