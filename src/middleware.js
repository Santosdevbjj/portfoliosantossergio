import { NextRequest, NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import { i18n, type Locale } from '@/i18n-config'
import { LOCALE_COOKIE_NAME } from '@/lib/locale-cookie'

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined

  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return i18n.defaultLocale

  const languages = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  }).languages()

  return matchLocale(
    languages,
    i18n.locales as readonly string[],
    i18n.defaultLocale
  ) as Locale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Só intercepta a raiz
  if (pathname !== '/') {
    return NextResponse.next()
  }

  const locale = detectLocale(request)
  const url = new URL(`/${locale}`, request.url)

  const response = NextResponse.redirect(url, 307)

  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
}

export const config = {
  matcher: ['/'],
}
