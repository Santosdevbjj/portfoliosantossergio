/**
 * Resume PDF Mapping - Versão 2026
 * -----------------------------------------------------------------------------
 * ✔ Suporte: Next.js 16, React 19, TS 6.0, Node 24
 * ✔ Objetivo: Mapear os arquivos físicos da pasta /public/pdf para os locales.
 */

import { SupportedLocale, DEFAULT_LOCALE } from "@/dictionaries/locales";

/**
 * Mapeamento estrito dos caminhos dos arquivos PDF.
 * Os arquivos devem estar localizados em: public/pdf/
 */
export const RESUME_PDF_MAP: Record<SupportedLocale, string> = {
  "pt-BR": "/pdf/cv-sergio-santos-pt-BR.pdf",
  "en-US": "/pdf/cv-sergio-santos-en-US.pdf",
  "es-ES": "/pdf/cv-sergio-santos-es-ES.pdf",
  "es-AR": "/pdf/cv-sergio-santos-es-AR.pdf",
  "es-MX": "/pdf/cv-sergio-santos-es-MX.pdf",
} as const;

/**
 * Retorna o caminho do PDF baseado no locale atual.
 * * @param locale - O idioma atual da página.
 * @returns O caminho relativo para uso em componentes <Link> ou <a>.
 */
export function getResumePath(locale: string): string {
  // Verificamos se o locale passado é um dos suportados
  // Caso contrário, retornamos o PDF no idioma padrão (pt-BR)
  const targetLocale = locale as SupportedLocale;
  
  return RESUME_PDF_MAP[targetLocale] || RESUME_PDF_MAP[DEFAULT_LOCALE];
}

/**
 * Helper para forçar o download com o nome de arquivo amigável.
 * Útil para o atributo 'download' de tags <a>.
 */
export function getResumeDownloadName(locale: string): string {
  return `CV-Sergio-Santos-${locale}.pdf`;
}
