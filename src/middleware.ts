import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configurações de localização
const locales = ['pt', 'en', 'es']
const defaultLocale = 'pt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Verifica se o pathname já contém um dos locales permitidos
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // 2. Se já tem o locale, não faz nada (segue o fluxo normal)
  if (pathnameHasLocale) return

  // 3. Se NÃO tem o locale, decide para qual redirecionar
  const acceptLanguage = request.headers.get('accept-language')
  let locale = defaultLocale

  // Lógica simplificada de detecção de idioma do navegador
  if (acceptLanguage) {
    if (acceptLanguage.startsWith('en') || acceptLanguage.includes('en-')) {
      locale = 'en'
    } else if (acceptLanguage.startsWith('es') || acceptLanguage.includes('es-')) {
      locale = 'es'
    }
  }

  // 4. Redireciona para a versão com o locale (ex: /about -> /pt/about)
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
}

export const config = {
  // O Matcher é crucial: ele impede que o middleware rode em arquivos estáticos e APIs
  matcher: [
    /*
     * Ignora:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos do Next)
     * - _next/image (otimização de imagens)
     * - icon.png, favicon.ico (ícones)
     * - images/ (sua pasta de troféus)
     * - .pdf (seus currículos)
     */
    '/((?!api|_next/static|_next/image|images|assets|favicon.ico|icon.png|sw.js|.*\\.png$|.*\\.pdf$).*)',
  ],
}
