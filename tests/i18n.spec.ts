import { Dictionary } from "../src/types/dictionary";
import { validateCrossLocale } from "../src/dictionaries/validateCrossLocale";

// Imports corretos conforme os nomes dos arquivos físicos
import ptBR from "../src/dictionaries/pt-BR.json";
import enUS from "../src/dictionaries/en-US.json";
import esES from "../src/dictionaries/es-ES.json";
import esAR from "../src/dictionaries/es-AR.json";
import esMX from "../src/dictionaries/es-MX.json";

describe("i18n dictionaries consistency", () => {
  const base = ptBR as Dictionary;

  it("pt-BR ↔ en-US should have identical structure", () => {
    const errors = validateCrossLocale(base, enUS as Dictionary, "pt-BR", "en-US");
    expect(errors).toHaveLength(0);
  });

  it("pt-BR ↔ es-ES should have identical structure", () => {
    const errors = validateCrossLocale(base, esES as Dictionary, "pt-BR", "es-ES");
    expect(errors).toHaveLength(0);
  });

  it("pt-BR ↔ es-AR should have identical structure", () => {
    const errors = validateCrossLocale(base, esAR as Dictionary, "pt-BR", "es-AR");
    expect(errors).toHaveLength(0);
  });

  it("pt-BR ↔ es-MX should have identical structure", () => {
    const errors = validateCrossLocale(base, esMX as Dictionary, "pt-BR", "es-MX");
    expect(errors).toHaveLength(0);
  });
});
