import pt from "../src/dictionaries/pt.json";
import en from "../src/dictionaries/en.json";
import es from "../src/dictionaries/es.json";
import { validateCrossLocale } from "../src/dictionaries/validateCrossLocale";

describe("i18n dictionaries consistency", () => {
  it("pt ↔ en should have identical structure", () => {
    const errors = validateCrossLocale(pt, en, "pt", "en");
    expect(errors).toHaveLength(0);
  });

  it("pt ↔ es should have identical structure", () => {
    const errors = validateCrossLocale(pt, es, "pt", "es");
    expect(errors).toHaveLength(0);
  });
});
