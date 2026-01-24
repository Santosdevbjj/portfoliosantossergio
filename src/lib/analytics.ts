type AnalyticsEvent = {
  name: string;
  props?: Record<string, any>;
};

export const track = ({ name, props }: AnalyticsEvent) => {
  if (typeof window === 'undefined') return;

  const consent = localStorage.getItem('consent-v1');
  if (!consent) return;

  const parsed = JSON.parse(consent);
  if (!parsed.analytics) return;

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', name, props);
  }

  // Plausible
  if (window.plausible) {
    window.plausible(name, { props });
  }

  // PostHog
  if (window.posthog) {
    window.posthog.capture(name, props);
  }
};
