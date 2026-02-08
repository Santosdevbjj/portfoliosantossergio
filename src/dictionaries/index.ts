import type { Dictionary, Locale } from "@/types/dictionary";

// Mapeamento de carregamento dinâmico (Code Splitting)
const dictionaries = {
  "pt-BR": () => import("./pt-BR.json").then((module) => module.default),
  "en-US": () => import("./en-US.json").then((module) => module.default),
  "es-ES": () => import("./es-ES.json").then((module) => module.default),
  "es-AR": () => import("./es-AR.json").then((module) => module.default),
  "es-MX": () => import("./es-MX.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // 1. Tenta carregar o locale solicitado
  // 2. Se falhar e for espanhol, tenta es-ES
  // 3. Fallback final para pt-BR
  
  const loader = dictionaries[locale] 
    ?? (locale.startsWith("es") ? dictionaries["es-ES"] : dictionaries["pt-BR"]);

  return (await loader()) as Dictionary;
};
