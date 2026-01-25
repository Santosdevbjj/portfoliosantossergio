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
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (
    cookieLocale &&
    i18n.locales.includes(cookieLocale as (typeof i18n.locales)[number])
  ) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return i18n.defaultLocale

  const languages = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  }).languages()

  return matchLocale(languages, i18n.locales, i18n.defaultLocale)
}

/* -------------------------------------------------------------------------- */
/* FEATURE FLAGS (EDGE-SAFE)                                                   */
/* -------------------------------------------------------------------------- */
function resolveFeatureFlags(request: NextRequest, region: Region) {
  const host = request.headers.get('host') ?? ''

  return {
    'x-feature-blog-v2':
      host.includes('preview') || region === 'us' ? 'on' : 'off',

    'x-feature-ai-search':
      region !== 'eu' ? 'on' : 'off',

    'x-feature-beta-ui':
      host.includes('beta') ? 'on' : 'off',
  }
}

/* -------------------------------------------------------------------------- */
/* CONSENT MODE V2 (GA4)                                                       */
/* -------------------------------------------------------------------------- */
function resolveConsentMode(
  region: Region,
  consent?: string
) {
  const isStrict = region === 'eu' && consent !== 'granted'

  return {
    analytics_storage: isStrict ? 'denied' : 'granted',
    ad_storage: isStrict ? 'denied' : 'granted',
    ad_user_data: isStrict ? 'denied' : 'granted',
    ad_personalization: isStrict ? 'denied' : 'granted',
  }
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

  /* ----------------------------- Region / Consent -------------------------- */
  const region = detectRegion(request)
  const consent = request.cookies.get(CONSENT_COOKIE)?.value

  const gdprMode =
    region === 'eu' && consent !== 'granted'
      ? 'strict'
      : 'standard'

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

    const response = NextResponse.redirect(redirectUrl, 307)

    response.cookies.set(LOCALE_COOKIE, locale, LOCALE_COOKIE_OPTIONS)
    response.cookies.set('region', region, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })

    response.headers.append('Vary', 'Accept-Language')
    return response
  }

  /* ------------------------ Header Bridge --------------------------------- */
  const headers = new Headers(request.headers)

  headers.set('x-user-lang', pathname.split('/')[1])
  headers.set('x-user-region', region)
  headers.set('x-gdpr-mode', gdprMode)

  const consentMode = resolveConsentMode(region, consent)
  Object.entries(consentMode).forEach(([key, value]) => {
    headers.set(`x-consent-${key}`, value)
  })

  const featureFlags = resolveFeatureFlags(request, region)
  Object.entries(featureFlags).forEach(([key, value]) => {
    headers.set(key, value)
  })

  const response = NextResponse.next({
    request: { headers },
  })

  response.headers.append('Vary', 'Accept-Language')
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
