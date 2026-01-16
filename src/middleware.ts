import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['pt', 'en', 'es']
let defaultLocale = 'pt'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Verifica se o caminho já tem o idioma (ex: /pt/...)
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Se não tiver o idioma na URL, redireciona
  if (pathnameIsMissingLocale) {
    // Tenta detectar o idioma do navegador, senão usa PT
    const acceptLanguage = request.headers.get('accept-language')
    let locale = defaultLocale

    if (acceptLanguage) {
      if (acceptLanguage.includes('en')) locale = 'en'
      else if (acceptLanguage.includes('es')) locale = 'es'
    }

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }
}

export const config = {
  // Melhorei o matcher para garantir que ele não tente redirecionar arquivos da pasta public
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
}

