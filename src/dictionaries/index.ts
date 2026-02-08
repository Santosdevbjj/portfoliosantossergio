// src/dictionaries/index.ts
import type { Dictionary, Locale } from "@/types/dictionary";

const dictionaries = {
  "pt-BR": () => import("./pt-BR.json").then((m) => m.default as Dictionary),
  "en-US": () => import("./en-US.json").then((m) => m.default as Dictionary),
  "es-ES": () => import("./es-ES.json").then((m) => m.default as Dictionary),
  "es-AR": () => import("./es-AR.json").then((m) => m.default as Dictionary),
  "es-MX": () => import("./es-MX.json").then((m) => m.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const loadDictionary = dictionaries[locale] ?? dictionaries["pt-BR"];
  return loadDictionary();
};
