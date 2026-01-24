'use client';

import { useEffect, useState } from 'react';
import { dictionary, Lang } from '@/lib/dictionary';
import { CONSENT_COOKIE, defaultConsent } from '@/lib/consent';

export const CookieBanner = ({ lang }: { lang: Lang }) => {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  const t = dictionary.cookie;

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_COOKIE);
    if (!consent) setOpen(true);
  }, []);

  const saveConsent = (acceptAll = false) => {
    const value = {
      necessary: true,
      analytics: acceptAll ? true : analytics,
    };

    localStorage.setItem(CONSENT_COOKIE, JSON.stringify(value));
    document.cookie = `${CONSENT_COOKIE}=${JSON.stringify(value)};path=/;max-age=31536000`;
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md z-50 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
      <h3 className="font-black text-sm uppercase tracking-widest">
        {t.title[lang]}
      </h3>

      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
        {t.description[lang]}
      </p>

      <div className="mt-4 space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked disabled />
          {t.necessary[lang]}
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
          />
          {t.analytics[lang]}
        </label>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => saveConsent(true)}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold"
        >
          {t.acceptAll[lang]}
        </button>

        <button
          onClick={() => saveConsent(false)}
          className="flex-1 border py-3 rounded-xl font-bold"
        >
          {t.save[lang]}
        </button>
      </div>
    </div>
  );
};
