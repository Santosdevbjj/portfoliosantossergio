/**
 * =====================================================
 * DICIONÁRIOS DE INTERNACIONALIZAÇÃO (i18n)
 * =====================================================
 * * Este arquivo atua como o validador central do projeto.
 * * ✔ Validação em tempo de build usando `satisfies`
 * ✔ Garante paridade total entre PT, EN e ES
 * ✔ Exporta tipos consistentes para os componentes UI
 */

import type { Dictionary } from '@/i18n-config';

// Importação dos arquivos JSON
import pt from './pt.json';
import en from './en.json';
import es from './es.json';

/**
 * Dicionários individuais validados pelo contrato soberano.
 * Se houver erro aqui, o build da Vercel falhará propositalmente
 * para evitar que o site suba com traduções faltando.
 */
export const ptDictionary = pt satisfies Dictionary;
export const enDictionary = en satisfies Dictionary;
export const esDictionary = es satisfies Dictionary;

/**
 * Definição de Idiomas Suportados
 * Alinhado com a configuração global do middleware
 */
export type SupportedLocale = 'pt' | 'en' | 'es';

/**
 * Mapa global de dicionários
 * Utilizado pelos Server Components para carregar o conteúdo traduzido
 */
export const dictionaries: Record<SupportedLocale, Dictionary> = {
  pt: ptDictionary,
  en: enDictionary,
  es: esDictionary,
};

/**
 * Helper para obter dicionário de forma síncrona 
 * (Utilizado em contextos onde o locale já foi validado)
 */
export function getDictionarySync(locale: SupportedLocale): Dictionary {
  return dictionaries[locale] || ptDictionary;
}

/**
 * Exportação para compatibilidade com o loader dinâmico
 */
export default dictionaries;
