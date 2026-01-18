import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['pt', 'en', 'es']
const defaultLocale = 'pt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Evita loop de redirecionamento se a rota já tem idioma
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // 2. Detecção de idioma baseada no navegador (UX Internacional)
  const acceptLanguage = request.headers.get('accept-language')
  let locale = defaultLocale

  if (acceptLanguage) {
    // Prioriza o idioma detectado se estiver na nossa lista de suporte
    const detected = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()
    if (locales.includes(detected)) {
      locale = detected
    } else if (acceptLanguage.includes('en')) {
      locale = 'en'
    } else if (acceptLanguage.includes('es')) {
      locale = 'es'
    }
  }

  // 3. Redirecionamento com preservação de estado
  const url = request.nextUrl.clone()
  
  // Garante que o pathname não duplique barras
  const cleanPathname = pathname === '/' ? '' : pathname
  url.pathname = `/${locale}${cleanPathname}`
  
  return NextResponse.redirect(url)
}

export const config = {
  /*
   * Matcher Robusto para Engenharia de Dados:
   * Ignora rotas de API, arquivos estáticos e documentos técnicos (PDF/PNG).
   */
  matcher: [
    // Pula arquivos internos do Next.js e arquivos de mídia/documentos
    '/((?!api|_next/static|_next/image|images|favicon.ico|manifest.json|.*\\.pdf$|.*\\.png$|.*\\.svg$).*)',
  ],
}
