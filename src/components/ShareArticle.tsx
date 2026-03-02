"use client";

interface ShareProps {
  title: string;
}

export default function ShareArticle({ title }: ShareProps) {
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;

  return (
    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 not-prose">
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
        Gostou do conteúdo?
      </p>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-[#0077b5] hover:bg-[#005582] text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
        Compartilhar no LinkedIn
      </a>
    </div>
  );
}
