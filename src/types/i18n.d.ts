// src/types/i18n.d.ts

import { 
  Locale as LocaleType, 
  Dictionary as DictionaryType 
} from "./dictionary";

/**
 * Tornamos os tipos disponíveis globalmente no projeto 
 * para satisfazer o rigor do TS 6.0 sem precisar de imports em todo lugar.
 */
declare global {
  type Locale = LocaleType;
  type Dictionary = DictionaryType;

  // Tipos auxiliares consistentes com seus dicionários
  interface I18nParams {
    params: {
      lang: Locale;
    };
  }
}

export {};
