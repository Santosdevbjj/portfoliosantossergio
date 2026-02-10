// src/components/AboutSection.tsx
import React from "react";
import type { Dictionary, Locale } from "@/types/dictionary";

export interface AboutSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

const AboutSection: React.FC<AboutSectionProps> = ({ dict }) => {
  const { about } = dict;

  const {
    title,
    differentialTitle,
    description,
    differentialContent,
    highlights,
    stats,
  } = about;

  return (
    <section
      id="sobre"
      className="w-full py-16 px-4 md:px-8 lg:px-16 bg-background text-foreground"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {differentialTitle}
          </p>
        </header>

        {/* Description */}
        <div className="space-y-4 max-w-3xl">
          <p className="text-base md:text-lg leading-relaxed">
            {description}
          </p>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            {differentialContent}
          </p>
        </div>

        {/* Highlights */}
        {highlights?.length > 0 && (
          <ul className="flex flex-wrap gap-3 pt-4">
            {highlights.map((item, index) => (
              <li
                key={index}
                className="rounded-full border border-border px-4 py-1 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-8">
            <div className="flex flex-col items-center rounded-xl border p-4">
              <span className="text-2xl font-bold text-primary">
                {stats.experienceValue}
              </span>
              <span className="text-sm text-muted-foreground">
                {stats.experienceLabel}
              </span>
            </div>

            <div className="flex flex-col items-center rounded-xl border p-4">
              <span className="text-2xl font-bold text-primary">
                {stats.availabilityValue}
              </span>
              <span className="text-sm text-muted-foreground">
                {stats.availabilityLabel}
              </span>
            </div>

            <div className="flex flex-col items-center rounded-xl border p-4 col-span-2">
              <span className="text-sm text-muted-foreground">
                {stats.automation}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
