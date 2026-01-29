import { NextRequest, NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['pt', 'en', 'es']
const DEFAULT_LOCALE = 'pt'
const LOCALE_COOKIE = 'NEXT_LOCALE'

function getLocale(request: NextRequest) {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookie && SUPPORTED_LOCALES.includes(cookie)) {
    return cookie
  }

  const header = request.headers.get('accept-language')
  if (!header) return DEFAULT_LOCALE

  if (header.startsWith('en')) return 'en'
  if (header.startsWith('es')) return 'es'
  return 'pt'
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Só atua na raiz
  if (pathname !== '/') {
    return NextResponse.next()
  }

  const locale = getLocale(request)
  const url = new URL(`/${locale}`, request.url)

  const response = NextResponse.redirect(url, 307)
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
}

export const config = {
  matcher: ['/'],
}
