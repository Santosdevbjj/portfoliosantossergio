// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { i18n } from '@/i18n-config'
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie'
import { CONSENT_COOKIE } from '@/lib/consent'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

/* -------------------------------------------------------------------------- */
/* REGION / GDPR DETECTION                                                     */
/* -------------------------------------------------------------------------- */
type Region = 'eu' | 'br' | 'us' | 'unknown'

const EU_COUNTRIES = new Set([
  'AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU',
  'IE','IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK'
])

function detectRegion(request: NextRequest): Region {
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code')

  if (!country) return 'unknown'
  if (EU_COUNTRIES.has(country)) return 'eu'
  if (country === 'BR') return 'br'
  if (country === 'US') return 'us'

  return 'unknown'
}

/* -------------------------------------------------------------------------- */
/* LOCALE DETECTION                                                            */
/* -------------------------------------------------------------------------- */
function detectLocale(request: NextRequest): string {
  // 1️⃣ Cookie explícito
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (
    cookieLocale &&
    i18n.locales.includes(cookieLocale as (typeof i18n.locales)[number])
  ) {
    return cookieLocale
  }

  // 2️⃣ Accept-Language
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return i18n.defaultLocale

  const languages = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  }).languages()

  return matchLocale(languages, i18n.locales, i18n.defaultLocale)
}

/* -------------------------------------------------------------------------- */
/* PROXY (EDGE)                                                                */
/* -------------------------------------------------------------------------- */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* ---------------------------- Ignored paths ----------------------------- */
  const isIgnored =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.[^/]+$/.test(pathname)

  if (isIgnored) {
    return NextResponse.next()
  }

  /* ----------------------------- Region logic ----------------------------- */
  const region = detectRegion(request)
  const consent = request.cookies.get(CONSENT_COOKIE)?.value

  const isGdprStrict = region === 'eu' && consent !== 'granted'

  /* ------------------------- Locale normalization ------------------------- */
  const hasLocale = i18n.locales.some(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (!hasLocale) {
    const locale = detectLocale(request)
    const normalizedPath = pathname === '/' ? '' : pathname

    const redirectUrl = new URL(
      `/${locale}${normalizedPath}`,
      request.url
    )

    request.nextUrl.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value)
    })

    const response = NextResponse.redirect(redirectUrl, 307)

    response.cookies.set(LOCALE_COOKIE, locale, LOCALE_COOKIE_OPTIONS)
    response.cookies.set('region', region, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })

    response.headers.append('Vary', 'Accept-Language')

    return response
  }

  /* ------------------------ Request header bridge ------------------------- */
  const requestHeaders = new Headers(request.headers)

  requestHeaders.set('x-user-lang', pathname.split('/')[1])
  requestHeaders.set('x-user-region', region)
  requestHeaders.set(
    'x-gdpr-mode',
    isGdprStrict ? 'strict' : 'standard'
  )

  if (consent) {
    requestHeaders.set('x-user-consent', consent)
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  /* ------------------------- Response headers ------------------------------ */
  response.headers.set('x-user-region', region)
  response.headers.set(
    'x-gdpr-mode',
    isGdprStrict ? 'strict' : 'standard'
  )

  response.headers.append('Vary', 'Accept-Language')

  /* --------------------------- Security headers ---------------------------- */
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  )
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  return response
}

/* -------------------------------------------------------------------------- */
/* MATCHER                                                                     */
/* -------------------------------------------------------------------------- */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
