// src/dictionaries/validateAllLocales.ts

import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";
import esES from "./es-ES.json";
import esAR from "./es-AR.json";
import esMX from "./es-MX.json";

import { validateCrossLocale } from "./validateCrossLocale";
import { Dictionary } from "@/types/dictionary";

/**
 * Valida a consistência estrutural entre todos os dicionários.
 * Garante que chaves presentes no idioma principal (pt-BR) existam nos outros.
 */
export function validateAllLocales() {
  // Cast para Dictionary para garantir que estamos validando contra o contrato correto
  const base = ptBR as Dictionary;
  
  const targets = [
    { data: enUS as Dictionary, code: "en-US" },
    { data: esES as Dictionary, code: "es-ES" },
    { data: esAR as Dictionary, code: "es-AR" },
    { data: esMX as Dictionary, code: "es-MX" }
  ];

  const errors: string[] = [];

  // Executa a validação cruzada para cada idioma contra o pt-BR
  targets.forEach(target => {
    errors.push(...validateCrossLocale(base, target.data, "pt-BR", target.code));
  });

  if (errors.length > 0) {
    console.error("\n❌ i18n validation failed (Alignment Errors):\n");
    errors.forEach(err => console.error(`  - ${err}`));
    
    // Interrompe o build ou execução se houver erro de alinhamento
    if (process.env.NODE_ENV !== "development") {
      throw new Error("i18n validation failed");
    }
  } else {
    console.log("✅ i18n dictionaries are fully aligned (5 locales).");
  }
}
