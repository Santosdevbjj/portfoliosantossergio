// src/components/AboutSection.tsx

import type { AboutDictionary } from "@/types/dictionary";

export interface AboutSectionProps {
  readonly dict: AboutDictionary;
}

export default function AboutSection({
  dict,
}: AboutSectionProps): React.JSX.Element {

  const {
    title,
    differentialTitle,
    description,
    differentialContent,
    highlights,
    stats,
  } = dict;

  return (
    <div
      className="w-full bg-background px-4 py-16 text-foreground md:px-8 lg:px-16"
      aria-labelledby="about-title"
    >
      <div className="mx-auto max-w-6xl space-y-8">

        <header className="space-y-2">
          <h2
            id="about-title"
            className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            {title}
          </h2>

          <p className="text-lg font-medium text-muted-foreground md:text-xl">
            {differentialTitle}
          </p>
        </header>

        <div className="max-w-4xl space-y-6">
          <p className="text-balance text-base leading-relaxed md:text-lg">
            {description}
          </p>

          <p className="text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            {differentialContent}
          </p>
        </div>

        {highlights.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-4 md:gap-3">
            {highlights.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="rounded-full border border-border bg-secondary/20 px-4 py-1.5 text-xs font-medium transition-colors hover:bg-secondary/40 md:text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          <StatCard
            value={stats.experienceValue}
            label={stats.experienceLabel}
          />
          <StatCard
            value={stats.availabilityValue}
            label={stats.availabilityLabel}
          />
          <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-6 sm:col-span-2">
            <span className="text-center font-medium text-foreground">
              {stats.automation}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
}: {
  readonly value: string;
  readonly label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border p-6 transition-all hover:shadow-md">
      <span className="text-3xl font-bold text-primary">
        {value}
      </span>
      <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
