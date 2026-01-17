import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Importamos a configuração centralizada para manter o código DRY (Don't Repeat Yourself)
// Caso você ainda não tenha criado o arquivo i18n-config, pode manter a lista manual.
const locales = ['pt', 'en', 'es']
const defaultLocale = 'pt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Verifica se o pathname já possui um locale válido
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // 2. Detecção inteligente de idioma (Accept-Language)
  const acceptLanguage = request.headers.get('accept-language')
  let locale = defaultLocale

  if (acceptLanguage) {
    // Usamos uma busca por prioridade
    if (acceptLanguage.includes('en')) {
      locale = 'en'
    } else if (acceptLanguage.includes('es')) {
      locale = 'es'
    }
  }

  // 3. Redirecionamento amigável
  // Preserva os parâmetros de busca (query strings) se houverem
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  
  return NextResponse.redirect(url)
}

export const config = {
  /*
   * Matcher ultra-seguro para Next.js 15:
   * Protege contra redirecionamento de:
   * - Arquivos estáticos (_next/static, _next/image)
   * - Imagens e Ativos (images, favicon, icon)
   * - Documentos (pdf)
   * - Service Workers (sw.js)
   */
  matcher: [
    '/((?!api|_next/static|_next/image|images|assets|favicon.ico|icon.png|sw.js|.*\\.png$|.*\\.pdf$).*)',
  ],
}
