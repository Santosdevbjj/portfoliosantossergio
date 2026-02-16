/**
 * LIB: Analytics Unified Layer
 * -----------------------------------------------------------------------------
 * Seguro contra Hydration Errors.
 * Compatível com Next.js 16 (App Router).
 */

import {
  CONSENT_COOKIE_NAME,
  DEFAULT_CONSENT,
  getSafeConsent,
  type ConsentPreferences,
} from "@/lib/consent";

export interface AnalyticsEvent {
  readonly name: string;
  readonly props?: Record<string, unknown>;
}

declare global {
  interface Window {
    gtag?: (
      command: "event",
      name: string,
      params?: Record<string, unknown>,
    ) => void;
    plausible?: (
      event: string,
      options?: { props?: Record<string, unknown> },
    ) => void;
    posthog?: {
      capture: (
        event: string,
        props?: Record<string, unknown>,
      ) => void;
    };
  }
}

function readConsentFromCookie(): ConsentPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_CONSENT;
  }

  try {
    const match = document.cookie
      .split("; ")
      .find((row) =>
        row.startsWith(`${CONSENT_COOKIE_NAME}=`),
      );

    if (!match) return DEFAULT_CONSENT;

    const raw = decodeURIComponent(
      match.split("=")[1] ?? "",
    );

    if (!raw) return DEFAULT_CONSENT;

    const parsed = JSON.parse(raw);

    return getSafeConsent(parsed);
  } catch {
    return DEFAULT_CONSENT;
  }
}

export function track({
  name,
  props,
}: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  try {
    const consent = readConsentFromCookie();

    if (!consent.analytics) return;

    const eventProps = props ?? {};

    if (typeof window.gtag === "function") {
      window.gtag("event", name, eventProps);
    }

    if (typeof window.plausible === "function") {
      window.plausible(name, { props: eventProps });
    }

    if (
      window.posthog &&
      typeof window.posthog.capture === "function"
    ) {
      window.posthog.capture(name, eventProps);
    }
  } catch {
    // Tracking nunca derruba a aplicação
  }
}
