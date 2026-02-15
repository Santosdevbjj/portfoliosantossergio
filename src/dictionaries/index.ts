// src/dictionaries/index.ts
import type { Dictionary } from "@/types/dictionary";
import {
  DEFAULT_LOCALE,
  normalizeLocale,
  type SupportedLocale,
} from "./locales";

const loaders: Record<
  SupportedLocale,
  () => Promise<Dictionary>
> = {
  "pt-BR": () => import("./pt-BR.json").then(m => m.default),
  "en-US": () => import("./en-US.json").then(m => m.default),
  "es-ES": () => import("./es-ES.json").then(m => m.default),
  "es-AR": () => import("./es-AR.json").then(m => m.default),
  "es-MX": () => import("./es-MX.json").then(m => m.default),
};

export const getDictionary = async (
  locale?: string,
): Promise<Dictionary> => {
  const normalized = normalizeLocale(locale);
  const loader = loaders[normalized] ?? loaders[DEFAULT_LOCALE];
  return loader();
};
