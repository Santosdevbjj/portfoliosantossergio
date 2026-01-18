import { pt } from './pt';
import { en } from './en';
import { es } from './es';

export const translations = { pt, en, es };

export type TranslationContent = typeof pt;
export type ITranslations = typeof translations;
