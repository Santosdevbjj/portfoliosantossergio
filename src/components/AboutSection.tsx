// components/AboutSection.tsx
import React from "react";

export interface AboutMetric {
  label: string;
  value: string;
}

export interface AboutContent {
  title: string;
  subtitle?: string;
  description: string;
  metrics?: AboutMetric[];
}

export interface AboutSectionProps {
  content: AboutContent;
}

const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  const { title, subtitle, description, metrics } = content;

  return (
    <section
      id="about"
      className="w-full py-16 px-4 md:px-8 lg:px-16 bg-background text-foreground"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </header>

        {/* Description */}
        <p className="text-base md:text-lg leading-relaxed max-w-3xl">
          {description}
        </p>

        {/* Metrics */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-8">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-xl border border-border p-4 text-center shadow-sm"
              >
                <span className="text-2xl font-bold text-primary">
                  {metric.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
